import React from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import BarMdx from '../content/bar.mdx'
import {
  chartTypes,
  examples,
  chartTypesGrouped,
  examplesGrouped,
  chartTypesStacked,
  examplesStacked,
} from '../data/carboncharts/bar'
import {
  // Showcase
  barShowcaseWorldPop,
  barShowcaseRevenue,
  barShowcaseDivergent,
  // Simple
  barSimple,
  barTimeSeries,
  barHorizontal,
  barHorizontalTimeSeries,
  barFloatingHorizontalTimeSeries,
  barFloating,
  barFloatingHorizontal,
  barCustomDomain,
  barCustomColors,
  barJapaneseLocale,
  barLongLabel,
  simpleBarData,
  timeSeriesData as barTimeSeriesData,
  floatingBarData,
  floatingHorizontalBarData,
  floatingHorizontalTimeSeriesData,
  longLabelData,
  // Grouped
  barGrouped,
  barGroupedCompact,
  barGroupedTimeSeries,
  barGroupedHorizontal,
  barGroupedHorizontalTimeSeries,
  groupedBarData,
  groupedBarCompactData,
  groupedBarTimeSeriesData,
  // Stacked
  barStacked,
  barStackedNegative,
  barStackedTimeSeries,
  barStackedShortInterval,
  barStackedHorizontal,
  barStackedHorizontalTimeSeries,
  stackedBarData,
  stackedBarNegativeData,
  stackedBarTimeSeriesData,
  stackedBarShortIntervalData,
} from '../data/echarts/bar'

// ── Simple (non-grouped / non-stacked) examples ───────────────────────────────

// Filter to test-tagged examples only
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

// ECharts equivalents paired by test example index
// Carbon test order (test-tagged examples only):
//  [0]  simpleBarOptions                     → vertical simple discrete
//  [1]  simpleBarTimeSeriesOptions            → vertical simple time series
//  [2]  simpleHorizontalBarOptions            → horizontal simple discrete
//  [3]  simpleHorizontalBarTimeSeriesOptions  → horizontal simple time series
//  [4]  floatingHorizontalBarTimeSeriesOptions → floating horizontal time series
//  [5]  floatingBarOptions                    → floating vertical discrete
//  [6]  floatingHorizontalBarOptions          → floating horizontal discrete
//  [7]  simpleBarFixedDomainOptions           → fixed domain (reuse simple)
//  [8]  simpleBarColorOverrideOptions         → custom colors (reuse simple)
//  [9]  simpleBarCenteredLegendOptions        → centered legend (reuse simple)
//  [10] simpleBarCustomLegendOrderOptions     → custom legend order (reuse simple)
//  [11] simpleBarAdditionalLegendItemsOptions → additional legend items (reuse simple)
//  [12] simpleBarJapaneseLocaleOptions        → Japanese locale (reuse time series)
//  [13] simpleHorizontalBarLongLabelOptions   → truncation (reuse horizontal)
const echartsOptions = [
  barSimple, // [0]
  barTimeSeries, // [1]
  barHorizontal, // [2]
  barHorizontalTimeSeries, // [3]
  barFloatingHorizontalTimeSeries, // [4] — time series floating horizontal
  barFloating, // [5]
  barFloatingHorizontal, // [6]
  barCustomDomain, // [7] fixed domain [-100000, 100000]
  barCustomColors, // [8] custom colors Qty+Misc override
  barSimple, // [9] centered legend
  barSimple, // [10] custom legend order
  barSimple, // [11] additional legend items (ECharts limitation)
  barJapaneseLocale, // [12] Japanese locale — ja-JP formatted date axis
  barLongLabel, // [13] truncated labels — long hex-hash group names
]

const titles = [
  'Vertical simple bar (discrete)',
  'Vertical simple bar (time series)',
  'Horizontal simple bar (discrete)',
  'Horizontal simple bar (time series)',
  'Horizontal floating bar (time series)',
  'Floating vertical bar (discrete)',
  'Floating horizontal bar (discrete)',
  'Custom domain (simple bar)',
  'Custom colors (simple bar)',
  'Centered legend (simple bar)',
  'Custom legend order (simple bar)',
  'Additional legend items (simple bar)',
  'Japanese locale',
  'Truncated labels (simple bar)',
]

