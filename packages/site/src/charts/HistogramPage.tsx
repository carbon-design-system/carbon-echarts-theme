import React from 'react'
import { ScaleTypes } from '@carbon/charts'
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

// Carbon Charts HistogramChart bins raw observations. Expand pre-binned counts into individual
// data points, using a unique offset per point so each lands in the correct bin.
const carbonHistogramData = histogramData.flatMap((d) => {
  const [lo, hi] = (d.key as string).split('–').map(Number)
  const step = (hi - lo) / (d.value + 1)
  return Array.from({ length: d.value }, (_, i) => ({
    group: 'Frequency',
    value: lo + step * (i + 1),
  }))
})

const carbonHistogramOptions = {
  axes: {
    bottom: {
      mapsTo: 'value',
      bins: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      limitDomainToBins: true,
    },
    left: {
      scaleType: ScaleTypes.LINEAR,
      stacked: true,
      binned: true,
    },
  },
}

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
            <HistogramChart
              data={carbonHistogramData as any}
              options={carbonHistogramOptions as any}
            />
          }
        />
      }
    />
  )
}
