import type { EChartsOption } from 'echarts'
import { groupByGroup } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 72, left: 48, right: 24, containLabel: true } as const

// ── Lollipop preset ───────────────────────────────────────────────────────────

export interface LollipopPresetOptions {
  /** Chart title text */
  title?: string
  /** Render as horizontal lollipop (default: false) */
  horizontal?: boolean
}

/**
 * Build an ECharts option object for lollipop charts.
 *
 * Carbon Charts `LollipopChart` equivalent.
 * Implemented as a `scatter` series (the dot) overlaid with
 * `markLine` segments from zero to each value (the stick).
 */
export function createLollipopOptions(
  data: ChartTabularData,
  opts: LollipopPresetOptions = {},
): EChartsOption {
  const { title, horizontal = false } = opts

  const { groups, categories } = groupByGroup(data, 'key')

  const series = groups.flatMap((g) => [
    // Dot
    {
      type: 'scatter' as const,
      name: g.name,
      data: g.data.map((d, i) => (horizontal ? [d.value, i] : [i, d.value])),
      symbolSize: 10,
      z: 3,
    },
    // Stick — line from zero to value for each point
    {
      type: 'bar' as const,
      name: g.name,
      data: g.data.map((d) => d.value),
      barWidth: 2,
      showBackground: false,
      itemStyle: { borderRadius: 0 },
      silent: true,
      legendHoverLink: false,
      // Hide from legend (duplicate entry)
      tooltip: { show: false },
    },
  ])

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    ...(horizontal
      ? {
          xAxis: { type: 'value' },
          yAxis: { type: 'category', data: categories },
        }
      : {
          xAxis: { type: 'category', data: categories },
          yAxis: { type: 'value' },
        }),
    series,
  }
}

// ── Sparkline preset ──────────────────────────────────────────────────────────

export interface SparklinePresetOptions {
  /** Show filled area under the line (default: false) */
  area?: boolean
}

/**
 * Build an ECharts option object for sparklines.
 *
 * Carbon Charts `SparklineChart` equivalent.
 * Strips all axes, grid, legend, and tooltip decorations.
 */
export function createSparklineOptions(
  data: ChartTabularData,
  opts: SparklinePresetOptions = {},
): EChartsOption {
  const { area = false } = opts

  const { groups, categories } = groupByGroup(data, 'key')
  const values = groups[0]?.data.map((d) => d.value) ?? []

  return {
    grid: { top: 0, bottom: 0, left: 0, right: 0 },
    xAxis: { type: 'category', data: categories, show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        data: values,
        symbol: 'none',
        lineStyle: { width: 1.5 },
        ...(area ? { areaStyle: { opacity: 0.3 } } : {}),
      },
    ],
    animation: false,
  }
}
