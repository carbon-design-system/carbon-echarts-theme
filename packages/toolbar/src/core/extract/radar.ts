import type { TableData } from './types'

// ── Radar ─────────────────────────────────────────────────────────────────────

export function extractRadar(option: any, series: any[]): TableData | null {
  const radarConfig = Array.isArray(option.radar) ? option.radar[0] : option.radar
  const indicators: string[] = (radarConfig?.indicator ?? []).map(
    (ind: any) => ind.name ?? ind.text ?? '',
  )

  const radarSeries = series.filter((s: any) => (s.type ?? '').toLowerCase() === 'radar')
  if (!radarSeries.length) return null

  const headers = [
    { key: 'group', header: 'Group' },
    ...indicators.map((ind) => ({ key: ind, header: ind })),
  ]

  const rows: Array<{ id: string } & Record<string, unknown>> = []
  radarSeries.forEach((s: any, si: number) => {
    ;(s.data as any[]).forEach((d: any, di: number) => {
      const values: number[] = Array.isArray(d.value) ? d.value : []
      const row: { id: string } & Record<string, unknown> = {
        id: `${si}-${di}`,
        group: String(d.name ?? s.name ?? `Series ${si + 1}`),
      }
      indicators.forEach((ind, ii) => {
        row[ind] = values[ii] ?? null
      })
      rows.push(row)
    })
  })
  return rows.length ? { headers, rows } : null
}
