import type { EChartsType } from 'echarts'
import type { TableData } from './types'
import { extractTimeSeries } from './time-series'
import { extractHistogram } from './histogram'
import { extractCategoryAxisLong, extractComboLong, extractCategoryAxis } from './category-axis'
import { extractPie } from './pie'
import { extractGauge } from './gauge'
import { extractRadar } from './radar'
import { extractHierarchy } from './hierarchy'
import { extractLinks } from './links'
import { extractBoxplot } from './boxplot'
import { extractScatterBubble } from './scatter'
import { extractLollipop } from './lollipop'
import { extractHeatmap, extractFlat } from './heatmap'
import { extractParallel } from './parallel'

export type { TableData }
export { extractTimeSeries } from './time-series'
export { extractHistogram } from './histogram'
export { extractCategoryAxisLong, extractComboLong, extractCategoryAxis } from './category-axis'
export { extractPie } from './pie'
export { extractGauge } from './gauge'
export { extractRadar } from './radar'
export { extractHierarchy } from './hierarchy'
export { extractLinks } from './links'
export { extractBoxplot } from './boxplot'
export { extractScatterBubble } from './scatter'
export { extractLollipop } from './lollipop'
export { extractHeatmap, extractFlat } from './heatmap'
export { extractParallel } from './parallel'

/**
 * Extracts tabular data from a live ECharts instance.
 * Returns null when the option has no series or no data.
 *
 * Handles all ECharts series types used in this project:
 *   - Category-axis (bar, line, area, histogram, lollipop)
 *   - Coordinate (scatter, bubble, heatmap)
 *   - Boxplot  → labelled 5-number summary columns
 *   - Pie/donut → name + value columns
 *   - Gauge     → name + value (skips phantom/label series)
 *   - Radar     → group per series, one column per indicator
 *   - Treemap / Tree → flattened leaf rows (name + value / path)
 *   - Graph (network) → reads `links` like sankey
 *   - Sankey/alluvial → reads `links` (source / target / value)
 *   - WordCloud → name + value (drops textStyle objects)
 */
