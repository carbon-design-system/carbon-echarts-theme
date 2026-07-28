import type { ChartTabularData } from '@carbon/echarts-theme/presets'

// ── Bar ────────────────────────────────────────────────────────────────────
export const barData: ChartTabularData = [
  { group: 'Dataset 1', value: 65000 },
  { group: 'Dataset 2', value: 29123 },
  { group: 'Dataset 3', value: 35213 },
  { group: 'Dataset 4', value: 51213 },
  { group: 'Dataset 5', value: 16988 },
]

export const groupedBarData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: 29123 },
  { group: 'Dataset 2', key: 'Qty', value: 35213 },
  { group: 'Dataset 2', key: 'More', value: 51213 },
  { group: 'Dataset 3', key: 'Qty', value: 16988 },
  { group: 'Dataset 3', key: 'More', value: 57788 },
]
