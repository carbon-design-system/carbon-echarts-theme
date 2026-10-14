import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const [C1, C2, C3, C4] = pickColors(4)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function gradient(color: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: color + 'dd' },
      { offset: 1, color: color + '11' },
    ],
  }
}

export const option: EChartsOption = {
  title: { text: 'Channel Traffic (Stacked Area)', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Search Engine', 'Direct', 'Email', 'Union Ads'], bottom: 0 },
  grid: { top: 56, bottom: 56, left: 16, right: 24, containLabel: true },
  xAxis: { type: 'category', data: months, boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Search Engine',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1250, 1100, 980, 870, 820],
      areaStyle: { color: gradient(C1) as never },
    },
    {
      name: 'Direct',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: [620, 732, 701, 734, 890, 930, 920, 850, 780, 650, 600, 590],
      areaStyle: { color: gradient(C2) as never },
    },
    {
      name: 'Email',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: [420, 532, 501, 534, 690, 730, 720, 650, 610, 520, 480, 450],
      areaStyle: { color: gradient(C3) as never },
    },
    {
      name: 'Union Ads',
      type: 'line',
      smooth: true,
      stack: 'total',
      data: [220, 332, 301, 334, 490, 530, 520, 450, 410, 320, 280, 250],
      areaStyle: { color: gradient(C4) as never },
    },
  ],
}
