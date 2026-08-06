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
 *  [7] optionsSkeleton      (skeleton / loading)          → areaSkeleton    [showSkeleton() from @carbon/echarts-theme/skeleton]
 *
 * ECharts limitations (documented, not implemented):
 *  - alwaysShowRulerTooltip: no ECharts equivalent; tooltip.trigger:'axis' shown on hover.
 *  - bounds (min/max bands): ECharts has no native bounded-area band; approximated as stacked.
 *  - Skeleton / loading state: ECharts has no built-in skeleton; use showSkeleton() from @carbon/echarts-theme/skeleton.
 */
import type { EChartsOption } from 'echarts'
import {
  createAreaOptions,
  createStackedAreaOptions,
  createBoundedAreaOptions,
  createSparklineOptions,
} from '@carbon/echarts-theme/presets'

// ── Shared datasets (values match carboncharts/area.ts exactly) ───────────────

/** `data` — 3 groups, ISO date-keyed time series */
export const timeSeriesData = [
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
export const discreteData = [
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
export const curvedData = [
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
 * `dataBounded` — 1 group with value/min/max fields matching Carbon Charts exactly.
 * ECharts has no native bounded-area band; approximated via createBoundedAreaOptions.
 */
export const boundedData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 47263, min: 40000, max: 50000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 14178, min: 10000, max: 20000 },
  { group: 'Dataset 1', date: '2023-01-08', value: 23094, min: 10000, max: 25000 },
  { group: 'Dataset 1', date: '2023-01-13', value: 45281, min: 42000, max: 50000 },
  { group: 'Dataset 1', date: '2023-01-19', value: -63954, min: -70000, max: -10000 },
]

/** `sparkLineData` — single group, ISO timestamps (minute-resolution), matches Carbon Charts */
export const sparkLineData = [
  { group: 'Dataset 1', date: '2019-05-21T19:21:00.000Z', value: 2 },
  { group: 'Dataset 1', date: '2019-05-21T19:22:00.000Z', value: 3 },
  { group: 'Dataset 1', date: '2019-05-21T19:23:00.000Z', value: 5 },
  { group: 'Dataset 1', date: '2019-05-21T19:24:00.000Z', value: 1 },
  { group: 'Dataset 1', date: '2019-05-21T19:25:00.000Z', value: 4 },
  { group: 'Dataset 1', date: '2019-05-21T19:26:00.000Z', value: 4 },
  { group: 'Dataset 1', date: '2019-05-21T19:27:00.000Z', value: 3 },
  { group: 'Dataset 1', date: '2019-05-21T19:28:00.000Z', value: 4 },
  { group: 'Dataset 1', date: '2019-05-21T19:29:00.000Z', value: 2 },
  { group: 'Dataset 1', date: '2019-05-21T19:30:00.000Z', value: 0 },
  { group: 'Dataset 1', date: '2019-05-21T19:31:00.000Z', value: 5 },
  { group: 'Dataset 1', date: '2019-05-21T19:32:00.000Z', value: 5 },
  { group: 'Dataset 1', date: '2019-05-21T19:33:00.000Z', value: 6 },
  { group: 'Dataset 1', date: '2019-05-21T19:34:00.000Z', value: 2 },
  { group: 'Dataset 1', date: '2019-05-21T19:35:00.000Z', value: 3 },
  { group: 'Dataset 1', date: '2019-05-21T19:36:00.000Z', value: 6 },
  { group: 'Dataset 1', date: '2019-05-21T19:38:00.000Z', value: 2 },
  { group: 'Dataset 1', date: '2019-05-21T19:39:00.000Z', value: 6 },
  { group: 'Dataset 1', date: '2019-05-21T19:40:00.000Z', value: 0 },
  { group: 'Dataset 1', date: '2019-05-21T19:41:00.000Z', value: 3 },
  { group: 'Dataset 1', date: '2019-05-21T19:42:00.000Z', value: 2 },
  { group: 'Dataset 1', date: '2019-05-21T19:43:00.000Z', value: 4 },
  { group: 'Dataset 1', date: '2019-05-21T19:44:00.000Z', value: 3 },
  { group: 'Dataset 1', date: '2019-05-21T19:45:00.000Z', value: 4 },
  { group: 'Dataset 1', date: '2019-05-21T19:46:00.000Z', value: 2 },
  { group: 'Dataset 1', date: '2019-05-21T19:47:00.000Z', value: 4 },
  { group: 'Dataset 1', date: '2019-05-21T19:48:00.000Z', value: 1 },
  { group: 'Dataset 1', date: '2019-05-21T19:49:00.000Z', value: 1 },
  { group: 'Dataset 1', date: '2019-05-21T19:50:00.000Z', value: 3 },
  { group: 'Dataset 1', date: '2019-05-21T19:51:00.000Z', value: 2 },
]

// ── ECharts option exports (one per test slot) ────────────────────────────────

/** [0] Time series area */
export const areaTimeSeries: EChartsOption = createAreaOptions(timeSeriesData, {
  timeSeries: true,
  title: 'Time Series',
  yAxisLabel: 'Conversion rate',
  xAxisTitle: '2023 Annual Sales Figures',
})

/**
 * [1] Always show ruler tooltip — ECharts limitation: no alwaysShowRulerTooltip.
 * Rendered as a standard time-series area.
 */
export const areaAlwaysRuler: EChartsOption = createAreaOptions(timeSeriesData, {
  timeSeries: true,
  title: 'Area (tooltip.alwaysShowRulerTooltip=true)',
  yAxisLabel: 'Conversion rate',
  xAxisTitle: '2023 Annual Sales Figures',
})

/** [2] Sparkline area */
export const areaSparkline: EChartsOption = createSparklineOptions(sparkLineData, {
  area: true,
  timeSeries: true,
})

/** [3] Discrete domain area */
export const areaDiscrete: EChartsOption = createAreaOptions(discreteData)

/** [4] Natural curve area (smooth: true ≈ curveNatural) */
export const areaNaturalCurve: EChartsOption = createAreaOptions(curvedData, {
  timeSeries: true,
  smooth: true,
})

/**
 * [5] Multiple bounded area with highlights — approximated via createBoundedAreaOptions.
 * Renders the min/max envelope as a stacked band and x-axis highlights as markArea.
 */
export const areaBounded: EChartsOption = createBoundedAreaOptions(boundedData, {
  timeSeries: true,
  smooth: true,
  title: 'Multiple Bounded Areas (Natural Curve)',
  xAxisTitle: '2023 Annual Sales Figures',
  highlights: [
    { start: '2023-01-03', end: '2023-01-08', label: 'Custom formatter' },
    { start: '2023-01-13', end: '2023-01-14', label: 'Custom formatter' },
  ],
})

/** [6] Multiple bounded area with zoombar — matches Carbon Charts optionsZoomBar */
export const areaZoombar: EChartsOption = createBoundedAreaOptions(boundedData, {
  timeSeries: true,
  smooth: true,
  title: 'Multiple Bounded Areas (Natural Curve) - Zoom bar enabled',
  xAxisTitle: '2023 Annual Sales Figures',
  highlights: [
    { start: '2023-01-03', end: '2023-01-08', label: 'Custom formatter' },
    { start: '2023-01-13', end: '2023-01-14', label: 'Custom formatter' },
  ],
  dataZoom: true,
  showLegend: false,
})

/**
 * [7] Skeleton / loading state.
 * The chart option is empty — the skeleton overlay is provided separately via
 * showSkeleton() from '@carbon/echarts-theme/skeleton', which is the ECharts
 * equivalent of Carbon Charts' `data: { loading: true }`.
 */
export const areaSkeleton: EChartsOption = {}

// ── Stacked convenience export ────────────────────────────────────────────────
export const areaStacked: EChartsOption = createStackedAreaOptions(timeSeriesData, {
  timeSeries: true,
})
