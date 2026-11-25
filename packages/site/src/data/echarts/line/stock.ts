import type { EChartsOption } from 'echarts'

const dates = [
  '2024-01-02',
  '2024-01-09',
  '2024-01-16',
  '2024-01-23',
  '2024-01-30',
  '2024-02-06',
  '2024-02-13',
  '2024-02-20',
  '2024-02-27',
  '2024-03-05',
  '2024-03-12',
  '2024-03-19',
  '2024-03-26',
  '2024-04-02',
  '2024-04-09',
  '2024-04-16',
  '2024-04-23',
  '2024-04-30',
]
const techFund = [
  148, 152, 155, 149, 161, 170, 165, 172, 168, 175, 183, 179, 188, 192, 185, 198, 205, 201,
]
const growthEtf = [
  210, 208, 215, 218, 212, 225, 230, 228, 235, 240, 237, 245, 250, 244, 252, 258, 262, 270,
]
const valueIndex = [
  95, 98, 101, 99, 105, 108, 103, 110, 107, 115, 118, 112, 120, 116, 125, 128, 122, 130,
]
const blueChip = [
  320, 325, 318, 330, 335, 328, 342, 338, 350, 345, 355, 360, 352, 365, 370, 362, 375, 380,
]
const smallCap = [55, 58, 56, 62, 59, 65, 63, 68, 70, 66, 73, 71, 75, 78, 74, 80, 83, 79]

export const option: EChartsOption = {
  title: { text: 'Weekly Stock Price Trends', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['Tech Fund', 'Growth ETF', 'Value Index', 'Blue-Chip', 'Small-Cap'],
    bottom: 0,
    type: 'scroll',
  },
  grid: { top: 56, bottom: 76, left: 16, right: 24, containLabel: true },
  dataZoom: [{ type: 'slider', bottom: 40, height: 20, start: 0, end: 100 }, { type: 'inside' }],
  xAxis: { type: 'time' },
  yAxis: { type: 'value', name: 'USD', nameLocation: 'middle', nameGap: 44, nameRotate: 90 },
  series: [
    { name: 'Tech Fund', type: 'line', smooth: true, data: dates.map((d, i) => [d, techFund[i]]) },
    {
      name: 'Growth ETF',
      type: 'line',
      smooth: true,
      data: dates.map((d, i) => [d, growthEtf[i]]),
    },
    {
      name: 'Value Index',
      type: 'line',
      smooth: true,
      data: dates.map((d, i) => [d, valueIndex[i]]),
    },
    { name: 'Blue-Chip', type: 'line', smooth: true, data: dates.map((d, i) => [d, blueChip[i]]) },
    { name: 'Small-Cap', type: 'line', smooth: true, data: dates.map((d, i) => [d, smallCap[i]]) },
  ],
}
