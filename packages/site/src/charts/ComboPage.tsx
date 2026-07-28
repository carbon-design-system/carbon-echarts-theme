import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import ComboMdx from '../content/combo.mdx'
import { createComboOptions } from '@carbon/echarts-theme/presets'
import { comboData } from '../fixtures/combo'
import { ComboChart } from '@carbon/charts-react'

const comboOption = createComboOptions(comboData, {
  lineGroups: ['Profit'],
})

const echartsCode = `import { createComboOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createComboOptions(data, {
  lineGroups: ['Profit'], // these groups render as lines, rest as bars
})

<ReactECharts option={option} theme="carbon-white" />`

const comboAxes = {
  axes: {
    bottom: { mapsTo: 'key', scaleType: 'labels' },
    left: { mapsTo: 'value', correspondingDatasets: ['Revenue'] },
    right: { mapsTo: 'value', correspondingDatasets: ['Profit'] },
  },
  comboChartTypes: [
    { type: 'simple-bar', correspondingDatasets: ['Revenue'], options: {} },
    { type: 'line', correspondingDatasets: ['Profit'], options: {} },
  ],
}

export function ComboPage() {
  return (
    <ChartPage
      title="Combo"
      description="Combine bar and line series in the same chart area."
      overview={<ComboMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(comboOption, null, 2)}
      examples={
        <SideBySide
          title="Bar + Line combo"
          echartsOption={comboOption}
          carbonChart={<ComboChart data={comboData as any} options={comboAxes as any} />}
        />
      }
    />
  )
}
