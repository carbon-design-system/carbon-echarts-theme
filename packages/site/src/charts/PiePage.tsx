import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import PieMdx from '../content/pie.mdx'
import { chartTypes, examples } from '../data/carboncharts/pie'
import { pie, pieCentered, pieValueMapsTo, data, dataMapsTo } from '../data/echarts/donut'

// Filter to test-tagged examples only
// Carbon test order: [0] Pie, [1] Pie (centered), [2] Pie (value maps to count)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = ['Pie', 'Pie (centered)', 'Pie (value maps to count)']

const echartsOptions = [pie, pieCentered, pieValueMapsTo]

const codeSamples = [
  `import { createPieOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

const option = createPieOptions(data)`,

  `import { createPieOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

const option = createPieOptions(data, { alignment: 'center' })`,

  `import { createPieOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 0, count: 28000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 0, count: 65000 },
  { group: 'JQAI 2M4L1', value: 0, count: 75000 },
  { group: 'J9DZ F37AP', value: 0, count: 3200 },
  { group: 'YEL48 Q6XK YEL48', value: 0, count: 15000 },
  { group: 'Misc', value: 0, count: 25000 },
]

const option = createPieOptions(data, { valueMapsTo: 'count' })`,
]

const chartDataSamples = [
  data, // [0] Pie
  data, // [1] Pie (centered)
  dataMapsTo, // [2] Pie (value maps to count)
]

export function PiePage() {
  return (
    <ChartPage
      title="Pie"
      description="Show part-to-whole relationships as proportional slices."
      overview={<PieMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? pie}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          optionCode={codeSamples[i]}
          chartData={chartDataSamples[i]}
        />
      ))}
    />
  )
}
