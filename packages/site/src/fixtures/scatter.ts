import type { ChartTabularData } from '@carbon/echarts-theme/presets'

export const scatterData: ChartTabularData = [
  { group: 'Dataset 1', key: '32', value: 20 },
  { group: 'Dataset 1', key: '42', value: 70 },
  { group: 'Dataset 1', key: '15', value: 60 },
  { group: 'Dataset 1', key: '72', value: 30 },
  { group: 'Dataset 1', key: '88', value: 10 },
  { group: 'Dataset 2', key: '10', value: 80 },
  { group: 'Dataset 2', key: '50', value: 50 },
  { group: 'Dataset 2', key: '78', value: 22 },
  { group: 'Dataset 2', key: '25', value: 55 },
  { group: 'Dataset 2', key: '60', value: 40 },
]

// Bubble: [x, y, size]
export const bubbleData: [number, number, number][] = [
  [10, 50, 15],
  [20, 30, 30],
  [40, 70, 8],
  [60, 20, 45],
  [80, 55, 20],
  [30, 80, 35],
]
