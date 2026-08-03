import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import ScatterMdx from '../content/scatter.mdx'
import { chartTypes, examples } from '../data/carboncharts/scatter'
import {
  scatterLinear,
  scatterTimeSeries,
  scatterDiscrete,
  scatterDualAxes,
} from '../data/echarts/scatter'

// Filter to test-tagged examples only
// Carbon test order (5 test examples):
//  [0] Scatter (linear x & y)     — employees/sales
//  [1] Scatter (time series)      — date/value
//  [2] Scatter (discrete)         — key/value, 4 datasets
//  [3] Scatter (dual axes)        — Orders/Products
//  [4] Scatter (always ruler)     — employees/sales again
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  scatterLinear, // [0] linear x & y
  scatterTimeSeries, // [1] time series
  scatterDiscrete, // [2] discrete
  scatterDualAxes, // [3] dual axes
  scatterLinear, // [4] always ruler tooltip (same data as linear)
]

const titles = [
  'Scatter (linear x & y)',
  'Scatter (time series)',
  'Scatter (discrete)',
  'Scatter (dual axes)',
  'Scatter (always show ruler tooltip)',
]

const codeSamples = [
  `import { createScatterOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 10, value: 13000 },
  { group: 'Dataset 1', key: 15, value: 16000 },
  // ... employees vs annual sales
]

const option = createScatterOptions(data)`,

  `import { createScatterOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  // ... time-series scatter
]

const option = createScatterOptions(data, { timeSeries: true })`,

  `import { createScatterOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  // ... discrete category scatter
]

const option = createScatterOptions(data)`,

  `import { createScatterOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10, orderCount: 5 },
  // ...
]

// secondaryGroups moves named series to the right Y axis
const option = createScatterOptions(data, {
  timeSeries: true,
  secondaryGroups: ['Dataset 2'],
})`,

  `import { createScatterOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 10, value: 13000 },
  // ...
]

const option = createScatterOptions(data)
// Note: Carbon Charts alwaysShowRulerTooltip — ECharts tooltip on hover only`,
]

export function ScatterPage() {
  return (
    <ChartPage
      title="Scatter"
      description="Explore correlation between two continuous variables."
      overview={<ScatterMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? scatterLinear}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