const codeSamples: string[] = [
  // [0] vertical simple discrete
  `import { createBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

const option = createBarOptions(data)

<ReactECharts option={option} theme="carbon-white" />`,

  // [1] vertical simple time series
  `import { createBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

const option = createBarOptions(data, { xField: 'date' })

<ReactECharts option={option} theme="carbon-white" />`,

  // [2] horizontal simple discrete
  `import { createHorizontalBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

const option = createHorizontalBarOptions(data)

<ReactECharts option={option} theme="carbon-white" />`,

  // [3] horizontal simple time series
  `import { createHorizontalBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

const option = createHorizontalBarOptions(data, { xField: 'date' })

<ReactECharts option={option} theme="carbon-white" />`,

  // [4] floating horizontal time series
  `import { createFloatingBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// value: [base, end] tuple — matches Carbon Charts floating data format
const data = [
  { group: 'Qty', date: '2023-01-01', value: [10000, 41000] },
  { group: 'More', date: '2023-01-02', value: [0, 65000] },
  { group: 'Sold', date: '2023-01-03', value: [0, 30000] },
  { group: 'Restocking', date: '2023-01-06', value: [22000, 69213] },
  { group: 'Misc', date: '2023-01-07', value: [3500, 71213] },
]

const option = createFloatingBarOptions(data, { horizontal: true })

<ReactECharts option={option} theme="carbon-white" />`,

  // [5] floating vertical discrete
  `import { createFloatingBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// value: [base, end] tuple — matches Carbon Charts floating data format
const data = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 16932] },
]

const option = createFloatingBarOptions(data)

<ReactECharts option={option} theme="carbon-white" />`,

  // [6] floating horizontal discrete
  `import { createFloatingBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// value: [base, end] tuple — matches Carbon Charts floating data format
const data = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 36932] },
]

const option = createFloatingBarOptions(data, { horizontal: true })

<ReactECharts option={option} theme="carbon-white" />`,

  // [7] custom domain
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

// yDomain clamps the value axis — matches Carbon Charts axes.left.domain
const option = createBarOptions(data, { yDomain: [-100000, 100000] })`,

  // [8] custom colors
  `import { purple50, teal50 } from '@carbon/colors'
import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

// colors map overrides palette for named groups — matches Carbon Charts color.scale
const option = createBarOptions(data, {
  colors: { Qty: purple50, Misc: teal50 },
})`,

  // [9] centered legend — ECharts limitation: legend.align not configurable via preset
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

const option = createBarOptions(data)
// Note: Carbon Charts centers the legend via legend.alignment — ECharts renders at bottom-left`,

  // [10] custom legend order — ECharts limitation: legend order follows series insertion order
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

const option = createBarOptions(data)
// Note: Carbon Charts reorders legend via legend.order — ECharts uses insertion order`,

  // [11] additional legend items — ECharts limitation: no additionalItems API
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

const option = createBarOptions(data)
// Note: Carbon Charts supports legend.additionalItems — ECharts has no equivalent`,

  // [12] Japanese locale — pass locale:'ja-JP' to format date axis labels
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

const option = createBarOptions(data, { xField: 'date', locale: 'ja-JP' })

<ReactECharts option={option} theme="carbon-white" />`,

  // [13] truncated labels — long hex-hash group names
  `import { createHorizontalBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '6591DA8668C339B1B39297C61091E320C35391AB7AFC15B469F96B8A2DD0C231', value: 65000 },
  { group: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9', value: 29123 },
  { group: '232D788298773BB389DBB8FCE44D3FB4E878879BE7AFB0B303BCE0D56EBB92E2', value: 35213 },
  { group: '58B01AADFA87E5547A218B3C6CE3AF07B8DF7BAB9E12BF60FD2BBB739C46B86E', value: 51213 },
  { group: 'Qty', value: 16932 },
]

const option = createHorizontalBarOptions(data)`,
]

const chartDataSamples = [
  simpleBarData, // [0] vertical simple discrete
  barTimeSeriesData, // [1] vertical simple time series
  simpleBarData, // [2] horizontal simple discrete
  barTimeSeriesData, // [3] horizontal simple time series
  floatingHorizontalTimeSeriesData, // [4] floating horizontal time series
  floatingBarData, // [5] floating vertical discrete
  floatingHorizontalBarData, // [6] floating horizontal discrete
  simpleBarData, // [7] custom domain
  simpleBarData, // [8] custom colors
  simpleBarData, // [9] centered legend
  simpleBarData, // [10] custom legend order
  simpleBarData, // [11] additional legend items
  barTimeSeriesData, // [12] Japanese locale
  longLabelData, // [13] truncated labels
]

// ── Grouped examples ──────────────────────────────────────────────────────────

// Carbon grouped test order (test-tagged, excluding legend-only examples):
//  [g1] groupedBarOptions                → vertical grouped discrete
//  [g2] groupedBarCompactOptions         → compact (missing bars)
//  [g3] groupedBarTimeSeriesOptions      → vertical grouped time series
//  [g7] groupedHorizontalBarOptions      → horizontal grouped discrete
//  [g8] groupedBarHorizontalTimeSeriesOptions → horizontal grouped time series
//
// [g0] groupedBarSelectedGroupsOptions is excluded — it is tagged ['test','legend'] and uses
// Carbon's data.selectedGroups API which has no ECharts equivalent. Including it creates a
// misleading comparison (Carbon shows 2 of 4 datasets; ECharts shows all 4).
const testGroupedExamples = examplesGrouped.filter(
  (ex) => ex.tags?.includes('test') && !ex.tags?.includes('legend'),
)

const groupedEchartsOptions = [
  barGrouped, // [g1] vertical grouped discrete
  barGroupedCompact, // [g2] compact (missing bars)
  barGroupedTimeSeries, // [g3] vertical grouped time series
  barGroupedHorizontal, // [g7] horizontal grouped discrete
  barGroupedHorizontalTimeSeries, // [g8] horizontal grouped time series
]

const groupedTitles = [
  'Vertical grouped bar (discrete)',
  'Grouped bar (compact — missing bars collapsed)',
  'Vertical grouped bar (time series)',
  'Horizontal grouped bar (discrete)',
  'Horizontal grouped bar (time series)',
]

const groupedCodeSamples: string[] = [
  `import { createGroupedBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: -29123 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  // ...
]

const option = createGroupedBarOptions(data)`,

  `import { createGroupedBarOptions } from '@carbon/echarts-theme/presets'

// Sparse data (missing bars for some groups) — ECharts renders null values as gaps
const data = [
  { group: 'Dataset 1', key: 'Q1', value: 65000 },
  { group: 'Dataset 1', key: 'Q2', value: 29123 },
  // Q3 missing for Dataset 1
  { group: 'Dataset 2', key: 'Q1', value: 32432 },
  { group: 'Dataset 2', key: 'Q3', value: 21312 },
  // ...
]

const option = createGroupedBarOptions(data)`,

  `import { createGroupedBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2', date: '2023-01-01', value: 8000 },
  // ...
]

const option = createGroupedBarOptions(data, { xField: 'date' })`,

  `import { createHorizontalBarOptions } from '@carbon/echarts-theme/presets'

// Horizontal grouped bar — pass multi-series data with a key field
const data = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  // ...
]

