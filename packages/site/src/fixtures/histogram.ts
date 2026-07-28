import type { ChartTabularData } from '@carbon/echarts-theme/presets'

// Pre-binned histogram data: key = bin label (e.g. "10–20"), value = count
// createHistogramOptions expects ChartTabularData (group=series, key=bin, value=count)
export const histogramData: ChartTabularData = [
  { group: 'Frequency', key: '10–20', value: 2 },
  { group: 'Frequency', key: '20–30', value: 4 },
  { group: 'Frequency', key: '30–40', value: 6 },
  { group: 'Frequency', key: '40–50', value: 10 },
  { group: 'Frequency', key: '50–60', value: 12 },
  { group: 'Frequency', key: '60–70', value: 8 },
  { group: 'Frequency', key: '70–80', value: 5 },
  { group: 'Frequency', key: '80–90', value: 2 },
  { group: 'Frequency', key: '90–100', value: 1 },
]
