import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import TreemapMdx from '../content/treemap.mdx'
import { chartTypes, examples } from '../data/carboncharts/treemap'
import { treemap, treemapNested, flatData } from '../data/echarts/treemap'

// Filter to test-tagged examples only
// Carbon test order: [0] Treemap, [1] Treemap (Custom colors)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = ['Treemap', 'Treemap (nested / drill-down)']

const echartsOptions = [
  treemap, // [0] flat multi-group treemap — colors by parent group
  treemapNested, // [1] custom teal ramp colors per parent group
]

const codeSamples = [
  `import { createTreemapOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Oceania', key: 'A', value: 800 },
  { group: 'Oceania', key: 'B', value: 200 },
  // ... more rows (group = parent, key = leaf name)
  { group: 'Asia', key: 'China', value: 12500 },
  { group: 'Asia', key: 'Iran', value: 22500 },
]

const option = createTreemapOptions(data)`,

  `import { createTreemapOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Oceania', key: 'A', value: 800 },
  // ... more rows
]

// Custom per-group colors — matches Carbon Charts color.scale
const option = createTreemapOptions(data, {
  colors: {
    Oceania:   '#3ddbd9',
    Europe:    '#08bdba',
    America:   '#009d9a',
    Australia: '#007d79',
    Africa:    '#005d5d',
    Asia:      '#004144',
  },
})`,
]

const chartDataSamples = [
  flatData, // [0] Treemap
  flatData, // [1] Treemap (nested)
]

export function TreemapPage() {
  return (
    <ChartPage
      title="Treemap"
      description="Display hierarchical data as nested rectangles sized by value."
      overview={<TreemapMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? treemap}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={chartDataSamples[i]}
        />
      ))}
    />
  )
}
