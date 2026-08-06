/**
 * ECharts equivalents for the Line chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/line.ts.
 *
 * Carbon test order (14 test examples):
 *  [0]  lineCustomDomainOptions  (axes)             → lineDiscrete
 *  [1]  lineTimeSeriesRotatedTicks (axes, time)     → lineRotatedTicks
 *  [2]  lineTimeSeriesFrenchLocale (locale)         → lineLocale   [ECharts limitation: no locale]
 *  [3]  lineLogAxisOptions       (axes)             → lineLogAxis
 *  [4]  lineCustomColorOptions   (colors)           → lineDiscrete [ECharts limitation: palette only]
 *  [5]  lineSelectedGroupsOptions (legend)          → lineDiscrete
 *  [6]  lineOptionsLegendOrientation (legend)       → lineDiscrete
 *  [7]  lineTimeSeriesWithThresholds (thresholds)   → lineThresholds
 *  [8]  lineLongLabelOptions     (truncation)       → lineLongLabel
 *  [9]  lineOptions              (discrete)         → lineDiscrete
 *  [10] lineAlwaysRulerTooltip                      → lineTimeSeries [ECharts limitation: always ruler]
 *  [11] lineTimeSeriesOptions    (axes, time)       → lineTimeSeries
 *  [12] lineTimeSeriesDenseOptions (axes, time)     → lineTimeSeriesDense
 *  [13] dualLine                 (axes, time, dual) → lineDualAxis
 *
 * ECharts limitations (documented, not implemented):
 *  - alwaysShowRulerTooltip: ECharts has no equivalent; tooltip.trigger:'axis' is always shown on hover.
 *  - Custom locale (French): ECharts time-axis uses the browser locale; no per-chart locale API.
 */
import type { EChartsOption } from 'echarts'
import {
  createLineOptions,
  createStepLineOptions,
  createTimeSeriesLineOptions,
} from '@carbon/echarts-theme/presets'

// ── Shared datasets (values match carboncharts/line.ts exactly) ───────────────

/** lineData — 4 groups, 5 categories — matches carboncharts/line.ts lineData */
export const lineData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: 'Restocking', value: 21400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'Dataset 4', key: 'Qty', value: 22000 },
  { group: 'Dataset 4', key: 'More', value: 1200 },
  { group: 'Dataset 4', key: 'Sold', value: 9000 },
  { group: 'Dataset 4', key: 'Restocking', value: 24000 },
  { group: 'Dataset 4', key: 'Misc', value: 3000 },
]

/**
 * lineSelectedGroupsData — same structure as lineData but Dataset 2 More = 56000
 * Matches carboncharts/line.ts lineSelectedGroupsData exactly.
 * Used for slot [5] (pre-selected groups demo — Dataset 1 + 3 active, 2 + 4 greyed).
 * ECharts limitation: per-series initial visibility cannot be pre-set from options alone.
 */
export const lineSelectedGroupsData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 56000 }, // differs from lineData
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: 'Restocking', value: 21400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'Dataset 4', key: 'Qty', value: 22000 },
  { group: 'Dataset 4', key: 'More', value: 1200 },
  { group: 'Dataset 4', key: 'Sold', value: 9000 },
  { group: 'Dataset 4', key: 'Restocking', value: 24000 },
  { group: 'Dataset 4', key: 'Misc', value: 3000 },
]

/**
 * lineLongLabelData — 3 normal groups + 'LongLabelShouldBeTruncated', with a 64-char hex key
 * Matches carboncharts/line.ts lineLongLabelData exactly.
 * Used for slot [8] (truncated label demo).
 */
export const lineLongLabelData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  {
    group: 'Dataset 1',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 42300,
  },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  {
    group: 'Dataset 2',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 21400,
  },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  {
    group: 'Dataset 3',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 1400,
  },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'LongLabelShouldBeTruncated', key: 'Qty', value: 22000 },
  { group: 'LongLabelShouldBeTruncated', key: 'More', value: 1200 },
  { group: 'LongLabelShouldBeTruncated', key: 'Sold', value: 9000 },
  {
    group: 'LongLabelShouldBeTruncated',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 24000,
  },
  { group: 'LongLabelShouldBeTruncated', key: 'Misc', value: 3000 },
]

/** lineTimeSeriesData — 4 groups, date-keyed (ISO strings, with nulls) */
export const timeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-08', value: null as unknown as number },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-08', value: 27432 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 3', date: '2023-01-01', value: 40000 },
  { group: 'Dataset 3', date: '2023-01-05', value: null as unknown as number },
  { group: 'Dataset 3', date: '2023-01-08', value: 18000 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213 },
  { group: 'Dataset 4', date: '2023-01-02', value: 20000 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-15', value: 25332 },
  { group: 'Dataset 4', date: '2023-01-19', value: null as unknown as number },
]

