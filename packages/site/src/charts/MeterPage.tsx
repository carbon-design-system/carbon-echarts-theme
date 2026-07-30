import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import MeterMdx from '../content/meter.mdx'
import { chartTypes, examples } from '../data/carboncharts/meter'
import { getMeterOption, getMeterPeakOption } from '../data/echarts/gauge'
import { tokens } from '@carbon/echarts-theme'
import { useTheme } from '../components/ThemeContext'

// Filter to test-tagged examples only
// Carbon test order (6 test examples):
//  [0] Meter Chart - with statuses
//  [1] Meter Chart - statuses and custom color
//  [2] Meter Chart - no status
//  [3] Proportional Meter Chart
//  [4] Proportional Meter Chart - peak and statuses
//  [5] Proportional Meter Chart (truncated)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Meter (with statuses)',
  'Meter (statuses and custom color)',
  'Meter (no status)',
  'Proportional meter',
  'Proportional meter (peak and statuses)',
  'Proportional meter (truncated)',
]

export function MeterPage() {
  const { theme } = useTheme()
  const t = tokens[theme]
  const meterOption = getMeterOption(t.textPrimary)
  const meterPeakOption = getMeterPeakOption(t.textPrimary)

  const echartsOptions = [
    meterOption,     // [0]
    meterOption,     // [1]
    meterOption,     // [2]
    meterOption,     // [3]
    meterPeakOption, // [4]
    meterOption,     // [5]
  ]

  return (
    <ChartPage
      title="Meter"
      description="Display progress toward a total on a linear scale."
      overview={<MeterMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? meterOption}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
