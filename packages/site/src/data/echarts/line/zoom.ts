import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const [C1, C2] = pickColors(2)

function isoDate(offsetDays: number): string {
  return new Date(Date.UTC(2024, 0, 1 + offsetDays)).toISOString().slice(0, 10)
}
function wave(i: number, freq: number, amp: number, base: number): number {
  return Math.round(base + amp * Math.sin((i / 365) * 2 * Math.PI * freq))
}

const days = Array.from({ length: 366 }, (_, i) => i)
const dates = days.map(isoDate)
const dataA = days.map((i) => wave(i, 2, 30, 80))
const dataB = days.map((i) => wave(i, 3, 20, 60))

export const option: EChartsOption = {
  title: { text: 'Daily KPI Trends — 2024', left: 'center', top: 8 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['Metric A', 'Metric B'], bottom: 0 },
  grid: { top: 56, bottom: 80, left: 16, right: 24, containLabel: true },
  toolbox: {
    right: 24,
    top: 8,
    feature: {
      dataZoom: { yAxisIndex: 'none', title: { zoom: 'Zoom', back: 'Restore' } },
      restore: { title: 'Reset' },
    },
  },
  dataZoom: [
    { type: 'slider', bottom: 44, height: 20, start: 60, end: 100 },
    { type: 'inside', start: 60, end: 100 },
  ],
  xAxis: { type: 'category', data: dates, boundaryGap: false },
  yAxis: { type: 'value', nameLocation: 'middle', nameGap: 40, nameRotate: 90 },
  series: [
    {
      name: 'Metric A',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: dataA,
      itemStyle: { color: C1 },
      lineStyle: { color: C1 },
    },
    {
      name: 'Metric B',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: dataB,
      itemStyle: { color: C2 },
      lineStyle: { color: C2 },
    },
  ],
}
