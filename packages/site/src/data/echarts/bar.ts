/**
 * ECharts equivalents for the Bar chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/bar.ts.
 *
 * Carbon test example order (test-tagged only):
 *  [0]  simpleBarOptions                     → vertical simple discrete
 *  [1]  simpleBarTimeSeriesOptions            → vertical simple time series
 *  [2]  simpleHorizontalBarOptions            → horizontal simple discrete
 *  [3]  simpleHorizontalBarTimeSeriesOptions  → horizontal simple time series
 *  [4]  floatingHorizontalBarTimeSeriesOptions → floating horizontal time series
 *  [5]  floatingBarOptions                    → floating vertical discrete
 *  [6]  floatingHorizontalBarOptions          → floating horizontal discrete
 *  [7]  simpleBarFixedDomainOptions           → fixed domain (reuse simple)
 *  [8]  simpleBarColorOverrideOptions         → custom colors (reuse simple)
 *  [9]  simpleBarCenteredLegendOptions        → centered legend (reuse simple)
 *  [10] simpleBarCustomLegendOrderOptions     → custom legend order (reuse simple)
 *  [11] simpleBarAdditionalLegendItemsOptions → additional legend items (reuse simple)
 *  [12] simpleBarJapaneseLocaleOptions        → Japanese locale (reuse time series)
 *  [13] simpleHorizontalBarLongLabelOptions   → truncation (reuse horizontal)
 */
import type { EChartsOption } from 'echarts'
import { purple50, teal50 } from '@carbon/colors'
import {
  createBarOptions,
  createGroupedBarOptions,
  createStackedBarOptions,
  createHorizontalBarOptions,
  createFloatingBarOptions,
  pickColors,
} from '@carbon/echarts-theme/presets'

// ── Simple discrete bar ───────────────────────────────────────────────────────
// Matches carboncharts/bar.ts `simpleBarData`
export const simpleBarData = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

// ── Time series bar ───────────────────────────────────────────────────────────
// Bug 5 fix: use ISO date strings in `date` field matching Carbon's
// `simpleBarTimeSeriesData` exactly (was using `key` with label strings).
export const timeSeriesData = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

// ── Floating vertical discrete ────────────────────────────────────────────────
// Bug 1 fix: use value: [base, end] tuple format matching Carbon's
// `floatingBarData` exactly (was using separate `base` + `value` fields).
export const floatingBarData = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 16932] },
]

// ── Floating horizontal discrete ──────────────────────────────────────────────
// Matches Carbon's `floatingHorizontalBarData`
export const floatingHorizontalBarData = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 36932] },
]

// ── Floating horizontal time series ──────────────────────────────────────────
// Bug 3 fix: use date-keyed [base, end] tuples matching Carbon's
// `floatingHorizontalBarTimeSeriesData`. Was incorrectly reusing discrete data.
// Note: rows with a plain number value (no base offset) use [0, value].
export const floatingHorizontalTimeSeriesData = [
  { group: 'Qty', date: '2023-01-01', value: [10000, 41000] },
  { group: 'More', date: '2023-01-02', value: [0, 65000] },
  { group: 'Sold', date: '2023-01-03', value: [0, 30000] },
  { group: 'Restocking', date: '2023-01-06', value: [22000, 69213] },
  { group: 'Misc', date: '2023-01-07', value: [3500, 71213] },
]