/** lineTimeSeriesDenseData — 2 groups, sub-daily ISO timestamps */
export const timeSeriesDenseData = [
  { group: 'Dataset 1', date: '2023-01-01T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-01T05:00:00.000Z', value: -12000 },
  { group: 'Dataset 1', date: '2023-01-01T10:00:00.000Z', value: -14000 },
  { group: 'Dataset 1', date: '2023-01-02T00:00:00.000Z', value: -25000 },
  { group: 'Dataset 1', date: '2023-01-02T02:00:00.000Z', value: -26000 },
  { group: 'Dataset 1', date: '2023-01-03T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-03T05:00:00.000Z', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-03T10:00:00.000Z', value: 12000 },
  { group: 'Dataset 1', date: '2023-01-05T00:00:00.000Z', value: 45000 },
  { group: 'Dataset 1', date: '2023-01-07T00:00:00.000Z', value: 49000 },
  { group: 'Dataset 1', date: '2023-01-07T15:00:00.000Z', value: 45000 },
  { group: 'Dataset 1', date: '2023-01-09T00:00:00.000Z', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-09T05:00:00.000Z', value: 52000 },
  { group: 'Dataset 1', date: '2023-01-09T15:00:00.000Z', value: 55000 },
  { group: 'Dataset 1', date: '2023-01-10T00:00:00.000Z', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-12T00:00:00.000Z', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-13T00:00:00.000Z', value: 80000 },
  { group: 'Dataset 1', date: '2023-01-14T10:00:00.000Z', value: 85000 },
  { group: 'Dataset 1', date: '2023-01-15T07:00:00.000Z', value: 90000 },
  { group: 'Dataset 1', date: '2023-01-15T18:00:00.000Z', value: 70000 },
  { group: 'Dataset 2', date: '2023-01-01T00:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-01T03:00:00.000Z', value: 22000 },
  { group: 'Dataset 2', date: '2023-01-01T16:00:00.000Z', value: 24000 },
  { group: 'Dataset 2', date: '2023-01-02T00:00:00.000Z', value: 35000 },
  { group: 'Dataset 2', date: '2023-01-02T07:00:00.000Z', value: 36000 },
  { group: 'Dataset 2', date: '2023-01-03T00:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-03T06:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-03T18:00:00.000Z', value: 22000 },
  { group: 'Dataset 2', date: '2023-01-05T00:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-06T00:00:00.000Z', value: 52000 },
  { group: 'Dataset 2', date: '2023-01-07T00:00:00.000Z', value: 52000 },
  { group: 'Dataset 2', date: '2023-01-07T15:00:00.000Z', value: 52000 },
  { group: 'Dataset 2', date: '2023-01-09T00:00:00.000Z', value: 60000 },
  { group: 'Dataset 2', date: '2023-01-09T05:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-09T10:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-12T00:00:00.000Z', value: 65000 },
  { group: 'Dataset 2', date: '2023-01-14T00:00:00.000Z', value: 40000 },
  { group: 'Dataset 2', date: '2023-01-15T05:00:00.000Z', value: 45000 },
  { group: 'Dataset 2', date: '2023-01-15T10:00:00.000Z', value: 35000 },
  { group: 'Dataset 2', date: '2023-01-15T18:00:00.000Z', value: 30000 },
]

/** lineTimeSeriesDualAxesData — Temperature (left) + Rainfall (right) */
export const dualAxesData = [
  { group: 'Temperature', date: '2023-01-01', value: 23 },
  { group: 'Temperature', date: '2023-02-01', value: 15 },
  { group: 'Temperature', date: '2023-03-01', value: 24 },
  { group: 'Temperature', date: '2023-04-01', value: 33 },
  { group: 'Temperature', date: '2023-05-01', value: 23 },
  { group: 'Temperature', date: '2023-06-01', value: 32 },
  { group: 'Temperature', date: '2023-07-01', value: 23 },
  { group: 'Rainfall', date: '2023-01-01', value: 50 },
  { group: 'Rainfall', date: '2023-02-01', value: 65 },
  { group: 'Rainfall', date: '2023-03-01', value: 35 },
  { group: 'Rainfall', date: '2023-04-01', value: 43 },
  { group: 'Rainfall', date: '2023-05-01', value: 53 },
  { group: 'Rainfall', date: '2023-06-01', value: 19 },
  { group: 'Rainfall', date: '2023-07-01', value: 13 },
]

/** lineLogAxisData — single group, time-keyed */
export const logAxisData = [
  { group: 'Dataset 1', date: '2023-12-30', value: 300100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 235000 },
  { group: 'Dataset 1', date: '2024-01-01', value: 153100 },
  { group: 'Dataset 1', date: '2024-01-02', value: 142300 },
  { group: 'Dataset 1', date: '2024-01-03', value: 82300 },
]

/** lineTimeSeriesDataRotatedTicks — single group, daily ticks needing rotation */
export const rotatedTicksData = [
  { group: 'Dataset 1', date: '2023-12-30', value: 32100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 23500 },
  { group: 'Dataset 1', date: '2024-01-01', value: 53100 },
  { group: 'Dataset 1', date: '2024-01-02', value: 42300 },
  { group: 'Dataset 1', date: '2024-01-03', value: 12300 },
]

/** lineTimeSeriesFrenchLocaleData — monthly intervals */
export const frenchLocaleData = [
  { group: 'Dataset 1', date: '2023-10-01', value: 10 },
  { group: 'Dataset 1', date: '2023-11-01', value: 10 },
  { group: 'Dataset 1', date: '2023-12-01', value: 10 },
  { group: 'Dataset 1', date: '2024-01-01', value: 10 },
  { group: 'Dataset 1', date: '2024-02-01', value: 10 },
  { group: 'Dataset 1', date: '2024-03-01', value: 10 },
  { group: 'Dataset 1', date: '2019-04-01', value: 10 },
]

// ── ECharts option exports (one per test slot) ────────────────────────────────

/** [0] Custom domain line — xDomain restricts visible categories; yDomain sets axis range */
export const lineDiscrete: EChartsOption = createLineOptions(lineData, {
  xDomain: ['Qty', 'More', 'Misc'],
  yDomain: [10000, 50000],
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [1] Rotated ticks — xAxis.axisLabel.rotate: -45 */
export const lineRotatedTicks: EChartsOption = createLineOptions(rotatedTicksData, {
  timeSeries: true,
  axisLabelRotate: -45,
})

/**
 * [2] French locale — ECharts limitation: no per-chart locale API.
 * Rendered as a standard time-series line using the same data.
 */
export const lineLocale: EChartsOption = createLineOptions(frenchLocaleData, {
  timeSeries: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [3] Log axis — no axis titles in the Carbon Charts original */
export const lineLogAxis: EChartsOption = createLineOptions(logAxisData, {
  timeSeries: true,
  logScale: true,
})

/** [4] Custom colors — per-series color scale matching Carbon Charts color.scale */
export const lineCustomColors: EChartsOption = createLineOptions(lineData, {
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
  colorScale: {
    'Dataset 1': '#925699',
    'Dataset 2': '#525669',
    'Dataset 3': '#725699',
    'Dataset 4': '#ccc',
  },
})

/** [5] Selected groups — Dataset 1 + 3 visible on load; Dataset 2 + 4 start hidden */
export const lineSelectedGroups: EChartsOption = createLineOptions(lineSelectedGroupsData, {
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
  selectedGroups: ['Dataset 1', 'Dataset 3'],
})

/** [6] Legend orientation — vertical legend on the left (matches Carbon LegendPositions.LEFT + VERTICAL) */
export const lineLegendOrientation: EChartsOption = createLineOptions(lineData, {
  legendPosition: 'left',
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [7] Time series with thresholds — Y thresholds at 55000 and 10000 */
export const lineThresholds: EChartsOption = createLineOptions(timeSeriesData, {
  timeSeries: true,
  smooth: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
  thresholds: [{ value: 55000, label: 'Custom label' }, { value: 10000 }],
})

/**
 * [8] Long / truncated labels — uses lineLongLabelData with 64-char hex key and
 * 'LongLabelShouldBeTruncated' group name. ECharts truncates long axis labels
 * automatically via axisLabel.overflow:'truncate'.
 */
export const lineLongLabel: EChartsOption = createLineOptions(lineLongLabelData, {
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [9] Line (discrete, standard) */
export const lineStandard: EChartsOption = createLineOptions(lineData, {
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/**
 * [10] Always show ruler tooltip — ECharts limitation: no alwaysShowRulerTooltip.
 * tooltip.trigger:'axis' shows on hover; no always-on equivalent.
 */
export const lineAlwaysRuler: EChartsOption = createLineOptions(timeSeriesData, {
  timeSeries: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [11] Time series */
export const lineTimeSeries: EChartsOption = createTimeSeriesLineOptions(timeSeriesData, {
  smooth: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [12] Time series dense */
export const lineTimeSeriesDense: EChartsOption = createTimeSeriesLineOptions(timeSeriesDenseData, {
  smooth: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})

/** [13] Dual axis — Rainfall on secondary (right) Y axis */
export const lineDualAxis: EChartsOption = createTimeSeriesLineOptions(dualAxesData, {
  smooth: true,
  secondaryGroups: ['Rainfall'],
})

// ── Convenience re-export (step line, unchanged) ──────────────────────────────
export const lineStep: EChartsOption = createStepLineOptions(lineData)
