import type { TableData } from './types'

// ── Gauge ─────────────────────────────────────────────────────────────────────

export function extractGauge(series: any[]): TableData | null {
  // Real gauge series have a visible axisLine or progress — skip phantom series
  // that exist only for delta labels (they have progress/axisLine with show:false)
  const real = series.filter(
    (s: any) =>
      (s.type ?? '').toLowerCase() === 'gauge' &&
      s.data?.length &&
      (s.axisLine?.show !== false || s.progress?.show !== false),
  )
  if (!real.length) {
    // Fallback: first gauge series with data
    const first = series.find(
      (s: any) => (s.type ?? '').toLowerCase() === 'gauge' && s.data?.length,
    )
    if (!first) return null
    real.push(first)
  }

  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ]
  const rows: Array<{ id: string } & Record<string, unknown>> = []
  real.forEach((s: any) => {
    ;(s.data as any[]).forEach((d: any, i: number) => {
      rows.push({
        id: String(rows.length + i),
        name: String(d.name ?? ''),
        value: d.value ?? null,
      })
    })
  })
  return rows.length ? { headers, rows } : null
}
