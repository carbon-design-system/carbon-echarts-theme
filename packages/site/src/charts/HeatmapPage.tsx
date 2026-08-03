import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import HeatmapMdx from '../content/heatmap.mdx'
import { chartTypes, examples } from '../data/carboncharts/heatmap'
import {
  heatmap,
  heatmapCustomColorRange,
  heatmapDivergent,
  heatmapMissingData,
  heatmapCustomColorDomain,
} from '../data/echarts/heatmap'

// Filter to test-tagged examples only
// Carbon test order (6 test examples):
//  [0] Heatmap (basic)
//  [1] Heatmap (quantize legend)
//  [2] Heatmap (positive/negative divergent)
//  [3] Heatmap (missing data)
//  [4] Heatmap (custom color domain)
//  [5] Heatmap (axis order option)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  heatmap, // [0] basic heatmap
  heatmapCustomColorRange, // [1] custom teal color range (quantize legend)
  heatmapDivergent, // [2] divergent — positive/negative data + diverging colors
  heatmapMissingData, // [3] missing data — sparse grid with null cells
  heatmapCustomColorDomain, // [4] custom color domain (0–150)
  heatmap, // [5] axis order option (same data, order is insertion-based)
]

const titles = [
  'Heatmap',
  'Heatmap (custom color range)',
  'Heatmap (divergent)',
  'Heatmap (missing data)',
  'Heatmap (custom color domain)',
  'Heatmap (axis order)',
]

const codeSamples = [
  `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'

// group = y-axis (month), key = x-axis (letter), value = cell value
const data = [
  { group: 'January', key: 'A', value: 41 },
  { group: 'January', key: 'B', value: 7  },
  // ... 10 letters × 12 months
]

const option = createHeatmapOptions(data, {
  xAxisLabel: 'Letters',
  yAxisLabel: 'Months',
})`,

  `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'
import { sequentialTeal } from '@carbon/echarts-theme'

const data = [/* same 10×12 grid */]

const option = createHeatmapOptions(data, {
  xAxisLabel: 'Letters',
  yAxisLabel: 'Months',
  colorRange: [sequentialTeal[0], sequentialTeal[sequentialTeal.length - 1]],
})`,

  `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'
import { divergingRedCyan } from '@carbon/echarts-theme'

// Positive and negative values — symmetric around 0
const data = [
  { group: 'January', key: 'A', value: -4.1 },
  { group: 'January', key: 'B', value: 0.7  },
  // ...
]

const option = createHeatmapOptions(data, {
  xAxisLabel: 'Letters',
  yAxisLabel: 'Months',
  diverging: true,
  divergingColors: [divergingRedCyan[2], divergingRedCyan[14]],
})`,

  `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'

// Null cells render as empty (no color) — matches Carbon Charts missing data behavior
const data = [
  { group: 'January', key: 'A', value: 41 },
  { group: 'January', key: 'B', value: null }, // missing cell
  // ...
]

const option = createHeatmapOptions(data)`,

  `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'
import { sequentialTeal } from '@carbon/echarts-theme'

const data = [/* same data */]

// colorDomainMin/Max extends the scale beyond data range (like Carbon colorDomain)
const option = createHeatmapOptions(data, {
  colorRange: [sequentialTeal[0], sequentialTeal[sequentialTeal.length - 1]],
  colorDomainMin: 0,
  colorDomainMax: 150,
})`,

  `import { createHeatmapOptions } from '@carbon/echarts-theme/presets'

const data = [/* same data */]

const option = createHeatmapOptions(data, {
  xAxisLabel: 'Letters',
  yAxisLabel: 'Months',
})
// Note: axis order enforced by insertion order of unique group values`,
]

export function HeatmapPage() {
  return (
    <ChartPage
      title="Heatmap"
      description="Encode values as color intensity across a two-dimensional grid."
      overview={<HeatmapMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? heatmap}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
