import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import PieMdx from '../content/pie.mdx'
import { chartTypes, examples } from '../data/carboncharts/pie'
import { pie } from '../data/echarts/donut'

// Filter to test-tagged examples only
// Carbon test order: [0] Pie, [1] Pie (centered), [2] Pie (value maps to count)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Pie',
  'Pie (centered)',
  'Pie (value maps to count)',
]

export function PiePage() {
  return (
    <ChartPage
      title="Pie"
      description="Show part-to-whole relationships as proportional slices."
      overview={<PieMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={pie}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
