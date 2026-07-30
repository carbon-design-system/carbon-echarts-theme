/**
 * ECharts equivalents for the Line chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/line.ts.
 */
import type { EChartsOption } from 'echarts'
import { createLineOptions, createStepLineOptions } from '@carbon/echarts-theme/presets'

const discreteData = [
  { group: 'Dataset 1', key: 'Qty', value: 32100 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: 'Restocking', value: 13400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
]

const timeSeriesData = [
  { group: 'Dataset 1', key: 'Jan 1', value: 0 },
  { group: 'Dataset 1', key: 'Jan 6', value: 57312 },
  { group: 'Dataset 1', key: 'Jan 8', value: 21432 },
  { group: 'Dataset 1', key: 'Jan 15', value: 70323 },
  { group: 'Dataset 1', key: 'Jan 19', value: 21300 },
  { group: 'Dataset 2', key: 'Jan 1', value: 50000 },
  { group: 'Dataset 2', key: 'Jan 5', value: 15000 },
  { group: 'Dataset 2', key: 'Jan 8', value: 20000 },
  { group: 'Dataset 2', key: 'Jan 13', value: 39213 },
  { group: 'Dataset 2', key: 'Jan 19', value: 61213 },
]

export const lineDiscrete: EChartsOption = createLineOptions(discreteData)
export const lineTimeSeries: EChartsOption = createLineOptions(timeSeriesData, { curve: 'curveMonotoneX' })
export const lineStep: EChartsOption = createStepLineOptions(discreteData)
