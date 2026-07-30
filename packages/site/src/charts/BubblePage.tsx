import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import BubbleMdx from '../content/bubble.mdx'
import { chartTypes, examples } from '../data/carboncharts/bubble'
import { bubbleLinear, bubbleDiscrete } from '../data/echarts/bubble'

// Filter to test-tagged examples only
// Carbon test order:
//  [0] Bubble (linear)
//  [1] No. of employees / Annual sales
//  [2] Bubble (tooltip.alwaysShowRulerTooltip=true)
//  [3] 2023 Annual Sales Figures
//  [4] Bubble (discrete)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  bubbleLinear,   // [0] linear
  bubbleLinear,   // [1] linear variant
  bubbleLinear,   // [2] tooltip variant
  bubbleLinear,   // [3] time series
  bubbleDiscrete, // [4] discrete
]

const titles = [
  'Bubble (linear)',
  'Bubble (linear — employees vs sales)',
  'Bubble (always show ruler tooltip)',
  'Bubble (2023 annual sales)',
  'Bubble (discrete)',
]

export function BubblePage() {
  return (
    <ChartPage
      title="Bubble"
      description="Show three-dimensional relationships using x, y position and circle size."
      overview={<BubbleMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? bubbleLinear}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
