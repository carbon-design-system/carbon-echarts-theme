/**
 * ECharts equivalents for the Boxplot chart page.
 * Carbon boxplot uses raw observations per group/key.
 */
import type { EChartsOption } from 'echarts'
import { createBoxplotOptions } from '@carbon/echarts-theme/presets'

// Matches carboncharts/boxplot.ts data (Q1-Q4 × Mon-Fri)
export const rawData = [
  { group: 'Q1', key: 'Q1', value: 65000 },
  { group: 'Q1', key: 'Q1', value: 29123 },
  { group: 'Q1', key: 'Q1', value: 35213 },
  { group: 'Q1', key: 'Q1', value: 51213 },
  { group: 'Q1', key: 'Q1', value: 16932 },
  { group: 'Q2', key: 'Q2', value: 32432 },
  { group: 'Q2', key: 'Q2', value: 14312 },
  { group: 'Q2', key: 'Q2', value: 66456 },
  { group: 'Q2', key: 'Q2', value: 21312 },
  { group: 'Q2', key: 'Q2', value: 37234 },
  { group: 'Q3', key: 'Q3', value: 5312 },
  { group: 'Q3', key: 'Q3', value: 23232 },
  { group: 'Q3', key: 'Q3', value: 34232 },
  { group: 'Q3', key: 'Q3', value: 12312 },
  { group: 'Q3', key: 'Q3', value: 44234 },
  { group: 'Q4', key: 'Q4', value: 32423 },
  { group: 'Q4', key: 'Q4', value: 21313 },
  { group: 'Q4', key: 'Q4', value: 64353 },
  { group: 'Q4', key: 'Q4', value: 24134 },
  { group: 'Q4', key: 'Q4', value: 45134 },
]

export const boxplotVertical: EChartsOption = createBoxplotOptions(rawData)
export const boxplotHorizontal: EChartsOption = createBoxplotOptions(rawData, { horizontal: true })
