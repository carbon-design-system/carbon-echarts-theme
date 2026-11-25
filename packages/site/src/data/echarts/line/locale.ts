import type { EChartsOption } from 'echarts'
import { createLineOptions } from '@carbon/echarts-theme/presets'

// Note: ECharts time axis uses browser locale; no per-chart locale API.
const data = [
  { group: 'Dataset 1', date: '2023-10-01', value: 10 },
  { group: 'Dataset 1', date: '2023-11-01', value: 10 },
  { group: 'Dataset 1', date: '2023-12-01', value: 10 },
  { group: 'Dataset 1', date: '2024-01-01', value: 10 },
  { group: 'Dataset 1', date: '2024-02-01', value: 10 },
  { group: 'Dataset 1', date: '2024-03-01', value: 10 },
  { group: 'Dataset 1', date: '2019-04-01', value: 10 },
]

export const option: EChartsOption = createLineOptions(data, {
  timeSeries: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})
