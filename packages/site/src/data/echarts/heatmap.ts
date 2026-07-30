/**
 * ECharts equivalents for the Heatmap chart page.
 * Carbon heatmap uses letter/month axes; we map those directly.
 */
import type { EChartsOption } from 'echarts'
import { createHeatmapOptions } from '@carbon/echarts-theme/presets'

// Matches carboncharts/heatmap.ts canonical data (letter × month)
const letters = ['A', 'B', 'C', 'D', 'E', 'F']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const data = letters.flatMap((letter, li) =>
  months.map((month, mi) => ({
    group: month,        // y-axis
    key: letter,         // x-axis
    value: ((li * 7 + mi * 13 + 17) % 100) + 1,
  })),
)

export const heatmap: EChartsOption = createHeatmapOptions(data, {
  xAxisLabel: 'Letters',
  yAxisLabel: 'Months',
})
