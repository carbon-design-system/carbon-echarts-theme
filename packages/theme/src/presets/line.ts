import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

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
    colorScheme = 'light',
  } = opts

  const xField = timeSeries ? 'date' : 'key'
  const { groups, categories } = groupByGroup(data, xField)

  const hasDualAxis = secondaryGroups.length > 0

  const colors = pickColors(groups.length, colorScheme)

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
    const rawData = xCategoryFilter ? g.data.filter((d) => xCategoryFilter.has(d.name)) : g.data
    const seriesData = timeSeries ? rawData.map((d) => [d.name, d.value as number]) : rawData

    return {
      type: 'line' as const,
      name: g.name,
      data: seriesData,
      smooth,
      connectNulls: true,
      itemStyle: { color: colors[i] },
      lineStyle: { color: colors[i] },
      ...(step !== undefined ? { step: step === true ? 'start' : step } : {}),
      ...(hasDualAxis && secondaryGroups.includes(g.name) ? { yAxisIndex: 1 } : {}),
      ...(markLine ? { markLine } : {}),
    }
  })

  const yAxisBase = {
    type: logScale ? ('log' as const) : ('value' as const),
    ...(yDomain ? { min: yDomain[0], max: yDomain[1] } : {}),
  }
  const yAxis = hasDualAxis
    ? [yAxisBase, { type: 'value' as const, splitLine: { show: false } }]
    : yAxisBase

  const xAxisLabel = axisLabelRotate !== undefined ? { axisLabel: { rotate: axisLabelRotate } } : {}

  // xDomain: for category axis restrict visible categories; for time/value set min/max
  const xDomainExtra =
    xDomain !== undefined
      ? timeSeries
        ? { min: xDomain[0], max: xDomain[1] }
        : { data: xDomain as string[] }
      : {}

  // legend position: carbon default is bottom; map to echarts legend placement
  const legendOpt =
    legendPosition === 'left' || legendPosition === 'right'
      ? { type: 'scroll' as const, orient: 'vertical' as const, [legendPosition]: 0, top: 'middle' }
      : legendPosition === 'top'
        ? { type: 'scroll' as const, top: 0 }
        : { type: 'scroll' as const, bottom: 0 }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis' },
    legend: legendOpt,
    grid: GRID,
    xAxis: timeSeries
      ? { type: 'time', ...xAxisLabel, ...xDomainExtra }
      : { type: 'category', data: categories, ...xAxisLabel, ...xDomainExtra },
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
