import type { TableData } from './types'

// ── Parallel coordinates ──────────────────────────────────────────────────────

/**
 * Extracts parallel-coordinates data into a flat long-format table.
 * Column headers come from `parallelAxis[n].name`; rows are labelled by
 * series name (city / group) in a leading "Group" column.
 */
export function extractParallel(option: any, series: any[]): TableData | null {
  // Build dim → label map from parallelAxis config
  const axisArr: any[] = Array.isArray(option.parallelAxis) ? option.parallelAxis : []
  const dimLabel: Record<number, string> = {}
  axisArr.forEach((ax: any) => {
    if (ax.dim != null && ax.name != null) {
      dimLabel[ax.dim as number] = String(ax.name)
    }
  })

  const allRows: Array<Record<string, unknown>> = []

  for (const s of series) {
    const groupName: string = s.name ?? 'Series'
    const raw: any[] = s.data ?? []
    for (const d of raw) {
      if (!Array.isArray(d)) continue
      const row: Record<string, unknown> = { Group: groupName }
      d.forEach((v: unknown, idx: number) => {
        const colName = dimLabel[idx] ?? `dim${idx}`
        row[colName] = v
      })
      allRows.push(row)
    }
  }

  if (!allRows.length) return null

  const colKeys = Array.from(new Set(allRows.flatMap(Object.keys)))
  const headers = colKeys.map((k) => ({ key: k, header: k }))
  const rows = allRows.map((r, i) => ({ id: String(i), ...r }))
  return { headers, rows }
}
