import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import TreemapMdx from '../content/treemap.mdx'
import { chartTypes, examples } from '../data/carboncharts/treemap'
import { treemap } from '../data/echarts/treemap'

// Filter to test-tagged examples only
// Carbon test order: [0] Treemap, [1] Treemap (Custom colors)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Treemap',
  'Treemap (custom colors)',
]

export function TreemapPage() {
  return (
    <ChartPage
      title="Treemap"
      description="Display hierarchical data as nested rectangles sized by value."
      overview={<TreemapMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={treemap}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