const option = createHorizontalBarOptions(data)`,

  `import { createHorizontalBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2', date: '2023-01-01', value: 8000 },
  // ...
]

const option = createHorizontalBarOptions(data, { xField: 'date' })`,
]

const groupedChartDataSamples = [
  groupedBarData, // [g1] vertical grouped discrete
  groupedBarCompactData, // [g2] compact
  groupedBarTimeSeriesData, // [g3] vertical grouped time series
  groupedBarData, // [g7] horizontal grouped discrete
  groupedBarTimeSeriesData, // [g8] horizontal grouped time series
]

// ── Stacked examples ──────────────────────────────────────────────────────────

// Carbon stacked test order (test-tagged only):
//  [s0] stackedBarOptions                       → vertical stacked discrete
//  [s1] stackedBarAlwaysRulerTooltipOptions      → always ruler tooltip (ECharts limitation)
//  [s2] stackedBarNegativeOptions                → divergent (negative values)
//  [s3] stackedBarTimeSeriesOptions              → vertical stacked time series
//  [s4] stackedBarShortIntervalTimeSeriesOptions → short-interval time series
//  [s7] stackedHorizontalBarOptions              → horizontal stacked discrete
//  [s8] stackedHorizontalBarTimeSeriesOptions    → horizontal stacked time series
const testStackedExamples = examplesStacked.filter((ex) => ex.tags?.includes('test'))

const stackedEchartsOptions = [
  barStacked, // [s0] vertical stacked discrete
  barStacked, // [s1] always ruler tooltip — ECharts: same as stacked (no alwaysShowRulerTooltip)
  barStackedNegative, // [s2] divergent (negative values)
  barStackedTimeSeries, // [s3] vertical stacked time series
  barStackedShortInterval, // [s4] short-interval time series
  barStackedHorizontal, // [s7] horizontal stacked discrete
  barStackedHorizontalTimeSeries, // [s8] horizontal stacked time series
]

const stackedTitles = [
  'Vertical stacked bar (discrete)',
  'Stacked bar (always ruler tooltip) — ECharts: tooltip on hover only',
  'Vertical stacked bar (divergent)',
  'Vertical stacked bar (time series)',
  'Vertical stacked bar (short interval time series)',
  'Horizontal stacked bar (discrete)',
  'Horizontal stacked bar (time series)',
]

const stackedCodeSamples: string[] = [
  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  // ...
]

const option = createStackedBarOptions(data)`,

  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

