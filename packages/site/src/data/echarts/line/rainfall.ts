import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const [C1, C2] = pickColors(2)
const [, , , accent] = pickColors(4)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const option: EChartsOption = {
  title: { text: 'Rainfall vs Evaporation', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Rainfall', 'Evaporation'], bottom: 0 },
  grid: { top: 56, bottom: 56, left: 16, right: 24, containLabel: true },
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value', name: 'mm', nameLocation: 'middle', nameGap: 40, nameRotate: 90 },
  series: [
    {
      name: 'Rainfall',
      type: 'line',
      smooth: true,
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: C1 + 'cc' },
            { offset: 1, color: C1 + '00' },
          ],
        },
      },
      markArea: {
        silent: true,
        data: [[{ name: 'Rainy season', xAxis: 'Jun' }, { xAxis: 'Sep' }]],
        itemStyle: { color: accent + '1a' },
        label: { color: accent, fontSize: 11 },
      },
    },
    {
      name: 'Evaporation',
      type: 'line',
      smooth: true,
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      lineStyle: { type: 'dashed' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: C2 + '99' },
            { offset: 1, color: C2 + '00' },
          ],
        },
      },
    },
  ],
}
