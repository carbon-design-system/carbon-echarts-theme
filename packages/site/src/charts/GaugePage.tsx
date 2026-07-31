import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import GaugeMdx from '../content/gauge.mdx'
import { chartTypes, examples } from '../data/carboncharts/gauge'
import { gaugeDanger, gaugeWarningFull, gaugeCustomColor } from '../data/echarts/gauge'
import { tokens } from '@carbon/echarts-theme'
import { useTheme } from '../components/ThemeContext'

// Filter to test-tagged examples only
// Carbon test order:
//  [0] Gauge semicircular -- danger status
//  [1] Gauge circular -- warning status
//  [2] Gauge circular without delta -- custom color
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = ['Gauge (semicircular)', 'Gauge (circular)', 'Gauge (circular, custom color)']

const codeSamples = [
  `import { createGaugeOptions } from '@carbon/echarts-theme/presets'

const option = createGaugeOptions(
  [{ group: 'value', value: 42 }],
  { unit: '%', type: 'semi', status: 'danger' },
)`,

  `import { createGaugeOptions } from '@carbon/echarts-theme/presets'

const option = createGaugeOptions(
  [{ group: 'value', value: 42 }],
  { unit: '%', type: 'full', status: 'warning' },
)`,

  `import { createGaugeOptions } from '@carbon/echarts-theme/presets'

const option = createGaugeOptions(
  [{ group: 'value', value: 67 }],
  { unit: '%', type: 'full', customColor: '#FFE5B4' },
)`,
]

export function GaugePage() {
  const { theme } = useTheme()
  const t = tokens[theme]
  const echartsOptions = [
    gaugeDanger(t.textSecondary), // [0] semicircular (semi type) with danger status
    gaugeWarningFull(t.textSecondary), // [1] circular (full) with warning status
    gaugeCustomColor(t.textSecondary), // [2] circular with custom color
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
          echartsOption={echartsOptions[i]}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
