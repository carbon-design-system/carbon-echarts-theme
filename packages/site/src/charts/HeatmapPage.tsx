import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import HeatmapMdx from '../content/heatmap.mdx'
import { createHeatmapOptions } from '@carbon/echarts-theme/presets'
import { heatmapData, heatmapXLabels, heatmapYLabels } from '../fixtures/heatmap'
import { HeatmapChart } from '@carbon/charts-react'

// createHeatmapOptions expects ChartTabularData (group=y, key=x, value)
const heatmapTabular = heatmapData.map(([xi, yi, v]) => ({
  group: heatmapYLabels[yi] ?? String(yi),
  key: heatmapXLabels[xi] ?? String(xi),
  value: v,
}))

const heatmapOption = createHeatmapOptions(heatmapTabular)

const echartsCode = `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// data: { group (y-axis), key (x-axis), value }[]
const option = createHeatmapOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

const carbonHeatmapData = heatmapData.map(([xi, yi, v]) => ({
  day: heatmapXLabels[xi],
  time: heatmapYLabels[yi],
  value: v,
}))
const heatmapAxes = {
  axes: {
    bottom: { title: 'Day', mapsTo: 'day', scaleType: 'labels' },
    left: { title: 'Time', mapsTo: 'time', scaleType: 'labels' },
  },
  heatmap: { colorLegend: { title: 'Count' } },
}

export function HeatmapPage() {
  return (
    <ChartPage
      title="Heatmap"
      description="Encode values as color intensity across a two-dimensional grid."
      overview={<HeatmapMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(heatmapOption, null, 2)}
      examples={
        <SideBySide
          title="Heatmap"
          echartsOption={heatmapOption}
          carbonChart={
            <HeatmapChart data={carbonHeatmapData as any} options={heatmapAxes as any} />
          }
        />
      }
    />
  )
}
