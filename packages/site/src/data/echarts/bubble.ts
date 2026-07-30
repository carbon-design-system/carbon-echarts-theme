/**
 * ECharts equivalents for the Bubble chart page.
 */
import type { EChartsOption } from 'echarts'
import { createBubbleOptions } from '@carbon/echarts-theme/presets'

// Linear bubble: sales vs profit, surplus = bubble size
const linearData = [
  { group: 'Dataset 1', key: 10000, value: 32100, size: 50000 },
  { group: 'Dataset 1', key: 12000, value: 23500, size: 34000 },
  { group: 'Dataset 1', key: 14000, value: 53100, size: 63000 },
  { group: 'Dataset 1', key: 15000, value: 42300, size: 43000 },
  { group: 'Dataset 2', key: 11000, value: 12400, size: 25000 },
  { group: 'Dataset 2', key: 13000, value: 34500, size: 35000 },
  { group: 'Dataset 2', key: 15500, value: 63200, size: 35000 },
]

// Discrete bubble: key=category, value=count, size=surplus
const discreteData = [
  { group: 'Dataset 1', key: 'Qty', value: 8000, size: 50000 },
  { group: 'Dataset 1', key: 'More', value: 23500, size: 15000 },
  { group: 'Dataset 1', key: 'Sold', value: 53100, size: 32000 },
  { group: 'Dataset 2', key: 'Qty', value: 34200, size: 23000 },
  { group: 'Dataset 2', key: 'More', value: 53200, size: 31000 },
  { group: 'Dataset 2', key: 'Sold', value: 42300, size: 13000 },
]

export const bubbleLinear: EChartsOption = createBubbleOptions(linearData, { sizeField: 'size' })
export const bubbleDiscrete: EChartsOption = createBubbleOptions(discreteData, { sizeField: 'size' })
