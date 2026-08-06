import type { EChartsType } from 'echarts'
import { buildTableData } from './extract'

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

/** Triggers a browser download of the chart data as a CSV file. */
export function downloadCSV(instance: EChartsType, filename: string): void {
  const csv = buildCSV(instance)
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
 * Uses ECharts getDataURL() for canvas renderer.
 * Falls back to SVG serialisation → canvas for the SVG renderer.
 */
export function exportImage(instance: EChartsType, filename: string, format: 'png' | 'jpg'): void {
  try {
    const url = instance.getDataURL({
      type: format === 'jpg' ? 'jpeg' : 'png',
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.${format}`
      a.click()
      return
    }
  } catch {
    // SVG renderer fallback below
  }

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
    a.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.${format}`
    a.click()
  }
  img.src = svgUrl
}
