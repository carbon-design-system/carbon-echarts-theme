import type { EChartsOption } from 'echarts'
import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 56000 },
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

// Dataset 1 + 3 visible on load; Dataset 2 + 4 start hidden, togglable via legend.
export const option: EChartsOption = createLineOptions(data, {
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
  selectedGroups: ['Dataset 1', 'Dataset 3'],
})
