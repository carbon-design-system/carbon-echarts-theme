import React from 'react'
import ReactDOM from 'react-dom'
import type { EChartsType } from 'echarts'
import { TableSplit, Maximize, Minimize, OverflowMenuVertical, Close } from '@carbon/icons-react'
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
} from '@carbon/react'

export interface ChartToolbarProps {
  /** ECharts instance — used for PNG/JPG/CSV export */
  chartInstance: EChartsType | null
  /** Chart title shown in the table modal header */
  title?: string
  /** Whether the chart is currently fullscreen */
  isFullscreen: boolean
  /** Toggle fullscreen */
  onFullscreen: () => void
}

// ---------------------------------------------------------------------------
// Data extraction helpers
// ---------------------------------------------------------------------------

function buildTableData(
  instance: EChartsType,
): { headers: { key: string; header: string }[]; rows: Record<string, unknown>[] } | null {
  const option = instance.getOption() as any
  if (!option) return null

  const series: any[] = Array.isArray(option.series) ? option.series : []
  if (!series.length) return null

  const xAxis: any[] = Array.isArray(option.xAxis)
    ? option.xAxis
    : option.xAxis
      ? [option.xAxis]
      : []
  const yAxis: any[] = Array.isArray(option.yAxis)
    ? option.yAxis
    : option.yAxis
      ? [option.yAxis]
      : []

  const categoryAxis =
    xAxis.find((a) => a?.type === 'category') ?? yAxis.find((a) => a?.type === 'category')
  const categoryData: string[] = categoryAxis?.data ?? []

  const seriesNames = series.map((s, i) => s.name ?? `Series ${i + 1}`)

  if (!categoryData.length) {
    // No category axis — flat dimension encoding (scatter / bubble / heatmap)
    const allRows = series.flatMap((s, si) => {
      const raw: any[] = s.data ?? []
      return raw.map((d) => {
        const row: Record<string, unknown> = {}
        if (Array.isArray(d)) {
          d.forEach((v, idx) => {
            row[`dim${idx}`] = v
          })
        } else {
          row[seriesNames[si]] = d
        }
        return row
      })
    })
    const colKeys = Array.from(new Set(allRows.flatMap(Object.keys)))
    const headers = colKeys.map((k) => ({ key: k, header: k }))
    const rows = allRows.map((r, i) => ({ id: String(i), ...r }))
    return { headers, rows }
  }

  // Category axis path
  const headers = [
    { key: 'category', header: 'Category' },
    ...seriesNames.map((n) => ({ key: n, header: n })),
  ]
  const rows: Record<string, unknown>[] = categoryData.map((cat, ci) => {
    const row: Record<string, unknown> = { id: String(ci), category: cat }
    series.forEach((s, si) => {
      const raw = s.data?.[ci]
      // ECharts data items can be: number | null | [x, y] | {value: N} | {value: [x,y]}
      let val: unknown = raw
      if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) {
        val = (raw as any).value ?? null
      }
      if (Array.isArray(val)) {
        val = val[1] ?? val[0]
      }
      row[seriesNames[si]] = val
    })
    return row
  })
  return { headers, rows }
}

function buildCSV(instance: EChartsType): string {
  const data = buildTableData(instance)
  if (!data) return ''
  const { headers, rows } = data
  const colKeys = headers.map((h) => h.key).filter((k) => k !== 'id')
  const header = headers
    .filter((h) => h.key !== 'id')
    .map((h) => JSON.stringify(h.header))
    .join(',')
  const body = rows.map((r) => colKeys.map((k) => JSON.stringify(r[k] ?? '')).join(',')).join('\n')
  return `${header}\n${body}`
}

