import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import ScatterMdx from '../content/scatter.mdx'
import { chartTypes, examples } from '../data/carboncharts/scatter'
import { scatterLinear, scatterDiscrete } from '../data/echarts/scatter'

// Filter to test-tagged examples only
// Carbon test order (5 test examples):
//  [0] Scatter (linear x & y)
//  [1] Scatter (discrete)
//  [2] Scatter (time series)
//  [3] Scatter (empty state)
//  [4] Scatter (skeleton)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  scatterLinear,   // [0] linear
  scatterDiscrete, // [1] discrete
  scatterLinear,   // [2] time series
  scatterLinear,   // [3] empty state → show live echarts
  scatterDiscrete, // [4] skeleton → show live echarts
]

const titles = [
  'Scatter (linear x & y)',
  'Scatter (discrete)',
  'Scatter (time series)',
  'Scatter (empty state)',
  'Scatter (standard)',
]

export function ScatterPage() {
  return (
    <ChartPage
      title="Scatter"
      description="Explore correlation between two continuous variables."
      overview={<ScatterMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? scatterLinear}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
