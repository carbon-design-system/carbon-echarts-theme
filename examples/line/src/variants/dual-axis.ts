import type { EChartsOption } from 'echarts'
import { createTimeSeriesLineOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Temperature', date: '2023-01-01', value: 23 },
  { group: 'Temperature', date: '2023-02-01', value: 15 },
  { group: 'Temperature', date: '2023-03-01', value: 24 },
  { group: 'Temperature', date: '2023-04-01', value: 33 },
  { group: 'Temperature', date: '2023-05-01', value: 23 },
  { group: 'Temperature', date: '2023-06-01', value: 32 },
  { group: 'Temperature', date: '2023-07-01', value: 23 },
  { group: 'Rainfall', date: '2023-01-01', value: 50 },
  { group: 'Rainfall', date: '2023-02-01', value: 65 },
  { group: 'Rainfall', date: '2023-03-01', value: 35 },
  { group: 'Rainfall', date: '2023-04-01', value: 43 },
  { group: 'Rainfall', date: '2023-05-01', value: 53 },
  { group: 'Rainfall', date: '2023-06-01', value: 19 },
  { group: 'Rainfall', date: '2023-07-01', value: 13 },
]

// Rainfall series goes on the secondary (right) Y axis.
export const option: EChartsOption = createTimeSeriesLineOptions(data, {
  smooth: true,
  secondaryGroups: ['Rainfall'],
})
