import type { EChartsOption } from 'echarts'
import { createLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-12-30', value: 300100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 235000 },
  { group: 'Dataset 1', date: '2024-01-01', value: 153100 },
  { group: 'Dataset 1', date: '2024-01-02', value: 142300 },
  { group: 'Dataset 1', date: '2024-01-03', value: 82300 },
]

export const option: EChartsOption = createLineOptions(data, {
  timeSeries: true,
  logScale: true,
})
