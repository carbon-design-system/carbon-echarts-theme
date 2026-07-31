import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import BoxplotMdx from '../content/boxplot.mdx'
import { chartTypes, examples } from '../data/carboncharts/boxplot'
import { boxplotVertical, boxplotHorizontal } from '../data/echarts/boxplot'

// Filter to test-tagged examples only
// Carbon test order: [0] Horizontal box plot, [1] Vertical box plot
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  boxplotHorizontal, // [0] Horizontal box plot
  boxplotVertical, // [1] Vertical box plot
]

const titles = ['Horizontal box plot', 'Vertical box plot']

const codeSamples = [
  `import { createBoxplotOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Q1', key: 'Dataset 1', value: 34 },
  { group: 'Q2', key: 'Dataset 1', value: 56 },
  // ... Q1–Q4 with min/q1/median/q3/max derived automatically
]

const option = createBoxplotOptions(data, { horizontal: true })`,

  `import { createBoxplotOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Q1', key: 'Dataset 1', value: 34 },
  // ...
]

const option = createBoxplotOptions(data)`,
]

export function BoxplotPage() {
  return (
    <ChartPage
      title="Boxplot"
      description="Display the statistical distribution of datasets across categories."
      overview={<BoxplotMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? boxplotVertical}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