// ── Long label data for slot [13] ────────────────────────────────────────────
// Matches carboncharts/bar.ts simpleHorizontalBarLongLabelData
export const longLabelData = [
  { group: '6591DA8668C339B1B39297C61091E320C35391AB7AFC15B469F96B8A2DD0C231', value: 65000 },
  { group: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9', value: 29123 },
  { group: '232D788298773BB389DBB8FCE44D3FB4E878879BE7AFB0B303BCE0D56EBB92E2', value: 35213 },
  { group: '58B01AADFA87E5547A218B3C6CE3AF07B8DF7BAB9E12BF60FD2BBB739C46B86E', value: 51213 },
  { group: 'Qty', value: 16932 },
]

/** ECharts option for each bar test example, same order as the carbon test examples array */
export const barSimple: EChartsOption = createBarOptions(simpleBarData)
export const barTimeSeries: EChartsOption = createBarOptions(timeSeriesData, { xField: 'date' })
export const barHorizontal: EChartsOption = createHorizontalBarOptions(simpleBarData)
export const barHorizontalTimeSeries: EChartsOption = createHorizontalBarOptions(timeSeriesData, {
  xField: 'date',
})
// Bug 3 fix: use correct time-series date-keyed tuple data, horizontal orientation
export const barFloatingHorizontalTimeSeries: EChartsOption = createFloatingBarOptions(
  floatingHorizontalTimeSeriesData,
  { horizontal: true },
)
// Bug 1+2 fix: use [base, end] tuple format; explicit colors bypass index shift
export const barFloating: EChartsOption = createFloatingBarOptions(floatingBarData)
export const barFloatingHorizontal: EChartsOption = createFloatingBarOptions(
  floatingHorizontalBarData,
  { horizontal: true },
)

/** [12] Japanese locale — date axis labels formatted in ja-JP */
export const barJapaneseLocale: EChartsOption = createBarOptions(timeSeriesData, {
  xField: 'date',
  locale: 'ja-JP',
})

/** [7] Custom domain — Y axis clamped to [-100000, 100000] */
export const barCustomDomain: EChartsOption = createBarOptions(simpleBarData, {
  yDomain: [-100000, 100000],
})

/** [8] Custom colors — Qty purple50, Misc teal50 (maps to Carbon color.scale) */
export const barCustomColors: EChartsOption = createBarOptions(simpleBarData, {
  colors: {
    Qty: purple50,
    Misc: teal50,
  },
})

/** [13] Truncated labels — horizontal bar with long hex-hash group names */
export const barLongLabel: EChartsOption = createHorizontalBarOptions(longLabelData, {
  truncateLabels: 120,
})

// ── Grouped bar data ──────────────────────────────────────────────────────────

/** Vertical grouped discrete — 4 datasets × 5 categories (matches Carbon groupedBarData) */
export const groupedBarData = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: -29123 },
  { group: 'Dataset 1', key: 'Sold', value: -35213 },
  { group: 'Dataset 1', key: 'Restocking', value: 51213 },
  { group: 'Dataset 1', key: 'Misc', value: 16932 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  { group: 'Dataset 2', key: 'More', value: -21312 },
  { group: 'Dataset 2', key: 'Sold', value: -56456 },
  { group: 'Dataset 2', key: 'Restocking', value: -21312 },
  { group: 'Dataset 2', key: 'Misc', value: 34234 },
  { group: 'Dataset 3', key: 'Qty', value: -12312 },
  { group: 'Dataset 3', key: 'More', value: 23232 },
  { group: 'Dataset 3', key: 'Sold', value: 34232 },
  { group: 'Dataset 3', key: 'Restocking', value: -12312 },
  { group: 'Dataset 3', key: 'Misc', value: -34234 },
  { group: 'Dataset 4', key: 'Qty', value: -32423 },
  { group: 'Dataset 4', key: 'More', value: 21313 },
  { group: 'Dataset 4', key: 'Sold', value: 64353 },
  { group: 'Dataset 4', key: 'Restocking', value: 24134 },
  { group: 'Dataset 4', key: 'Misc', value: 24134 },
]

/** Grouped bar time series — 2 datasets × 5 dates */
export const groupedBarTimeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-02', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-03', value: 30000 },
  { group: 'Dataset 1', date: '2023-01-06', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-07', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-01', value: 8000 },
  { group: 'Dataset 2', date: '2023-01-02', value: 67000 },
  { group: 'Dataset 2', date: '2023-01-03', value: 15000 },
  { group: 'Dataset 2', date: '2023-01-06', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-07', value: 45213 },
]

