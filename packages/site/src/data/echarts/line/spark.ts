import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const [C1] = pickColors(1)

// Render one spark per card — no axes, no legend, just the trend shape.
export const option: EChartsOption = {
  grid: { top: 4, bottom: 4, left: 4, right: 4 },
  xAxis: { type: 'category', show: false, boundaryGap: false },
  yAxis: { type: 'value', show: false },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: [12, 15, 11, 18, 14, 20, 17, 22, 19, 25],
      itemStyle: { color: C1 },
      lineStyle: { color: C1, width: 2 },
      areaStyle: { color: C1 + '33' },
    },
  ],
}
