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
  comboEmpty,
  comboLoading,
} from '../data/echarts/combo'

const titles = examples.map((example) => example.options.title)

const echartsOptions = [
  comboBarLine,
  comboBarLineRuler,
  comboStackedBarLine,
  comboGroupedLine,
  comboFloatingLine,
  comboGroupedHorizontal,
  comboHorizontalLine,
  comboAreaLine,
  comboStackedAreaLine,
  comboStackedAreaLine,
  comboScatterLine,
  comboAreaLineTimeSeries,
  comboEmpty,
  comboLoading,
]

const codeSamples: string[] = [
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

  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'School A', date: 'Monday', value: 10000 },
  { group: 'Temperature', date: 'Monday', value: 70 },
  // ...
]

// Note: Carbon Charts alwaysShowRulerTooltip — ECharts shows the axis tooltip on hover.
const option = createComboOptions(data, {
  xField: 'date',
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})`,

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

  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1 with a very long name', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-01', value: 20000 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-01', value: 30000 },
  { group: 'Temperature', date: '2023-01-01', value: 77 },
  // ...
]

// Carbon changes only legend presentation here; the ECharts preset input stays the same.
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

  `import { createComboOptions } from '@carbon/echarts-theme/presets'

const option = createComboOptions([], {
  title: 'Combo Chart (empty)',
})`,

  `import { createComboOptions } from '@carbon/echarts-theme/presets'
import { showSkeleton } from '@carbon/echarts-theme/skeleton'

const option = createComboOptions([], {
  title: 'Combo Chart (loading)',
  loading: true,
})

const hide = showSkeleton(chartContainerEl, 'white')

// call hide() once your data has loaded
fetchData().then((data) => {
  setData(data)
  hide()
})`,
]

export function ComboPage() {
  return (
    <ChartPage
      title="Combo"
      description="Combine bar and line series in the same chart area."
      overview={<ComboMdx />}
      examples={examples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? comboBarLine}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={examples[i]?.data}
          showLoading={i === 13}
        />
      ))}
    />
  )
}
