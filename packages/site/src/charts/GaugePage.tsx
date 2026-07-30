import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import GaugeMdx from '../content/gauge.mdx'
import { createGaugeOptions, createMeterOptions } from '@carbon/echarts-theme/presets'
import { tokens, IBM_PLEX_FONT_FAMILY } from '@carbon/echarts-theme'
import { gaugeValue, meterValue, meterMax } from '../fixtures/gauge'
import { GaugeChart, MeterChart } from '@carbon/charts-react'
import { useTheme } from '../components/ThemeContext'

const echartsCode = `import { createGaugeOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createGaugeOptions(
  [{ group: 'CPU', value: 72.5 }],
  { unit: '%' }
)

<ReactECharts option={option} theme="carbon-white" />`

// Carbon Charts GaugeChart requires group:'value' (and optionally group:'delta')
const carbonGaugeData = [{ group: 'value', value: gaugeValue }]
// Carbon Charts MeterChart (non-proportional) uses a single data point
const carbonMeterData = [{ group: 'Storage used', value: meterValue }]

export function GaugePage() {
  const { theme } = useTheme()
  const t = tokens[theme]

  const gaugeOption = createGaugeOptions([{ group: 'Utilization', value: gaugeValue }], {
    unit: '%',
    type: 'semi',
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: t.textSecondary,
  })

  const meterOption = createMeterOptions([{ group: 'Storage used', value: meterValue }], {
    total: meterMax,
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: t.textPrimary,
  })

  return (
    <ChartPage
      title="Gauge & Meter"
      description="Display a single KPI value on a circular or linear scale."
      overview={<GaugeMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(gaugeOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Gauge"
            echartsOption={gaugeOption}
            carbonChart={
              <GaugeChart
                data={carbonGaugeData as any}
                options={{ gauge: { type: 'semi' }, height: '250px', resizable: true } as any}
              />
            }
          />
          <SideBySide
            title="Meter"
            echartsOption={meterOption}
            carbonChart={
              <MeterChart
                data={carbonMeterData as any}
                options={{ meter: { peak: 100 }, height: '100px', resizable: true } as any}
              />
            }
          />
        </>
      }
    />
  )
}
