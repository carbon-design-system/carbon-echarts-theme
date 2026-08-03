import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import DonutMdx from '../content/donut.mdx'
import { chartTypes, examples } from '../data/carboncharts/donut'
import { donut, donutCentered, donutValueMapsTo } from '../data/echarts/donut'

// Filter to test-tagged examples only
// Carbon test order: [0] Donut, [1] Donut (centered), [2] Donut (value maps to count)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = ['Donut', 'Donut (centered)', 'Donut (value maps to count)']

const echartsOptions = [donut, donutCentered, donutValueMapsTo]

const codeSamples = [
  `import { createDonutOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

const option = createDonutOptions(data, { centerLabel: 'Browsers' })`,

  `import { createDonutOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

const option = createDonutOptions(data, {
  centerLabel: 'Browsers',
  alignment: 'center',
})`,

  `import { createDonutOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 0, count: 28000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 0, count: 65000 },
  { group: 'JQAI 2M4L1', value: 0, count: 75000 },
  { group: 'J9DZ F37AP', value: 0, count: 3200 },
  { group: 'YEL48 Q6XK YEL48', value: 0, count: 15000 },
  { group: 'Misc', value: 0, count: 25000 },
]

const option = createDonutOptions(data, { valueMapsTo: 'count' })`,
]

export function DonutPage() {
  return (
    <ChartPage
      title="Donut"
      description="Show part-to-whole relationships with a center cutout."
      overview={<DonutMdx />}
      examples={testExamples.map((ex, i) => (
        <Compare
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? donut}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
