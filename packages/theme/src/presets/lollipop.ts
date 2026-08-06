import type { EChartsOption } from 'echarts'
import { graphic } from 'echarts/core'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 72, left: 48, right: 24, containLabel: true } as const

// ── Lollipop preset ───────────────────────────────────────────────────────────

export interface LollipopPresetOptions {
  /** Chart title text */
  title?: string
  /** Render as horizontal lollipop (default: false) */
  horizontal?: boolean
  /**
   * Title label for the category axis (bottom for vertical, left for horizontal).
   * Maps to Carbon Charts `axes.bottom.title` / `axes.left.title`.
   * Used as the column header in the tabular representation.
   */
  categoryAxisTitle?: string
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
  const { title, horizontal = false, categoryAxisTitle } = opts

  const { groups, categories } = groupByGroup(data, 'key')

  const series = groups.flatMap((g) => [
    // Dot — scatter series, z:3 so it renders above the stick
    {
      type: 'scatter' as const,
      name: g.name,
      data: g.data
        .filter((d) => d.value !== null)
        .map((d) => {
          const catIdx = categories.indexOf(d.name)
          return horizontal ? [d.value as number, catIdx] : [catIdx, d.value as number]
        }),
      symbolSize: 10,
      z: 3,
    },
    // Stick — thin bar series centred on each category.
    // barMaxWidth + barGap:'-100%' collapses all stick series onto the category
    // centre so they never shift sideways, regardless of group count.
    {
      type: 'bar' as const,
      name: g.name,
      data: g.data.map((d) => d.value as number),
      barMaxWidth: 2,
      barGap: '-100%',
      showBackground: false,
      itemStyle: { borderRadius: 0 },
      silent: true,
      legendHoverLink: false,
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
          yAxis: {
            type: 'category',
            data: categories,
            ...(categoryAxisTitle
              ? { name: categoryAxisTitle, nameLocation: 'middle', nameGap: 80 }
              : {}),
          },
        }
      : {
          xAxis: {
            type: 'category',
            data: categories,
            ...(categoryAxisTitle
              ? { name: categoryAxisTitle, nameLocation: 'middle', nameGap: 32 }
              : {}),
          },
          yAxis: { type: 'value' },
        }),
    series,
  }
}

// ── Sparkline preset ──────────────────────────────────────────────────────────

export interface SparklinePresetOptions {
  /** Show filled area under the line (default: false) */
  area?: boolean
  /** Use date field as x-axis (time-series mode, matches Carbon Charts sparkline) */
  timeSeries?: boolean
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for sparklines.
 *
 * Carbon Charts `SparklineChart` equivalent.
 * Strips all axes, grid, legend, and tooltip decorations.
 * When `area: true`, applies a vertical gradient from white to the series color,
 * matching Carbon Charts' `color.gradient.enabled: true` behaviour.
 */
export function createSparklineOptions(
  data: ChartTabularData,
  opts: SparklinePresetOptions = {},
): EChartsOption {
  const { area = false, timeSeries = false, colorScheme = 'light' } = opts

  const xField = timeSeries ? 'date' : 'key'
  const { groups, categories } = groupByGroup(data, xField)
  const seriesColor = pickColors(1, colorScheme)[0]!

  // Time-series mode: ECharts needs [date, value] pairs
  const seriesData = timeSeries
    ? (groups[0]?.data.map((d) => [d.name, d.value as number]) ?? [])
    : (groups[0]?.data.map((d) => d.value as number) ?? [])

  // Vertical gradient: opaque series color at top → transparent white at bottom
  const gradientColor = new graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: seriesColor },
    { offset: 1, color: 'rgba(255,255,255,0)' },
  ])

  return {
    grid: { top: 0, bottom: 0, left: 0, right: 0 },
    xAxis: timeSeries
      ? { type: 'time', show: false }
      : { type: 'category', data: categories, show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        data: seriesData,
        symbol: 'none',
        lineStyle: { width: 1.5, color: seriesColor },
        itemStyle: { color: seriesColor },
        ...(area ? { areaStyle: { color: gradientColor } } : {}),
      },
    ],
    animation: false,
  }
}
