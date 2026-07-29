import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import AreaMdx from '../content/area.mdx'
import { createAreaOptions, createStackedAreaOptions } from '@carbon/echarts-theme/presets'
import { areaData } from '../fixtures/area'
import { AreaChart, StackedAreaChart } from '@carbon/charts-react'

const areaOption = createAreaOptions(areaData)
const stackedOption = createStackedAreaOptions(areaData)

const echartsCode = `import { createAreaOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createAreaOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

const areaAxes = {
  axes: { bottom: { mapsTo: 'key', scaleType: 'labels' }, left: { mapsTo: 'value' } },
}

const stackedAreaAxes = {
  axes: {
    bottom: { mapsTo: 'key', scaleType: 'labels' },
    left: { mapsTo: 'value', stacked: true },
  },
}

export function AreaPage() {
  return (
    <ChartPage
      title="Area chart"
      description="Show volume or cumulative totals over time."
      overview={<AreaMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(areaOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Simple area"
            echartsOption={areaOption}
            carbonChart={<AreaChart data={areaData as any} options={areaAxes as any} />}
          />
          <SideBySide
            title="Stacked area"
            echartsOption={stackedOption}
            carbonChart={
              <StackedAreaChart data={areaData as any} options={stackedAreaAxes as any} />
            }
          />
        </>
      }
    />
  )
}
