/**
 * Shared Carbon Charts tabular data → ECharts series transform.
 *
 * Carbon Charts uses a flat tabular format:
 *   { group, key?, date?, value, ...extras }
 *
 * ECharts expects data split by series. This module contains the utilities
 * that every preset uses to perform that conversion.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

/** Single row of Carbon Charts flat tabular data */
export interface ChartTabularDatum {
  group: string
  key?: string
  date?: string | Date
  value: number
  [extra: string]: unknown
}

export type ChartTabularData = ChartTabularDatum[]

/** Single ECharts series entry produced by the transform */
export interface GroupedSeriesDatum {
  value: number | null
  name: string
}

export interface GroupedSeries {
  name: string
  data: GroupedSeriesDatum[]
}

export interface TransformResult {
  groups: GroupedSeries[]
  categories: string[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert Carbon Charts flat tabular data into ECharts series array.
 *
 * @param data    Flat tabular rows
 * @param xField  Which row field to use as the category axis label
 * @returns       `{ groups, categories }` where `groups` is the series array
 *                and `categories` is the ordered x-axis label array.
 */
export function groupByGroup(
  data: ChartTabularData,
  xField: 'key' | 'date' = 'key',
): TransformResult {
  const categorySet = new Set<string>()
  const map = new Map<string, Map<string, number>>()

  for (const d of data) {
    const raw = d[xField]
    const cat = raw instanceof Date ? raw.toISOString() : String(raw ?? '')
    categorySet.add(cat)
    if (!map.has(d.group)) map.set(d.group, new Map())
    map.get(d.group)!.set(cat, d.value)
  }

  const categories = [...categorySet]
  const groups: GroupedSeries[] = []

  for (const [name, byKey] of map) {
    groups.push({
      name,
      data: categories.map((cat) => ({
        value: byKey.has(cat) ? byKey.get(cat)! : null,
        name: cat,
      })),
    })
  }

  return { groups, categories }
}
