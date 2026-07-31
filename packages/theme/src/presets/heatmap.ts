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
  /**
   * Two-stop color range `[minColor, maxColor]` for the visualMap gradient.
   * Takes precedence over `colors` when provided.
   * Both values must come from the Carbon palette (e.g. from `sequentialPurple`).
   */
  colorRange?: [string, string]
  /**
   * Diverging color scale with a midpoint at zero.
   * When true, the visualMap is centred at 0 so negative values use the left
   * color and positive values use the right color (matching Carbon Charts
   * `heatmap.colorLegend.type: 'quantize'` with positive/negative data).
   * Requires `divergingColors` to specify the two-end stops.
   */
  diverging?: boolean
  /**
   * Colors for a diverging scale `[negativeColor, positiveColor]`.
   * Used together with `diverging: true`.
   * Example: `[red60, cyan50]` for the Carbon Charts red↔cyan diverging palette.
   */
  divergingColors?: [string, string]
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
  /**
   * Explicit min value for the visualMap color scale.
   * Maps to Carbon Charts `heatmap.colorDomain.min`.
   * When omitted, the scale minimum is derived from the data.
   */
  colorDomainMin?: number
  /**
   * Explicit max value for the visualMap color scale.
   * Maps to Carbon Charts `heatmap.colorDomain.max`.
   * When omitted, the scale maximum is derived from the data.
   */
  colorDomainMax?: number
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
  const {
    title,
    colors,
    colorRange,
    diverging = false,
    divergingColors,
    minLabel,
    maxLabel,
    xAxisLabel,
    yAxisLabel,
    legendPosition = 'right',
    colorDomainMin,
    colorDomainMax,
  } = opts

  // colorRange ([min,max]) takes precedence over multi-stop colors array
  const resolvedColors = colorRange ?? colors

  const xSet = new Set<string>()
  const ySet = new Set<string>()
  for (const d of data) {
    xSet.add(String(d.key ?? ''))
    ySet.add(d.group)
  }

  const xCategories = [...xSet]
  const yCategories = [...ySet]

  // Handle null cells — map to -Infinity so they don't affect min/max but are
  // still included in the data array as null (ECharts renders them as empty).
  const values: [number, number, number | null][] = data.map((d) => [
    xCategories.indexOf(String(d.key ?? '')),
    yCategories.indexOf(d.group),
    d.value == null ? null : (d.value as number),
  ])

  const allNonNull = data.filter((d) => d.value != null).map((d) => d.value as number)
  const dataMin = allNonNull.length > 0 ? Math.min(...allNonNull) : 0
  const dataMax = allNonNull.length > 0 ? Math.max(...allNonNull) : 100

  const scaleMin =
    colorDomainMin ?? (diverging ? -Math.max(Math.abs(dataMin), Math.abs(dataMax)) : dataMin)
  const scaleMax =
    colorDomainMax ?? (diverging ? Math.max(Math.abs(dataMin), Math.abs(dataMax)) : dataMax)

  const isBottom = legendPosition === 'bottom'

  // Build visualMap — diverging uses a piecewise with negative/positive halves;
  // sequential uses the standard continuous range.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let visualMap: any
  if (diverging && divergingColors) {
    const [negColor, posColor] = divergingColors
    visualMap = {
      type: 'continuous',
      min: scaleMin,
      max: scaleMax,
      inRange: {
        color: [negColor, '#ffffff', posColor],
      },
      calculable: true,
      ...(isBottom
        ? { orient: 'horizontal', left: 'center', bottom: 16 }
        : { orient: 'vertical', right: 0, top: 'center' }),
    }
  } else {
    visualMap = {
      min: scaleMin,
      max: scaleMax,
      ...(minLabel ? { text: [maxLabel ?? '', minLabel] } : {}),
      calculable: true,
      ...(isBottom
        ? { orient: 'horizontal', left: 'center', bottom: 16 }
        : { orient: 'vertical', right: 0, top: 'center' }),
      ...(resolvedColors ? { inRange: { color: resolvedColors } } : {}),
    }
  }

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
    visualMap,
    series: [
      {
        type: 'heatmap',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: values as any,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10 } },
      },
    ],
  }
}
