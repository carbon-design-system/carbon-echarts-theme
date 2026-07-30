/**
 * ECharts equivalents for the Scatter chart page.
 */
import type { EChartsOption } from 'echarts'
import { createScatterOptions } from '@carbon/echarts-theme/presets'

// Linear scatter: employees vs sales (maps employees→key, sales→value)
const linearData = [
  { group: 'Dataset 1', key: 5000, value: 32100 },
  { group: 'Dataset 1', key: 3000, value: 25100 },
  { group: 'Dataset 1', key: 8000, value: 12100 },
  { group: 'Dataset 1', key: 4000, value: 53100 },
  { group: 'Dataset 2', key: 5000, value: 32100 },
  { group: 'Dataset 2', key: 2000, value: 34100 },
  { group: 'Dataset 2', key: 4000, value: 23100 },
  { group: 'Dataset 2', key: 7000, value: 14100 },
]

const discreteData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: 'Restocking', value: 21400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
]

export const scatterLinear: EChartsOption = createScatterOptions(linearData)
export const scatterDiscrete: EChartsOption = createScatterOptions(discreteData)
