import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, groupSparse, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true }
// Extra grid offset reserved for a vertical legend panel on the left or right.
// Carbon Charts allocates ~120px for the legend column; we use the same value.
const LEGEND_SIDE_WIDTH = 120

// ── Line preset ───────────────────────────────────────────────────────────────

export type LineStep = 'start' | 'middle' | 'end'

export interface ThresholdDef {
  /** Y-axis value at which to draw the threshold line */
  value: number
  /** Optional label text shown on the line */
  label?: string
}

export interface LinePresetOptions {
  /** Smooth the line (Carbon Charts does not; kept for power users) */
  smooth?: boolean
  /** Step-line variant */
  step?: LineStep | boolean
  /** Use date field as x-axis (time-series mode) */
  timeSeries?: boolean
  /** Use log scale on Y axis */
  logScale?: boolean
  /**
   * Dual-axis: series names in this array go on the secondary (right) Y axis.
   * A second yAxis entry is added automatically.
   */
  secondaryGroups?: string[]
  /**
   * Horizontal axis label rotation in degrees (e.g. -45).
   * Maps to xAxis.axisLabel.rotate.
   */
  axisLabelRotate?: number
  /**
   * Y-axis threshold lines drawn via markLine on the first series.
   * Each entry becomes a silent horizontal reference line.
   */
  thresholds?: ThresholdDef[]
  /**
   * Restrict visible X-axis domain.
   * For category axes: array of category strings to show (subset).
   * For time/value axes: [min, max] numeric/string pair passed to xAxis.min/max.
   */
  xDomain?: [number | string, number | string] | string[]
  /**
   * Restrict visible Y-axis domain: [min, max] passed to yAxis.min/max.
   */
  yDomain?: [number, number]
  /**
   * Legend position. Maps to ECharts legend left/top/right/bottom anchor.
   * Default: 'bottom' (matches Carbon Charts default).
   */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** Chart title text */
  title?: string
  /** X-axis title label (maps to Carbon Charts axes.bottom.title) */
  xAxisTitle?: string
  /** Y-axis title label (maps to Carbon Charts axes.left.title) */
  yAxisTitle?: string
  /**
   * Per-series custom colors (maps to Carbon Charts color.scale).
   * Keys are group names, values are CSS color strings.
   * When provided, overrides the automatic palette for any matched series.
   */
  colorScale?: Record<string, string>
  /**
   * Series names that should be visible on initial render (maps to Carbon Charts
   * data.selectedGroups). All other series start hidden but are togglable via
   * the legend. When omitted all series are visible.
   */
  selectedGroups?: string[]
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for line charts.
 *
 * Supports discrete category, time-series, log scale, step-line,
 * dual-axis, rotated axis labels, and threshold lines.
 */
export function createLineOptions(
  data: ChartTabularData,
  opts: LinePresetOptions = {},
): EChartsOption {
  const {
    smooth = false,
    step,
    timeSeries = false,
    logScale = false,
    secondaryGroups = [],
    axisLabelRotate,
    thresholds = [],
    xDomain,
    yDomain,
    legendPosition,
    title,
    xAxisTitle,
    yAxisTitle,
    colorScale,
    selectedGroups,
    colorScheme = 'light',
  } = opts

  const xField = timeSeries ? 'date' : 'key'
  const { groups, categories } = timeSeries ? groupSparse(data) : groupByGroup(data, xField)

  const hasDualAxis = secondaryGroups.length > 0

  const paletteColors = pickColors(groups.length, colorScheme)
  const colors = groups.map((g, i) =>
    colorScale && colorScale[g.name] ? colorScale[g.name] : paletteColors[i],
  )

  // If xDomain is a category filter (string[]), determine which category indices to keep
  const xCategoryFilter =
    !timeSeries && Array.isArray(xDomain) ? new Set(xDomain as string[]) : null

  const series: SeriesOption[] = groups.map((g, i) => {
    const isFirst = i === 0
    const markLine =
      isFirst && thresholds.length > 0
        ? {
            silent: true,
            data: thresholds.map((t) => ({
              yAxis: t.value,
              ...(t.label ? { label: { formatter: t.label } } : {}),
            })),
          }
        : undefined

    // For time-series x-axis, ECharts needs [date, value] pairs.
    // groupByGroup stores the category label in `name`; re-pair it with the numeric value.
    // When xDomain is a category filter, keep only the matching data points.
    // When yDomain is set, null out values outside [min, max] so ECharts clips them
    // the same way Carbon Charts does (no line drawn through out-of-range points).
    const filteredData = xCategoryFilter
      ? g.data.filter((d) => xCategoryFilter.has(d.name))
      : g.data
    const rawData = yDomain
      ? filteredData.map((d) => ({
          ...d,
          value:
            typeof d.value === 'number' && (d.value < yDomain[0] || d.value > yDomain[1])
              ? null
              : d.value,
        }))
      : filteredData
    const seriesData = timeSeries ? rawData.map((d) => [d.name, d.value as number]) : rawData

    return {
      type: 'line' as const,
      name: g.name,
      data: seriesData,
      smooth,
      connectNulls: false,
      itemStyle: { color: colors[i] },
      lineStyle: { color: colors[i] },
      ...(step !== undefined ? { step: step === true ? 'start' : step } : {}),
      ...(hasDualAxis && secondaryGroups.includes(g.name) ? { yAxisIndex: 1 } : {}),
      ...(markLine ? { markLine } : {}),
    }
  })

  // Category axis labels: always show every tick (interval:0), rotate if requested,
  // and truncate long labels to match Carbon Charts' overflow:'truncate' behaviour.
  const xAxisLabel = {
    axisLabel: {
      interval: 0,
      overflow: 'truncate' as const,
      width: 80,
      ...(axisLabelRotate !== undefined ? { rotate: axisLabelRotate } : {}),
    },
  }
  const xAxisTitleOpt = xAxisTitle
    ? { name: xAxisTitle, nameLocation: 'middle' as const, nameGap: 40 }
    : {}
  const yAxisTitleOpt = yAxisTitle
    ? { name: yAxisTitle, nameLocation: 'middle' as const, nameRotate: 90, nameGap: 50 }
    : {}

  const yAxisBase = {
    type: logScale ? ('log' as const) : ('value' as const),
    ...(yDomain ? { min: yDomain[0], max: yDomain[1] } : {}),
    ...yAxisTitleOpt,
  }
  const yAxis = hasDualAxis
    ? [yAxisBase, { type: 'value' as const, splitLine: { show: false } }]
    : yAxisBase

  // xDomain: for category axis restrict visible categories; for time/value set min/max
  const xDomainExtra =
    xDomain !== undefined
      ? timeSeries
        ? { min: xDomain[0], max: xDomain[1] }
        : { data: xDomain as string[] }
      : {}

  // legend position: carbon default is bottom; map to echarts legend placement
  const legendBase =
    legendPosition === 'left' || legendPosition === 'right'
      ? { type: 'scroll' as const, orient: 'vertical' as const, [legendPosition]: 0, top: 'middle' }
      : legendPosition === 'top'
        ? { type: 'scroll' as const, top: 0 }
        : { type: 'scroll' as const, bottom: 0 }

  // Pre-select only the listed groups — all others start hidden (matches Carbon
  // Charts data.selectedGroups). When selectedGroups is omitted every series is shown.
  const legendSelected = selectedGroups
    ? Object.fromEntries(groups.map((g) => [g.name, selectedGroups.includes(g.name)]))
    : undefined

  const legendOpt = legendSelected ? { ...legendBase, selected: legendSelected } : legendBase

  const grid = {
    ...GRID,
    ...(legendPosition === 'left' ? { left: GRID.left + LEGEND_SIDE_WIDTH } : {}),
    ...(legendPosition === 'right' ? { right: GRID.right + LEGEND_SIDE_WIDTH } : {}),
  }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis' },
    legend: legendOpt,
    grid,
    xAxis: timeSeries
      ? { type: 'time', ...xAxisLabel, ...xAxisTitleOpt, ...xDomainExtra }
      : { type: 'category', data: categories, ...xAxisLabel, ...xAxisTitleOpt, ...xDomainExtra },
    yAxis,
    series,
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export const createStepLineOptions = (
  data: ChartTabularData,
  opts?: Omit<LinePresetOptions, 'step'>,
): EChartsOption => createLineOptions(data, { ...opts, step: 'start' })

export const createTimeSeriesLineOptions = (
  data: ChartTabularData,
  opts?: Omit<LinePresetOptions, 'timeSeries'>,
): EChartsOption => createLineOptions(data, { ...opts, timeSeries: true })
