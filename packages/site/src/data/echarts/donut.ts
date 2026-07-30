/**
 * ECharts equivalents for the Donut and Pie chart pages.
 */
import type { EChartsOption } from 'echarts'
import { createDonutOptions, createPieOptions } from '@carbon/echarts-theme/presets'

// Matches carboncharts/donut.ts and pie.ts — same data shared between both
const data = [
  { group: '2V2N 9KYPM', value: 20000 },
  { group: 'L22I P66EP', value: 40000 },
  { group: 'JQAI 2M0J1', value: 60000 },
  { group: 'J9DK 1V2N', value: 10000 },
]

export const donut: EChartsOption = createDonutOptions(data)
export const pie: EChartsOption = createPieOptions(data)
