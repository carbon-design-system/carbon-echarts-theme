import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Line preset ───────────────────────────────────────────────────────────────

export type LineStep = 'start' | 'middle' | 'end'

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
  /** Chart title text */
  title?: string
}

/**
 * Build an ECharts option object for line charts.
 *
 * Supports discrete category, time-series, log scale, step-line, and
 * dual-axis variants.
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
    title,
  } = opts

  const xField = timeSeries ? 'date' : 'key'
  const { groups, categories } = groupByGroup(data, xField)

  const hasDualAxis = secondaryGroups.length > 0

  const series: SeriesOption[] = groups.map((g) => ({
    type: 'line' as const,
    name: g.name,
    data: g.data,
    smooth,
    ...(step !== undefined ? { step: step === true ? 'start' : step } : {}),
    ...(hasDualAxis && secondaryGroups.includes(g.name) ? { yAxisIndex: 1 } : {}),
  }))

  const yAxisBase = { type: logScale ? ('log' as const) : ('value' as const) }
  const yAxis = hasDualAxis
    ? [yAxisBase, { type: 'value' as const, splitLine: { show: false } }]
    : yAxisBase

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: timeSeries ? { type: 'time' } : { type: 'category', data: categories },
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
