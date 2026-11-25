import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const [C1, C2, C3] = pickColors(3)
const dates = [
  '2024-01-01',
  '2024-02-01',
  '2024-03-01',
  '2024-04-01',
  '2024-05-01',
  '2024-06-01',
  '2024-07-01',
  '2024-08-01',
]

export const option: EChartsOption = {
  title: { text: 'Server Alert States', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Node A', 'Node B', 'Node C'], bottom: 0 },
  grid: { top: 56, bottom: 56, left: 16, right: 24, containLabel: true },
  xAxis: { type: 'category', data: dates, boundaryGap: false },
  yAxis: {
    type: 'value',
    name: 'Alert count',
    nameLocation: 'middle',
    nameGap: 40,
    nameRotate: 90,
    minInterval: 1,
  },
  series: [
    {
      name: 'Node A',
      type: 'line',
      step: 'end',
      data: [3, 3, 5, 5, 2, 2, 4, 4],
      itemStyle: { color: C1 },
      lineStyle: { color: C1 },
      areaStyle: { color: C1 + '22' },
    },
    {
      name: 'Node B',
      type: 'line',
      step: 'end',
      data: [1, 4, 4, 2, 2, 6, 6, 3],
      itemStyle: { color: C2 },
      lineStyle: { color: C2 },
      areaStyle: { color: C2 + '22' },
    },
    {
      name: 'Node C',
      type: 'line',
      step: 'end',
      data: [0, 0, 2, 2, 5, 5, 1, 1],
      itemStyle: { color: C3 },
      lineStyle: { color: C3 },
      areaStyle: { color: C3 + '22' },
    },
  ],
}