/** Compact (missing bars) grouped data */
export const groupedBarCompactData = [
  { group: 'Dataset 1', key: 'Q1', value: 65000 },
  { group: 'Dataset 1', key: 'Q2', value: 29123 },
  { group: 'Dataset 1', key: 'Q4', value: 51213 },
  { group: 'Dataset 2', key: 'Q1', value: 32432 },
  { group: 'Dataset 2', key: 'Q3', value: 21312 },
  { group: 'Dataset 3', key: 'Q2', value: 23232 },
  { group: 'Dataset 3', key: 'Q3', value: 34232 },
  { group: 'Dataset 3', key: 'Q4', value: 12312 },
  { group: 'Dataset 4', key: 'Q1', value: 32423 },
  { group: 'Dataset 4', key: 'Q4', value: 24134 },
  { group: 'Dataset 5', key: 'Q2', value: 18500 },
  { group: 'Dataset 5', key: 'Q3', value: 42100 },
  { group: 'Dataset 6', key: 'Q1', value: 55600 },
]

// Grouped ECharts options
// Carbon grouped test order:
//  [g0] groupedBarSelectedGroupsOptions  → pre-selected groups (ECharts: no equivalent, render same as grouped)
//  [g1] groupedBarOptions                → vertical grouped discrete
//  [g2] groupedBarCompactOptions         → compact (missing bars)
//  [g3] groupedBarTimeSeriesOptions      → vertical grouped time series
//  [g7] groupedHorizontalBarOptions      → horizontal grouped discrete
//  [g8] groupedBarHorizontalTimeSeriesOptions → horizontal grouped time series

export const barGrouped: EChartsOption = createGroupedBarOptions(groupedBarData)
export const barGroupedCompact: EChartsOption = createGroupedBarOptions(groupedBarCompactData)
export const barGroupedTimeSeries: EChartsOption = createGroupedBarOptions(
  groupedBarTimeSeriesData,
  {
    xField: 'date',
  },
)
export const barGroupedHorizontal: EChartsOption = createHorizontalBarOptions(groupedBarData)
export const barGroupedHorizontalTimeSeries: EChartsOption = createHorizontalBarOptions(
  groupedBarTimeSeriesData,
  { xField: 'date' },
)

// ── Stacked bar data ──────────────────────────────────────────────────────────

/** Vertical stacked discrete — 4 datasets × 5 categories (all positive) */
export const stackedBarData = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: 29123 },
  { group: 'Dataset 1', key: 'Sold', value: 35213 },
  { group: 'Dataset 1', key: 'Restocking', value: 51213 },
  { group: 'Dataset 1', key: 'Misc', value: 16932 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  { group: 'Dataset 2', key: 'More', value: 21312 },
  { group: 'Dataset 2', key: 'Sold', value: 56456 },
  { group: 'Dataset 2', key: 'Restocking', value: 21312 },
  { group: 'Dataset 2', key: 'Misc', value: 34234 },
  { group: 'Dataset 3', key: 'Qty', value: 12312 },
  { group: 'Dataset 3', key: 'More', value: 23232 },
  { group: 'Dataset 3', key: 'Sold', value: 34232 },
  { group: 'Dataset 3', key: 'Restocking', value: 12312 },
  { group: 'Dataset 3', key: 'Misc', value: 34234 },
  { group: 'Dataset 4', key: 'Qty', value: 32423 },
  { group: 'Dataset 4', key: 'More', value: 21313 },
  { group: 'Dataset 4', key: 'Sold', value: 64353 },
  { group: 'Dataset 4', key: 'Restocking', value: 24134 },
  { group: 'Dataset 4', key: 'Misc', value: 32423 },
]

/** Stacked divergent — Dataset 4 has negative values */
export const stackedBarNegativeData = [
  ...stackedBarData.filter((d) => d.group !== 'Dataset 4'),
  { group: 'Dataset 4', key: 'Qty', value: -32423 },
  { group: 'Dataset 4', key: 'More', value: -21313 },
  { group: 'Dataset 4', key: 'Sold', value: -64353 },
  { group: 'Dataset 4', key: 'Restocking', value: -24134 },
  { group: 'Dataset 4', key: 'Misc', value: -32423 },
]

