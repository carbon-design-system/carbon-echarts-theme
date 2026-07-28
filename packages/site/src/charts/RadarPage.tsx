import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import RadarMdx from '../content/radar.mdx'
import { createRadarOptions } from '@carbon/echarts-theme/presets'
import { radarIndicators, radarData } from '../fixtures/radar'
import { RadarChart } from '@carbon/charts-react'

const radarOption = createRadarOptions(
  radarData.flatMap((s) =>
    s.values.map((v, i) => ({
      group: s.name,
      key: radarIndicators[i]?.name ?? String(i),
      value: v,
    })),
  ),
  { indicators: radarIndicators },
)

const echartsCode = `import { createRadarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createRadarOptions(data, {
  indicators: [
    { name: 'Sales', max: 100 },
    { name: 'Marketing', max: 100 },
  ]
})

<ReactECharts option={option} theme="carbon-white" />`

// Carbon Charts RadarChart expects flat { group, key, value } rows
const carbonRadarData = radarData.flatMap(s =>
  s.values.map((v, i) => ({ group: s.name, key: radarIndicators[i]?.name ?? String(i), value: v }))
)
const radarAxes = { radar: { axes: { angle: 'key', value: 'value' } } }

export function RadarPage() {
  return (
    <ChartPage
      title="Radar"
      description="Compare profiles across multiple quantitative dimensions."
      overview={<RadarMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(radarOption, null, 2)}
      examples={
        <SideBySide
          title="Radar"
          echartsOption={radarOption}
          carbonChart={<RadarChart data={carbonRadarData as any} options={radarAxes as any} />}
        />
      }
    />
  )
}
