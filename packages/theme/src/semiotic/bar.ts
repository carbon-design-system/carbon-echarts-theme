import { pickColors, type ChartTabularData } from '../presets/_transform'
import type { ThemeKey } from '../tokens'
import { colorSchemeFor } from './theme'
import type { SemioticLegendInteraction } from './line'

export interface SemioticThresholdDef {
  /** Value at which to draw the threshold line */
  value: number
  /** Optional label text */
  label?: string
}

export interface BarPresetOptions {
  title?: string
  /** Category axis label. */
  xLabel?: string
  /** Value axis label. */
  yLabel?: string
  horizontal?: boolean
  /** Restrict visible value domain: [min, max]. */
  yDomain?: [number, number]
  /** Value-axis threshold lines. */
  thresholds?: SemioticThresholdDef[]
  /** Custom formatter for value ticks and tooltip values. */
  valueFormatter?: (v: number | string) => string
  /** Screen reader description for accessibility (aria-label). */
  description?: string
  /** Screen reader summary note for accessibility. */
  summary?: string
  /** Per-group colour overrides `{ [group]: colour }`. Unlisted groups use the Carbon palette. */
  colors?: Record<string, string>
  /** Carbon theme key — selects the light or dark palette. Default `'white'`. */
  themeKey?: ThemeKey
  width?: number
  height?: number
  /** Legend position. Default `'bottom'`. */
  legendPosition?: 'bottom' | 'top' | 'left' | 'right'
  /** Legend interaction mode ('isolate', 'highlight', 'none'). Default `'none'` for simple bar. */
  legendInteraction?: SemioticLegendInteraction
}

export interface BarRow {
  group: string
  value: number
}

/**
 * Structural subset of Semiotic's `BarChartProps<BarRow>`. Declared locally so
 * this package does not depend on `semiotic`. Spread it into `<BarChart>`.
 */
export interface SemioticBarProps {
  data: BarRow[]
  categoryAccessor: 'group'
  valueAccessor: 'value'
  colorBy: 'group'
  colorScheme: Record<string, string>
  orientation: 'vertical' | 'horizontal'
  title?: string
  categoryLabel?: string
  valueLabel?: string
  valueFormat: (v: number | string) => string
  showLegend: boolean
  legendPosition: 'bottom' | 'top' | 'left' | 'right'
  legendInteraction: SemioticLegendInteraction
  enableHover: boolean
  valueExtent?: [number, number]
  annotations?: Array<Record<string, unknown>>
  description?: string
  summary?: string
  /** Follow the parent container's width. Set unless an explicit `width` was given. */
  responsiveWidth?: boolean
  width?: number
  height?: number
}

/**
 * Table for the toolbar's "Show as table" / CSV. Structurally the toolbar's
 * `TableData`; declared locally so this package does not depend on the toolbar.
 */
export interface BarTableData {
  headers: Array<{ key: string; header: string }>
  rows: Array<{ id: string } & Record<string, unknown>>
}

/** Keeps rows with a scalar numeric value (floating `[base, end]` and `null` values are not supported yet). */
function toBarRows(data: ChartTabularData): BarRow[] {
  return data.flatMap((d) =>
    typeof d.value === 'number' ? [{ group: d.group, value: d.value }] : [],
  )
}

/**
 * Semiotic counterpart of `createBarOptions` — a simple bar chart.
 * Takes the same Carbon flat `{ group, value }` rows and returns props for
 * Semiotic's `BarChart`.
 *
 * @example
 * <BarChart {...createBarProps(rows, { title: 'Simple bar' })} />
 */
export function createBarProps(
  data: ChartTabularData,
  opts: BarPresetOptions = {},
): SemioticBarProps {
  const allRows = toBarRows(data)
  const allGroups = [...new Set(allRows.map((r) => r.group))]
  const palette = pickColors(allGroups.length, colorSchemeFor(opts.themeKey ?? 'white'))
  const colorScheme: Record<string, string> = Object.fromEntries(
    allGroups.map((g, i) => [g, opts.colors?.[g] ?? palette[i]]),
  )

  const valueFormat =
    opts.valueFormatter ??
    ((v: number | string) => (typeof v === 'number' ? v.toLocaleString() : String(v)))

  const annotations = opts.thresholds?.map((t) => ({
    type: opts.horizontal ? 'x-threshold' : 'y-threshold',
    value: t.value,
    label: t.label,
  }))

  return {
    data: allRows,
    categoryAccessor: 'group',
    valueAccessor: 'value',
    colorBy: 'group',
    colorScheme,
    orientation: opts.horizontal ? 'horizontal' : 'vertical',
    title: opts.title,
    categoryLabel: opts.xLabel,
    valueLabel: opts.yLabel,
    valueFormat,
    showLegend: true,
    legendPosition: opts.legendPosition ?? 'bottom',
    legendInteraction: opts.legendInteraction ?? 'none',
    enableHover: true,
    ...(opts.yDomain ? { valueExtent: opts.yDomain } : {}),
    ...(annotations && annotations.length > 0 ? { annotations } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.summary ? { summary: opts.summary } : {}),
    ...(opts.width !== undefined ? { width: opts.width } : { responsiveWidth: true }),
    ...(opts.height !== undefined && { height: opts.height }),
  }
}

/**
 * Table for the toolbar's "Show as table" / CSV, in the same
 * `Group | x-value | y-value` shape the ECharts simple bar produces.
 * Pass the `data` returned by `createBarProps`.
 */
export function createBarTableData(rows: BarRow[]): BarTableData {
  return {
    headers: [
      { key: 'group', header: 'Group' },
      { key: 'x-value', header: 'x-value' },
      { key: 'y-value', header: 'y-value' },
    ],
    rows: rows.map((r, i) => ({
      id: String(i),
      group: r.group,
      'x-value': r.group,
      'y-value': r.value,
    })),
  }
}
