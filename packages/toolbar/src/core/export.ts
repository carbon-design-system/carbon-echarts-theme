import { toChartSource, type ChartSource, type ChartSourceInput } from './source'

function buildCSV(source: ChartSource): string {
  const data = source.getTableData()
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

/** Triggers a browser download of the chart data as a CSV file. */
export function downloadCSV(input: ChartSourceInput, filename: string): void {
  const csv = buildCSV(toChartSource(input))
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Triggers a browser download of the chart as a PNG or JPG image.
 * Uses the source's native `getDataURL()` when it provides one (ECharts canvas).
 * Otherwise falls back to SVG serialisation → canvas.
 */
export function exportImage(
  input: ChartSourceInput,
  filename: string,
  format: 'png' | 'jpg',
): void {
  const source = toChartSource(input)
  try {
    const url = source.getDataURL?.(format === 'jpg' ? 'jpeg' : 'png')
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.${format}`
      a.click()
      return
    }
  } catch {
    // SVG fallback below
  }

  const svgEl = source.getSvgElement?.()
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
    a.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.${format}`
    a.click()
  }
  img.src = svgUrl
}
