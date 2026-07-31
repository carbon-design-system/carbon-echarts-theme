import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
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
//  [0] Histogram (linear)                       → age data, binWidth 10
//  [1] Histogram (tooltip.alwaysShowRulerTooltip=true) → age data, binWidth 10
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

// Age dataset — each entry is a single numeric value
const data = [
  { group: 'Dataset 1', value: 32 },
  { group: 'Dataset 1', value: 32 },
  // ... (multiple rows per bin)
]

const option = createHistogramOptions(data, { binWidth: 10 })`,

  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

const data = [{ group: 'Dataset 1', value: 32 }, /* ... */]

const option = createHistogramOptions(data, { binWidth: 10 })
// Note: Carbon Charts alwaysShowRulerTooltip — ECharts tooltip on hover only`,

  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

// US$ millions dataset
const data = [
  { group: 'Dataset 1', value: 100 },
  // ...
]

const option = createHistogramOptions(data, { binWidth: 10 })`,

  `import { createHistogramOptions } from '@carbon/echarts-theme/presets'

const data = [{ group: 'Dataset 1', value: 32 }, /* ... */]

// Wider bins — equivalent to Carbon Charts bins width parameter
const option = createHistogramOptions(data, { binWidth: 20 })`,
]

export function HistogramPage() {
  return (
    <ChartPage
      title="Histogram"
      description="Display the frequency distribution of a continuous variable."
      overview={<HistogramMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
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
