/**
 * ECharts equivalents for the Area chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/area.ts.
 *
 * Carbon test order (8 test examples):
 *  [0] options              (time series area)            → areaTimeSeries
 *  [1] optionsAlwaysRulerTooltip                          → areaTimeSeries  [ECharts limitation: no alwaysShowRulerTooltip]
 *  [2] optionsSpark         (sparkline)                   → areaSparkline
 *  [3] optionsDiscrete      (discrete domain)             → areaDiscrete
 *  [4] optionsCurved        (natural curve, time series)  → areaNaturalCurve
 *  [5] optionsMultipleBounded (bounded highlights)        → areaBounded
 *  [6] optionsZoomBar       (zoombar)                     → areaZoombar
 *  [7] optionsSkeleton      (skeleton / loading)          → areaTimeSeries  [ECharts limitation: no skeleton]
 *
 * ECharts limitations (documented, not implemented):
 *  - alwaysShowRulerTooltip: no ECharts equivalent; tooltip.trigger:'axis' shown on hover.
 *  - bounds (min/max bands): ECharts has no native bounded-area band; approximated as stacked.
 *  - Skeleton / loading state: ECharts has no built-in skeleton; show live chart instead.
 */
import type { EChartsOption } from 'echarts'
import {
  createAreaOptions,
  createStackedAreaOptions,
  createSparklineOptions,
} from '@carbon/echarts-theme/presets'

// ── Shared datasets (values match carboncharts/area.ts exactly) ───────────────

/** `data` — 3 groups, ISO date-keyed time series */
const timeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 0 },
  { group: 'Dataset 1', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 1', date: '2023-01-08', value: 21432 },
  { group: 'Dataset 1', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 1', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 2', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 2', date: '2023-01-05', value: 15000 },
  { group: 'Dataset 2', date: '2023-01-08', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 2', date: '2023-01-19', value: 61213 },
  { group: 'Dataset 3', date: '2023-01-02', value: 10 },
  { group: 'Dataset 3', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 3', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 3', date: '2023-01-13', value: 40323 },
  { group: 'Dataset 3', date: '2023-01-19', value: 31300 },
]

/** `dataDiscrete` — 3 groups, label-keyed (a/b/c/d/e) */
const discreteData = [
  { group: 'Dataset 1', value: 10000, key: 'a' },
  { group: 'Dataset 1', value: 65000, key: 'b' },
  { group: 'Dataset 1', value: 10000, key: 'c' },
  { group: 'Dataset 1', value: 49213, key: 'd' },
  { group: 'Dataset 1', value: 51213, key: 'e' },
  { group: 'Dataset 2', value: 20000, key: 'a' },
  { group: 'Dataset 2', value: 25000, key: 'b' },
  { group: 'Dataset 2', value: 60000, key: 'c' },
  { group: 'Dataset 2', value: 30213, key: 'd' },
  { group: 'Dataset 2', value: 55213, key: 'e' },
  { group: 'Dataset 3', value: 30000, key: 'a' },
  { group: 'Dataset 3', value: 20000, key: 'b' },
  { group: 'Dataset 3', value: 40000, key: 'c' },
  { group: 'Dataset 3', value: 60213, key: 'd' },
  { group: 'Dataset 3', value: 25213, key: 'e' },
]

/** `dataCurved` — 2 groups, time-keyed, negative values */
const curvedData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 0 },
  { group: 'Dataset 1', date: '2023-01-06', value: -37312 },
  { group: 'Dataset 1', date: '2023-01-08', value: -22392 },
  { group: 'Dataset 1', date: '2023-01-15', value: -52576 },
  { group: 'Dataset 1', date: '2023-01-19', value: 20135 },
  { group: 'Dataset 2', date: '2023-01-01', value: 47263 },
  { group: 'Dataset 2', date: '2023-01-05', value: 14178 },
  { group: 'Dataset 2', date: '2023-01-08', value: 23094 },
  { group: 'Dataset 2', date: '2023-01-13', value: 45281 },
  { group: 'Dataset 2', date: '2023-01-19', value: -63954 },
]

/**
 * `dataBounded` — 1 group with value/min/max fields.
 * ECharts has no native bounded-area band; we represent it as a stacked area
 * using the min and max as separate series to approximate the envelope.
 */
const boundedData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 47263 },
  { group: 'Dataset 1', date: '2023-01-05', value: 14178 },
  { group: 'Dataset 1', date: '2023-01-08', value: 23094 },
  { group: 'Dataset 1', date: '2023-01-13', value: 45281 },
  { group: 'Dataset 1', date: '2023-01-19', value: -63954 },
]

/** `sparkLineData` — single group, ISO timestamps (minute-resolution) */
const sparkLineData = [
  { group: 'Dataset 1', key: '19:21', value: 2 },
  { group: 'Dataset 1', key: '19:22', value: 3 },
  { group: 'Dataset 1', key: '19:23', value: 5 },
  { group: 'Dataset 1', key: '19:24', value: 1 },
  { group: 'Dataset 1', key: '19:25', value: 4 },
  { group: 'Dataset 1', key: '19:26', value: 4 },
  { group: 'Dataset 1', key: '19:27', value: 3 },
  { group: 'Dataset 1', key: '19:28', value: 4 },
  { group: 'Dataset 1', key: '19:29', value: 2 },
  { group: 'Dataset 1', key: '19:30', value: 0 },
]

// ── ECharts option exports (one per test slot) ────────────────────────────────

/** [0] Time series area */
export const areaTimeSeries: EChartsOption = createAreaOptions(timeSeriesData, { timeSeries: true })

/**
 * [1] Always show ruler tooltip — ECharts limitation: no alwaysShowRulerTooltip.
 * Rendered as a standard time-series area.
 */
export const areaAlwaysRuler: EChartsOption = createAreaOptions(timeSeriesData, {
  timeSeries: true,
})

/** [2] Sparkline area */
export const areaSparkline: EChartsOption = createSparklineOptions(sparkLineData, { area: true })

/** [3] Discrete domain area */
export const areaDiscrete: EChartsOption = createAreaOptions(discreteData)

/** [4] Natural curve area (smooth: true ≈ curveNatural) */
export const areaNaturalCurve: EChartsOption = createAreaOptions(curvedData, {
  timeSeries: true,
  smooth: true,
})

/**
 * [5] Bounded area — ECharts limitation: no native bounded-area band.
 * Rendered as a stacked area using the same bounded dataset's value series.
 */
export const areaBounded: EChartsOption = createStackedAreaOptions(boundedData, {
  timeSeries: true,
  smooth: true,
})

/** [6] Area with zoombar (dataZoom slider) */
export const areaZoombar: EChartsOption = createAreaOptions(timeSeriesData, {
  timeSeries: true,
  smooth: true,
  dataZoom: true,
})

/** [7] Skeleton / loading — ECharts limitation: no skeleton state. Show live chart. */
export const areaSkeleton: EChartsOption = createAreaOptions(timeSeriesData, { timeSeries: true })

// ── Stacked convenience export ────────────────────────────────────────────────
export const areaStacked: EChartsOption = createStackedAreaOptions(timeSeriesData, {
  timeSeries: true,
})