export function buildTableData(instance: EChartsType): TableData | null {
  const option = instance.getOption() as any
  if (!option) return null

  const series: any[] = Array.isArray(option.series) ? option.series : []
  if (!series.length) return null

  // ── Per-type extractors ───────────────────────────────────────────────────

  const type0: string = (series[0]?.type ?? '').toLowerCase()

  // Radar — special top-level `radar.indicator` config
  if (type0 === 'radar') {
    return extractRadar(option, series)
  }

  // Treemap / Tree / Sunburst — hierarchical; flatten to leaf rows
  if (type0 === 'treemap' || type0 === 'tree' || type0 === 'sunburst') {
    return extractHierarchy(series)
  }

  // Gauge — read only the first real data point; skip phantom/label series
  if (type0 === 'gauge') {
    return extractGauge(series)
  }

  // Sankey / Graph (network) — read `links` not `data`
  if (type0 === 'sankey' || type0 === 'graph') {
    return extractLinks(series)
  }

  // Parallel coordinates — use parallelAxis names as headers; one row per data point
  if (type0 === 'parallel') {
    return extractParallel(option, series)
  }

  // Heatmap — data is [xIdx, yIdx, value]; resolve category labels from axes
  if (type0 === 'heatmap') {
    const xAxisArr: any[] = Array.isArray(option.xAxis)
      ? option.xAxis
      : option.xAxis
        ? [option.xAxis]
        : []
    const yAxisArr: any[] = Array.isArray(option.yAxis)
      ? option.yAxis
      : option.yAxis
        ? [option.yAxis]
        : []
    return extractHeatmap(
      series,
      xAxisArr[0]?.data ?? [],
      yAxisArr[0]?.data ?? [],
      xAxisArr[0]?.name,
      yAxisArr[0]?.name,
    )
  }

  // Category axis present → wide pivot
  const xAxis: any[] = Array.isArray(option.xAxis)
    ? option.xAxis
    : option.xAxis
      ? [option.xAxis]
      : []
  const yAxis: any[] = Array.isArray(option.yAxis)
    ? option.yAxis
    : option.yAxis
      ? [option.yAxis]
      : []

  const categoryAxis =
    xAxis.find((a: any) => a?.type === 'category') ?? yAxis.find((a: any) => a?.type === 'category')
  const categoryData: string[] = categoryAxis?.data ?? []

  const timeAxis =
    xAxis.find((a: any) => a?.type === 'time') ?? yAxis.find((a: any) => a?.type === 'time')

  // Filter to only real (non-phantom/hidden) series for the table
  const visibleSeries = series.filter(
    (s: any) =>
      !s.silent &&
      s.type !== 'scatter' && // lollipop dot overlay — skip
      (s.data?.length || s.links?.length),
  )

  // Boxplot — intercept before category-axis pivot; needs categoryData from above
  if (type0 === 'boxplot') {
    return extractBoxplot(series, categoryData)
  }

  // Lollipop — alternating scatter (dot) + bar (silent stick) pairs per group.
  // Detected when series alternate scatter/bar and the bar series are all silent.
  const isLollipop =
    type0 === 'scatter' &&
    series.length >= 2 &&
    series.every((s: any, i: number) =>
      i % 2 === 0
        ? (s.type ?? '').toLowerCase() === 'scatter'
        : (s.type ?? '').toLowerCase() === 'bar' && s.silent === true,
    )

  if (isLollipop) {
    const xAxisObj = xAxis[0]
    const yAxisObj = yAxis[0]
    // The category axis may be x (vertical lollipop) or y (horizontal)
    const catAxis = xAxisObj?.type === 'category' ? xAxisObj : yAxisObj
    const valAxis = xAxisObj?.type === 'value' ? xAxisObj : yAxisObj
    const xColName: string = catAxis?.name || 'x-value'
    const yColName: string = valAxis?.name || 'y-value'
    const cats: string[] = catAxis?.data ?? categoryData
    return extractLollipop(series, cats, xColName, yColName, catAxis === yAxisObj)
  }

  // Histogram — bar chart where the last category is a closing boundary (null data)
  // Detected when: all visible bar series have null as their last data entry.
  const isHistogram =
    type0 === 'bar' &&
    categoryData.length >= 2 &&
    (visibleSeries.length ? visibleSeries : series).every((s: any) => {
      const d: unknown[] = s.data ?? []
      const last = d[d.length - 1]
      return (
        last === null ||
        last === undefined ||
        (typeof last === 'object' && (last as any)?.value == null)
      )
    })

  if (isHistogram) {
    return extractHistogram(categoryData, visibleSeries.length ? visibleSeries : series)
  }

  // Discrete category-axis line (and area) — emit long format matching Carbon Charts.
  // Line series data items are objects { name, value } (produced by groupByGroup) for
  // discrete axes, or plain scalars (produced by stacked time-series) where the x-value
  // comes from categoryData[index].
  // Bar charts use the wide pivot instead, so we gate on type === 'line'.
  const allLineType = (visibleSeries.length ? visibleSeries : series).every(
    (s: any) => (s.type ?? '').toLowerCase() === 'line',
  )

  if (allLineType && categoryData.length) {
    const xTitle: string | undefined = categoryAxis?.name || undefined
    const valueAxis = yAxis.find((a: any) => a?.type === 'value' || !a?.type) ?? yAxis[0]
    const yTitle: string | undefined =
      (Array.isArray(valueAxis) ? valueAxis[0] : valueAxis)?.name || undefined
    return extractCategoryAxisLong(
      visibleSeries.length ? visibleSeries : series,
      categoryData,
      xTitle,
      yTitle,
    )
  }

  // Scatter / bubble — all series are scatter type with numeric or string x values.
  // Intercept here so we have access to axis names for column headers.
  const allScatterType = series.every((s: any) => (s.type ?? '').toLowerCase() === 'scatter')

  if (allScatterType) {
    // Resolve axis name labels: prefer axis.name; fall back to generic labels
    const xAxisObj = xAxis[0]
    const yAxisObj = yAxis[0]
    const xName: string = xAxisObj?.name || 'x-value'
    const yName: string = yAxisObj?.name || 'y-value'
    return extractScatterBubble(series, xName, yName)
  }

  // If all series are pie/wordcloud — use flat extractor
  const allFlat = series.every((s: any) =>
    ['pie', 'wordcloud'].includes((s.type ?? '').toLowerCase()),
  )

  if (categoryData.length && !allFlat) {
    const activeSeries = visibleSeries.length ? visibleSeries : series
    const types = new Set(activeSeries.map((s: any) => (s.type ?? '').toLowerCase()))
    const isCombo = types.size > 1

    if (isCombo) {
      // Combo chart: mixed series types — emit long format matching Carbon Charts
      // Group | <xAxisName> | <primaryValName> | <secondaryValName>
      const xTitle: string | undefined = categoryAxis?.name || undefined
      const primaryAxis = yAxis.find((a: any) => a?.type === 'value' || !a?.type)
      const secondaryAxis = yAxis.length > 1 ? yAxis[1] : undefined
      const primaryName: string | undefined = primaryAxis?.name || undefined
      const secondaryName: string | undefined = secondaryAxis?.name || undefined
      return extractComboLong(activeSeries, categoryData, xTitle, primaryName, secondaryName)
    }

    const categoryAxisName: string | undefined = categoryAxis?.name || undefined
    return extractCategoryAxis(categoryData, activeSeries, categoryAxisName)
  }

  // Time axis → long-format table with Group / date / value columns
  if (timeAxis) {
    const xTitle: string | undefined = timeAxis.name || undefined
    const valueAxis = yAxis.find((a: any) => a?.type === 'value' || !a?.type) ?? yAxis[0]
    const yTitle: string | undefined = valueAxis?.name || undefined
    return extractTimeSeries(visibleSeries.length ? visibleSeries : series, xTitle, yTitle)
  }

  // Pie / donut
  if (type0 === 'pie') {
    return extractPie(series)
  }

  // Flat coordinate (heatmap, wordcloud)
  return extractFlat(series)
}
