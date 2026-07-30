/**
 * ECharts equivalents for the Alluvial / Sankey chart page.
 */
import type { EChartsOption } from 'echarts'
import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import type { AlluvialDatum } from '@carbon/echarts-theme/presets'

// Matches carboncharts/alluvial.ts basic example data
const basicData: AlluvialDatum[] = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  { source: 'About Modal', target: 'Data and AI, Info Architecture', value: 4 },
  { source: 'About Modal', target: 'Public Cloud', value: 3 },
  { source: 'About Modal', target: 'Security', value: 4 },
  { source: 'About Modal', target: 'Automation', value: 8 },
  { source: 'Cards', target: 'Data and AI, AI Apps', value: 6 },
  { source: 'Cards', target: 'Data and AI, Info Architecture', value: 15 },
  { source: 'Cards', target: 'Public Cloud', value: 2 },
  { source: 'Cards', target: 'Security', value: 10 },
  { source: 'Cards', target: 'Automation', value: 13 },
  { source: 'Create Flow', target: 'Data and AI, AI Apps', value: 2 },
  { source: 'Create Flow', target: 'Data and AI, Info Architecture', value: 15 },
  { source: 'Create Flow', target: 'Public Cloud', value: 1 },
  { source: 'Create Flow', target: 'Security', value: 6 },
  { source: 'Create Flow', target: 'Automation', value: 15 },
  { source: 'Notifications', target: 'Data and AI, Info Architecture', value: 14 },
  { source: 'Notifications', target: 'Public Cloud', value: 3 },
  { source: 'Notifications', target: 'Security', value: 3 },
  { source: 'Page Header', target: 'Data and AI, AI Apps', value: 4 },
  { source: 'Page Header', target: 'Data and AI, Info Architecture', value: 8 },
  { source: 'Page Header', target: 'Automation', value: 13 },
]

const multiCategoryData: AlluvialDatum[] = [
  { source: '1st', target: 'Female', value: 25 },
  { source: '1st', target: 'Male', value: 35 },
  { source: '2nd', target: 'Female', value: 35 },
  { source: '2nd', target: 'Male', value: 50 },
  { source: 'Crew', target: 'Male', value: 43 },
  { source: 'Crew', target: 'Female', value: 18 },
  { source: 'Male', target: 'Child', value: 38 },
  { source: 'Male', target: 'Adult', value: 90 },
  { source: 'Female', target: 'Adult', value: 52 },
  { source: 'Female', target: 'Child', value: 26 },
  { source: 'Child', target: 'Yes', value: 58 },
  { source: 'Child', target: 'No', value: 6 },
  { source: 'Adult', target: 'Yes', value: 22 },
  { source: 'Adult', target: 'No', value: 120 },
]

export const alluvialBasic: EChartsOption = createAlluvialOptions(basicData)
export const alluvialMultiCategory: EChartsOption = createAlluvialOptions(multiCategoryData)
