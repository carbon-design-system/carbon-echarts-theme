import type { TableData } from './types'

// ── Time-axis long-format (line / area time-series) ──────────────────────────

/**
 * Extracts time-series data as a long-format table with three columns:
 *   Group | <xAxisTitle or "Date"> | <yAxisLabel or "Value">
 *
 * Each series contributes one row per data point. Series data items are
 * expected to be [timestamp, value] tuples (as produced by createAreaOptions /
 * createLineOptions when timeSeries:true).
 */
export function extractTimeSeries(
  series: any[],
  xTitle?: string,
  yTitle?: string,
): TableData | null {
  const dateKey = xTitle ?? 'Date'
  const valueKey = yTitle ?? 'Value'
  const rows: Array<{ id: string } & Record<string, unknown>> = []

  for (const s of series) {
    const groupName: string = s.name ?? ''
    const pts: any[] = s.data ?? []
    for (const pt of pts) {
      let x: unknown
      let y: unknown
      if (Array.isArray(pt)) {
        x = pt[0]
        y = pt[1]
      } else if (pt !== null && typeof pt === 'object') {
        x = (pt as any).name ?? (pt as any).value?.[0] ?? null
        y = Array.isArray((pt as any).value) ? (pt as any).value[1] : ((pt as any).value ?? null)
      } else {
        x = null
        y = pt
      }

      // Format timestamp as a human-readable date if it looks like one.
      // Use timeZone:'UTC' so that ISO date strings like '2023-01-01' (which are
      // parsed as UTC midnight) don't shift to the previous day in behind-UTC locales.
      let dateStr: unknown = x
      if (
        typeof x === 'number' ||
        (typeof x === 'string' && !Number.isNaN(Date.parse(x as string)))
      ) {
        const parsed = new Date(x as number | string)
        if (!Number.isNaN(parsed.getTime())) {
          // Use UTC for pure date strings (no time component); use local time for timestamps
          const isDateOnly = typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)
          dateStr = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(isDateOnly ? { timeZone: 'UTC' } : {}),
          }).format(parsed)
        }
      }

      const row: { id: string } & Record<string, unknown> = {
        id: String(rows.length),
        group: groupName,
      }
      row[dateKey] = dateStr
      row[valueKey] = y
      rows.push(row)
    }
  }

  if (!rows.length) return null

  const headers = [
    { key: 'group', header: 'Group' },
    { key: dateKey, header: dateKey },
    { key: valueKey, header: valueKey },
  ]
  return { headers, rows }
}
