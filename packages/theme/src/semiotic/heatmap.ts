import type { ChartTabularData } from '../presets/_transform'
import type { ThemeKey } from '../tokens'

export interface HeatmapPresetOptions {
  /** Chart title text */
  title?: string
  /** X-axis label (e.g. "Day" or "Letter") */
  xLabel?: string
  /** Y-axis label (e.g. "Time" or "Month") */
  yLabel?: string
  /**
   * Color scheme name (e.g. 'blues', 'purples', 'viridis', 'turbo') or 'custom'.
   * Default: 'blues'.
   */
  colorScheme?: string
  /** Custom color scale function mapping numeric value to CSS color string */
  customColorScale?: (value: number) => string
  /** Show numeric values inside each cell */
  showValues?: boolean
  /** Custom formatter for cell values */
  valueFormatter?: (v: number) => string
  /** Show color scale legend. Default `true`. */
  showLegend?: boolean
  /** Position of the gradient legend. Default `'right'`. */
  legendPosition?: 'right' | 'left' | 'top' | 'bottom'
  /** Screen reader description for accessibility (aria-label). */
  description?: string
  /** Screen reader summary note for accessibility. */
  summary?: string
  /** Cell border color. Default `'var(--semiotic-bg, #ffffff)'`. */
  cellBorderColor?: string
  /** Cell border width. Default `1`. */
  cellBorderWidth?: number
  /** Carbon theme key. Default `'white'`. */
  themeKey?: ThemeKey
  width?: number
  height?: number
}

export interface HeatmapRow {
  group: string
  key: string
  x: number
  y: number
  value: number
}

/**
 * Structural subset of Semiotic's `HeatmapProps<HeatmapRow>`.
 * Declared locally so this package does not depend on `semiotic`.
 */
export interface SemioticHeatmapProps {
  data: HeatmapRow[]
  xAccessor: 'x'
  yAccessor: 'y'
  valueAccessor: 'value'
  title?: string
  xLabel?: string
  yLabel?: string
  xFormat?: (d: string | number | Date, index?: number, allTicks?: number[]) => string
  yFormat?: (d: number | Date | string) => string
  colorScheme?: string
  customColorScale?: (value: number) => string
  showValues?: boolean
  valueFormat?: (d: number) => string
  cellBorderColor?: string
  cellBorderWidth?: number
  showLegend: boolean
  legendPosition: 'right' | 'left' | 'top' | 'bottom'
  enableHover: boolean
  description?: string
  summary?: string
  responsiveWidth?: boolean
  width?: number
  height?: number
  frameProps?: {
    axes?: Array<{
      orient: 'bottom' | 'top' | 'left' | 'right'
      ticks?: number
      tickValues?: number[]
      [key: string]: unknown
    }>
    [key: string]: unknown
  }
}

/** Table for the toolbar's "Show as table" / CSV. */
export interface HeatmapTableData {
  headers: Array<{ key: string; header: string }>
  rows: Array<{ id: string } & Record<string, unknown>>
}

/**
 * Semiotic counterpart of `createHeatmapOptions` — a 2D matrix heatmap.
 * Maps Carbon `{ group, key, value }` rows into continuous coordinate indices
 * with discrete tick label formatters.
 */
export function createHeatmapProps(
  data: ChartTabularData,
  opts: HeatmapPresetOptions = {},
): SemioticHeatmapProps {
  // Extract unique X categories (keys) and Y categories (groups) preserving appearance order
  const xCategories: string[] = []
  const yCategories: string[] = []

  for (const d of data) {
    const k = String(d.key ?? (d as unknown as Record<string, unknown>).x ?? '')
    const g = String(d.group ?? (d as unknown as Record<string, unknown>).y ?? '')
    if (k && !xCategories.includes(k)) xCategories.push(k)
    if (g && !yCategories.includes(g)) yCategories.push(g)
  }

  const xMap = new Map(xCategories.map((c, i) => [c, i]))
  const yMap = new Map(yCategories.map((c, i) => [c, i]))

  const rows: HeatmapRow[] = data.flatMap((d) => {
    if (typeof d.value !== 'number') return []
    const k = String(d.key ?? (d as unknown as Record<string, unknown>).x ?? '')
    const g = String(d.group ?? (d as unknown as Record<string, unknown>).y ?? '')
    const x = xMap.get(k)
    const y = yMap.get(g)
    if (x === undefined || y === undefined) return []
    return [{ group: g, key: k, x, y, value: d.value }]
  })

  const xFormat = (v: string | number | Date) => xCategories[Math.round(Number(v))] ?? String(v)
  const yFormat = (v: number | Date | string) => yCategories[Math.round(Number(v))] ?? String(v)

  const valueFormat = opts.valueFormatter
    ? (v: number) => opts.valueFormatter!(v)
    : (v: number) => (typeof v === 'number' ? v.toLocaleString() : String(v))

  const frameProps: SemioticHeatmapProps['frameProps'] = {
    axes: [
      {
        orient: 'bottom',
        ticks: xCategories.length,
        tickValues: xCategories.map((_, i) => i),
      },
      {
        orient: 'left',
        ticks: yCategories.length,
        tickValues: yCategories.map((_, i) => i),
      },
    ],
  }

  return {
    data: rows,
    xAccessor: 'x',
    yAccessor: 'y',
    valueAccessor: 'value',
    title: opts.title,
    xLabel: opts.xLabel,
    yLabel: opts.yLabel,
    xFormat,
    yFormat,
    colorScheme: opts.colorScheme ?? 'blues',
    ...(opts.customColorScale ? { customColorScale: opts.customColorScale } : {}),
    showValues: opts.showValues ?? false,
    valueFormat,
    cellBorderColor: opts.cellBorderColor,
    cellBorderWidth: opts.cellBorderWidth ?? 1,
    showLegend: opts.showLegend ?? true,
    legendPosition: opts.legendPosition ?? 'right',
    enableHover: true,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.summary ? { summary: opts.summary } : {}),
    ...(opts.width !== undefined ? { width: opts.width } : { responsiveWidth: true }),
    ...(opts.height !== undefined && { height: opts.height }),
    frameProps,
  }
}

/** Generates table data for toolbar CSV / Table Modal */
export function createHeatmapTableData(rows: HeatmapRow[]): HeatmapTableData {
  return {
    headers: [
      { key: 'group', header: 'Group / Y' },
      { key: 'key', header: 'Key / X' },
      { key: 'value', header: 'Value' },
    ],
    rows: rows.map((r, i) => ({
      id: String(i),
      group: r.group,
      key: r.key,
      value: r.value,
    })),
  }
}
