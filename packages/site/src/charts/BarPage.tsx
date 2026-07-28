import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import BarMdx from '../content/bar.mdx'
import {
  createBarOptions,
  createGroupedBarOptions,
  createStackedBarOptions,
  createHorizontalBarOptions,
} from '@carbon/echarts-theme/presets'
import { barData, groupedBarData } from '../fixtures/bar'
import {
  SimpleBarChart,
  GroupedBarChart,
  StackedBarChart,
} from '@carbon/charts-react'
import '@carbon/charts-react/styles.css'

const simpleOption = createBarOptions(barData)
const groupedOption = createGroupedBarOptions(groupedBarData)
const stackedOption = createStackedBarOptions(groupedBarData)
const horizontalOption = createHorizontalBarOptions(barData)

const echartsCode = `import { createBarOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createBarOptions([
  { group: 'Dataset 1', value: 65000 },
  { group: 'Dataset 2', value: 29123 },
])

<ReactECharts option={option} theme="carbon-white" />`

const carbonCode = `import { SimpleBarChart } from '@carbon/charts-react'
import '@carbon/charts-react/styles.css'

<SimpleBarChart
  data={[
    { group: 'Dataset 1', value: 65000 },
    { group: 'Dataset 2', value: 29123 },
  ]}
  options={{ axes: { bottom: { mapsTo: 'group', scaleType: 'labels' }, left: { mapsTo: 'value' } } }}
/>`

const simpleBarAxes = { axes: { bottom: { mapsTo: 'group', scaleType: 'labels' }, left: { mapsTo: 'value' } } }
const groupedBarAxes = { axes: { bottom: { mapsTo: 'key', scaleType: 'labels' }, left: { mapsTo: 'value' }, color: { scale: { 'Qty': '#6929c4', 'More': '#1192e8' } } } }

export function BarPage() {
  return (
    <ChartPage
      title="Bar chart"
      description="Compare values across discrete categories."
      overview={<BarMdx />}
      echartsCode={echartsCode}
      carbonCode={carbonCode}
      optionsJson={JSON.stringify(simpleOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Simple bar"
            echartsOption={simpleOption}
            carbonChart={<SimpleBarChart data={barData as any} options={simpleBarAxes as any} />}
          />
          <SideBySide
            title="Grouped bar"
            echartsOption={groupedOption}
            carbonChart={<GroupedBarChart data={groupedBarData as any} options={groupedBarAxes as any} />}
          />
          <SideBySide
            title="Stacked bar"
            echartsOption={stackedOption}
            carbonChart={<StackedBarChart data={groupedBarData as any} options={groupedBarAxes as any} />}
          />
          <SideBySide title="Horizontal bar" echartsOption={horizontalOption} />
        </>
      }
    />
  )
}
