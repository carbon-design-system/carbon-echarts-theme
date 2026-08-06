/**
 * ECharts equivalents for the Bubble chart page.
 *
 * Carbon test order (5 test examples):
 *  [0] Bubble (linear)                   — sales/profit x/y, surplus = size
 *  [1] Bubble (always ruler tooltip)     — time series, value/surplus
 *  [2] Bubble (time series)              — time series, value/surplus
 *  [3] Bubble (discrete)                 — key/value/surplus, 4 datasets
 *  [4] Bubble (dual discrete axes)       — product/problem discrete x/y, value = size
 */
import type { EChartsOption } from 'echarts'
import { createBubbleOptions } from '@carbon/echarts-theme/presets'

// [0] Linear bubble: sales vs profit, surplus = bubble size
// Matches carboncharts/bubble.ts bubbleDoubleLinearData
export const linearData = [
  { group: 'Dataset 1', key: 10000, value: 32100, surplus: 50000 },
  { group: 'Dataset 1', key: 12000, value: 23500, surplus: 34000 },
  { group: 'Dataset 1', key: 14000, value: 53100, surplus: 63000 },
  { group: 'Dataset 1', key: 15000, value: 42300, surplus: 43000 },
  { group: 'Dataset 1', key: 16000, value: 12300, surplus: 55000 },
  { group: 'Dataset 2', key: 11000, value: 12400, surplus: 25000 },
  { group: 'Dataset 2', key: 13000, value: 34500, surplus: 35000 },
  { group: 'Dataset 2', key: 13500, value: 23100, surplus: 55000 },
  { group: 'Dataset 2', key: 15500, value: 63200, surplus: 35000 },
  { group: 'Dataset 2', key: 15750, value: 24300, surplus: 64000 },
]

// [1] & [2] Time series bubble — matches bubbleTimeSeriesData
export const timeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000, surplus: 1108792759.4591982 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000, surplus: 590247271.3872744 },
  { group: 'Dataset 1', date: '2023-01-08', value: null, surplus: 9219.520929038921 },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213, surplus: 1144546546.5725653 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213, surplus: 1206431312.2321992 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0, surplus: 9107.915339546651 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312, surplus: 1297879289.3455367 },
  { group: 'Dataset 2', date: '2023-01-08', value: 27432, surplus: 254653461.2692332 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323, surplus: 791440614.5922209 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300, surplus: 87235499.55803385 },
  { group: 'Dataset 3', date: '2023-01-01', value: 40000, surplus: 99661858.42808129 },
  { group: 'Dataset 3', date: '2023-01-05', value: null, surplus: 4582.283257286785 },
  { group: 'Dataset 3', date: '2023-01-08', value: 18000, surplus: 388038660.7993739 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213, surplus: 281485241.99383223 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213, surplus: 77655008.12585072 },
  { group: 'Dataset 4', date: '2023-01-02', value: 20000, surplus: 138468385.58061224 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312, surplus: 703848952.2932228 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432, surplus: 721135448.0965896 },
  { group: 'Dataset 4', date: '2023-01-15', value: 25332, surplus: 524200058.75680393 },
  { group: 'Dataset 4', date: '2023-01-19', value: null, surplus: 4347.704175756872 },
]

