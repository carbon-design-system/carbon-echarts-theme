import type { EChartsOption } from 'echarts'
import { createLineOptions } from '@carbon/echarts-theme/presets'

const HEX = '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9'

const data = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: HEX, value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: HEX, value: 21400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: HEX, value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'LongLabelShouldBeTruncated', key: 'Qty', value: 22000 },
  { group: 'LongLabelShouldBeTruncated', key: 'More', value: 1200 },
  { group: 'LongLabelShouldBeTruncated', key: 'Sold', value: 9000 },
  { group: 'LongLabelShouldBeTruncated', key: HEX, value: 24000 },
  { group: 'LongLabelShouldBeTruncated', key: 'Misc', value: 3000 },
]

export const option: EChartsOption = createLineOptions(data, {
  xAxisTitle: '2023 Annual Sales Figures',
  yAxisTitle: 'Conversion rate',
})
