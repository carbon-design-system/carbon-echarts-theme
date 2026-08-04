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
import {
  createBarOptions,
  createHorizontalBarOptions,
  createFloatingBarOptions,
} from '@carbon/echarts-theme/presets'

// ── Simple discrete bar ───────────────────────────────────────────────────────
// Matches carboncharts/bar.ts `simpleBarData`
const simpleBarData = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

// ── Time series bar ───────────────────────────────────────────────────────────
// Bug 5 fix: use ISO date strings in `date` field matching Carbon's
// `simpleBarTimeSeriesData` exactly (was using `key` with label strings).
const timeSeriesData = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

// ── Floating vertical discrete ────────────────────────────────────────────────
// Bug 1 fix: use value: [base, end] tuple format matching Carbon's
// `floatingBarData` exactly (was using separate `base` + `value` fields).
const floatingBarData = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 16932] },
]

// ── Floating horizontal discrete ──────────────────────────────────────────────
// Matches Carbon's `floatingHorizontalBarData`
const floatingHorizontalBarData = [
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
const floatingHorizontalTimeSeriesData = [
  { group: 'Qty', date: '2023-01-01', value: [10000, 41000] },
  { group: 'More', date: '2023-01-02', value: [0, 65000] },
  { group: 'Sold', date: '2023-01-03', value: [0, 30000] },
  { group: 'Restocking', date: '2023-01-06', value: [22000, 69213] },
  { group: 'Misc', date: '2023-01-07', value: [3500, 71213] },
]

// ── Long label data for slot [13] ────────────────────────────────────────────
// Matches carboncharts/bar.ts simpleHorizontalBarLongLabelData
const longLabelData = [
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

/** [8] Custom colors — Qty '#925699', Misc '#525669' (maps to Carbon color.scale) */
export const barCustomColors: EChartsOption = createBarOptions(simpleBarData, {
  colors: {
    Qty: '#925699',
    Misc: '#525669',
  },
})

/** [13] Truncated labels — horizontal bar with long hex-hash group names */
export const barLongLabel: EChartsOption = createHorizontalBarOptions(longLabelData, {
  truncateLabels: 120,
})
