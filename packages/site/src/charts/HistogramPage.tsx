import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import HistogramMdx from '../content/histogram.mdx'
import { chartTypes, examples } from '../data/carboncharts/histogram'
import {
  histogram,
  histogramTooltip,
  histogramCustomBin,
  histogramCustomBinWidth,
} from '../data/echarts/histogram'

// Filter to test-tagged examples only
// Carbon test order (4 test examples):
//  [0] Histogram (linear)                       → age data, binWidth 5
//  [1] Histogram (tooltip.alwaysShowRulerTooltip=true) → age data, binWidth 5
//  [2] Histogram (defined bins number, linear)  → US$ data, binWidth 10
//  [3] Histogram (defined bins)                 → age data, binWidth 20
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  histogram, // [0] linear
  histogramTooltip, // [1] always show ruler tooltip (same binning)
  histogramCustomBin, // [2] US$ dataset
  histogramCustomBinWidth, // [3] age data, wider bins
]

const titles = [
  'Histogram (linear)',
  'Histogram (always show ruler tooltip)',
  'Histogram (defined bins number)',
  'Histogram (defined bins width)',
]

const codeSamples = [
  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

// Age dataset — each entry is a single numeric observation value
const data = [
  { group: 'Dataset 1', value: 20 },
  { group: 'Dataset 2', value: 21 },
  // ...
]

const option = createHistogramOptions(data, {
  binWidth: 5,
  xAxisLabel: 'Age',
  yAxisLabel: 'No. of participants',
})`,

  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

const data = [{ group: 'Dataset 1', value: 20 }, /* ... */]

const option = createHistogramOptions(data, {
  binWidth: 5,
  xAxisLabel: 'Age',
  yAxisLabel: 'No. of participants',
})
// Note: Carbon Charts alwaysShowRulerTooltip — ECharts tooltip on hover only`,

  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

// US$ millions dataset
const data = [
  { group: 'Dataset 1', value: 200 },
  // ...
]

const option = createHistogramOptions(data, {
  binWidth: 10,
  xAxisLabel: 'US $ (million)',
  yAxisLabel: 'No. of transactions',
})`,

  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

const data = [{ group: 'Dataset 1', value: 20 }, /* ... */]

const option = createHistogramOptions(data, {
  binWidth: 20,
  xAxisLabel: 'Age',
  yAxisLabel: 'No. of participants',
})`,
]

export function HistogramPage() {
  return (
    <ChartPage
      title="Histogram"
      description="Display the frequency distribution of a continuous variable."
      overview={<HistogramMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? histogram}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