const data = [/* discrete stacked data */]

const option = createStackedBarOptions(data)
// Note: Carbon Charts tooltip.alwaysShowRulerTooltip — ECharts: tooltip on hover only`,

  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

// Divergent stack — Dataset 4 has negative values
const data = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 4', key: 'Qty', value: -32423 },
  // ...
]

const option = createStackedBarOptions(data)`,

  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2', date: '2023-01-03', value: 75000 },
  // ...
]

const option = createStackedBarOptions(data, { xField: 'date' })`,

  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

// Short-interval time series — ISO timestamp strings (millisecond precision)
const data = [
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.222Z', value: 65000 },
  // ...
]

const option = createStackedBarOptions(data, { xField: 'date' })`,

  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  // ...
]

const option = createStackedBarOptions(data, { horizontal: true })`,

  `import { createStackedBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2', date: '2023-01-03', value: 75000 },
  // ...
]

const option = createStackedBarOptions(data, { xField: 'date', horizontal: true })`,
]

const stackedChartDataSamples = [
  stackedBarData, // [s0] vertical stacked discrete
  stackedBarData, // [s1] always ruler tooltip
  stackedBarNegativeData, // [s2] divergent
  stackedBarTimeSeriesData, // [s3] vertical stacked time series
  stackedBarShortIntervalData, // [s4] short-interval time series
  stackedBarData, // [s7] horizontal stacked discrete
  stackedBarTimeSeriesData, // [s8] horizontal stacked time series
]

// ── Page component ────────────────────────────────────────────────────────────

