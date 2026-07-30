import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import GaugeMdx from '../content/gauge.mdx'
import { chartTypes, examples } from '../data/carboncharts/gauge'
import { getGaugeOption, getGaugeFullOption } from '../data/echarts/gauge'
import { tokens } from '@carbon/echarts-theme'
import { useTheme } from '../components/ThemeContext'

// Filter to test-tagged examples only
// Carbon test order:
//  [0] Gauge semicircular -- danger status
//  [1] Gauge circular -- warning status
//  [2] Gauge circular without delta -- custom color
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Gauge (semicircular)',
  'Gauge (circular)',
  'Gauge (circular, custom color)',
]

export function GaugePage() {
  const { theme } = useTheme()
  const t = tokens[theme]
  const gaugeOption = getGaugeOption(t.textSecondary)
  const gaugeFullOption = getGaugeFullOption(t.textSecondary)

  const echartsOptions = [
    gaugeOption,     // [0] semicircular (semi type)
    gaugeFullOption, // [1] circular (full)
    gaugeOption,     // [2] circular, custom color
  ]

  return (
    <ChartPage
      title="Gauge"
      description="Display a single KPI value on a circular arc scale."
      overview={<GaugeMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? gaugeOption}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
