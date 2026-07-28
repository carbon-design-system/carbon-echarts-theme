import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Combo preset ──────────────────────────────────────────────────────────────

export interface ComboPresetOptions {
  /**
   * Series names that should render as line series.
   * All other groups default to bar.
   */
  lineGroups?: string[]
  /**
   * Series names that share a secondary (right) Y axis.
   * A second yAxis entry is added automatically.
   */
  secondaryGroups?: string[]
  /** Chart title text */
  title?: string
}

/**
 * Build an ECharts option object for combination (bar + line) charts.
 *
 * Carbon Charts `ComboChart` equivalent.
 * Defaults all series to bar; groups listed in `lineGroups` become line series.
 * Optionally places specific series on a secondary Y axis.
 */
export function createComboOptions(
  data: ChartTabularData,
  opts: ComboPresetOptions = {},
): EChartsOption {
  const { lineGroups = [], secondaryGroups = [], title } = opts

  const { groups, categories } = groupByGroup(data, 'key')

  const hasDualAxis = secondaryGroups.length > 0

  const series: SeriesOption[] = groups.map((g) => ({
    type: lineGroups.includes(g.name) ? ('line' as const) : ('bar' as const),
    name: g.name,
    data: g.data,
    ...(hasDualAxis && secondaryGroups.includes(g.name) ? { yAxisIndex: 1 } : {}),
  }))

  const yAxis = hasDualAxis
    ? [{ type: 'value' as const }, { type: 'value' as const, splitLine: { show: false } }]
    : { type: 'value' as const }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: { type: 'category', data: categories },
    yAxis,
    series,
  }
}
