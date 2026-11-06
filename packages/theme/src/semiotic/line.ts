import { pickColors, type ChartTabularData } from '../presets/_transform'
import type { ThemeKey } from '../tokens'
import { colorSchemeFor } from './theme'

export type SemioticCurve =
  | 'linear'
  | 'monotoneX'
  | 'monotoneY'
  | 'step'
  | 'stepAfter'
  | 'stepBefore'
  | 'basis'
  | 'cardinal'
  | 'catmullRom'

export type SemioticLegendInteraction = 'none' | 'highlight' | 'isolate'

export interface SemioticThresholdDef {
  /** Value at which to draw the threshold line */
  value: number
  /** Optional label text shown on the line */
  label?: string
}

export interface LinePresetOptions {
  title?: string
  /** Category or time axis label. */
  xLabel?: string
  /** Value axis label. */
  yLabel?: string
  /**
   * Horizontal axis label rotation (in degrees or boolean).
   * In Semiotic, enables axes autoRotate.
   */
  axisLabelRotate?: number | boolean
  /** Curve interpolation type. Default `'linear'`. */
  curve?: SemioticCurve
  /** Step line variant. */
  step?: boolean | 'step' | 'stepAfter' | 'stepBefore'
  /** Explicit time-series mode. */
  timeSeries?: boolean
  /** Use log scale on Y axis. */
  logScale?: boolean
  /** Restrict visible Y-axis domain: [min, max]. */
  yDomain?: [number, number]
  /** Y-axis threshold reference lines. */
  thresholds?: SemioticThresholdDef[]
  /** Custom formatter for value ticks and tooltips. */
  valueFormatter?: (v: number | string) => string
  /** Screen reader description for accessibility (aria-label). */
  description?: string
  /** Screen reader summary note for accessibility. */
  summary?: string
  /** Show point markers along the line. Default `true`. */
  showPoints?: boolean
  /** Point radius when `showPoints` is true. Default `3`. */
  pointRadius?: number
  /** Line stroke width. Default `2`. */
  lineWidth?: number
  /** Fill area under the line. */
  fillArea?: boolean | string[]
  /** Area opacity when fillArea is true. Default `0.2`. */
  areaOpacity?: number
  /** Per-group colour overrides `{ [group]: colour }`. Unlisted groups use the Carbon palette. */
  colors?: Record<string, string>
  /** Carbon theme key — selects the light or dark palette. Default `'white'`. */
  themeKey?: ThemeKey
  width?: number
  height?: number
  /** Show legend for multi-series lines. Default `true` when groups > 1. */
  showLegend?: boolean
  /** Legend position. Default `'bottom'`. */
  legendPosition?: 'bottom' | 'top' | 'left' | 'right'
  /** Legend interaction mode ('isolate', 'highlight', 'none'). Default `'isolate'`. */
  legendInteraction?: SemioticLegendInteraction
}

export interface LineRow {
  group: string
  x: number | Date | string
  value: number
  /** Original category label for discrete category axes */
  category?: string
}

/**
 * Structural subset of Semiotic's `LineChartProps<LineRow>`. Declared locally
 * so this package does not depend on `semiotic`. Spread it into `<LineChart>`.
 */
