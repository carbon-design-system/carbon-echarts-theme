import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import HistogramMdx from '../content/histogram.mdx'
import { createHistogramOptions } from '@carbon/echarts-theme/presets'
import { histogramData } from '../fixtures/histogram'
import { HistogramChart } from '@carbon/charts-react'

const histogramOption = createHistogramOptions(histogramData)

const echartsCode = `import { createHistogramOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// data: { group, key (bin label), value (count) }[]
const option = createHistogramOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

// Carbon Charts HistogramChart expects raw { group, value } observations — it bins automatically
const carbonHistogramData = histogramData.flatMap((d) =>
  Array.from({ length: d.value }, () => ({ group: 'Frequency', value: parseInt(d.key as string) })),
)

export function HistogramPage() {
  return (
    <ChartPage
      title="Histogram"
      description="Display the frequency distribution of a continuous variable."
      overview={<HistogramMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(histogramOption, null, 2)}
      examples={
        <SideBySide
          title="Histogram"
          echartsOption={histogramOption}
          carbonChart={
            <HistogramChart data={carbonHistogramData as any} options={{ bins: 9 } as any} />
          }
        />
      }
    />
  )
}
