import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import DonutMdx from '../content/donut.mdx'
import { chartTypes, examples } from '../data/carboncharts/donut'
import { donut } from '../data/echarts/donut'

// Filter to test-tagged examples only
// Carbon test order: [0] Donut, [1] Donut (centered), [2] Donut (value maps to count)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Donut',
  'Donut (centered)',
  'Donut (value maps to count)',
]

export function DonutPage() {
  return (
    <ChartPage
      title="Donut"
      description="Show part-to-whole relationships with a center cutout."
      overview={<DonutMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={donut}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