function downloadCSV(instance: EChartsType, title: string) {
  const csv = buildCSV(instance)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function exportImage(instance: EChartsType, title: string, format: 'png' | 'jpg') {
  // canvas renderer: use ECharts built-in getDataURL
  try {
    const url = instance.getDataURL({
      type: format === 'jpg' ? 'jpeg' : 'png',
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.${format}`
      a.click()
      return
    }
  } catch {
    // SVG renderer fallback below
  }

  // SVG renderer: serialise → canvas → image
  const container = (instance as any).getDom?.() as HTMLElement | null
  if (!container) return
  const svgEl = container.querySelector('svg')
  if (!svgEl) return

  const svgStr = new XMLSerializer().serializeToString(svgEl)
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' })
  const svgUrl = URL.createObjectURL(svgBlob)
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || svgEl.clientWidth
    canvas.height = img.naturalHeight || svgEl.clientHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(svgUrl)
    const dataUrl = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.${format}`
    a.click()
  }
  img.src = svgUrl
}

// ---------------------------------------------------------------------------
// Table modal
// ---------------------------------------------------------------------------

interface TableModalProps {
  title: string
  instance: EChartsType
  onClose: () => void
}

function TableModal({ title, instance, onClose }: TableModalProps) {
  const data = buildTableData(instance)
  const displayHeaders = data ? data.headers.filter((h) => h.key !== 'id') : []
  const displayRows = data ? (data.rows as { id: string; [key: string]: unknown }[]) : []

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return ReactDOM.createPortal(
    <div className="chart-toolbar__modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="chart-toolbar__modal"
        role="dialog"
        aria-modal="true"
        aria-label="Tabular representation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="chart-toolbar__modal-header">
          <span className="chart-toolbar__modal-title">Tabular representation</span>
          <button
            type="button"
            className="chart-toolbar__modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            <Close size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="chart-toolbar__modal-body">
          {data ? (
            <DataTable rows={displayRows} headers={displayHeaders}>
              {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                <TableContainer>
                  <Table {...getTableProps()} size="md">
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader key={header.key} {...(getHeaderProps({ header }) as any)}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id} {...(getRowProps({ row }) as any)}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{String(cell.value ?? '')}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          ) : (
            <p className="chart-toolbar__modal-empty">No tabular data available for this chart.</p>
          )}
        </div>

        {/* Footer */}
        <div className="chart-toolbar__modal-footer">
          <Button kind="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            kind="primary"
            onClick={() => data && downloadCSV(instance, title)}
            disabled={!data}
          >
            Download as CSV
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ---------------------------------------------------------------------------
// Main toolbar component
// ---------------------------------------------------------------------------

export function ChartToolbar({
  chartInstance,
  title = 'chart',
  isFullscreen,
  onFullscreen,
}: ChartToolbarProps) {
  const [showTable, setShowTable] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close overflow menu on outside click
  React.useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleExport = (type: 'png' | 'jpg') => {
    setMenuOpen(false)
    if (!chartInstance) return
    exportImage(chartInstance, title, type)
  }

  const hasData = chartInstance !== null

  return (
    <>
      {/* Toolbar floats in the upper-right corner of the chart container */}
      <div className="chart-toolbar" role="toolbar" aria-label="Chart controls">
        {/* Show as table */}
        <button
          type="button"
          className="chart-toolbar__btn"
          title="Show as table"
          aria-label="Show as table"
          disabled={!hasData}
          onClick={() => setShowTable(true)}
        >
          <TableSplit size={16} />
        </button>

        {/* Make / exit fullscreen */}
        <button
          type="button"
          className="chart-toolbar__btn"
          title={isFullscreen ? 'Exit fullscreen' : 'Make fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Make fullscreen'}
          onClick={onFullscreen}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        {/* More options overflow */}
        <div className="chart-toolbar__menu-wrap" ref={menuRef}>
          <button
            type="button"
            className={`chart-toolbar__btn${menuOpen ? ' chart-toolbar__btn--active' : ''}`}
            title="More options"
            aria-label="More options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            disabled={!hasData}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <OverflowMenuVertical size={16} />
          </button>

          {menuOpen && (
            <div className="chart-toolbar__menu" role="menu">
              <button
                type="button"
                role="menuitem"
                className="chart-toolbar__menu-item"
                onClick={() => {
                  setMenuOpen(false)
                  if (chartInstance) downloadCSV(chartInstance, title)
                }}
              >
                Export to CSV
              </button>
              <button
                type="button"
                role="menuitem"
                className="chart-toolbar__menu-item"
                onClick={() => handleExport('png')}
              >
                Export to PNG
              </button>
              <button
                type="button"
                role="menuitem"
                className="chart-toolbar__menu-item"
                onClick={() => handleExport('jpg')}
              >
                Export to JPG
              </button>
            </div>
          )}
        </div>
      </div>

      {showTable && chartInstance && (
        <TableModal title={title} instance={chartInstance} onClose={() => setShowTable(false)} />
      )}
    </>
  )
}