/** Stacked bar time series — 4 datasets, sparse dates */
export const stackedBarTimeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-08', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-03', value: 75000 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-08', value: 21432 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 3', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 3', date: '2023-01-05', value: 15000 },
  { group: 'Dataset 3', date: '2023-01-08', value: 20000 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213 },
  { group: 'Dataset 4', date: '2023-01-02', value: 10 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-15', value: 40323 },
  { group: 'Dataset 4', date: '2023-01-19', value: 31300 },
]

/** Stacked bar short-interval time series — ISO timestamps (millisecond precision) */
export const stackedBarShortIntervalData = [
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.222Z', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.333Z', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.444Z', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.555Z', value: 0 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.222Z', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.333Z', value: 21432 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.444Z', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.555Z', value: 0 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.222Z', value: 15000 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.333Z', value: 20000 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.444Z', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.555Z', value: 0 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.222Z', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.333Z', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.444Z', value: 40323 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.555Z', value: 0 },
]

// Stacked ECharts options
// Carbon stacked test order:
//  [s0] stackedBarOptions                       → vertical stacked discrete
//  [s1] stackedBarAlwaysRulerTooltipOptions      → always ruler tooltip (ECharts limitation)
//  [s2] stackedBarNegativeOptions                → divergent (negative values)
//  [s3] stackedBarTimeSeriesOptions              → vertical stacked time series
//  [s4] stackedBarShortIntervalTimeSeriesOptions → short-interval time series
//  [s7] stackedHorizontalBarOptions              → horizontal stacked discrete
//  [s8] stackedHorizontalBarTimeSeriesOptions    → horizontal stacked time series

export const barStacked: EChartsOption = createStackedBarOptions(stackedBarData)
export const barStackedNegative: EChartsOption = createStackedBarOptions(stackedBarNegativeData)
export const barStackedTimeSeries: EChartsOption = createStackedBarOptions(
  stackedBarTimeSeriesData,
  {
    xField: 'date',
  },
)
export const barStackedShortInterval: EChartsOption = createStackedBarOptions(
  stackedBarShortIntervalData,
  { xField: 'date' },
)
export const barStackedHorizontal: EChartsOption = createStackedBarOptions(stackedBarData, {
  horizontal: true,
})
export const barStackedHorizontalTimeSeries: EChartsOption = createStackedBarOptions(
  stackedBarTimeSeriesData,
  { xField: 'date', horizontal: true },
)

// ══════════════════════════════════════════════════════════════════════════════
// SHOWCASE — Bar Charts
// Inspired by official Apache ECharts gallery examples, re-themed with Carbon.
// https://echarts.apache.org/examples/en/index.html#chart-type-bar
// ══════════════════════════════════════════════════════════════════════════════

// ── Showcase Bar 1: World Population by Region (horizontal) ──────────────────
// https://echarts.apache.org/examples/en/editor.html?c=bar-y-category
//
// Each bar is a different colour because this is a single series with 10 items
// (regions are not comparable groups — each bar IS its own category).
// The theme `color` array rotates by series, not by item within a series, so
// per-item itemStyle.color is structurally required here.  We source the values
// from pickColors() so they stay in sync with whatever the theme uses.

const _worldRegions = [
  'Northern Africa',
  'Southern Africa',
  'Central America',
  'Eastern Europe',
  'Southeast Asia',
  'Western Europe',
  'South America',
  'North America',
  'East Asia',
  'South Asia',
]
const _worldPop = [254, 198, 175, 292, 688, 197, 438, 502, 1673, 2027]
// 10 colours from the authoritative palette helper — wraps after 6 via the
// full categorical fallback, same logic the theme itself uses for N > 5.
const _worldPalette = pickColors(_worldPop.length)

export const barShowcaseWorldPop: EChartsOption = {
  title: { text: 'Population by World Region (millions)', left: 'center', top: 8 },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (params: unknown) => {
      const p = (params as Array<{ name: string; value: number }>)[0]
      return `${p.name}<br/><strong>${p.value.toLocaleString()}M</strong>`
    },
  },
  grid: { top: 48, bottom: 24, left: 8, right: 40, containLabel: true },
  xAxis: { type: 'value', name: 'Population (M)', nameLocation: 'middle', nameGap: 32 },
  yAxis: {
    type: 'category',
    data: _worldRegions,
    axisLabel: { width: 130, overflow: 'truncate' as const },
  },
  series: [
    {
      name: 'Population',
      type: 'bar',
      data: _worldPop.map((v, i) => ({ value: v, itemStyle: { color: _worldPalette[i] } })),
      label: { show: true, position: 'right', formatter: '{c}M', fontSize: 11 },
      barMaxWidth: 28,
    },
  ],
}

