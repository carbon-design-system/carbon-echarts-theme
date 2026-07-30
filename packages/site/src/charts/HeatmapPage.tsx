import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import HeatmapMdx from '../content/heatmap.mdx'
import { chartTypes, examples } from '../data/carboncharts/heatmap'
import { heatmap } from '../data/echarts/heatmap'

// Filter to test-tagged examples only
// Carbon test order (6 test examples):
//  [0] Heatmap (basic)
//  [1] Heatmap (quantize legend)
//  [2] Heatmap (quantile legend)
//  [3] Heatmap (linear legend)
//  [4] Heatmap (always ruler tooltip)
//  [5] Heatmap (missing data)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Heatmap',
  'Heatmap (quantize legend)',
  'Heatmap (quantile legend)',
  'Heatmap (linear legend)',
  'Heatmap (always show ruler tooltip)',
  'Heatmap (missing data)',
]

export function HeatmapPage() {
  return (
    <ChartPage
      title="Heatmap"
      description="Encode values as color intensity across a two-dimensional grid."
      overview={<HeatmapMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={heatmap}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
