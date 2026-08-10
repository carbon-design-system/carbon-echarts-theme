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
import * as carbonColors from '@carbon/colors'
import { lightCategorical, darkCategorical } from '../palettes'

// Typed reference used by sunburstPalette below.
// Double-cast through unknown because the @carbon/colors namespace also exports
// grouped objects (e.g. `yellow`) alongside flat string tokens, so a direct
// cast to Record<string,string> fails the overlap check.
const cc = carbonColors as unknown as Record<string, string>

// ── Types ─────────────────────────────────────────────────────────────────────

/** Single row of Carbon Charts flat tabular data */
export interface ChartTabularDatum {
  group: string
  /** Category axis label — string for discrete data, number for continuous (e.g. employees count) */
  key?: string | number
  date?: string | Date
  /** Scalar value, [base, end] tuple (floating bar / floating area), or null (missing data) */
  value: number | number[] | null
  [extra: string]: unknown
}

export type ChartTabularData = ChartTabularDatum[]

/** Single ECharts series entry produced by the transform */
export interface GroupedSeriesDatum {
  value: number | number[] | null
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
    // Only store scalar values in the category map; tuple values (floating bar)
    // are handled directly in the floating-bar preset path, not via groupByGroup.
    if (!Array.isArray(d.value)) {
      map.get(d.group)!.set(cat, d.value as number)
    }
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

/**
 * Group time-series data by group name without null-padding missing dates.
 *
 * Unlike `groupByGroup`, this produces sparse per-series arrays — each series
 * only contains its own actual data points as `[date, value]`-ready entries.
 * ECharts' time axis handles sparse series natively, so no null padding is needed
 * and `connectNulls: false` won't produce isolated dots from padded holes.
 *
 * Explicit `null` values in the source data ARE preserved so that intentional
 * gaps (e.g. `value: null`) still break the line.
 */
export function groupSparse(data: ChartTabularData): TransformResult {
  const map = new Map<string, GroupedSeriesDatum[]>()

  for (const d of data) {
    if (!map.has(d.group)) map.set(d.group, [])
    const raw = d.date ?? d.key
    const name = raw instanceof Date ? raw.toISOString() : String(raw ?? '')
    map
      .get(d.group)!
      .push({ name, value: Array.isArray(d.value) ? null : (d.value as number | null) })
  }

  const groups: GroupedSeries[] = [...map.entries()].map(([name, data]) => ({ name, data }))
  return { groups, categories: [] }
}

// ── N-color palette selection ─────────────────────────────────────────────────

/**
 * Carbon Charts uses optimised N-color palettes that differ from the plain
 * sequential 14-color order. For small N, colors are chosen for maximum
 * visual contrast. For N > 5, the full 14-color sequential palette is used.
 *
 * Source: Carbon Charts _color-palette.scss, cds-charts-N-1-* CSS variables.
 */

/** Light theme (white/g10) N-optimised palettes for N = 1..5.
 * Source: Carbon Charts _color-palette.scss $white-theme-colors variant '1' for each N.
 */
const LIGHT_N_PALETTES: readonly (readonly string[])[] = [
  [purple70],
  [purple70, teal50],
  [magenta50, cyan50, purple70],
  [purple70, cyan90, teal50, magenta50],
  [purple70, cyan50, teal70, magenta70, red90],
]

/** Dark theme (g90/g100) N-optimised palettes for N = 1..5.
 * Source: Carbon Charts _color-palette.scss $dark-theme-colors variant '1' for each N.
 */
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

// ── Extended sunburst palette ─────────────────────────────────────────────────

/**
 * 45-colour palette for hierarchical charts (sunburst, treemap with many nodes).
 * Sourced entirely from @carbon/colors mid-range stops (30–70) across all 9
 * data-vis hues. Near-white (10, 20) and near-black (80–100) stops are excluded
 * so every swatch is legible against both white background and label text.
 *
 * Ordered to maximise contrast between adjacent segments: hues cycle before
 * stops step, so neighbours are always a different colour family.
 * Design can trim or reorder this set — the constant name is the stable API.
 */
export const sunburstPalette: readonly string[] = [
  // stop 50 — each hue's perceptual midpoint
  cc.blue50,
  cc.cyan50,
  cc.teal50,
  cc.green50,
  cc.red50,
  cc.magenta50,
  cc.purple50,
  cc.orange50,
  cc.yellow50,
  // stop 30 — lighter shade, same hue cycle
  cc.blue30,
  cc.cyan30,
  cc.teal30,
  cc.green30,
  cc.red30,
  cc.magenta30,
  cc.purple30,
  cc.orange30,
  cc.yellow30,
  // stop 70 — darker shade, same hue cycle
  cc.blue70,
  cc.cyan70,
  cc.teal70,
  cc.green70,
  cc.red70,
  cc.magenta70,
  cc.purple70,
  cc.orange70,
  cc.yellow70,
  // stop 40
  cc.blue40,
  cc.cyan40,
  cc.teal40,
  cc.green40,
  cc.red40,
  cc.magenta40,
  cc.purple40,
  cc.orange40,
  cc.yellow40,
  // stop 60
  cc.blue60,
  cc.cyan60,
  cc.teal60,
  cc.green60,
  cc.red60,
  cc.magenta60,
  cc.purple60,
  cc.orange60,
  cc.yellow60,
]
