import type { EChartsOption } from 'echarts'
import { createTimeSeriesLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', date: '2023-01-01T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-01T05:00:00.000Z', value: -12000 },
  { group: 'Dataset 1', date: '2023-01-01T10:00:00.000Z', value: -14000 },
  { group: 'Dataset 1', date: '2023-01-02T00:00:00.000Z', value: -25000 },
  { group: 'Dataset 1', date: '2023-01-02T02:00:00.000Z', value: -26000 },
  { group: 'Dataset 1', date: '2023-01-03T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-03T05:00:00.000Z', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-03T10:00:00.000Z', value: 12000 },
  { group: 'Dataset 1', date: '2023-01-05T00:00:00.000Z', value: 45000 },
  { group: 'Dataset 1', date: '2023-01-07T00:00:00.000Z', value: 49000 },
  { group: 'Dataset 2', date: '2023-01-01T00:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-01T03:00:00.000Z', value: 22000 },
  { group: 'Dataset 2', date: '2023-01-01T16:00:00.000Z', value: 24000 },
  { group: 'Dataset 2', date: '2023-01-02T00:00:00.000Z', value: 35000 },
  { group: 'Dataset 2', date: '2023-01-02T07:00:00.000Z', value: 36000 },
  { group: 'Dataset 2', date: '2023-01-03T00:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-03T06:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-03T18:00:00.000Z', value: 22000 },
  { group: 'Dataset 2', date: '2023-01-05T00:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-06T00:00:00.000Z', value: 52000 },
]

export const option: EChartsOption = createTimeSeriesLineOptions(data, {
  smooth: true,
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})
