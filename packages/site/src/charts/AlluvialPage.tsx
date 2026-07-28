import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import AlluvialMdx from '../content/alluvial.mdx'
import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import { alluvialData } from '../fixtures/alluvial'
import { AlluvialChart } from '@carbon/charts-react'

const alluvialOption = createAlluvialOptions(alluvialData)

const echartsCode = `import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createAlluvialOptions([
  { source: 'A', target: 'B', value: 100 },
  { source: 'A', target: 'C', value: 50 },
])

<ReactECharts option={option} theme="carbon-white" />`

export function AlluvialPage() {
  return (
    <ChartPage
      title="Alluvial & Sankey"
      description="Visualize flows and redistribution between nodes."
      overview={<AlluvialMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(alluvialOption, null, 2)}
      examples={
        <SideBySide
          title="Alluvial / Sankey"
          echartsOption={alluvialOption}
          carbonChart={<AlluvialChart data={alluvialData as any} options={{} as any} />}
        />
      }
    />
  )
}
