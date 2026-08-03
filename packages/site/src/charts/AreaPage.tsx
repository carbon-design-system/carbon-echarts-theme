import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import AreaMdx from '../content/area.mdx'
import { chartTypes, examples } from '../data/carboncharts/area'
import {
  areaTimeSeries,
  areaAlwaysRuler,
  areaSparkline,
  areaDiscrete,
  areaNaturalCurve,
  areaBounded,
  areaZoombar,
  areaSkeleton,
} from '../data/echarts/area'

// Filter to test-tagged examples only
// Carbon test order (8 test examples):
//  [0] options                (time series area)
//  [1] optionsAlwaysRulerTooltip
//  [2] optionsSpark           (sparkline)
//  [3] optionsDiscrete        (discrete domain)
//  [4] optionsCurved          (natural curve)
//  [5] optionsMultipleBounded (bounded highlights)
//  [6] optionsZoomBar         (zoombar)
//  [7] optionsSkeleton        (skeleton)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

// ECharts equivalents paired by test example index
const echartsOptions = [
  areaTimeSeries, // [0] Time series area
  areaAlwaysRuler, // [1] Always ruler tooltip (ECharts limitation)
  areaSparkline, // [2] Sparkline area
  areaDiscrete, // [3] Discrete domain area
  areaNaturalCurve, // [4] Natural curve area
  areaBounded, // [5] Bounded highlights (ECharts limitation: approximated as stacked)
  areaZoombar, // [6] Area with zoombar
  areaSkeleton, // [7] Skeleton (ECharts limitation: no skeleton state)
]

const titles = [
  'Time series area',
  'Time series area (always ruler tooltip) — ECharts: tooltip on hover only',
  'Sparkline area',
  'Discrete domain area',
  'Natural curve area',
  'Bounded area — ECharts: approximated as stacked',
  'Area with zoombar',
  'Area (skeleton) — ECharts: no skeleton state',
]

const codeSamples = [
  `import { createAreaOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2', date: '2023-01-01', value: 50000 },
  // ...
]

const option = createAreaOptions(data, { timeSeries: true })`,

  `import { createAreaOptions } from '@carbon/echarts-theme/presets'

const data = [/* time series data */]

const option = createAreaOptions(data, { timeSeries: true })
// Note: Carbon Charts alwaysShowRulerTooltip — ECharts: tooltip on hover only`,

  `import { createAreaOptions } from '@carbon/echarts-theme/presets'

// Sparkline — minimal area chart with no axes
const data = [
  { group: 'Dataset 1', date: '2023-01-01T00:00:00.000Z', value: 10000 },
  // ... 30 ISO-timestamp rows
]

const option = createAreaOptions(data, { timeSeries: true, sparkline: true })`,

  `import { createAreaOptions } from '@carbon/echarts-theme/presets'

// Discrete category axis
const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  // ...
]

const option = createAreaOptions(data)`,

  `import { createAreaOptions } from '@carbon/echarts-theme/presets'

// Smooth curve (natural interpolation)
const data = [{ group: 'Dataset 1', key: 'Qty', value: 10000 }, /* ... */]

const option = createAreaOptions(data, { smooth: true })`,

  `import { createStackedAreaOptions } from '@carbon/echarts-theme/presets'

// Bounded highlights — approximated as stacked area (ECharts limitation)
const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  // ...
]

const option = createStackedAreaOptions(data, { timeSeries: true })`,

  `import { createAreaOptions } from '@carbon/echarts-theme/presets'

const data = [{ group: 'Dataset 1', date: '2023-01-01', value: 10000 }, /* ... */]

// dataZoom adds a scrollbar — matches Carbon Charts zoomBar
const option = createAreaOptions(data, { timeSeries: true, dataZoom: true })`,

  `// Carbon Charts: data: { loading: true }
// ECharts: call chart.showLoading() on the instance
chart.showLoading()`,
]

export function AreaPage() {
  return (
    <ChartPage
      title="Area"
      description="Show volume or cumulative totals over time."
      overview={<AreaMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? areaTimeSeries}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
