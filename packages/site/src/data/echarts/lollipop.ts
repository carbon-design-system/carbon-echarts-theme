/**
 * ECharts equivalents for the Lollipop chart page.
 * Carbon lollipop data: key=category, value=count.
 */
import type { EChartsOption } from 'echarts'
import { createLollipopOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 34200 },
  { group: 'Dataset 3', key: 'Sold', value: 41200 },
  { group: 'Dataset 4', key: 'Restocking', value: 22000 },
]

export const lollipopDiscrete: EChartsOption = createLollipopOptions(data)
export const lollipopHorizontal: EChartsOption = createLollipopOptions(data, { horizontal: true })
