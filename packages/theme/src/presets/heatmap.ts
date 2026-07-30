import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

// ── Heatmap preset ────────────────────────────────────────────────────────────

export interface HeatmapPresetOptions {
  /** Chart title text */
  title?: string
  /**
   * Colour range for the visualMap component.
   * If omitted the theme's default sequential palette is used.
   */
  colors?: string[]
  /** Label for the visualMap min value */
  minLabel?: string
  /** Label for the visualMap max value */
  maxLabel?: string
  /** X-axis title (e.g. "Day") */
  xAxisLabel?: string
  /** Y-axis title (e.g. "Time") */
  yAxisLabel?: string
  /**
   * Position of the visualMap (colour legend).
   * - `'right'` (default) – vertical legend to the right of the chart
   * - `'bottom'` – horizontal legend below the chart (like Carbon Charts)
   */
  legendPosition?: 'right' | 'bottom'
}

/**
 * Build an ECharts option object for heatmap charts.
 *
 * Carbon Charts `HeatmapChart` equivalent.
 *
 * Data format: `{ group (y-label), key (x-label), value (cell value) }`.
 * The `group` field maps to the Y axis and `key` to the X axis.
 */
export function createHeatmapOptions(
  data: ChartTabularData,
  opts: HeatmapPresetOptions = {},
): EChartsOption {
  const { title, colors, minLabel, maxLabel, xAxisLabel, yAxisLabel, legendPosition = 'right' } = opts

  const xSet = new Set<string>()
  const ySet = new Set<string>()
  for (const d of data) {
    xSet.add(String(d.key ?? ''))
    ySet.add(d.group)
  }

  const xCategories = [...xSet]
  const yCategories = [...ySet]

  const values: [number, number, number][] = data.map((d) => [
    xCategories.indexOf(String(d.key ?? '')),
    yCategories.indexOf(d.group),
    d.value,
  ])

  const allValues = data.map((d) => d.value)
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)

  const isBottom = legendPosition === 'bottom'

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}' },
    grid: {
      top: 48,
      bottom: isBottom ? 120 : 80,
      left: yAxisLabel ? 96 : 80,
      right: isBottom ? 20 : 100,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: xCategories,
      splitArea: { show: true },
      ...(xAxisLabel ? { name: xAxisLabel, nameLocation: 'middle', nameGap: 32 } : {}),
    },
    yAxis: {
      type: 'category',
      data: yCategories,
      splitArea: { show: true },
      ...(yAxisLabel ? { name: yAxisLabel, nameLocation: 'middle', nameGap: 56 } : {}),
    },
    visualMap: {
      min,
      max,
      ...(minLabel ? { text: [maxLabel ?? '', minLabel] } : {}),
      calculable: true,
      ...(isBottom
        ? { orient: 'horizontal', left: 'center', bottom: 16 }
        : { orient: 'vertical', right: 0, top: 'center' }),
      ...(colors ? { inRange: { color: colors } } : {}),
    },
    series: [
      {
        type: 'heatmap',
        data: values,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10 } },
      },
    ],
  }
}
