import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import HistogramMdx from '../content/histogram.mdx'
import { chartTypes, examples } from '../data/carboncharts/histogram'
import { histogram } from '../data/echarts/histogram'

// Filter to test-tagged examples only
// Carbon test order (4 test examples):
//  [0] Histogram (linear)
//  [1] Histogram (tooltip.alwaysShowRulerTooltip=true)
//  [2] Histogram (defined bins number, linear)
//  [3] Histogram (defined bins width)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Histogram (linear)',
  'Histogram (always show ruler tooltip)',
  'Histogram (defined bins number)',
  'Histogram (defined bins width)',
]

export function HistogramPage() {
  return (
    <ChartPage
      title="Histogram"
      description="Display the frequency distribution of a continuous variable."
      overview={<HistogramMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={histogram}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
