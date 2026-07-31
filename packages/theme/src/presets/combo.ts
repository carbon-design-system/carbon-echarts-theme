import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Combo preset ──────────────────────────────────────────────────────────────

export interface ComboPresetOptions {
  /**
   * Series names that should render as line series.
   * All other groups default to bar (unless listed in areaGroups / scatterGroups).
   */
  lineGroups?: string[]
  /**
   * Series names that should render as line series with areaStyle (area fill).
   */
  areaGroups?: string[]
  /**
   * Series names that should render as scatter series.
   */
  scatterGroups?: string[]
  /**
   * Series names that share a secondary axis.
   * Vertical: secondary right Y axis (yAxisIndex: 1).
   * Horizontal: secondary bottom X axis (xAxisIndex: 1).
   */
  secondaryGroups?: string[]
  /**
   * Stack bar groups into a single stacked bar (applies stack: 'total').
   */
  stacked?: boolean
  /**
   * Render as horizontal combo chart (category on Y axis, value on X).
   */
  horizontal?: boolean
  /**
   * Series that use floating bar format (value: [base, end] tuples).
   * Rendered as invisible-base + visible-offset bar pair.
   */
  floatingGroups?: string[]
  /**
   * Use 'date' as x-axis field and xAxis.type = 'time' (time-series mode).
   * Series data is emitted as [dateString, value] pairs.
   */
  timeSeries?: boolean
  /**
   * Override the x-axis category field. Defaults to 'key' (or 'date' when timeSeries=true).
   */
  xField?: 'key' | 'date'
  /** Chart title text */
  title?: string
  /** Color scheme ('light' or 'dark'). Defaults to 'light'. */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for combination charts.
 *
 * Carbon Charts `ComboChart` equivalent.
 * Supports: bar, stacked bar, grouped bar, horizontal bar, floating bar,
 * line, area, stacked area, scatter — all mixed in one chart.
 */
export function createComboOptions(
  data: ChartTabularData,
  opts: ComboPresetOptions = {},
): EChartsOption {
  const {
    lineGroups = [],
    areaGroups = [],
    scatterGroups = [],
    secondaryGroups = [],
    stacked = false,
    horizontal = false,
    floatingGroups = [],
    timeSeries = false,
    colorScheme = 'light',
    title,
  } = opts

  const xField = opts.xField ?? (timeSeries ? 'date' : 'key')

  const { groups, categories } = groupByGroup(data, xField)

  const hasDualAxis = secondaryGroups.length > 0
  const colors = pickColors(groups.length, colorScheme)

  const series: SeriesOption[] = groups.flatMap((g, i) => {
    const isLine = lineGroups.includes(g.name)
    const isArea = areaGroups.includes(g.name)
    const isScatter = scatterGroups.includes(g.name)
    const isFloating = floatingGroups.includes(g.name)
    const isSecondary = hasDualAxis && secondaryGroups.includes(g.name)
    const color = colors[i]

    // Axis index: vertical → yAxisIndex, horizontal → xAxisIndex
    const secondaryAxisProp = horizontal ? 'xAxisIndex' : 'yAxisIndex'
    const secondaryAxisValue = isSecondary ? { [secondaryAxisProp]: 1 } : {}

    // Time-series data must be [date, value] pairs for ECharts 'time' axis
    const seriesData = timeSeries ? g.data.map((d) => [d.name, d.value as number]) : g.data

    if (isFloating) {
      // Floating bar: invisible base + visible offset pair
      const floatRows = data.filter((d) => d.group === g.name)
      const cats = categories

      type FloatItem = { base: number; top: number }
      const rowMap = new Map<string, FloatItem>()
      for (const d of floatRows) {
        const cat = String(d[xField] ?? '')
        let base: number
        let top: number
        if (Array.isArray(d.value)) {
          base = (d.value as number[])[0] ?? 0
          top = ((d.value as number[])[1] ?? 0) - base
        } else {
          base = typeof d['base'] === 'number' ? (d['base'] as number) : 0
          top = (d.value as number) - base
        }
        rowMap.set(cat, { base, top })
      }

      return [
        {
          type: 'bar' as const,
          name: `__base_${g.name}`,
          stack: `float_${g.name}`,
          data: cats.map((c) => ({ value: rowMap.get(c)?.base ?? 0, name: c })),
          itemStyle: { color: 'transparent' },
          legendHoverLink: false,
          silent: true,
          emphasis: { disabled: true },
          ...secondaryAxisValue,
        } as SeriesOption,
        {
          type: 'bar' as const,
          name: g.name,
          stack: `float_${g.name}`,
          colorBy: 'series' as const,
          data: cats.map((c) => ({ value: rowMap.get(c)?.top ?? 0, name: c })),
          itemStyle: { color },
          ...secondaryAxisValue,
        } as SeriesOption,
      ]
    }

    if (isScatter) {
      return {
        type: 'scatter' as const,
        name: g.name,
        data: seriesData,
        itemStyle: { color },
        ...secondaryAxisValue,
      } as SeriesOption
    }

    if (isLine || isArea) {
      return {
        type: 'line' as const,
        name: g.name,
        data: seriesData,
        itemStyle: { color },
        lineStyle: { color },
        ...(isArea ? { areaStyle: {} } : {}),
        ...secondaryAxisValue,
      } as SeriesOption
    }

    // Default: bar
    return {
      type: 'bar' as const,
      name: g.name,
      data: seriesData,
      itemStyle: { color },
      ...(stacked ? { stack: 'total' } : {}),
      ...secondaryAxisValue,
    } as SeriesOption
  })

  // ── Axis construction ──────────────────────────────────────────────────────

  if (horizontal) {
    // Horizontal: category on yAxis, value on xAxis.
    // Dual-axis horizontal: two xAxis entries (primary top, secondary bottom).
    const xAxisArr = hasDualAxis
      ? [{ type: 'value' as const }, { type: 'value' as const, splitLine: { show: false } }]
      : [{ type: 'value' as const }]

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { type: 'scroll', bottom: 0 },
      grid: GRID,
      xAxis: xAxisArr,
      yAxis: { type: 'category' as const, data: categories },
      series,
    }
  }

  // Vertical (default)
  const yAxis = hasDualAxis
    ? [{ type: 'value' as const }, { type: 'value' as const, splitLine: { show: false } }]
    : { type: 'value' as const }

  const xAxisDef = timeSeries
    ? { type: 'time' as const }
    : { type: 'category' as const, data: categories }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: xAxisDef,
    yAxis,
    series,
  }
}
