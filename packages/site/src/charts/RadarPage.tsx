import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import RadarMdx from '../content/radar.mdx'
import { chartTypes, examples } from '../data/carboncharts/radar'
import { radar } from '../data/echarts/radar'

// Filter to test-tagged examples only
// Carbon test order (5 test examples):
//  [0] Radar
//  [1] Radar (centered)
//  [2] Radar - Missing datapoints
//  [3] Radar - Dense
//  [4] Radar - Custom Max Score (100)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Radar',
  'Radar (centered)',
  'Radar (missing datapoints)',
  'Radar (dense)',
  'Radar (custom max score)',
]

export function RadarPage() {
  return (
    <ChartPage
      title="Radar"
      description="Compare multiple variables across categories on a radial axis."
      overview={<RadarMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={radar}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
