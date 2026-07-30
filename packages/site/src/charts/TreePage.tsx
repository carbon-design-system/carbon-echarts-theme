import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import TreeMdx from '../content/tree.mdx'
import { chartTypes, examples } from '../data/carboncharts/tree'
import { tree, treeTB } from '../data/echarts/tree'

// Filter to test-tagged examples only
// Carbon test order: [0] Tree, [1] Dendrogram
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  tree,    // [0] Tree (left-right orientation)
  treeTB,  // [1] Dendrogram (top-bottom orientation)
]

const titles = [
  'Tree',
  'Dendrogram',
]

export function TreePage() {
  return (
    <ChartPage
      title="Tree"
      description="Display hierarchical data as an expandable node-link diagram."
      overview={<TreeMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? tree}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
