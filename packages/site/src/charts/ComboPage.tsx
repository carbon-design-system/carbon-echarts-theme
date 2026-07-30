import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import ComboMdx from '../content/combo.mdx'
import { chartTypes, examples } from '../data/carboncharts/combo'
import { comboBarLine, comboGroupedLine } from '../data/echarts/combo'

// Filter to test-tagged examples only
// Carbon test order (11 test examples):
//  [0]  comboSimpleOptions          → bar + line
//  [1]  comboAlwaysRulerTooltipOptions → bar + line
//  [2]  comboStackedOptions         → stacked bar + line
//  [3]  comboGroupedOptions         → grouped bar + line
//  [4]  comboSimpleFloatingOptions  → floating bar + line
//  [5]  comboGroupedHorizontalOptions → grouped horizontal
//  [6]  comboHorizontalOptions      → horizontal bar + line
//  [7]  comboAreaLineOptions        → area + line
//  [8]  comboStackedAreaLineOptions → stacked area + line
//  [9]  comboLineScatterOptions     → line + scatter
//  [10] comboAreaLineTimeSeriesOptions → area + line time series
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  comboBarLine,     // [0]
  comboBarLine,     // [1] tooltip variant
  comboBarLine,     // [2] stacked
  comboGroupedLine, // [3] grouped
  comboBarLine,     // [4] floating
  comboGroupedLine, // [5] horizontal grouped
  comboBarLine,     // [6] horizontal
  comboBarLine,     // [7] area + line
  comboBarLine,     // [8] stacked area + line
  comboBarLine,     // [9] line + scatter
  comboBarLine,     // [10] area + line time series
]

const titles = [
  'Combo (bar + line)',
  'Combo (always show ruler tooltip)',
  'Combo (stacked bar + line)',
  'Combo (grouped bar + line)',
  'Combo (floating bar + line)',
  'Combo (grouped horizontal)',
  'Combo (horizontal bar + line)',
  'Combo (area + line)',
  'Combo (stacked area + line)',
  'Combo (line + scatter)',
  'Combo (area + line, time series)',
]

export function ComboPage() {
  return (
    <ChartPage
      title="Combo"
      description="Combine bar and line series in the same chart area."
      overview={<ComboMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? comboBarLine}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
