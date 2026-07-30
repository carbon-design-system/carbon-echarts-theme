/**
 * ECharts equivalents for the Histogram chart page.
 * Carbon histogram uses raw observation data (e.g. age values).
 */
import type { EChartsOption } from 'echarts'
import { createHistogramOptions } from '@carbon/echarts-theme/presets'

// Matches carboncharts/histogram.ts — raw age observations
const rawData = [
  20, 21, 23, 21, 23, 24, 30, 34, 35, 30, 40, 43, 45, 46, 40,
  43, 45, 48, 50, 55, 66, 58, 70, 78, 71, 75, 83, 86, 87, 91,
].map((v) => ({ group: 'Dataset 1', value: v }))

export const histogram: EChartsOption = createHistogramOptions(rawData, { binWidth: 10 })
