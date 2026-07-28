import type { AlluvialDatum } from '@carbon/echarts-theme/presets'

export const alluvialData: AlluvialDatum[] = [
  { source: 'Tier 1', target: 'Tier 2', value: 200 },
  { source: 'Tier 1', target: 'Tier 3', value: 100 },
  { source: 'Tier 2', target: 'Tier 4', value: 150 },
  { source: 'Tier 2', target: 'Tier 5', value: 50 },
  { source: 'Tier 3', target: 'Tier 4', value: 60 },
  { source: 'Tier 3', target: 'Tier 5', value: 40 },
]
