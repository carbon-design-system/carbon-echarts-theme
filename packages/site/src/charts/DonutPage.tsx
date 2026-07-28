import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import DonutMdx from '../content/donut.mdx'
import { createDonutOptions, createPieOptions } from '@carbon/echarts-theme/presets'
import { donutData } from '../fixtures/donut'
import { DonutChart, PieChart } from '@carbon/charts-react'

const donutOption = createDonutOptions(donutData)
const pieOption = createPieOptions(donutData)

const echartsCode = `import { createDonutOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createDonutOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

const pieAxes = { pie: { alignment: 'center' } }

export function DonutPage() {
  return (
    <ChartPage
      title="Donut & Pie"
      description="Show part-to-whole relationships."
      overview={<DonutMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(donutOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Donut"
            echartsOption={donutOption}
            carbonChart={<DonutChart data={donutData as any} options={pieAxes as any} />}
          />
          <SideBySide
            title="Pie"
            echartsOption={pieOption}
            carbonChart={<PieChart data={donutData as any} options={pieAxes as any} />}
          />
        </>
      }
    />
  )
}
