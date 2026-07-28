import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import LineMdx from '../content/line.mdx'
import { createLineOptions } from '@carbon/echarts-theme/presets'
import { lineData } from '../fixtures/line'
import { LineChart } from '@carbon/charts-react'

const lineOption = createLineOptions(lineData)
const stepOption = createLineOptions(lineData, { step: 'start' })

const echartsCode = `import { createLineOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createLineOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

const lineAxes = { axes: { bottom: { mapsTo: 'key', scaleType: 'labels' }, left: { mapsTo: 'value' } } }

export function LinePage() {
  return (
    <ChartPage
      title="Line chart"
      description="Display trends or changes over time."
      overview={<LineMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(lineOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Discrete line"
            echartsOption={lineOption}
            carbonChart={<LineChart data={lineData as any} options={lineAxes as any} />}
          />
          <SideBySide title="Step line" echartsOption={stepOption} />
        </>
      }
    />
  )
}
