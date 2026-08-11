import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import AlluvialMdx from '../content/alluvial.mdx'
import { chartTypes, examples } from '../data/carboncharts/alluvial'
import {
  alluvialBasic,
  alluvialGradient,
  alluvialMultiCategory,
  alluvialMonochrome,
  alluvialAligned,
  alluvialCustomColors,
  basicData,
  multiCategoryData,
  monochromeData,
  alignedData,
} from '../data/echarts/alluvial'

// Filter to test-tagged examples only
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

// ECharts equivalents paired by test example index
const echartsOptions = [
  alluvialBasic, // [0] Basic
  alluvialGradient, // [1] Gradient
  alluvialMultiCategory, // [2] Multiple Categories
  alluvialMonochrome, // [3] Monochrome with Custom Node Padding
  alluvialAligned, // [4] Aligned Nodes
  alluvialCustomColors, // [5] Custom Colors
]

const titles = [
  'Basic',
  'Gradient',
  'Multiple categories',
  'Monochrome with custom node padding',
  'Aligned nodes',
  'Custom colors',
]

const codeSamples: (string | undefined)[] = [
  // [0] Basic
  `import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  { source: 'Cards',       target: 'Data and AI, AI Apps', value: 6 },
  // ... more links
]

const option = createAlluvialOptions(data)

export default () => <ReactECharts option={option} theme="carbon-charts-default-light" />`,

  // [1] Gradient
  `import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const data = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  // ... more links
]

// gradient: true blends each link from its source node color to its target node
// color. The auto-palette colors are used by default — no colors override needed.
const option = createAlluvialOptions(data, { gradient: true })

// Optionally supply explicit per-node colors using Carbon color tokens:
// import { red60, yellow50, cyan50 } from '@carbon/colors'
// createAlluvialOptions(data, { gradient: true, colors: { Cards: red60, ... } })

export default () => <ReactECharts option={option} theme="carbon-charts-default-light" />`,

  // [2] Multiple categories
  `import { createAlluvialOptionsFromTabular } from '@carbon/echarts-theme/presets'

const data = [
  { source: 'Class 1', target: 'Survived', value: 136, group: 'Class' },
  { source: 'Class 2', target: 'Survived', value: 87,  group: 'Class' },
  // ... Titanic dataset with source/target/group fields
]

const option = createAlluvialOptionsFromTabular(data)`,

  // [3] Monochrome + custom padding
  `import { createAlluvialOptions } from '@carbon/echarts-theme/presets'

const data = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  // ... more links
]

const option = createAlluvialOptions(data, {
  monochrome: true,
  nodePadding: 33,
})`,

  // [4] Aligned nodes
  `import { createAlluvialOptions } from '@carbon/echarts-theme/presets'

const data = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  // ... more links
]

const option = createAlluvialOptions(data, { nodeAlign: 'left' })`,

  // [5] Custom colors
  `import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import { magenta60, teal40, green30 } from '@carbon/colors'

const data = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  { source: 'Cards',       target: 'Data and AI, Info Architecture', value: 15 },
  // ... more links
]

// Color keys that don't match node names are ignored; nodes use the auto-palette.
const option = createAlluvialOptions(data, {
  colors: {
    A: magenta60,
    B: teal40,
    C: green30,
  },
})`,
]

const chartDataSamples = [
  basicData, // [0] Basic
  basicData, // [1] Gradient
  multiCategoryData, // [2] Multiple categories
  monochromeData, // [3] Monochrome
  alignedData, // [4] Aligned nodes
  basicData, // [5] Custom colors
]

export function AlluvialPage() {
  return (
    <ChartPage
      title="Alluvial / Sankey"
      description="Visualize flows and redistribution between nodes."
      overview={<AlluvialMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i]!}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={chartDataSamples[i]}
        />
      ))}
    />
  )
}
