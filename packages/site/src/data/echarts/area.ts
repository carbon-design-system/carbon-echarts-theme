/**
 * ECharts equivalents for the Area chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/area.ts.
 *
 * Carbon test examples we cover:
 *  [0] Time Series area
 *  [2] Sparkline area
 *  [3] Discrete domain area
 *  [4] Natural curve area
 */
import type { EChartsOption } from 'echarts'
import { createAreaOptions, createStackedAreaOptions } from '@carbon/echarts-theme/presets'

// Time series data (maps date strings → key for ECharts preset)
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
  { group: 'Dataset 3', key: 'Jan 2', value: 10 },
  { group: 'Dataset 3', key: 'Jan 6', value: 37312 },
  { group: 'Dataset 3', key: 'Jan 8', value: 51432 },
  { group: 'Dataset 3', key: 'Jan 13', value: 40323 },
  { group: 'Dataset 3', key: 'Jan 19', value: 31300 },
]

const discreteData = [
  { group: 'Dataset 1', key: 'a', value: 10000 },
  { group: 'Dataset 1', key: 'b', value: 65000 },
  { group: 'Dataset 1', key: 'c', value: 10000 },
  { group: 'Dataset 1', key: 'd', value: 49213 },
  { group: 'Dataset 1', key: 'e', value: 51213 },
  { group: 'Dataset 2', key: 'a', value: 20000 },
  { group: 'Dataset 2', key: 'b', value: 25000 },
  { group: 'Dataset 2', key: 'c', value: 60000 },
  { group: 'Dataset 2', key: 'd', value: 30213 },
  { group: 'Dataset 2', key: 'e', value: 55213 },
]

const sparkData = [
  { group: 'Dataset 1', key: '19:21', value: 2 },
  { group: 'Dataset 1', key: '19:22', value: 3 },
  { group: 'Dataset 1', key: '19:23', value: 5 },
  { group: 'Dataset 1', key: '19:24', value: 1 },
  { group: 'Dataset 1', key: '19:25', value: 4 },
  { group: 'Dataset 1', key: '19:26', value: 4 },
  { group: 'Dataset 1', key: '19:27', value: 3 },
  { group: 'Dataset 1', key: '19:28', value: 4 },
  { group: 'Dataset 1', key: '19:29', value: 2 },
  { group: 'Dataset 1', key: '19:30', value: 0 },
]

export const areaTimeSeries: EChartsOption = createAreaOptions(timeSeriesData)
export const areaSparkline: EChartsOption = createAreaOptions(sparkData)
export const areaDiscrete: EChartsOption = createAreaOptions(discreteData)
export const areaStacked: EChartsOption = createStackedAreaOptions(timeSeriesData)
