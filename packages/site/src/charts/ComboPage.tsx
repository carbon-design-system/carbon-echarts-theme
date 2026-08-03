import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import ComboMdx from '../content/combo.mdx'
import { chartTypes, examples } from '../data/carboncharts/combo'
import {
  comboBarLine,
  comboBarLineRuler,
  comboStackedBarLine,
  comboGroupedLine,
  comboFloatingLine,
  comboGroupedHorizontal,
  comboHorizontalLine,
  comboAreaLine,
  comboStackedAreaLine,
  comboScatterLine,
  comboAreaLineTimeSeries,
} from '../data/echarts/combo'

// Filter to test-tagged examples only
// Carbon test order (11 test examples):
//  [0]  comboSimpleOptions          → bar + line
//  [1]  comboAlwaysRulerTooltipOptions → bar + line
//  [2]  comboStackedOptions         → stacked bar + line
//  [3]  comboGroupedOptions         → grouped bar + line
//  [4]  comboSimpleFloatingOptions  → floating bar + line
//  [5]  comboGroupedHorizontalOptions → grouped horizontal
//  [6]  comboHorizontalOptions      → horizontal bar + line
//  [7]  comboAreaLineOptions        → area + line
//  [8]  comboStackedAreaLineOptions → stacked area + line
//  [9]  comboLineScatterOptions     → line + scatter
//  [10] comboAreaLineTimeSeriesOptions → area + line time series
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  comboBarLine, // [0] bar + line
  comboBarLineRuler, // [1] tooltip variant (same visual)
  comboStackedBarLine, // [2] stacked bar + line
  comboGroupedLine, // [3] grouped bar + line
  comboFloatingLine, // [4] floating bar + line
  comboGroupedHorizontal, // [5] grouped horizontal bar + line
  comboHorizontalLine, // [6] horizontal bar + line
  comboAreaLine, // [7] area + line
  comboStackedAreaLine, // [8] stacked area + line
  comboScatterLine, // [9] bar + scatter + line
  comboAreaLineTimeSeries, // [10] area + line time series
]

const titles = [
  'Combo (bar + line)',
  'Combo (always show ruler tooltip)',
  'Combo (stacked bar + line)',
  'Combo (grouped bar + line)',
  'Combo (floating bar + line)',
  'Combo (grouped horizontal)',
  'Combo (horizontal bar + line)',
  'Combo (area + line)',
  'Combo (stacked area + line)',
  'Combo (line + scatter)',
  'Combo (area + line, time series)',
]

const codeSamples: string[] = [
  // [0] Bar + line (dual Y)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'School A', date: 'Monday', value: 10000 },
  { group: 'School A', date: 'Tuesday', value: 65000 },
  { group: 'Temperature', date: 'Monday', value: 70 },
  { group: 'Temperature', date: 'Tuesday', value: 75 },
  // ...
]

const option = createComboOptions(data, {
  xField: 'date',
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [1] Bar + line — tooltip variant (same data and options as [0])
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'School A', date: 'Monday', value: 10000 },
  { group: 'Temperature', date: 'Monday', value: 70 },
  // ...
]

// Note: Carbon Charts alwaysShowRulerTooltip — ECharts: tooltip on hover only
const option = createComboOptions(data, {
  xField: 'date',
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [2] Stacked bar + line (dual Y)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Florida', key: 'Monday', value: 65000 },
  { group: 'California', key: 'Monday', value: 32432 },
  { group: 'Tokyo', key: 'Monday', value: 12312 },
  { group: 'Temperature', key: 'Monday', value: 23 },
  // ...
]

const option = createComboOptions(data, {
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
  stacked: true,
})`,

  // [3] Grouped bar + line (dual Y, with negatives)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Location 1', key: 'Monday', value: 65000 },
  { group: 'Location 1', key: 'Tuesday', value: -39123 },
  { group: 'Location 2', key: 'Monday', value: 32432 },
  { group: 'Temperature', key: 'Monday', value: 20 },
  // ...
]

const option = createComboOptions(data, {
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [4] Floating bar + line
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'School A', date: 'Monday', value: 50000 },
  { group: 'School A', date: 'Tuesday', value: 45000 },
  { group: 'Temperature', date: 'Monday', value: [65, 70] },
  { group: 'Temperature', date: 'Tuesday', value: [67, 71] },
  // ...
]

const option = createComboOptions(data, {
  xField: 'date',
  lineGroups: ['School A'],
  floatingGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [5] Grouped horizontal bar + line
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Location 1', key: 'Monday', value: 65000 },
  { group: 'Location 2', key: 'Monday', value: 32432 },
  { group: 'Location 3', key: 'Monday', value: -12312 },
  { group: 'Temperature', key: 'Monday', value: 20 },
  // ...
]

const option = createComboOptions(data, {
  horizontal: true,
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [6] Horizontal bar + line
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'School A', date: 'Monday', value: 10000 },
  { group: 'School A', date: 'Tuesday', value: 65000 },
  { group: 'Temperature', date: 'Monday', value: 70 },
  // ...
]

const option = createComboOptions(data, {
  xField: 'date',
  horizontal: true,
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [7] Area + line (dual Y)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Health', key: 'January', value: 312 },
  { group: 'Health', key: 'February', value: 232 },
  { group: 'Temperature', key: 'January', value: -20 },
  { group: 'Temperature', key: 'February', value: -12 },
  // ...
]

const option = createComboOptions(data, {
  areaGroups: ['Health'],
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [8] Stacked area + line (time series, dual Y)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1 with a very long name', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-01', value: 20000 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-01', value: 30000 },
  { group: 'Temperature', date: '2023-01-01', value: 77 },
  // ...
]

const option = createComboOptions(data, {
  timeSeries: true,
  areaGroups: [
    'Dataset 1 with a very long name',
    'Dataset 2 with a very long name',
    'Dataset 3 with a very long name',
  ],
  stacked: true,
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

  // [9] Scatter + line (dual Y)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Paris', key: 'Monday', value: 25 },
  { group: 'Marseille', key: 'Monday', value: 16 },
  { group: 'Avg Temperature', key: 'Monday', value: 20.5 },
  { group: 'Attendance', key: 'Monday', value: 2650 },
  // ...
]

const option = createComboOptions(data, {
  lineGroups: ['Avg Temperature'],
  scatterGroups: ['Paris', 'Marseille'],
  secondaryGroups: ['Avg Temperature', 'Paris', 'Marseille'],
})`,

  // [10] Area + line (time series, dual Y)
  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Health', key: '2022-12-30', value: 312 },
  { group: 'Health', key: '2023-01-06', value: 232 },
  { group: 'Temperature', key: '2023-01-01', value: -20 },
  { group: 'Temperature', key: '2023-01-05', value: -12 },
  // ...
]

const option = createComboOptions(data, {
  xField: 'key',
  timeSeries: true,
  areaGroups: ['Health'],
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,
]

export function ComboPage() {
  return (
    <ChartPage
      title="Combo"
      description="Combine bar and line series in the same chart area."
      overview={<ComboMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? comboBarLine}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
