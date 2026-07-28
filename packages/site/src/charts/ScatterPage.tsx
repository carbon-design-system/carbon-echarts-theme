import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import ScatterMdx from '../content/scatter.mdx'
import { createScatterOptions } from '@carbon/echarts-theme/presets'
import { scatterData, bubbleData } from '../fixtures/scatter'
import { ScatterChart, BubbleChart } from '@carbon/charts-react'

const scatterOption = createScatterOptions(scatterData)

// Bubble: raw [x, y, size] triples → scatter with symbolSize fn
const bubbleOption = {
  tooltip: { trigger: 'item' as const },
  xAxis: { type: 'value' as const },
  yAxis: { type: 'value' as const },
  series: [
    {
      type: 'scatter' as const,
      name: 'Dataset 1',
      data: bubbleData,
      symbolSize: (d: number[]) => Math.sqrt(d[2]!) * 6,
    },
  ],
}

const echartsCode = `import { createScatterOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createScatterOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

const scatterAxes = { axes: { bottom: { mapsTo: 'key', scaleType: 'linear' }, left: { mapsTo: 'value' } } }

// Carbon Charts bubble data needs x/y/r shape — map our [x,y,size] triples
const carbonBubbleData = bubbleData.map(([x, y, r], i) => ({
  group: 'Dataset 1',
  x,
  y,
  r,
}))
const bubbleAxes = { axes: { bottom: { mapsTo: 'x', scaleType: 'linear' }, left: { mapsTo: 'y' }, radius: { mapsTo: 'r' } } }

export function ScatterPage() {
  return (
    <ChartPage
      title="Scatter & Bubble"
      description="Explore correlation between two continuous variables."
      overview={<ScatterMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(scatterOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Scatter"
            echartsOption={scatterOption}
            carbonChart={<ScatterChart data={scatterData as any} options={scatterAxes as any} />}
          />
          <SideBySide
            title="Bubble"
            echartsOption={bubbleOption}
            carbonChart={<BubbleChart data={carbonBubbleData as any} options={bubbleAxes as any} />}
          />
        </>
      }
    />
  )
}