export function BarPage() {
  return (
    <ChartPage
      title="Bar"
      description="Compare values across discrete categories."
      overview={<BarMdx />}
      examples={
        <Tabs>
          <TabList aria-label="Bar chart variants">
            <Tab>Simple</Tab>
            <Tab>Grouped</Tab>
            <Tab>Stacked</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* ── Showcase ── */}
              <Compare
                title="World Population by Region — horizontal bar with value labels"
                echartsOption={barShowcaseWorldPop}
                extended
                height="380px"
                optionCode={`import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const regions = ['Northern Africa','Southern Africa','Central America','Eastern Europe','Southeast Asia',
                  'Western Europe','South America','North America','East Asia','South Asia']
const population = [254, 198, 175, 292, 688, 197, 438, 502, 1673, 2027]
const palette = pickColors(population.length)

const option: EChartsOption = {
  title: { text: 'Population by World Region (millions)', left: 'center' },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value', name: 'Population (M)' },
  yAxis: { type: 'category', data: regions },
  series: [{
    type: 'bar',
    data: population.map((v, i) => ({ value: v, itemStyle: { color: palette[i] } })),
    label: { show: true, position: 'right', formatter: '{c}M' },
    barMaxWidth: 28,
  }],
}

<ReactECharts option={option} theme="carbon-white" />`}
              />
              {/* ── Carbon Charts parity comparisons ── */}
              {testExamples.map((ex, i) => (
                <Compare
                  key={i}
                  title={titles[i] ?? `Example ${i + 1}`}
                  echartsOption={echartsOptions[i] ?? barSimple}
                  carbonExample={ex}
                  chartClass={chartTypes.vanilla}
                  optionCode={codeSamples[i]}
                  chartData={chartDataSamples[i]}
                />
              ))}
            </TabPanel>
            <TabPanel>
              {/* ── Showcase ── */}
              <Compare
                title="Monthly Revenue — grouped bar with positive and negative values"
                echartsOption={barShowcaseRevenue}
                extended
                height="360px"
                optionCode={`import type { EChartsOption } from 'echarts'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const option: EChartsOption = {
  title: { text: 'Monthly Revenue Breakdown', left: 'center' },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Income', 'Profit', 'Expenses'], bottom: 0 },
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value', name: 'USD (K)' },
  series: [
    { name: 'Income',   type: 'bar', data: [320,302,341,374,390,450,410,390,450,355,402,382] },
    { name: 'Profit',   type: 'bar', data: [200,170, 57,140,166,222,133,108,168,102, 93,172] },
    { name: 'Expenses', type: 'bar', data: [-120,-132,-101,-134,-90,-230,-210,-182,-125,-83,-110,-190] },
  ],
}

<ReactECharts option={option} theme="carbon-white" />`}
              />
              {/* ── Carbon Charts parity comparisons ── */}
              {testGroupedExamples.map((ex, i) => (
                <Compare
                  key={i}
                  title={groupedTitles[i] ?? `Grouped example ${i + 1}`}
                  echartsOption={groupedEchartsOptions[i] ?? barGrouped}
                  carbonExample={ex}
                  chartClass={chartTypesGrouped.vanilla}
                  optionCode={groupedCodeSamples[i]}
                  chartData={groupedChartDataSamples[i]}
                />
              ))}
            </TabPanel>
            <TabPanel>
              {/* ── Showcase ── */}
              <Compare
                title="Quarterly Sales by Region — stacked divergent (positive + negative stacks)"
                echartsOption={barShowcaseDivergent}
                extended
                height="360px"
                optionCode={`import type { EChartsOption } from 'echarts'

const quarters = ['Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024']

const option: EChartsOption = {
  title: { text: 'Quarterly Sales by Region', left: 'center' },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['North America','Europe','Asia Pacific','South America','MEA'], bottom: 0 },
  xAxis: { type: 'category', data: quarters },
  yAxis: { type: 'value', name: 'Revenue (M USD)' },
  series: [
    { name: 'North America', type: 'bar', stack: 'positive', data: [120,132,101,134, 90,230] },
    { name: 'Europe',        type: 'bar', stack: 'positive', data: [220,182,191,234,290,330] },
    { name: 'Asia Pacific',  type: 'bar', stack: 'positive', data: [150,212,201,154,190,330] },
    { name: 'South America', type: 'bar', stack: 'negative', data: [[-98,0],[-77,0],[-101,0],[-134,0],[-90,0],[-130,0]] },
    { name: 'MEA',           type: 'bar', stack: 'negative', data: [[-48,0],[-52,0],[-101,0],[-134,0],[-90,0], [-80,0]] },
  ],
}

<ReactECharts option={option} theme="carbon-white" />`}
              />
              {/* ── Carbon Charts parity comparisons ── */}
              {testStackedExamples.map((ex, i) => (
                <Compare
                  key={i}
                  title={stackedTitles[i] ?? `Stacked example ${i + 1}`}
                  echartsOption={stackedEchartsOptions[i] ?? barStacked}
                  carbonExample={ex}
                  chartClass={chartTypesStacked.vanilla}
                  optionCode={stackedCodeSamples[i]}
                  chartData={stackedChartDataSamples[i]}
                />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      }
    />
  )
}
