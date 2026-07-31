import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData, ChartTabularDatum } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const
// When dataZoom slider sits at top:0 (h=40) the title sits at top:44 and the
// chart grid starts below both (top:100).
const GRID_ZOOM_TOP = { top: 100, bottom: 56, left: 48, right: 24, containLabel: true } as const

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
  /** Optional Y-axis label (e.g. "Conversion rate") */
  yAxisLabel?: string
  /** Optional X-axis bottom title (e.g. "2023 Annual Sales Figures") */
  xAxisTitle?: string
}

// ── Bounded area preset ───────────────────────────────────────────────────────

export interface HighlightRegion {
  /** Start of the highlighted region (ISO date string or timestamp) */
  start: string | Date
  /** End of the highlighted region (ISO date string or timestamp) */
  end: string | Date
  /** Optional label for the region */
  label?: string
}

export interface BoundedAreaPresetOptions {
  /** Use date field as x-axis (time-series mode) */
  timeSeries?: boolean
  /** Smooth the area lines */
  smooth?: boolean
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
  /** Optional Y-axis label */
  yAxisLabel?: string
  /** Optional X-axis bottom title */
  xAxisTitle?: string
  /**
   * Vertical highlight regions drawn as markArea bands.
   * Equivalent to Carbon Charts' axes.bottom.highlights.
   */
  highlights?: HighlightRegion[]
  /**
   * Field name in each data row that holds the lower bound value.
   * Defaults to 'min'.
   */
  lowerBoundField?: string
  /**
   * Field name in each data row that holds the upper bound value.
   * Defaults to 'max'.
   */
  upperBoundField?: string
  /**
   * Add a scroll/zoom bar above the chart.
   * Equivalent to Carbon Charts' zoomBar.top.enabled.
   */
  dataZoom?: boolean
  /** Show the legend. Default: true */
  showLegend?: boolean
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
    yAxisLabel,
    xAxisTitle,
  } = opts

  // For time-series, group raw rows by group name and map directly to [date, value] pairs.
  // This avoids the cross-group date union from groupByGroup which pads missing dates with
  // null, causing connectNulls to draw straight lines across gaps (wrong shape).
  // ECharts time axis handles sparse / unaligned series natively.
  let groupNames: string[]
  let categories: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let seriesDataMap: Map<string, any[]>

  if (timeSeries) {
    const order: string[] = []
    const byGroup = new Map<string, Array<[string, number | null]>>()
    for (const d of data) {
      if (!byGroup.has(d.group)) {
        order.push(d.group)
        byGroup.set(d.group, [])
      }
      const dateStr = d.date instanceof Date ? d.date.toISOString() : String(d.date ?? '')
      byGroup.get(d.group)!.push([dateStr, d.value as number | null])
    }
    groupNames = order
    categories = []
    seriesDataMap = byGroup
  } else {
    const { groups, categories: cats } = groupByGroup(data, 'key')
    groupNames = groups.map((g) => g.name)
    categories = cats
    seriesDataMap = new Map(groups.map((g) => [g.name, g.data]))
  }

  const colors = pickColors(groupNames.length, colorScheme)

  const series: SeriesOption[] = groupNames.map((name, i) => {
    return {
      type: 'line' as const,
      name,
      data: seriesDataMap.get(name)!,
      smooth,
      showSymbol: false,
      legendHoverLink: true,
      areaStyle: { opacity: 0.4, color: colors[i] },
      itemStyle: { color: colors[i] },
      lineStyle: { color: colors[i], width: 2 },
      ...(stacked ? { stack: 'total' } : {}),
    }
  })

  return {
    ...(title
      ? { title: { text: title, top: dataZoom ? 44 : 'auto' } }
      : {}),
    tooltip: { trigger: 'axis' },
    legend: {
      type: 'scroll',
      bottom: 0,
      icon: 'roundRect',
    },
    xAxis: timeSeries
      ? {
          type: 'time',
          axisLabel: {
            formatter: (value: number) =>
              new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                new Date(value),
              ),
          },
          ...(xAxisTitle
            ? { name: xAxisTitle, nameLocation: 'middle', nameGap: 32 }
            : {}),
        }
      : {
          type: 'category',
          data: categories,
          ...(xAxisTitle
            ? { name: xAxisTitle, nameLocation: 'middle', nameGap: 32 }
            : {}),
        },
    yAxis: {
      type: 'value',
      ...(yAxisLabel
        ? { name: yAxisLabel, nameLocation: 'middle', nameGap: 56, nameRotate: 90 }
        : {}),
    },
    series,
    ...(dataZoom
      ? {
          dataZoom: [
            { type: 'inside' },
            {
              type: 'slider',
              top: 0,
              height: 40,
              showDataShadow: true,
              showDetail: false,
              filterMode: 'none',
            },
          ],
        }
      : {}),
    grid: dataZoom ? GRID_ZOOM_TOP : GRID,
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export const createStackedAreaOptions = (
  data: ChartTabularData,
  opts?: Omit<AreaPresetOptions, 'stacked'>,
): EChartsOption => createAreaOptions(data, { ...opts, stacked: true })

