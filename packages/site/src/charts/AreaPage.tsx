import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import AreaMdx from '../content/area.mdx'
import { chartTypes, examples } from '../data/carboncharts/area'
import {
  areaTimeSeries,
  areaSparkline,
  areaDiscrete,
  areaStacked,
} from '../data/echarts/area'

// Filter to test-tagged examples only
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

// ECharts equivalents paired by test example index
// Carbon test order: [0] optionsAlwaysRulerTooltip, [1] optionsSpark, [2] optionsDiscrete,
// [3] optionsCurved, [4] optionsMultipleBounded, [5] optionsZoomBar, [6] optionsSkeleton
const echartsOptions = [
  areaTimeSeries,    // [0] Time series area
  areaSparkline,     // [1] Sparkline area
  areaDiscrete,      // [2] Discrete domain area
  areaTimeSeries,    // [3] Natural curve area
  areaStacked,       // [4] Bounded highlights area
  areaStacked,       // [5] Zoombar area
  areaTimeSeries,    // [6] Skeleton (show live echarts equivalent)
]

const titles = [
  'Time series area',
  'Sparkline area',
  'Discrete domain area',
  'Natural curve area',
  'Stacked area',
  'Area with zoombar',
  'Area (standard)',
]

export function AreaPage() {
  return (
    <ChartPage
      title="Area"
      description="Show volume or cumulative totals over time."
      overview={<AreaMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? areaTimeSeries}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
