import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import MeterMdx from '../content/meter.mdx'
import { chartTypes, examples } from '../data/carboncharts/meter'
import {
  getMeterWithStatusOption,
  getMeterStatusCustomColorOption,
  getMeterNoStatusOption,
  getMeterProportionalOption,
  getMeterProportionalStatusOption,
  getMeterProportionalTruncatedOption,
} from '../data/echarts/gauge'
import { tokens } from '@carbon/echarts-theme'
import { useTheme } from '../components/ThemeContext'

// Filter to test-tagged examples only
// Carbon test order (6 test examples):
//  [0] Meter Chart - with statuses
//  [1] Meter Chart - statuses and custom color
//  [2] Meter Chart - no status
//  [3] Proportional Meter Chart
//  [4] Proportional Meter Chart - peak and statuses
//  [5] Proportional Meter Chart (truncated)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Meter (with statuses)',
  'Meter (statuses and custom color)',
  'Meter (no status)',
  'Proportional meter',
  'Proportional meter (peak and statuses)',
  'Proportional meter (truncated)',
]

export function MeterPage() {
  const { theme } = useTheme()
  const t = tokens[theme]

  const echartsOptions = [
    getMeterWithStatusOption(t.textPrimary), // [0] status zones + peak 80
    getMeterStatusCustomColorOption(t.textPrimary), // [1] status zones + peak 70 + barColor
    getMeterNoStatusOption(t.textPrimary), // [2] peak 70 only
    getMeterProportionalOption(t.textPrimary), // [3] proportional
    getMeterProportionalStatusOption(t.textPrimary), // [4] proportional + peak 1800 + status zones
    getMeterProportionalTruncatedOption(t.textPrimary), // [5] proportional (same as [3])
  ]

  const codeSamples = [
    `import { createMeterOptions } from '@carbon/echarts-theme/presets'

const option = createMeterOptions(
  [{ group: 'Dataset 1', value: 56 }],
  {
    total: 100,
    statusRanges: [
      { range: [0, 50],   status: 'success' },
      { range: [50, 60],  status: 'warning' },
      { range: [60, 100], status: 'danger'  },
    ],
    peak: 80,
  },
)`,

    `import { createMeterOptions } from '@carbon/echarts-theme/presets'
import { magenta70 } from '@carbon/colors'

const option = createMeterOptions(
  [{ group: 'Dataset 1', value: 56 }],
  {
    total: 100,
    statusRanges: [
      { range: [0, 40],   status: 'success' },
      { range: [40, 60],  status: 'warning' },
      { range: [60, 100], status: 'danger'  },
    ],
    peak: 70,
    barColor: magenta70,
  },
)`,

    `import { createMeterOptions } from '@carbon/echarts-theme/presets'

const option = createMeterOptions(
  [{ group: 'Dataset 1', value: 56 }],
  { total: 100, peak: 70 },
)`,

    `import { createMeterOptions } from '@carbon/echarts-theme/presets'

const option = createMeterOptions(
  [
    { group: 'emails',        value: 202 },
    { group: 'photos',        value: 654 },
    { group: 'text messages', value: 723 },
    { group: 'other',         value: 120 },
  ],
  { proportional: true },
)`,

    `import { createMeterOptions } from '@carbon/echarts-theme/presets'

const option = createMeterOptions(
  [
    { group: 'emails',        value: 202 },
    { group: 'photos',        value: 654 },
    { group: 'text messages', value: 723 },
    { group: 'other',         value: 120 },
  ],
  {
    proportional: true,
    peak: 1800,
    statusRanges: [
      { range: [0, 800],     status: 'success' },
      { range: [800, 1800],  status: 'warning' },
      { range: [1800, 2000], status: 'danger'  },
    ],
  },
)`,

    `import { createMeterOptions } from '@carbon/echarts-theme/presets'

// Same as proportional meter — unit/truncation is a Carbon Charts feature
const option = createMeterOptions(
  [
    { group: 'emails',        value: 202 },
    { group: 'photos',        value: 654 },
    { group: 'text messages', value: 723 },
    { group: 'other',         value: 120 },
  ],
  { proportional: true },
)`,
  ]

  const meterChartData = [
    [{ group: 'Dataset 1', value: 56 }], // [0] with statuses
    [{ group: 'Dataset 1', value: 56 }], // [1] statuses + custom color
    [{ group: 'Dataset 1', value: 56 }], // [2] no status
    [
      // [3] proportional
      { group: 'emails', value: 202 },
      { group: 'photos', value: 654 },
      { group: 'text messages', value: 723 },
      { group: 'other', value: 120 },
    ],
    [
      // [4] proportional + peak + statuses
      { group: 'emails', value: 202 },
      { group: 'photos', value: 654 },
      { group: 'text messages', value: 723 },
      { group: 'other', value: 120 },
    ],
    [
      // [5] proportional (truncated)
      { group: 'emails', value: 202 },
      { group: 'photos', value: 654 },
      { group: 'text messages', value: 723 },
      { group: 'other', value: 120 },
    ],
  ]

  return (
    <ChartPage
      title="Meter"
      description="Display progress toward a total on a linear scale."
      overview={<MeterMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i]}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={meterChartData[i]}
        />
      ))}
    />
  )
}
