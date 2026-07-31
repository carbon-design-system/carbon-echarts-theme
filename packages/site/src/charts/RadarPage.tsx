import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import RadarMdx from '../content/radar.mdx'
import { chartTypes, examples } from '../data/carboncharts/radar'
import {
  radar,
  radarMultiSeries,
  radarMissingDatapoints,
  radarDense,
  radarCustomMax,
} from '../data/echarts/radar'

// Filter to test-tagged examples only
// Carbon test order (5 test examples):
//  [0] Radar
//  [1] Radar (centered)
//  [2] Radar - Missing datapoints
//  [3] Radar - Dense
//  [4] Radar - Custom Max Score (100)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = [
  'Radar',
  'Radar (centered)',
  'Radar (missing datapoints)',
  'Radar (dense)',
  'Radar (custom max score)',
]

const echartsOptions = [
  radar, // [0] Radar — Product 1 + Product 2
  radarMultiSeries, // [1] Radar (centered) — same data (alignment is ECharts limitation)
  radarMissingDatapoints, // [2] Radar missing datapoints — Sugar/Oil/Water × cities
  radarDense, // [3] Radar dense — month × activity × hoursAvg
  radarCustomMax, // [4] Radar custom max — single product, maxValue:100
]

const codeSamples = [
  `import { createRadarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Product 1', key: 'Price',        value: 60 },
  { group: 'Product 1', key: 'Usability',    value: 92 },
  { group: 'Product 1', key: 'Availability', value: 5  },
  { group: 'Product 1', key: 'Performance',  value: 85 },
  { group: 'Product 1', key: 'Quality',      value: 60 },
  { group: 'Product 2', key: 'Price',        value: 70 },
  // ...
]

const option = createRadarOptions(data)`,

  `import { createRadarOptions } from '@carbon/echarts-theme/presets'

const data = [/* same product data */]

const option = createRadarOptions(data)
// Note: Carbon Charts alignment:CENTER — ECharts renders chart at default position`,

  `import { createRadarOptions } from '@carbon/echarts-theme/presets'

// Missing datapoints — Water/Sydney absent (fills as 0)
const data = [
  { group: 'Sugar', key: 'London',   value: 25 },
  { group: 'Oil',   key: 'London',   value: 6  },
  { group: 'Water', key: 'London',   value: 12 },
  // ... Sugar/Oil/Water across 5 cities (Water missing Sydney)
]

const option = createRadarOptions(data)`,

  `import { createRadarOptions } from '@carbon/echarts-theme/presets'

// Dense dataset with custom field names
const data = [
  { month: 'January', activity: 'Eating',   hoursAvg: 2   },
  { month: 'January', activity: 'Drinking', hoursAvg: 6   },
  // ...
]

const option = createRadarOptions(data, {
  groupField: 'month',
  axisField: 'activity',
  valueField: 'hoursAvg',
})`,

  `import { createRadarOptions } from '@carbon/echarts-theme/presets'

// Single product, values ≤60, max forced to 100
const data = [
  { group: 'Product 1', key: 'Price',        value: 50 },
  { group: 'Product 1', key: 'Usability',    value: 20 },
  { group: 'Product 1', key: 'Availability', value: 5  },
  { group: 'Product 1', key: 'Performance',  value: 45 },
  { group: 'Product 1', key: 'Quality',      value: 60 },
]

// maxValue matches Carbon Charts radar.maxValue: 100
const option = createRadarOptions(data, { maxValue: 100 })`,
]

export function RadarPage() {
  return (
    <ChartPage
      title="Radar"
      description="Compare multiple variables across categories on a radial axis."
      overview={<RadarMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={echartsOptions[i] ?? radar}
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
          echartsCode={codeSamples[i]}
        />
      ))}
    />
  )
}
