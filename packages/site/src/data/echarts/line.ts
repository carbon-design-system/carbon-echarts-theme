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
import { magenta70, cyan70, purple60, gray30 } from '@carbon/colors'
import {
  createLineOptions,
  createStepLineOptions,
  createTimeSeriesLineOptions,
  pickColors,
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
    'Dataset 1': magenta70,
    'Dataset 2': cyan70,
    'Dataset 3': purple60,
    'Dataset 4': gray30,
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

// ══════════════════════════════════════════════════════════════════════════════
// SHOWCASE — Line Charts
// Inspired by official Apache ECharts gallery examples, re-themed with Carbon.
// https://echarts.apache.org/examples/en/index.html#chart-type-line
// ══════════════════════════════════════════════════════════════════════════════

// ── Showcase Line 1: Rainfall vs Evaporation ─────────────────────────────────
// https://echarts.apache.org/examples/en/editor.html?c=line-rainfall
//
// areaStyle gradients and the markArea tint must reference explicit hex values —
// the theme color array only applies to itemStyle/lineStyle, not to colorStops.
// We source those hex values from pickColors() so they stay in sync.

const _rainfallMonths = [
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
const _rainfallData = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
const _evapData = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
// [0] = Rainfall colour, [1] = Evaporation colour — matches what the theme assigns
// to series 1 and 2 of a 2-series chart.
const [_rfC1, _rfC2] = pickColors(2)
// Accent tint for the markArea — use the 4th slot of the 4-colour palette so it
// contrasts with the two series colours without being mistaken for a data series.
const [, , , _rfAccent] = pickColors(4)

export const lineShowcaseRainfall: EChartsOption = {
  title: { text: 'Rainfall vs Evaporation', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Rainfall', 'Evaporation'], bottom: 0 },
  grid: { top: 56, bottom: 56, left: 16, right: 24, containLabel: true },
  xAxis: { type: 'category', data: _rainfallMonths },
  yAxis: { type: 'value', name: 'mm', nameLocation: 'middle', nameGap: 40, nameRotate: 90 },
  series: [
    {
      name: 'Rainfall',
      type: 'line',
      smooth: true,
      data: _rainfallData,
      // itemStyle/lineStyle intentionally omitted — the theme color array handles them
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: _rfC1 + 'cc' },
            { offset: 1, color: _rfC1 + '00' },
          ],
        },
      },
      markArea: {
        silent: true,
        data: [[{ name: 'Rainy season', xAxis: 'Jun' }, { xAxis: 'Sep' }]],
        itemStyle: { color: _rfAccent + '1a' },
        label: { color: _rfAccent, fontSize: 11 },
      },
    },
    {
      name: 'Evaporation',
      type: 'line',
      smooth: true,
      data: _evapData,
      lineStyle: { type: 'dashed' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: _rfC2 + '99' },
            { offset: 1, color: _rfC2 + '00' },
          ],
        },
      },
    },
  ],
}

// ── Showcase Line 2: Stock Price Trends ───────────────────────────────────────
// https://echarts.apache.org/examples/en/editor.html?c=line-smooth
//
// Five named series — the theme color array assigns each one its palette colour
// automatically. No itemStyle/lineStyle colour overrides needed.

const _stockDates = [
  '2024-01-02',
  '2024-01-09',
  '2024-01-16',
  '2024-01-23',
  '2024-01-30',
  '2024-02-06',
  '2024-02-13',
  '2024-02-20',
  '2024-02-27',
  '2024-03-05',
  '2024-03-12',
  '2024-03-19',
  '2024-03-26',
  '2024-04-02',
  '2024-04-09',
  '2024-04-16',
  '2024-04-23',
  '2024-04-30',
]
const _stockA = [
  148, 152, 155, 149, 161, 170, 165, 172, 168, 175, 183, 179, 188, 192, 185, 198, 205, 201,
]
const _stockB = [
  210, 208, 215, 218, 212, 225, 230, 228, 235, 240, 237, 245, 250, 244, 252, 258, 262, 270,
]
const _stockC = [
  95, 98, 101, 99, 105, 108, 103, 110, 107, 115, 118, 112, 120, 116, 125, 128, 122, 130,
]
const _stockD = [
  320, 325, 318, 330, 335, 328, 342, 338, 350, 345, 355, 360, 352, 365, 370, 362, 375, 380,
]
const _stockE = [55, 58, 56, 62, 59, 65, 63, 68, 70, 66, 73, 71, 75, 78, 74, 80, 83, 79]

