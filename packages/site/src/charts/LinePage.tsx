import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import LineMdx from '../content/line.mdx'
import { chartTypes, examples } from '../data/carboncharts/line'
import { lineDiscrete, lineTimeSeries, lineStep } from '../data/echarts/line'

// Filter to test-tagged examples only
// Carbon test order (14 test examples):
//  [0]  lineCustomDomainOptions (axes)
//  [1]  lineTimeSeriesRotatedTicksOptions (axes, time)
//  [2]  lineTimeSeriesFrenchLocale (axes, time, locale)
//  [3]  lineLogAxisOptions (axes)
//  [4]  lineCustomColorOptions (colors)
//  [5]  lineSelectedGroupsOptions (legend)
//  [6]  lineOptionsLegendOrientation (legend)
//  [7]  lineTimeSeriesWithThresholdsOptions (axes, time, thresholds)
//  [8]  lineLongLabelOptions (truncation)
//  [9]  lineOptions
//  [10] lineAlwaysRulerTooltipOptions
//  [11] lineTimeSeriesOptions (axes, time)
//  [12] lineTimeSeriesDenseOptions (axes, time)
//  [13] dualLine (axes, time, dual)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  lineDiscrete,    // [0] custom domain
  lineTimeSeries,  // [1] time series rotated ticks
  lineTimeSeries,  // [2] locale
  lineDiscrete,    // [3] log axis
  lineDiscrete,    // [4] custom colors
  lineDiscrete,    // [5] selected groups
  lineDiscrete,    // [6] legend orientation
  lineTimeSeries,  // [7] time series with thresholds
  lineDiscrete,    // [8] long labels / truncation
  lineDiscrete,    // [9] line (discrete)
  lineDiscrete,    // [10] always ruler tooltip
  lineTimeSeries,  // [11] time series
  lineTimeSeries,  // [12] time series dense
  lineTimeSeries,  // [13] dual line
]

const titles = [
  'Line (custom domain)',
  'Line (time series, rotated ticks)',
  'Line (time series, French locale)',
  'Line (log axis)',
  'Line (custom colors)',
  'Line (selected groups)',
  'Line (legend orientation)',
  'Line (time series, thresholds)',
  'Line (truncated labels)',
  'Line (discrete)',
  'Line (always show ruler tooltip)',
  'Line (time series)',
  'Line (time series, dense)',
  'Line (dual)',
]

export function LinePage() {
  return (
    <ChartPage
      title="Line"
      description="Display trends or changes over time."
      overview={<LineMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? lineDiscrete}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
