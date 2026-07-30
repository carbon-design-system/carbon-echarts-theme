/**
 * ECharts equivalents for the Treemap chart page.
 * Carbon treemap data has nested parent/children structure.
 */
import type { EChartsOption } from 'echarts'
import { createTreemapOptions } from '@carbon/echarts-theme/presets'

// Flat format: group = parent category, key = leaf name
const data = [
  { group: 'Data assets', key: 'API Connect', value: 102 },
  { group: 'Data assets', key: 'IBM Cloud Object Storage', value: 116 },
  { group: 'Data assets', key: 'Cognos Analytics', value: 46 },
  { group: 'Data assets', key: 'Event Streams', value: 64 },
  { group: 'People', key: 'Watson Studio', value: 55 },
  { group: 'People', key: 'Watson OpenScale', value: 27 },
  { group: 'People', key: 'DB2 Warehouse', value: 49 },
  { group: 'Business process', key: 'Decision Optimization', value: 119 },
  { group: 'Business process', key: 'SPSS Modeler', value: 79 },
]

export const treemap: EChartsOption = createTreemapOptions(data)
