import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import BubbleMdx from '../content/bubble.mdx'
import { chartTypes, examples } from '../data/carboncharts/bubble'
import {
  bubbleLinear,
  bubbleTimeSeries,
  bubbleDiscrete,
  bubbleDualDiscrete,
  linearData,
  timeSeriesData as bubbleTimeSeriesData,
  discreteData as bubbleDiscreteData,
  dualDiscreteData,
} from '../data/echarts/bubble'

// Filter to test-tagged examples only
// Carbon test order (5 test examples):
//  [0] Bubble (linear)                   — sales/profit x/y, surplus = size
//  [1] Bubble (always ruler tooltip)     — time series, value/surplus
//  [2] Bubble (time series)              — time series, value/surplus
//  [3] Bubble (discrete)                 — key/value/surplus, 4 datasets
//  [4] Bubble (dual discrete axes)       — problem/product discrete x/y, value = size
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  bubbleLinear, // [0] linear
  bubbleTimeSeries, // [1] always ruler tooltip (time series data)
  bubbleTimeSeries, // [2] time series
  bubbleDiscrete, // [3] discrete
  bubbleDualDiscrete, // [4] dual discrete axes
]

const titles = [
  'Bubble (linear)',
  'Bubble (always show ruler tooltip)',
  'Bubble (time series)',
  'Bubble (discrete)',
  'Bubble (dual discrete axes)',
]

const codeSamples = [
  `import { createBubbleOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 10000, value: 38000, surplus: 1000 },
  // ... key=x(employees), value=y(sales), surplus=bubble size
]

const option = createBubbleOptions(data)`,

  `import { createBubbleOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000, surplus: 200 },
  // ...
]

const option = createBubbleOptions(data, { timeSeries: true })
// Note: alwaysShowRulerTooltip — ECharts: tooltip on hover only`,

  `import { createBubbleOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000, surplus: 200 },
  // ...
]

const option = createBubbleOptions(data, { timeSeries: true })`,

  `import { createBubbleOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200, surplus: 1000 },
  // ...
]

const option = createBubbleOptions(data)`,

  `import { createBubbleOptions } from '@carbon/echarts-theme/presets'

// dualDiscrete: separate axes for problem (x) and product (y)
const data = [
  { group: 'Dataset 1', key: 'Problem A', value: 'Product 1', surplus: 10 },
  // ...
]

const option = createBubbleOptions(data, { dualDiscrete: true })`,
]

const chartDataSamples = [
  linearData, // [0] linear
  bubbleTimeSeriesData, // [1] always ruler tooltip
  bubbleTimeSeriesData, // [2] time series
  bubbleDiscreteData, // [3] discrete
  dualDiscreteData, // [4] dual discrete axes
]

export function BubblePage() {
  return (
    <ChartPage
      title="Bubble"
      description="Show three-dimensional relationships using x, y position and circle size."
      overview={<BubbleMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? bubbleLinear}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={chartDataSamples[i]}
        />
      ))}
    />
  )
}
