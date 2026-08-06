import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import TreeMdx from '../content/tree.mdx'
import { chartTypes, examples } from '../data/carboncharts/tree'
import { tree, treeHorizontal, treeData } from '../data/echarts/tree'

// Filter to test-tagged examples only
// Carbon test order: [0] Dendrogram (LR), [1] Tree (LR)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  tree, // [0] Dendrogram — LR layout, depth 2
  treeHorizontal, // [1] Tree — TB layout, depth 2
]

const titles = ['Tree (dendrogram)', 'Tree (top-bottom)']

const codeSamples = [
  `import { createTreeOptionsFromTabular } from '@carbon/echarts-theme/presets'

// Flare hierarchy — same dataset as Carbon Charts tree examples
const data = [
  { name: 'flare', children: [
    { name: 'analytics', children: [
      { name: 'cluster', children: [/* ... */] },
    ]},
  ]},
]

const option = createTreeOptionsFromTabular(data, { initialDepth: 2 })`,

  `import { createTreeOptionsFromTabular } from '@carbon/echarts-theme/presets'

const data = [/* same flare hierarchy */]

const option = createTreeOptionsFromTabular(data, {
  initialDepth: 2,
  orient: 'TB',  // top-to-bottom layout
})`,
]

const chartDataSamples = [
  [treeData], // [0] dendrogram — wrap in array for consistent chartData type
  [treeData], // [1] top-bottom
]

export function TreePage() {
  return (
    <ChartPage
      title="Tree"
      description="Display hierarchical data as an expandable node-link diagram."
      overview={<TreeMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? tree}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={chartDataSamples[i]}
        />
      ))}
    />
  )
}
