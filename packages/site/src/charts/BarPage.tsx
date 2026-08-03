import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import BarMdx from '../content/bar.mdx'
import { chartTypes, examples } from '../data/carboncharts/bar'
import {
  barSimple,
  barTimeSeries,
  barHorizontal,
  barHorizontalTimeSeries,
  barFloatingHorizontalTimeSeries,
  barFloating,
  barFloatingHorizontal,
  barCustomDomain,
  barCustomColors,
  barLongLabel,
} from '../data/echarts/bar'

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
  barTimeSeries, // [12] locale (ECharts limitation)
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
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

// colors map overrides palette for named groups — matches Carbon Charts color.scale
const option = createBarOptions(data, {
  colors: { Qty: '#925699', Misc: '#525669' },
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

  // [12] Japanese locale — ECharts limitation: date locale is browser-controlled
  `import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

const option = createBarOptions(data, { xField: 'date' })
// Note: Carbon Charts locale:'ja-JP' — ECharts time axis uses browser locale`,

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

export function BarPage() {
  return (
    <ChartPage
      title="Bar"
      description="Compare values across discrete categories."
      overview={<BarMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? barSimple}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