// ── Bounded area ──────────────────────────────────────────────────────────────

/**
 * Build an ECharts option object for bounded area charts.
 *
 * The band fill uses a stacked pair of invisible/visible series:
 *
 *  1. __floor  — values = lowerBound; invisible line + opacity-0 areaStyle;
 *                stacked first to establish the coloured-fill baseline.
 *  2. __delta  — values = upperBound - lowerBound; invisible line + coloured
 *                areaStyle; stacked on __floor so the fill covers only the
 *                lowerBound→upperBound band.
 *  3. __lower_line / __upper_line — the actual dashed visible lines drawn at
 *                the lowerBound / upperBound values, with no area fill.
 *  4. value    — solid value line drawn over the band.
 *
 * stackStrategy:'all' on the floor+delta pair handles mixed-sign values
 * (e.g. negative min with positive delta) without distorting the y-axis.
 * The opacity-0 areaStyle on __floor leaves the chart background visible
 * below the lower bound — no white masking required.
 *
 * Vertical highlight regions are rendered as markArea on the value series.
 */
export function createBoundedAreaOptions(
  data: ChartTabularData,
  opts: BoundedAreaPresetOptions = {},
): EChartsOption {
  const {
    timeSeries = false,
    smooth = false,
    title,
    colorScheme = 'light',
    yAxisLabel,
    xAxisTitle,
    highlights = [],
    lowerBoundField = 'min',
    upperBoundField = 'max',
    dataZoom = false,
    showLegend = true,
  } = opts

  const xField = timeSeries ? 'date' : 'key'

  // Collect ordered x-axis categories
  const categorySet = new Set<string>()
  const byGroup = new Map<string, Map<string, ChartTabularDatum>>()

  for (const d of data) {
    const raw = d[xField]
    const cat = raw instanceof Date ? raw.toISOString() : String(raw ?? '')
    categorySet.add(cat)
    if (!byGroup.has(d.group)) byGroup.set(d.group, new Map())
    byGroup.get(d.group)!.set(cat, d)
  }

  const categories = [...categorySet]
  const groupNames = [...byGroup.keys()]
  const colors = pickColors(groupNames.length, colorScheme)

  const series: SeriesOption[] = []

  groupNames.forEach((groupName, i) => {
    const rowMap = byGroup.get(groupName)!
    const color = colors[i]

    const lowerData = categories.map((cat) => {
      const row = rowMap.get(cat)
      const v = row ? (row[lowerBoundField] as number | undefined) : undefined
      return timeSeries ? [cat, v ?? null] : { name: cat, value: v ?? null }
    })

    const upperData = categories.map((cat) => {
      const row = rowMap.get(cat)
      const v = row ? (row[upperBoundField] as number | undefined) : undefined
      return timeSeries ? [cat, v ?? null] : { name: cat, value: v ?? null }
    })

    const valueData = categories.map((cat) => {
      const row = rowMap.get(cat)
      const v = row ? (row.value as number | undefined) : undefined
      return timeSeries ? [cat, v ?? null] : { name: cat, value: v ?? null }
    })

    const markAreaData = highlights.map((h) => [
      { xAxis: h.start instanceof Date ? h.start.toISOString() : h.start },
      { xAxis: h.end instanceof Date ? h.end.toISOString() : h.end },
    ])

    // delta = max - min (always positive when data is well-formed)
    const deltaData = categories.map((cat) => {
      const row = rowMap.get(cat)
      const lo = row ? (row[lowerBoundField] as number | undefined) : undefined
      const hi = row ? (row[upperBoundField] as number | undefined) : undefined
      const delta = lo != null && hi != null ? hi - lo : null
      return timeSeries ? [cat, delta] : { name: cat, value: delta }
    })

    // 1. __floor — invisible stacked baseline at lowerBound values
    series.push({
      type: 'line' as const,
      name: `${groupName}__floor`,
      data: lowerData,
      smooth,
      showSymbol: false,
      stack: `${groupName}__band`,
      stackStrategy: 'all' as const,
      lineStyle: { opacity: 0 },
      areaStyle: { opacity: 0 },
      itemStyle: { opacity: 0 },
      legendHoverLink: false,
      silent: true,
      tooltip: { show: false },
    } as SeriesOption)

    // 2. __delta — coloured band fill stacked on __floor; covers lowerBound→upperBound
    series.push({
      type: 'line' as const,
      name: `${groupName}__delta`,
      data: deltaData,
      smooth,
      showSymbol: false,
      stack: `${groupName}__band`,
      stackStrategy: 'all' as const,
      lineStyle: { opacity: 0 },
      areaStyle: { color, opacity: 0.3 },
      itemStyle: { opacity: 0 },
      legendHoverLink: false,
      silent: true,
      tooltip: { show: false },
    } as SeriesOption)

    // 3. __lower_line — dashed line at lowerBound, no fill
    series.push({
      type: 'line' as const,
      name: `${groupName}__lower_line`,
      data: lowerData,
      smooth,
      showSymbol: false,
      lineStyle: { color, width: 1, type: 'dashed' },
      itemStyle: { color },
      legendHoverLink: false,
      silent: true,
      tooltip: { show: false },
    } as SeriesOption)

    // 4. __upper_line — dashed line at upperBound, no fill
    series.push({
      type: 'line' as const,
      name: `${groupName}__upper_line`,
      data: upperData,
      smooth,
      showSymbol: false,
      lineStyle: { color, width: 1, type: 'dashed' },
      itemStyle: { color },
      legendHoverLink: false,
      silent: true,
      tooltip: { show: false },
    } as SeriesOption)

    // 5. Value line — solid, drawn over the band, carries markArea highlights
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueSeries: any = {
      type: 'line' as const,
      name: groupName,
      data: valueData,
      smooth,
      showSymbol: false,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      ...(markAreaData.length > 0
        ? {
            markArea: {
              silent: true,
              itemStyle: {
                color: 'rgba(255, 182, 193, 0.15)',
                borderColor: 'rgba(220, 100, 130, 0.5)',
                borderWidth: 1,
                borderType: 'dashed',
              },
              data: markAreaData,
            },
          }
        : {}),
    }
    series.push(valueSeries as SeriesOption)
  })

  // Value series sit at indices 4, 9, 14, … (every 5th starting from 4)
  const valueSeriesIndices = groupNames.map((_, i) => i * 5 + 4)

  return {
    ...(title
      ? { title: { text: title, top: dataZoom ? 44 : 'auto' } }
      : {}),
    tooltip: {
      trigger: 'axis',
      // Suppress the internal __lower/__upper series from the tooltip
      formatter: (params: unknown) => {
        if (!Array.isArray(params)) return ''
        const visible = (params as Array<{ seriesName: string; marker: string; value: unknown[] | number }>)
          .filter((p) => !p.seriesName.includes('__'))
        if (!visible.length) return ''
        const header = timeSeries
          ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
              new Date(visible[0].value[0] as number),
            )
          : String(visible[0].value)
        return (
          `<b>${header}</b><br/>` +
          visible
            .map((p) => `${p.marker} ${p.seriesName}: ${p.value instanceof Array ? p.value[1] : p.value}`)
            .join('<br/>')
        )
      },
    },
    legend: showLegend
      ? { type: 'scroll', bottom: 0, icon: 'roundRect', data: groupNames.map((name) => ({ name })) }
      : { show: false },
    grid: dataZoom ? GRID_ZOOM_TOP : GRID,
    xAxis: timeSeries
      ? {
          type: 'time',
          axisLabel: {
            formatter: (value: number) =>
              new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                new Date(value),
              ),
          },
          ...(xAxisTitle
            ? { name: xAxisTitle, nameLocation: 'middle', nameGap: 32 }
            : {}),
        }
      : {
          type: 'category',
          data: categories,
          ...(xAxisTitle
            ? { name: xAxisTitle, nameLocation: 'middle', nameGap: 32 }
            : {}),
        },
    yAxis: {
      type: 'value',
      ...(yAxisLabel
        ? { name: yAxisLabel, nameLocation: 'middle', nameGap: 56, nameRotate: 90 }
        : {}),
    },
    series,
    ...(dataZoom
      ? {
          dataZoom: [
            { type: 'inside' },
            {
              type: 'slider',
              top: 0,
              height: 40,
              showDataShadow: true,
              showDetail: false,
              filterMode: 'none',
              // Shadow from the value line (index 2, 5, 8…), not the band helper series
              seriesIndex: valueSeriesIndices,
              // Make the slider body fully transparent so the chart shows through
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              fillerColor: 'rgba(135, 119, 217, 0.15)',
              dataBackground: {
                lineStyle: { color: colors[0], opacity: 0.5, width: 1 },
                areaStyle: { color: colors[0], opacity: 0.2 },
              },
              selectedDataBackground: {
                lineStyle: { color: colors[0], opacity: 0.8, width: 1 },
                areaStyle: { color: colors[0], opacity: 0.4 },
              },
            },
          ],
        }
      : {}),
  }
}
