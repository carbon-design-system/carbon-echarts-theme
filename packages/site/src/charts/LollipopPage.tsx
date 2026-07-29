import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import LollipopMdx from '../content/lollipop.mdx'
import { createLollipopOptions, createSparklineOptions } from '@carbon/echarts-theme/presets'
import { lollipopData, sparklineData } from '../fixtures/lollipop'
import { LollipopChart } from '@carbon/charts-react'

const lollipopOption = createLollipopOptions(lollipopData)
const sparklineOption = createSparklineOptions(sparklineData)

const echartsCode = `import { createLollipopOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createLollipopOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

const lollipopAxes = {
  axes: { bottom: { mapsTo: 'key', scaleType: 'labels' }, left: { mapsTo: 'value' } },
}

export function LollipopPage() {
  return (
    <ChartPage
      title="Lollipop & Sparkline"
      description="Lollipop charts reduce bar-chart clutter. Sparklines are inline trend indicators."
      overview={<LollipopMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(lollipopOption, null, 2)}
      examples={
        <>
          <SideBySide
            title="Lollipop"
            echartsOption={lollipopOption}
            carbonChart={<LollipopChart data={lollipopData as any} options={lollipopAxes as any} />}
          />
          <SideBySide title="Sparkline" echartsOption={sparklineOption} />
        </>
      }
    />
  )
}
