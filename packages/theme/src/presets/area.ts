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
  /** Smooth the area lines (equivalent to Carbon's curveNatural / curveMonotoneX) */
  smooth?: boolean
  /**
   * Add a scroll/zoom bar beneath the chart.
   * Adds dataZoom: [{ type: 'inside' }, { type: 'slider' }] — equivalent
   * to Carbon Charts' ZoomBar toolbar.
   */
  dataZoom?: boolean
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for area charts.
 *
 * Supports simple (overlapping) and stacked variants, with optional
 * time-series x-axis, smooth curves, and dataZoom scroll bar.
 */
export function createAreaOptions(
  data: ChartTabularData,
  opts: AreaPresetOptions = {},
): EChartsOption {
  const {
    stacked = false,
    timeSeries = false,
    smooth = false,
    dataZoom = false,
    title,
    colorScheme = 'light',
  } = opts

  const xField = timeSeries ? 'date' : 'key'
  const { groups, categories } = groupByGroup(data, xField)

  const colors = pickColors(groups.length, colorScheme)

  const series: SeriesOption[] = groups.map((g, i) => {
    // For time-series x-axis, ECharts needs [date, value] pairs, not { value, name } objects.
    // groupByGroup stores the category label in `name`; re-pair it with the numeric value.
    const seriesData = timeSeries ? g.data.map((d) => [d.name, d.value as number]) : g.data

    return {
      type: 'line' as const,
      name: g.name,
      data: seriesData,
      smooth,
      areaStyle: {},
      itemStyle: { color: colors[i] },
      lineStyle: { color: colors[i] },
      ...(stacked ? { stack: 'total' } : {}),
    }
  })

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: timeSeries ? { type: 'time' } : { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series,
    ...(dataZoom ? { dataZoom: [{ type: 'inside' }, { type: 'slider' }] } : {}),
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export const createStackedAreaOptions = (
  data: ChartTabularData,
  opts?: Omit<AreaPresetOptions, 'stacked'>,
): EChartsOption => createAreaOptions(data, { ...opts, stacked: true })
