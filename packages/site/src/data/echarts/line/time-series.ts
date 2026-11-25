import type { EChartsOption } from 'echarts'
import { createTimeSeriesLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-08', value: null as unknown as number },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-08', value: 27432 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 3', date: '2023-01-01', value: 40000 },
  { group: 'Dataset 3', date: '2023-01-05', value: null as unknown as number },
  { group: 'Dataset 3', date: '2023-01-08', value: 18000 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213 },
  { group: 'Dataset 4', date: '2023-01-02', value: 20000 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-15', value: 25332 },
  { group: 'Dataset 4', date: '2023-01-19', value: null as unknown as number },
]

export const option: EChartsOption = createTimeSeriesLineOptions(data, {
  smooth: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})
