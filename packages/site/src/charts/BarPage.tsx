import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import BarMdx from '../content/bar.mdx'
import { chartTypes, examples } from '../data/carboncharts/bar'
import {
  barSimple,
  barTimeSeries,
  barHorizontal,
  barHorizontalTimeSeries,
  barFloating,
  barFloatingHorizontal,
} from '../data/echarts/bar'

// Filter to test-tagged examples only
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

// ECharts equivalents paired by test example index
// Carbon test order:
//  [0]  simpleBarOptions            → vertical simple discrete
//  [1]  simpleBarTimeSeriesOptions  → vertical simple time series
//  [2]  simpleHorizontalBarOptions  → horizontal simple discrete
//  [3]  simpleHorizontalBarTimeSeries → horizontal simple time series
//  [4]  floatingHorizontalBarTimeSeries → floating horizontal time series
//  [5]  floatingBarOptions           → floating vertical discrete
//  [6]  floatingHorizontalBarOptions → floating horizontal discrete
//  [7]  simpleBarFixedDomainOptions (axes) → reuse simple
//  [8]  simpleBarColorOverrideOptions (colors) → reuse simple
//  [9]  simpleBarCenteredLegendOptions (legend) → reuse simple
//  [10] simpleBarCustomLegendOrderOptions (legend) → reuse simple
//  [11] simpleBarAdditionalLegendItemsOptions (legend) → reuse simple
//  [12] simpleBarJapaneseLocaleOptions (locale) → reuse time series
//  [13] simpleHorizontalBarLongLabelOptions (truncation) → reuse horizontal
const echartsOptions = [
  barSimple,              // [0]
  barTimeSeries,          // [1]
  barHorizontal,          // [2]
  barHorizontalTimeSeries, // [3]
  barFloatingHorizontal,  // [4]
  barFloating,            // [5]
  barFloatingHorizontal,  // [6]
  barSimple,              // [7] fixed domain
  barSimple,              // [8] custom colors
  barSimple,              // [9] centered legend
  barSimple,              // [10] custom legend order
  barSimple,              // [11] additional legend items
  barTimeSeries,          // [12] locale
  barHorizontal,          // [13] truncated labels
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
  { group: 'Qty', key: 'Jan 1', value: 10000 },
  { group: 'More', key: 'Jan 2', value: 65000 },
  { group: 'Sold', key: 'Jan 3', value: 30000 },
  { group: 'Restocking', key: 'Jan 6', value: 49213 },
  { group: 'Misc', key: 'Jan 7', value: 51213 },
]

const option = createBarOptions(data)

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
  { group: 'Qty', key: 'Jan 1', value: 10000 },
  { group: 'More', key: 'Jan 2', value: 65000 },
  { group: 'Sold', key: 'Jan 3', value: 30000 },
  { group: 'Restocking', key: 'Jan 6', value: 49213 },
  { group: 'Misc', key: 'Jan 7', value: 51213 },
]

const option = createHorizontalBarOptions(data)

<ReactECharts option={option} theme="carbon-white" />`,

  // [4] horizontal floating time series
  `import { createFloatingBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', key: 'Jan 1', value: 41000, base: 10000 },
  { group: 'More', key: 'Jan 2', value: 65000, base: 0 },
  { group: 'Sold', key: 'Jan 3', value: 30000, base: 0 },
  { group: 'Restocking', key: 'Jan 6', value: 69213, base: 22000 },
  { group: 'Misc', key: 'Jan 7', value: 71213, base: 3500 },
]

const option = createFloatingBarOptions(data, { horizontal: true })

<ReactECharts option={option} theme="carbon-white" />`,

  // [5] floating vertical discrete
  `import { createFloatingBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', key: 'Qty', value: 65000, base: 30000 },
  { group: 'More', key: 'More', value: 29123, base: 15000 },
  { group: 'Sold', key: 'Sold', value: 35213, base: 22000 },
  { group: 'Restocking', key: 'Restocking', value: 51213, base: 28000 },
  { group: 'Misc', key: 'Misc', value: 16932, base: 3000 },
]

const option = createFloatingBarOptions(data)

<ReactECharts option={option} theme="carbon-white" />`,

  // [6] floating horizontal discrete
  `import { createFloatingBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { group: 'Qty', key: 'Qty', value: 65000, base: 30000 },
  { group: 'More', key: 'More', value: 29123, base: 15000 },
  { group: 'Sold', key: 'Sold', value: 35213, base: 22000 },
  { group: 'Restocking', key: 'Restocking', value: 51213, base: 28000 },
  { group: 'Misc', key: 'Misc', value: 16932, base: 3000 },
]

const option = createFloatingBarOptions(data, { horizontal: true })

<ReactECharts option={option} theme="carbon-white" />`,
]

export function BarPage() {
  return (
    <ChartPage
      title="Bar"
      description="Compare values across discrete categories."
      overview={<BarMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
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