export const lineShowcaseStock: EChartsOption = {
  title: { text: 'Weekly Stock Price Trends', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['Tech Fund', 'Growth ETF', 'Value Index', 'Blue-Chip', 'Small-Cap'],
    bottom: 0,
    type: 'scroll',
  },
  grid: { top: 56, bottom: 76, left: 16, right: 24, containLabel: true },
  dataZoom: [{ type: 'slider', bottom: 40, height: 20, start: 0, end: 100 }, { type: 'inside' }],
  xAxis: { type: 'time' },
  yAxis: { type: 'value', name: 'USD', nameLocation: 'middle', nameGap: 44, nameRotate: 90 },
  series: [
    {
      name: 'Tech Fund',
      type: 'line',
      smooth: true,
      data: _stockDates.map((d, i) => [d, _stockA[i]]),
    },
    {
      name: 'Growth ETF',
      type: 'line',
      smooth: true,
      data: _stockDates.map((d, i) => [d, _stockB[i]]),
    },
    {
      name: 'Value Index',
      type: 'line',
      smooth: true,
      data: _stockDates.map((d, i) => [d, _stockC[i]]),
    },
    {
      name: 'Blue-Chip',
      type: 'line',
      smooth: true,
      data: _stockDates.map((d, i) => [d, _stockD[i]]),
    },
    {
      name: 'Small-Cap',
      type: 'line',
      smooth: true,
      data: _stockDates.map((d, i) => [d, _stockE[i]]),
    },
  ],
}

// ── Showcase Line 3: Stacked Smooth Area with Gradient Fills ──────────────────
// https://echarts.apache.org/examples/en/editor.html?c=area-stack-gradient
//
// areaStyle gradients must reference explicit hex values — the theme color array
// doesn't reach into colorStops. We source them from pickColors(4) so they match
// exactly what the theme assigns to these four series, then omit itemStyle/lineStyle.

const _areaMonths = [
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
const _areaSearch = [820, 932, 901, 934, 1290, 1330, 1320, 1250, 1100, 980, 870, 820]
const _areaDirect = [620, 732, 701, 734, 890, 930, 920, 850, 780, 650, 600, 590]
const _areaEmail = [420, 532, 501, 534, 690, 730, 720, 650, 610, 520, 480, 450]
const _areaUnion = [220, 332, 301, 334, 490, 530, 520, 450, 410, 320, 280, 250]
const _areaColors = pickColors(4)

function _areaGradient(color: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: color + 'dd' },
      { offset: 1, color: color + '11' },
    ],
  }
}

export const lineShowcaseStackedArea: EChartsOption = {
  title: { text: 'Channel Traffic (Stacked Area)', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Search Engine', 'Direct', 'Email', 'Union Ads'], bottom: 0 },
  grid: { top: 56, bottom: 56, left: 16, right: 24, containLabel: true },
  xAxis: { type: 'category', data: _areaMonths, boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Search Engine',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: _areaSearch,
      areaStyle: { color: _areaGradient(_areaColors[0]) as never },
    },
    {
      name: 'Direct',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: _areaDirect,
      areaStyle: { color: _areaGradient(_areaColors[1]) as never },
    },
    {
      name: 'Email',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: _areaEmail,
      areaStyle: { color: _areaGradient(_areaColors[2]) as never },
    },
    {
      name: 'Union Ads',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: _areaUnion,
      areaStyle: { color: _areaGradient(_areaColors[3]) as never },
    },
  ],
}
