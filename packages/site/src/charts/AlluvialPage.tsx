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

const option = createAlluvialOptions(data, {
  gradient: true,
  colors: {
    'About Modal':                  '#b28600',
    Cards:                          '#da1e28',
    'Create Flow':                  '#198038',
    'Page Header':                  '#ee538b',
    Notifications:                  '#08bdba',
    'Data and AI, AI Apps':         '#1192e8',
    'Data and AI, Info Architecture': '#a56eff',
    Security:                       '#009d9a',
    Automation:                     '#fa4d56',
    'Public Cloud':                 '#198038',
  },
})

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

const data = [
  { source: 'A', target: 'X', value: 3 },
  // ... more links
]

const option = createAlluvialOptions(data, {
  colors: {
    A: '#da1e28',
    B: '#0f62fe',
    C: '#198038',
  },
})`,
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
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
