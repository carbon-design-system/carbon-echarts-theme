/**
 * Shared Carbon Charts tabular data → ECharts series transform.
 *
 * Carbon Charts uses a flat tabular format:
 *   { group, key?, date?, value, ...extras }
 *
 * ECharts expects data split by series. This module contains the utilities
 * that every preset uses to perform that conversion.
 */
import {
  // Light N-palettes
  purple70,
  teal50,
  magenta50,
  cyan50,
  cyan90,
  teal70,
  magenta70,
  red90,
  // Dark N-palettes
  purple60,
  teal40,
  cyan20,
  blue50,
  magenta40,
  purple30,
} from '@carbon/colors'
import { lightCategorical, darkCategorical } from '../palettes'

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
  xField: 'key' | 'date' | 'group' = 'key',
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

// ── N-color palette selection ─────────────────────────────────────────────────

/**
 * Carbon Charts uses optimised N-color palettes that differ from the plain
 * sequential 14-color order. For small N, colors are chosen for maximum
 * visual contrast. For N > 5, the full 14-color sequential palette is used.
 *
 * Source: Carbon Charts _color-palette.scss, cds-charts-N-1-* CSS variables.
 */

/** Light theme (white/g10) N-optimised palettes for N = 1..5 */
const LIGHT_N_PALETTES: readonly (readonly string[])[] = [
  [purple70],
  [purple70, teal50],
  [magenta50, cyan50, purple70],
  [purple70, cyan90, teal50, magenta50],
  [purple70, cyan50, teal70, magenta70, red90],
]

/** Dark theme (g90/g100) N-optimised palettes for N = 1..5 */
const DARK_N_PALETTES: readonly (readonly string[])[] = [
  [purple30],
  [purple60, teal40],
  [purple60, teal40, cyan20],
  [purple60, teal40, cyan20, blue50],
  [purple60, teal40, cyan20, blue50, magenta40],
]

/**
 * Pick per-series colors matching Carbon Charts' N-color palette selection.
 *
 * For N ≤ 5 series, returns the optimised N-color subset.
 * For N > 5, falls back to the full 14-color sequential categorical palette.
 *
 * @param count        Number of series
 * @param colorScheme  'light' (default) or 'dark'
 */
export function pickColors(count: number, colorScheme: 'light' | 'dark' = 'light'): string[] {
  const nPalettes = colorScheme === 'dark' ? DARK_N_PALETTES : LIGHT_N_PALETTES
  const fallback = (colorScheme === 'dark' ? darkCategorical : lightCategorical) as string[]

  if (count >= 1 && count <= nPalettes.length) {
    return [...nPalettes[count - 1]]
  }
  // For N > 5, cycle through the full categorical palette
  return Array.from({ length: count }, (_, i) => fallback[i % fallback.length])
}
