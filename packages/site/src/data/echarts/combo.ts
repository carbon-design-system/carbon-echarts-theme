/**
 * ECharts equivalents for the Combo chart page.
 */
import type { EChartsOption } from 'echarts'
import { createComboOptions } from '@carbon/echarts-theme/presets'

// Matches carboncharts/combo.ts comboSimpleData (School A + Temperature)
const simpleData = [
  { group: 'School A', key: 'Monday', value: 10 },
  { group: 'School A', key: 'Tuesday', value: 20 },
  { group: 'School A', key: 'Wednesday', value: 15 },
  { group: 'School A', key: 'Thursday', value: 25 },
  { group: 'School A', key: 'Friday', value: 30 },
  { group: 'Temperature', key: 'Monday', value: 72 },
  { group: 'Temperature', key: 'Tuesday', value: 78 },
  { group: 'Temperature', key: 'Wednesday', value: 83 },
  { group: 'Temperature', key: 'Thursday', value: 75 },
  { group: 'Temperature', key: 'Friday', value: 70 },
]

// Grouped combo data
const groupedData = [
  { group: 'Location 1', key: 'Qty', value: 65000 },
  { group: 'Location 1', key: 'More', value: 29123 },
  { group: 'Location 1', key: 'Sold', value: 35213 },
  { group: 'Location 2', key: 'Qty', value: 32432 },
  { group: 'Location 2', key: 'More', value: 14312 },
  { group: 'Location 2', key: 'Sold', value: 66456 },
  { group: 'Temperature', key: 'Qty', value: 22 },
  { group: 'Temperature', key: 'More', value: 18 },
  { group: 'Temperature', key: 'Sold', value: 25 },
]

export const comboBarLine: EChartsOption = createComboOptions(simpleData, {
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

export const comboGroupedLine: EChartsOption = createComboOptions(groupedData, {
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})
