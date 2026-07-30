/**
 * ECharts equivalents for the Bar chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/bar.ts.
 *
 * Canonical test examples we cover:
 *  [0]  Vertical simple bar (discrete)
 *  [1]  Vertical simple bar (time series)
 *  [5]  Horizontal simple bar (discrete)
 *  [6]  Horizontal simple bar (time series)
 *  [9]  Horizontal floating bar (time series)
 *  [10] Floating vertical bar (discrete)
 *  [11] Floating horizontal bar (discrete)
 */
import type { EChartsOption } from 'echarts'
import {
  createBarOptions,
  createHorizontalBarOptions,
  createFloatingBarOptions,
} from '@carbon/echarts-theme/presets'

const simpleBarData = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

const timeSeriesData = [
  { group: 'Qty', key: 'Jan 1', value: 10000 },
  { group: 'More', key: 'Jan 2', value: 65000 },
  { group: 'Sold', key: 'Jan 3', value: 30000 },
  { group: 'Restocking', key: 'Jan 6', value: 49213 },
  { group: 'Misc', key: 'Jan 7', value: 51213 },
]

const floatingBarData = [
  { group: 'Qty', key: 'Qty', value: 65000, base: 30000 },
  { group: 'More', key: 'More', value: 29123, base: 15000 },
  { group: 'Sold', key: 'Sold', value: 35213, base: 22000 },
  { group: 'Restocking', key: 'Restocking', value: 51213, base: 28000 },
  { group: 'Misc', key: 'Misc', value: 16932, base: 3000 },
]

/** ECharts option for each bar test example, same order as the carbon test examples array */
export const barSimple: EChartsOption = createBarOptions(simpleBarData)
export const barTimeSeries: EChartsOption = createBarOptions(timeSeriesData)
export const barHorizontal: EChartsOption = createHorizontalBarOptions(simpleBarData)
export const barHorizontalTimeSeries: EChartsOption = createHorizontalBarOptions(timeSeriesData)
export const barFloating: EChartsOption = createFloatingBarOptions(floatingBarData)
export const barFloatingHorizontal: EChartsOption = createFloatingBarOptions(floatingBarData, { horizontal: true })