// ── Showcase Bar 2: Monthly Revenue — grouped with negative values ─────────────
// https://echarts.apache.org/examples/en/editor.html?c=bar-negative
//
// Three named series — the theme's color array assigns each one its palette
// colour automatically. No itemStyle.color needed.

const _revenueMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const _revenueProfit = [200, 170, 57, 140, 166, 222, 133, 108, 168, 102, 93, 172]
const _revenueExpense = [-120, -132, -101, -134, -90, -230, -210, -182, -125, -83, -110, -190]
const _revenueIncome = [320, 302, 341, 374, 390, 450, 410, 390, 450, 355, 402, 382]

export const barShowcaseRevenue: EChartsOption = {
  title: { text: 'Monthly Revenue Breakdown', left: 'center', top: 8 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Income', 'Profit', 'Expenses'], bottom: 0 },
  grid: { top: 56, bottom: 56, left: 16, right: 16, containLabel: true },
  xAxis: { type: 'category', data: _revenueMonths },
  yAxis: {
    type: 'value',
    name: 'USD (K)',
    nameLocation: 'middle',
    nameGap: 44,
    nameRotate: 90,
    splitLine: { lineStyle: { type: 'dashed' } },
  },
  series: [
    { name: 'Income', type: 'bar', data: _revenueIncome, barMaxWidth: 20 },
    { name: 'Profit', type: 'bar', data: _revenueProfit, barMaxWidth: 20 },
    { name: 'Expenses', type: 'bar', data: _revenueExpense, barMaxWidth: 20 },
  ],
}

// ── Showcase Bar 3: Quarterly Sales — stacked divergent ───────────────────────
// https://echarts.apache.org/examples/en/editor.html?c=bar-stack
//
// Five named series — the theme's color array assigns each one its palette
// colour automatically. No itemStyle.color needed.

const _quarters = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024']
const _salesNA = [120, 132, 101, 134, 90, 230]
const _salesEU = [220, 182, 191, 234, 290, 330]
const _salesAPAC = [150, 212, 201, 154, 190, 330]
const _salesSA = [
  [-98, 0],
  [-77, 0],
  [-101, 0],
  [-134, 0],
  [-90, 0],
  [-130, 0],
]
const _salesMEA = [
  [-48, 0],
  [-52, 0],
  [-101, 0],
  [-134, 0],
  [-90, 0],
  [-80, 0],
]

export const barShowcaseDivergent: EChartsOption = {
  title: { text: 'Quarterly Sales by Region', left: 'center', top: 8 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: {
    data: ['North America', 'Europe', 'Asia Pacific', 'South America', 'MEA'],
    bottom: 0,
    type: 'scroll',
  },
  grid: { top: 56, bottom: 56, left: 16, right: 16, containLabel: true },
  xAxis: { type: 'category', data: _quarters },
  yAxis: {
    type: 'value',
    name: 'Revenue (M USD)',
    nameLocation: 'middle',
    nameGap: 52,
    nameRotate: 90,
  },
  series: [
    { name: 'North America', type: 'bar', stack: 'positive', data: _salesNA, barMaxWidth: 40 },
    { name: 'Europe', type: 'bar', stack: 'positive', data: _salesEU, barMaxWidth: 40 },
    { name: 'Asia Pacific', type: 'bar', stack: 'positive', data: _salesAPAC, barMaxWidth: 40 },
    { name: 'South America', type: 'bar', stack: 'negative', data: _salesSA, barMaxWidth: 40 },
    { name: 'MEA', type: 'bar', stack: 'negative', data: _salesMEA, barMaxWidth: 40 },
  ],
}