// [3] Discrete bubble — matches bubbleDiscreteData (4 datasets), surplus = size
export const discreteData = [
  { group: 'Dataset 1', key: 'Qty', value: 8000, surplus: 50000 },
  { group: 'Dataset 1', key: 'More', value: 23500, surplus: 15000 },
  { group: 'Dataset 1', key: 'Sold', value: 53100, surplus: 32000 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300, surplus: 53000 },
  { group: 'Dataset 1', key: 'Misc', value: 12300, surplus: 34000 },
  { group: 'Dataset 2', key: 'Qty', value: 34200, surplus: 23000 },
  { group: 'Dataset 2', key: 'More', value: 53200, surplus: 31000 },
  { group: 'Dataset 2', key: 'Sold', value: 42300, surplus: 13000 },
  { group: 'Dataset 2', key: 'Restocking', value: 13400, surplus: 55000 },
  { group: 'Dataset 2', key: 'Misc', value: 0, surplus: 12000 },
  { group: 'Dataset 3', key: 'Qty', value: 41200, surplus: 32000 },
  { group: 'Dataset 3', key: 'More', value: 18400, surplus: 12000 },
  { group: 'Dataset 3', key: 'Sold', value: 34210, surplus: 18000 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400, surplus: 21000 },
  { group: 'Dataset 3', key: 'Misc', value: 42100, surplus: 22000 },
  { group: 'Dataset 4', key: 'Qty', value: 22000, surplus: 32000 },
  { group: 'Dataset 4', key: 'More', value: 4000, surplus: 32000 },
  { group: 'Dataset 4', key: 'Sold', value: 9000, surplus: 43000 },
  { group: 'Dataset 4', key: 'Restocking', value: 24000, surplus: 43000 },
  { group: 'Dataset 4', key: 'Misc', value: 7000, surplus: 21000 },
]

// [4] Dual discrete bubble — matches bubbleDualDiscreteData
// x = problem (discrete), y = product (discrete), size (bubble radius) = value
// We store all fields using their original Carbon field names:
//   group = year, problem = x-category, product = y-category, value = bubble size
// ChartTabularDatum.value must be numeric — value here IS numeric (it drives bubble size).
export const dualDiscreteData = [
  { group: '2014', value: 162, problem: 'Skills', product: 'Cloud' },
  { group: '2014', value: 340, problem: 'Skills', product: 'Mainframe' },
  { group: '2014', value: 202, problem: 'Software', product: 'Cloud' },
  { group: '2014', value: 64, problem: 'Software', product: 'Mainframe' },
  { group: '2014', value: 102, problem: 'Staffing', product: 'Cloud' },
  { group: '2014', value: 88, problem: 'Staffing', product: 'Mainframe' },
  { group: '2016', value: 136, problem: 'Skills', product: 'Cloud' },
  { group: '2016', value: 74, problem: 'Skills', product: 'Mainframe' },
  { group: '2016', value: 45, problem: 'Software', product: 'Cloud' },
  { group: '2016', value: 24, problem: 'Software', product: 'Mainframe' },
  { group: '2016', value: 36, problem: 'Staffing', product: 'Cloud' },
  { group: '2016', value: 44, problem: 'Staffing', product: 'Mainframe' },
  { group: '2018', value: 78, problem: 'Skills', product: 'Cloud' },
  { group: '2018', value: 94, problem: 'Skills', product: 'Mainframe' },
  { group: '2018', value: 56, problem: 'Software', product: 'Cloud' },
  { group: '2018', value: 104, problem: 'Software', product: 'Mainframe' },
  { group: '2018', value: 146, problem: 'Staffing', product: 'Cloud' },
  { group: '2018', value: 274, problem: 'Staffing', product: 'Mainframe' },
]

export const bubbleLinear: EChartsOption = createBubbleOptions(linearData, {
  sizeField: 'surplus',
  xAxisName: 'No. of employees',
  yAxisName: 'Annual sales',
})
export const bubbleTimeSeries: EChartsOption = createBubbleOptions(timeSeriesData, {
  timeSeries: true,
  sizeField: 'surplus',
  xAxisName: '2023 Annual Sales Figures',
})
export const bubbleDiscrete: EChartsOption = createBubbleOptions(discreteData, {
  sizeField: 'surplus',
  xAxisName: '2023 Annual Sales Figures',
})
export const bubbleDualDiscrete: EChartsOption = createBubbleOptions(dualDiscreteData, {
  sizeField: 'value',
  dualDiscrete: { xField: 'problem', yField: 'product' },
  xAxisName: 'Problems',
  yAxisName: 'Products',
})
