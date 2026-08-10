import type { TableData } from './types'

// ── Lollipop ──────────────────────────────────────────────────────────────────

/**
 * Extracts lollipop data as a long-format table: Group | <xCol> | <yCol>
 *
 * Lollipop series alternate scatter (dot) / bar (silent stick) pairs.
 * Each scatter series has data as [catIdx, value] (vertical) or [value, catIdx]
 * (horizontal). We read only the scatter series and resolve catIdx → label.
 */
export function extractLollipop(
  series: any[],
  cats: string[],
  xColName: string,
  yColName: string,
  horizontal: boolean,
): TableData | null {
  const rows: Array<{ id: string } & Record<string, unknown>> = []
  let rowId = 0

  // Scatter series are at even indices (0, 2, 4, ...)
  for (let i = 0; i < series.length; i += 2) {
    const s = series[i]
    const groupName: string = s.name ?? `Series ${i / 2 + 1}`
    const raw: any[] = s.data ?? []
    for (const d of raw) {
      const tuple = Array.isArray(d) ? d : null
      if (!tuple) continue
      // vertical: [catIdx, value]; horizontal: [value, catIdx]
      const catIdx = horizontal ? tuple[1] : tuple[0]
      const val = horizontal ? tuple[0] : tuple[1]
      const catLabel = typeof catIdx === 'number' ? (cats[catIdx] ?? catIdx) : catIdx
      rows.push({
        id: String(rowId++),
        group: groupName,
        [xColName]: catLabel,
        [yColName]: val,
      })
    }
  }

  if (!rows.length) return null

  return {
    headers: [
      { key: 'group', header: 'Group' },
      { key: xColName, header: xColName },
      { key: yColName, header: yColName },
    ],
    rows,
  }
}
