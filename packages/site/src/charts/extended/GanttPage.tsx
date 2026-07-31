import type { EChartsOption } from 'echarts'
import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { SideBySide } from '../../components/SideBySide'
import GanttMdx from '../../content/extended/gantt.mdx'

// Tasks encoded as [taskName, startDay, endDay]
// Using numeric day offsets from a project start for simplicity
const tasks = [
  { name: 'Discovery', start: 0, end: 5 },
  { name: 'Design', start: 4, end: 12 },
  { name: 'Development', start: 10, end: 24 },
  { name: 'Testing', start: 20, end: 28 },
  { name: 'Deployment', start: 27, end: 30 },
]

// Floating bar pattern: transparent base bar (start value) + visible bar (duration)
const ganttOption: EChartsOption = {
  tooltip: {
    trigger: 'axis' as const,
    axisPointer: { type: 'shadow' as const },
    formatter: (params: unknown) => {
      if (!Array.isArray(params)) return ''
      const task =
        (params as { name: string; value: number[] }[])[1] ??
        (params as { name: string; value: number[] }[])[0]
      if (!task) return ''
      return `${task.name}<br/>Day ${task.value[0]} → Day ${task.value[0] + task.value[1]}`
    },
  },
  grid: { left: '12%', right: '4%', top: '4%', bottom: '8%', containLabel: false },
  xAxis: {
    type: 'value' as const,
    name: 'Day',
    nameLocation: 'end' as const,
    min: 0,
    max: 30,
    splitLine: { show: true },
  },
  yAxis: {
    type: 'category' as const,
    data: tasks.map((t) => t.name),
    axisTick: { show: false },
    axisLine: { show: false },
  },
  series: [
    {
      // Transparent offset bar — encodes start day
      name: 'offset',
      type: 'bar' as const,
      stack: 'gantt',
      itemStyle: { color: 'transparent', borderColor: 'transparent' },
      emphasis: { disabled: true },
      data: tasks.map((t) => t.start),
    },
    {
      // Visible duration bar
      name: 'duration',
      type: 'bar' as const,
      stack: 'gantt',
      barMaxWidth: 24,
      label: {
        show: true,
        position: 'inside' as const,
        formatter: ({ dataIndex }: { dataIndex: number }) => {
          const t = tasks[dataIndex]
          return `${t.end - t.start}d`
        },
      },
      data: tasks.map((t) => t.end - t.start),
    },
  ],
}

const ganttCode = `const tasks = [
  { name: 'Discovery',   start: 0,  end: 5  },
  { name: 'Design',      start: 4,  end: 12 },
  { name: 'Development', start: 10, end: 24 },
  { name: 'Testing',     start: 20, end: 28 },
  { name: 'Deployment',  start: 27, end: 30 },
]

const ganttOption = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '12%', right: '4%', top: '4%', bottom: '8%' },
  xAxis: { type: 'value', name: 'Day', min: 0, max: 30 },
  yAxis: { type: 'category', data: tasks.map(t => t.name) },
  series: [
    {
      name: 'offset',
      type: 'bar',
      stack: 'gantt',
      itemStyle: { color: 'transparent', borderColor: 'transparent' },
      emphasis: { disabled: true },
      data: tasks.map(t => t.start),
    },
    {
      name: 'duration',
      type: 'bar',
      stack: 'gantt',
      barMaxWidth: 24,
      data: tasks.map(t => t.end - t.start),
    },
  ],
}

<ReactECharts option={ganttOption} theme="carbon-white" />`

export function GanttPage() {
  return (
    <ChartPage
      title="Gantt"
      description="Display project schedules and task durations along a time axis."
      overview={<GanttMdx />}
      examples={
        <SideBySide
          title="Gantt (project schedule)"
          echartsOption={ganttOption}
          extended
          echartsCode={ganttCode}
        />
      }
    />
  )
}
