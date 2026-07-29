import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Area preset ───────────────────────────────────────────────────────────────

export interface AreaPresetOptions {
  /** Stack all series into a cumulative area chart */
  stacked?: boolean
  /** Use date field as x-axis (time-series mode) */
  timeSeries?: boolean
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for area charts.
 *
 * Supports simple (overlapping) and stacked variants, with optional
 * time-series x-axis.
 */
export function createAreaOptions(
  data: ChartTabularData,
  opts: AreaPresetOptions = {},
): EChartsOption {
  const { stacked = false, timeSeries = false, title, colorScheme = 'light' } = opts

  const xField = timeSeries ? 'date' : 'key'
  const { groups, categories } = groupByGroup(data, xField)

  const colors = pickColors(groups.length, colorScheme)

  const series: SeriesOption[] = groups.map((g, i) => ({
    type: 'line' as const,
    name: g.name,
    data: g.data,
    areaStyle: {},
    itemStyle: { color: colors[i] },
    lineStyle: { color: colors[i] },
    ...(stacked ? { stack: 'total' } : {}),
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: timeSeries ? { type: 'time' } : { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series,
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export const createStackedAreaOptions = (
  data: ChartTabularData,
  opts?: Omit<AreaPresetOptions, 'stacked'>,
): EChartsOption => createAreaOptions(data, { ...opts, stacked: true })
