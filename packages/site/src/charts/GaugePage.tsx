import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import GaugeMdx from '../content/gauge.mdx'
import { createGaugeOptions, createMeterOptions } from '@carbon/echarts-theme/presets'
import { gaugeValue, meterValue } from '../fixtures/gauge'
import { GaugeChart, MeterChart } from '@carbon/charts-react'

const gaugeOption = createGaugeOptions(
  [{ group: 'Utilization', value: gaugeValue }],
  { unit: '%' },
)

const meterOption = createMeterOptions(
  [{ group: 'Storage used', value: meterValue }],
  { total: 100 },
)

const echartsCode = `import { createGaugeOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createGaugeOptions(
  [{ group: 'CPU', value: 72.5 }],
  { unit: '%' }
)

<ReactECharts option={option} theme="carbon-white" />`

const carbonGaugeData = [{ group: 'Utilization', value: gaugeValue }]
const carbonMeterData = [{ group: 'Storage used', value: meterValue }, { group: 'Remaining', value: 100 - meterValue }]

export function GaugePage() {
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
            carbonChart={<GaugeChart data={carbonGaugeData as any} options={{ gauge: { type: 'semi' } } as any} />}
          />
          <SideBySide
            title="Meter"
            echartsOption={meterOption}
            carbonChart={<MeterChart data={carbonMeterData as any} options={{ meter: { peak: 100 } } as any} />}
          />
        </>
      }
    />
  )
}
