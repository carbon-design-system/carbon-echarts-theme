/**
 * ECharts equivalents for the Scatter chart page.
 *
 * Carbon test order (5 test examples):
 *  [0] Scatter (linear x & y)     — employees/sales fields
 *  [1] Scatter (time series)      — date/value fields
 *  [2] Scatter (discrete)         — key/value, 4 datasets
 *  [3] Scatter (dual axes)        — dual axes (Orders/Products)
 *  [4] Scatter (always ruler)     — employees/sales again
 */
import type { EChartsOption } from 'echarts'
import { createScatterOptions } from '@carbon/echarts-theme/presets'

// [0] & [4] Linear scatter: employees vs sales
// Carbon's doubleLinearScatterData uses employees→key, sales→value
const doubleLinearData = [
  { group: 'Dataset 1', key: 5000, value: 32100 },
  { group: 'Dataset 1', key: 3000, value: 25100 },
  { group: 'Dataset 1', key: 8000, value: 12100 },
  { group: 'Dataset 1', key: 4000, value: 53100 },
  { group: 'Dataset 2', key: 5000, value: 32100 },
  { group: 'Dataset 2', key: 2000, value: 34100 },
  { group: 'Dataset 2', key: 4000, value: 23100 },
  { group: 'Dataset 2', key: 7000, value: 14100 },
  { group: 'Dataset 2', key: 6000, value: 53100 },
]

// [1] Time series scatter — matches lineTimeSeriesData from carboncharts/line.ts
const timeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-08', value: null },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-08', value: 27432 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 3', date: '2023-01-01', value: 40000 },
  { group: 'Dataset 3', date: '2023-01-05', value: null },
  { group: 'Dataset 3', date: '2023-01-08', value: 18000 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213 },
  { group: 'Dataset 4', date: '2023-01-02', value: 20000 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-15', value: 25332 },
  { group: 'Dataset 4', date: '2023-01-19', value: null },
]

// [2] Discrete scatter — matches scatterDiscreteData (4 datasets)
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
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'Dataset 4', key: 'Qty', value: 22000 },
  { group: 'Dataset 4', key: 'More', value: 1200 },
  { group: 'Dataset 4', key: 'Sold', value: 9000 },
  { group: 'Dataset 4', key: 'Restocking', value: 24000 },
  { group: 'Dataset 4', key: 'Misc', value: 3000 },
]

// [3] Dual axes — Orders (orderCount) and Products (productCount)
// ECharts handles this as two separate value series on a category x-axis
const dualAxesData = [
  { group: 'Orders', key: 'January', value: 121 },
  { group: 'Orders', key: 'February', value: 321 },
  { group: 'Orders', key: 'March', value: 370 },
  { group: 'Orders', key: 'April', value: 329 },
  { group: 'Orders', key: 'May', value: 121 },
  { group: 'Products', key: 'January', value: 26100 },
  { group: 'Products', key: 'February', value: 25100 },
  { group: 'Products', key: 'March', value: 28100 },
  { group: 'Products', key: 'April', value: 15900 },
  { group: 'Products', key: 'May', value: 34100 },
]

export const scatterLinear: EChartsOption = createScatterOptions(doubleLinearData)
export const scatterTimeSeries: EChartsOption = createScatterOptions(timeSeriesData, {
  timeSeries: true,
})
export const scatterDiscrete: EChartsOption = createScatterOptions(discreteData)
/** [3] Dual axes — Products series on secondary (right) Y axis */
export const scatterDualAxes: EChartsOption = createScatterOptions(dualAxesData, {
  secondaryGroups: ['Products'],
})
