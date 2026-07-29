import type { ChartTabularData } from '@carbon/echarts-theme/presets'

// Five datasets — both Carbon Charts and ECharts resolve to the same
// categorical palette variant (purple70, cyan50, teal70, magenta70, red50)
// at this series count, making the side-by-side comparison accurate.
export const areaData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Jan', value: 10000 },
  { group: 'Dataset 1', key: 'Feb', value: 65000 },
  { group: 'Dataset 1', key: 'Mar', value: 30000 },
  { group: 'Dataset 1', key: 'Apr', value: 49213 },
  { group: 'Dataset 1', key: 'May', value: 49213 },
  { group: 'Dataset 2', key: 'Jan', value: 20000 },
  { group: 'Dataset 2', key: 'Feb', value: 25000 },
  { group: 'Dataset 2', key: 'Mar', value: 60000 },
  { group: 'Dataset 2', key: 'Apr', value: 32000 },
  { group: 'Dataset 2', key: 'May', value: 49000 },
  { group: 'Dataset 3', key: 'Jan', value: 30000 },
  { group: 'Dataset 3', key: 'Feb', value: 18000 },
  { group: 'Dataset 3', key: 'Mar', value: 45000 },
  { group: 'Dataset 3', key: 'Apr', value: 38000 },
  { group: 'Dataset 3', key: 'May', value: 24000 },
  { group: 'Dataset 4', key: 'Jan', value: 5000 },
  { group: 'Dataset 4', key: 'Feb', value: 40000 },
  { group: 'Dataset 4', key: 'Mar', value: 22000 },
  { group: 'Dataset 4', key: 'Apr', value: 55000 },
  { group: 'Dataset 4', key: 'May', value: 33000 },
  { group: 'Dataset 5', key: 'Jan', value: 15000 },
  { group: 'Dataset 5', key: 'Feb', value: 35000 },
  { group: 'Dataset 5', key: 'Mar', value: 12000 },
  { group: 'Dataset 5', key: 'Apr', value: 28000 },
  { group: 'Dataset 5', key: 'May', value: 41000 },
]
