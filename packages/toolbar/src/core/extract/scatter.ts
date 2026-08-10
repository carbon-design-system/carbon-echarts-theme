import type { TableData } from './types'

// ── Scatter / bubble ──────────────────────────────────────────────────────────

/**
 * Extracts scatter/bubble data as a long-format table:
 *   Group | <xAxisName> | <yAxisName> [| Size]
 *
 * Each series contributes one row per data point. Series data items are
 * [x, y] pairs (scatter) or [x, y, size] triples (bubble).
 * The column headers use the axis names set on the ECharts option.
 */
export function extractScatterBubble(
  series: any[],
  xName: string,
  yName: string,
): TableData | null {
  const rows: Array<{ id: string } & Record<string, unknown>> = []
  let hasSize = false

  for (const s of series) {
    const groupName: string = s.name ?? ''
    const pts: any[] = s.data ?? []
    for (const pt of pts) {
      let x: unknown, y: unknown, size: unknown
      if (Array.isArray(pt)) {
        x = pt[0]
        y = pt[1]
        if (pt.length > 2) {
          size = pt[2]
          hasSize = true
        }
      } else if (pt !== null && typeof pt === 'object') {
        const v = (pt as any).value
        if (Array.isArray(v)) {
          x = v[0]
          y = v[1]
          if (v.length > 2) {
            size = v[2]
            hasSize = true
          }
        } else {
          x = v
          y = null
        }
      } else {
        x = pt
        y = null
      }
      const row: { id: string } & Record<string, unknown> = {
        id: String(rows.length),
        group: groupName,
        [xName]: x,
        [yName]: y,
      }
      if (size !== undefined) row['size'] = size
      rows.push(row)
    }
  }

  if (!rows.length) return null

  const headers = [
    { key: 'group', header: 'Group' },
    { key: xName, header: xName },
    { key: yName, header: yName },
    ...(hasSize ? [{ key: 'size', header: 'Size' }] : []),
  ]
  return { headers, rows }
}
