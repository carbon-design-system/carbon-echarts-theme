import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import LollipopMdx from '../content/lollipop.mdx'
import { chartTypes, examples } from '../data/carboncharts/lollipop'
import { lollipopDiscrete, lollipopHorizontal } from '../data/echarts/lollipop'

// Filter to test-tagged examples only
// Carbon test order: [0] Lollipop (discrete), [1] Lollipop (horizontal)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const echartsOptions = [
  lollipopDiscrete, // [0]
  lollipopHorizontal, // [1]
]

const titles = ['Lollipop (discrete)', 'Lollipop (horizontal)']

const codeSamples = [
  `import { createLollipopOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
]

const option = createLollipopOptions(data)`,

  `import { createLollipopOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
]

const option = createLollipopOptions(data, { horizontal: true })`,
]

export function LollipopPage() {
  return (
    <ChartPage
      title="Lollipop"
      description="Lollipop charts reduce bar-chart clutter by encoding values as lines capped with a dot."
      overview={<LollipopMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? lollipopDiscrete}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
