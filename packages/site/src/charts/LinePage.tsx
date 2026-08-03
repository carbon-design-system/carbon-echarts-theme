import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import LineMdx from '../content/line.mdx'
import { chartTypes, examples } from '../data/carboncharts/line'
import {
  lineDiscrete,
  lineRotatedTicks,
  lineLocale,
  lineLogAxis,
  lineCustomColors,
  lineSelectedGroups,
  lineLegendOrientation,
  lineThresholds,
  lineLongLabel,
  lineStandard,
  lineAlwaysRuler,
  lineTimeSeries,
  lineTimeSeriesDense,
  lineDualAxis,
} from '../data/echarts/line'

// Filter to test-tagged examples only
// Carbon test order (14 test examples):
//  [0]  lineCustomDomainOptions (axes)
//  [1]  lineTimeSeriesRotatedTicksOptions (axes, time)
//  [2]  lineTimeSeriesFrenchLocale (axes, time, locale)
//  [3]  lineLogAxisOptions (axes)
//  [4]  lineCustomColorOptions (colors)
//  [5]  lineSelectedGroupsOptions (legend)
//  [6]  lineOptionsLegendOrientation (legend)
//  [7]  lineTimeSeriesWithThresholdsOptions (axes, time, thresholds)
//  [8]  lineLongLabelOptions (truncation)
//  [9]  lineOptions
//  [10] lineAlwaysRulerTooltipOptions
//  [11] lineTimeSeriesOptions (axes, time)
//  [12] lineTimeSeriesDenseOptions (axes, time)
//  [13] dualLine (axes, time, dual)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  lineDiscrete, // [0] custom domain
  lineRotatedTicks, // [1] time series rotated ticks
  lineLocale, // [2] locale (ECharts limitation: no per-chart locale)
  lineLogAxis, // [3] log axis
  lineCustomColors, // [4] custom colors (ECharts limitation: palette only)
  lineSelectedGroups, // [5] selected groups
  lineLegendOrientation, // [6] legend orientation
  lineThresholds, // [7] time series with thresholds
  lineLongLabel, // [8] long labels / truncation
  lineStandard, // [9] line (discrete)
  lineAlwaysRuler, // [10] always ruler tooltip (ECharts limitation)
  lineTimeSeries, // [11] time series
  lineTimeSeriesDense, // [12] time series dense
  lineDualAxis, // [13] dual line
]

const titles = [
  'Line (custom domain)',
  'Line (time series, rotated ticks)',
  'Line (time series, French locale) — ECharts uses browser locale',
  'Line (log axis)',
  'Line (custom colors) — ECharts uses Carbon palette',
  'Line (selected groups)',
  'Line (legend orientation)',
  'Line (time series, thresholds)',
  'Line (truncated labels)',
  'Line (discrete)',
  'Line (always show ruler tooltip) — ECharts: tooltip on hover only',
  'Line (time series)',
  'Line (time series, dense)',
  'Line (dual axis)',
]

const codeSamples: string[] = [
  // [0] Custom domain — plain line (ECharts has no custom domain API)
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  // ...
]

const option = createLineOptions(data)`,

  // [1] Rotated ticks — time series with axisLabelRotate
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-12-30', value: 32100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 23500 },
  { group: 'Dataset 1', date: '2024-01-01', value: 53100 },
  // ...
]

const option = createLineOptions(data, { timeSeries: true, axisLabelRotate: -45 })`,

  // [2] French locale — ECharts uses browser locale; no per-chart locale API
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-10-01', value: 10 },
  { group: 'Dataset 1', date: '2023-11-01', value: 10 },
  { group: 'Dataset 1', date: '2023-12-01', value: 10 },
  // ...
]

// Note: ECharts time axis uses browser locale; no per-chart locale API
const option = createLineOptions(data, { timeSeries: true })`,

  // [3] Log axis
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-12-30', value: 300100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 235000 },
  { group: 'Dataset 1', date: '2024-01-01', value: 153100 },
  // ...
]

const option = createLineOptions(data, { timeSeries: true, logScale: true })`,

  // [4] Custom colors — ECharts limitation: palette only
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  // ...
]

// Note: ECharts colors come from the Carbon palette only; per-series custom
// colors are not supported via createLineOptions
const option = createLineOptions(data)`,

  // [5] Selected groups — Dataset 2 More = 56000; no pre-selection in ECharts
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

// Dataset 2 'More' value differs (56000) from lineData (53200)
const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 56000 },
  // ...
]

// Note: ECharts cannot pre-select/deselect series from options alone
const option = createLineOptions(data)`,

  // [6] Legend orientation — left vertical legend not yet implemented in ECharts preset
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  // ...
]

// Note: left vertical legend orientation is not yet implemented in the preset
const option = createLineOptions(data)`,

  // [7] Time series with thresholds
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  { group: 'Dataset 3', date: '2023-01-01', value: 40000 },
  // ...
]

const option = createLineOptions(data, {
  timeSeries: true,
  smooth: true,
  thresholds: [
    { value: 55000, label: 'Custom label' },
    { value: 10000 },
  ],
})`,

  // [8] Long / truncated labels — 64-char hex key + 'LongLabelShouldBeTruncated' group
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const HEX_KEY = '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: HEX_KEY, value: 42300 },
  { group: 'LongLabelShouldBeTruncated', key: 'Qty', value: 22000 },
  // ...
]

const option = createLineOptions(data)`,

  // [9] Line (discrete, standard)
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  // ...
]

const option = createLineOptions(data)`,

  // [10] Always ruler tooltip — no always-ruler equivalent in ECharts
  `import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  // ...
]

// Note: Carbon Charts alwaysShowRulerTooltip — ECharts has no always-on tooltip
const option = createLineOptions(data, { timeSeries: true, smooth: true })`,

  // [11] Time series
  `import { createTimeSeriesLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  // ...
]

const option = createTimeSeriesLineOptions(data, { smooth: true })`,

  // [12] Time series dense — sub-daily ISO timestamps
  `import { createTimeSeriesLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-01T05:00:00.000Z', value: -12000 },
  { group: 'Dataset 2', date: '2023-01-01T00:00:00.000Z', value: 20000 },
  // ...
]

const option = createTimeSeriesLineOptions(data, { smooth: true })`,

  // [13] Dual axis — Rainfall on secondary (right) Y axis
  `import { createTimeSeriesLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Temperature', date: '2023-01-01', value: 23 },
  { group: 'Temperature', date: '2023-02-01', value: 15 },
  { group: 'Rainfall', date: '2023-01-01', value: 50 },
  // ...
]

const option = createTimeSeriesLineOptions(data, {
  smooth: true,
  secondaryGroups: ['Rainfall'],
})`,
]

export function LinePage() {
  return (
    <ChartPage
      title="Line"
      description="Display trends or changes over time."
      overview={<LineMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? lineDiscrete}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
