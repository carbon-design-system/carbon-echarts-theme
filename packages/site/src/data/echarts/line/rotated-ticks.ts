import type { EChartsOption } from 'echarts'
import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-12-30', value: 32100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 23500 },
  { group: 'Dataset 1', date: '2024-01-01', value: 53100 },
  { group: 'Dataset 1', date: '2024-01-02', value: 42300 },
  { group: 'Dataset 1', date: '2024-01-03', value: 12300 },
]

export const option: EChartsOption = createLineOptions(data, {
  timeSeries: true,
  axisLabelRotate: -45,
})
