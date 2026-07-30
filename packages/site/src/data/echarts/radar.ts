/**
 * ECharts equivalents for the Radar chart page.
 * Carbon radar data uses product/feature/score fields.
 */
import type { EChartsOption } from 'echarts'
import { createRadarOptions } from '@carbon/echarts-theme/presets'

// Matches carboncharts/radar.ts radarData (product × feature)
const data = [
  { group: 'Product 1', key: 'Price', value: 60 },
  { group: 'Product 1', key: 'Usability', value: 92 },
  { group: 'Product 1', key: 'Availability', value: 5 },
  { group: 'Product 1', key: 'Performance', value: 85 },
  { group: 'Product 1', key: 'Quality', value: 60 },
  { group: 'Product 2', key: 'Price', value: 70 },
  { group: 'Product 2', key: 'Usability', value: 63 },
  { group: 'Product 2', key: 'Availability', value: 78 },
  { group: 'Product 2', key: 'Performance', value: 50 },
  { group: 'Product 2', key: 'Quality', value: 30 },
]

const indicators = [
  { name: 'Price', max: 100 },
  { name: 'Usability', max: 100 },
  { name: 'Availability', max: 100 },
  { name: 'Performance', max: 100 },
  { name: 'Quality', max: 100 },
]

export const radar: EChartsOption = createRadarOptions(data, { indicators })
