import type { TableData } from './types'

// ── Pie / donut ───────────────────────────────────────────────────────────────

export function extractPie(series: any[]): TableData | null {
  // Use only the first non-phantom series (phantom donut has radius[0]===radius[1])
  const mainSeries =
    series.find((s: any) => {
      if ((s.type ?? '').toLowerCase() !== 'pie') return false
      const r = s.radius
      if (!Array.isArray(r)) return true
      return r[0] !== r[1]
    }) ?? series.find((s: any) => (s.type ?? '').toLowerCase() === 'pie')

  if (!mainSeries?.data?.length) return null

  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ]
  const rows = (mainSeries.data as any[]).map((d: any, i: number) => ({
    id: String(i),
    name: String(d.name ?? ''),
    value: d.value ?? null,
  }))
  return { headers, rows }
}