export interface SemioticLineProps {
  data: LineRow[]
  xAccessor: 'x'
  yAccessor: 'value'
  lineBy: 'group'
  colorBy: 'group'
  colorScheme: Record<string, string>
  title?: string
  xLabel?: string
  yLabel?: string
  xScaleType?: 'linear' | 'log' | 'time'
  yScaleType?: 'linear' | 'log' | 'symlog'
  xFormat?: (d: number | Date | string) => string
  yFormat?: (d: number | Date | string) => string
  valueFormat?: (d: number | string) => string
  xExtent?: [number, number]
  yExtent?: [number, number]
  annotations?: Array<Record<string, unknown>>
  description?: string
  summary?: string
  curve?: SemioticCurve
  showPoints: boolean
  pointRadius?: number
  lineWidth?: number
  fillArea?: boolean | string[]
  areaOpacity?: number
  showGrid: boolean
  showLegend: boolean
  legendPosition: 'bottom' | 'top' | 'left' | 'right'
  legendInteraction: SemioticLegendInteraction
  enableHover: boolean
  /** Follow the parent container's width. Set unless an explicit `width` was given. */
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

/**
 * Table for the toolbar's "Show as table" / CSV. Structurally the toolbar's
 * `TableData`; declared locally so this package does not depend on the toolbar.
 */
export interface LineTableData {
  headers: Array<{ key: string; header: string }>
  rows: Array<{ id: string } & Record<string, unknown>>
}

/** Converts Carbon tabular data rows `{ group, key/date, value }` to raw intermediate rows. */
function toRawLineRows(
  data: ChartTabularData,
): Array<{ group: string; rawX: string | number | Date; value: number }> {
  return data.flatMap((d) => {
    if (typeof d.value !== 'number') return []
    const xVal =
      d.date !== undefined
        ? d.date
        : d.key !== undefined
          ? d.key
          : (d as unknown as Record<string, unknown>).x
    if (xVal === undefined || xVal === null) return []
    return [{ group: d.group, rawX: xVal as string | number | Date, value: d.value }]
  })
}

/**
 * Semiotic counterpart of `createLineOptions` — a line chart.
 * Takes the same Carbon flat `{ group, key/date, value }` rows and returns props
 * for Semiotic's `LineChart`.
 *
 * For discrete category axes (e.g. `key: 'Qty'`), categories are mapped to
 * coordinate indices `0..N-1` and formatted so Semiotic's continuous XY engine
 * renders marks and axis ticks accurately.
 *
 * @example
 * <LineChart {...createLineProps(rows, { title: 'Line chart' })} />
 */
export function createLineProps(
  data: ChartTabularData,
  opts: LinePresetOptions = {},
): SemioticLineProps {
  const rawRows = toRawLineRows(data)
  const allGroups = [...new Set(rawRows.map((r) => r.group))]
  const palette = pickColors(allGroups.length, colorSchemeFor(opts.themeKey ?? 'white'))
  const colorScheme: Record<string, string> = Object.fromEntries(
    allGroups.map((g, i) => [g, opts.colors?.[g] ?? palette[i]]),
  )

  const isTime =
    opts.timeSeries ||
    rawRows.some(
      (r) =>
        r.rawX instanceof Date || (typeof r.rawX === 'string' && /^\d{4}-\d{2}-\d{2}/.test(r.rawX)),
    )

  const isCategorical =
    !isTime && rawRows.some((r) => typeof r.rawX === 'string' && Number.isNaN(Number(r.rawX)))

  let rows: LineRow[]
  let xFormat: ((d: number | Date | string) => string) | undefined
  let xExtent: [number, number] | undefined
  let frameProps: SemioticLineProps['frameProps'] | undefined

  if (isCategorical) {
    const categories = [...new Set(rawRows.map((r) => String(r.rawX)))]
    const catMap = new Map(categories.map((c, i) => [c, i]))
    rows = rawRows.map((r) => ({
      group: r.group,
      x: catMap.get(String(r.rawX)) ?? 0,
      value: r.value,
      category: String(r.rawX),
    }))
    xFormat = (v: number | Date | string) => categories[Math.round(Number(v))] ?? String(v)
    xExtent = [0, categories.length - 1]
  } else {
    rows = rawRows.map((r) => ({
      group: r.group,
      x: r.rawX,
      value: r.value,
    }))
  }

  const hasBottomAxisConfig = isCategorical || Boolean(opts.axisLabelRotate)
  if (hasBottomAxisConfig) {
    frameProps = {
      axes: [
        {
          orient: 'bottom',
          ...(opts.axisLabelRotate ? { autoRotate: true } : {}),
          ...(isCategorical
            ? {
                ticks: xExtent ? xExtent[1] + 1 : undefined,
                tickValues: [...new Set(rows.map((r) => Number(r.x)))],
              }
            : {}),
        },
        { orient: 'left' },
      ],
    }
  }

  const curve: SemioticCurve = opts.step
    ? typeof opts.step === 'string'
      ? (opts.step as SemioticCurve)
      : 'stepAfter'
    : (opts.curve ?? 'linear')

  const annotations = opts.thresholds?.map((t) => ({
    type: 'y-threshold',
    value: t.value,
    label: t.label,
  }))

  const valueFormat = opts.valueFormatter
    ? (v: number | string) => opts.valueFormatter!(v)
    : undefined

  return {
    data: rows,
    xAccessor: 'x',
    yAccessor: 'value',
    lineBy: 'group',
    colorBy: 'group',
    colorScheme,
    title: opts.title,
    xLabel: opts.xLabel,
    yLabel: opts.yLabel,
    ...(isTime ? { xScaleType: 'time' as const } : {}),
    ...(opts.logScale ? { yScaleType: 'log' as const } : {}),
    ...(xFormat ? { xFormat } : {}),
    ...(valueFormat
      ? {
          valueFormat,
          yFormat: (d: number | Date | string) =>
            valueFormat(typeof d === 'number' ? d : String(d)),
        }
      : {}),
    ...(xExtent ? { xExtent } : {}),
    ...(opts.yDomain ? { yExtent: opts.yDomain } : {}),
    ...(annotations && annotations.length > 0 ? { annotations } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.summary ? { summary: opts.summary } : {}),
    curve,
    showPoints: opts.showPoints ?? true,
    pointRadius: opts.pointRadius ?? 3,
    lineWidth: opts.lineWidth ?? 2,
    ...(opts.fillArea !== undefined
      ? { fillArea: opts.fillArea, areaOpacity: opts.areaOpacity ?? 0.2 }
      : {}),
    showGrid: true,
    showLegend: opts.showLegend ?? allGroups.length > 1,
    legendPosition: opts.legendPosition ?? 'bottom',
    legendInteraction: opts.legendInteraction ?? 'isolate',
    enableHover: true,
    ...(opts.width !== undefined ? { width: opts.width } : { responsiveWidth: true }),
    ...(opts.height !== undefined && { height: opts.height }),
    ...(frameProps ? { frameProps } : {}),
  }
}

/** Convenience wrapper for step line charts. */
export const createStepLineProps = (
  data: ChartTabularData,
  opts?: Omit<LinePresetOptions, 'step'>,
): SemioticLineProps => createLineProps(data, { ...opts, step: true })

/** Convenience wrapper for time-series line charts. */
export const createTimeSeriesLineProps = (
  data: ChartTabularData,
  opts?: Omit<LinePresetOptions, 'timeSeries'>,
): SemioticLineProps => createLineProps(data, { ...opts, timeSeries: true })

/**
 * Table for the toolbar's "Show as table" / CSV.
 * Pass the `data` returned by `createLineProps`.
 */
export function createLineTableData(
  rows: LineRow[],
  xHeader = 'Key',
  yHeader = 'Value',
): LineTableData {
  return {
    headers: [
      { key: 'group', header: 'Group' },
      { key: 'x', header: xHeader },
      { key: 'value', header: yHeader },
    ],
    rows: rows.map((r, i) => ({
      id: String(i),
      group: r.group,
      x: r.category ?? (r.x instanceof Date ? r.x.toISOString() : String(r.x)),
      value: r.value,
    })),
  }
}
