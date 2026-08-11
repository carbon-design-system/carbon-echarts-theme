import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { Compare } from '../../components/Compare'
import FunnelMdx from '../../content/extended/funnel.mdx'
import { pickColors } from '@carbon/echarts-theme/presets'
import { useTheme } from '../../components/ThemeContext'

// Customized Funnel — Expected vs Actual
// Based on: https://echarts.apache.org/examples/en/editor.html?c=funnel-customize
//
// Two overlapping funnel series share the same data categories.
// The outer "Expected" series is rendered at reduced opacity so the inner
// "Actual" series is visually distinct.
//
// Colors are set via the top-level `color` array (resolved from Carbon's
// N-color palette via pickColors) combined with `colorBy: 'data'` on each
// series. No hex strings appear in data items — the tabular view stays clean.

const funnelStages = [
  { name: 'Show', expectedValue: 100, actualValue: 80 },
  { name: 'Click', expectedValue: 80, actualValue: 60 },
  { name: 'Visit', expectedValue: 60, actualValue: 40 },
  { name: 'Inquiry', expectedValue: 40, actualValue: 20 },
  { name: 'Order', expectedValue: 20, actualValue: 10 },
]

function makeFunnelOption(colorScheme: 'light' | 'dark') {
  const colors = pickColors(funnelStages.length, colorScheme)

  const expectedData = funnelStages.map(({ name, expectedValue }) => ({
    value: expectedValue,
    name,
  }))

  const actualData = funnelStages.map(({ name, actualValue }) => ({
    value: actualValue,
    name,
  }))

  return {
    // Top-level color array — ECharts uses this with colorBy:'data' on each
    // series so both series share the same per-stage color identity.
    color: colors,
    tooltip: {
      trigger: 'item' as const,
      formatter: '{a} <br/>{b} : {c}%',
    },
    legend: {
      data: funnelStages.map((s) => s.name),
    },
    series: [
      {
        name: 'Expected',
        type: 'funnel' as const,
        colorBy: 'data' as const,
        left: '10%',
        width: '80%',
        label: {
          formatter: '{b}Expected',
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          opacity: 0.7,
        },
        emphasis: {
          label: {
            position: 'inside' as const,
            formatter: '{b}Expected: {c}%',
          },
        },
        data: expectedData,
      },
      {
        name: 'Actual',
        type: 'funnel' as const,
        colorBy: 'data' as const,
        left: '10%',
        width: '80%',
        maxSize: '80%',
        label: {
          position: 'inside' as const,
          formatter: '{c}%',
          color: '#fff',
        },
        itemStyle: {
          opacity: 0.5,
          borderColor: '#fff',
          borderWidth: 2,
        },
        emphasis: {
          label: {
            position: 'inside' as const,
            formatter: '{b}Actual: {c}%',
          },
        },
        data: actualData,
        z: 100,
      },
    ],
  }
}

export function FunnelPage() {
  const { theme } = useTheme()
  const colorScheme: 'light' | 'dark' = theme === 'g90' || theme === 'g100' ? 'dark' : 'light'
  const funnelOption = makeFunnelOption(colorScheme)

  return (
    <ChartPage
      title="Funnel"
      description="Show conversion rates through a sequential multi-step process."
      overview={<FunnelMdx />}
      examples={
        <Compare
          title="Funnel — Expected vs Actual"
          echartsOption={funnelOption}
          extended
          height="420px"
          optionCode={`import { pickColors } from '@carbon/echarts-theme/presets'

const stages = [
  { name: 'Show',    expectedValue: 100, actualValue: 80 },
  { name: 'Click',   expectedValue: 80,  actualValue: 60 },
  { name: 'Visit',   expectedValue: 60,  actualValue: 40 },
  { name: 'Inquiry', expectedValue: 40,  actualValue: 20 },
  { name: 'Order',   expectedValue: 20,  actualValue: 10 },
]

const expectedData = stages.map(({ name, expectedValue }) => ({ value: expectedValue, name }))
const actualData   = stages.map(({ name, actualValue })   => ({ value: actualValue,   name }))

const option = {
  color: pickColors(stages.length),
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}%' },
  legend: { data: stages.map((s) => s.name) },
  series: [
    {
      name: 'Expected', type: 'funnel', colorBy: 'data',
      left: '10%', width: '80%',
      label: { formatter: '{b}Expected' },
      labelLine: { show: false },
      itemStyle: { opacity: 0.7 },
      emphasis: { label: { position: 'inside', formatter: '{b}Expected: {c}%' } },
      data: expectedData,
    },
    {
      name: 'Actual', type: 'funnel', colorBy: 'data',
      left: '10%', width: '80%', maxSize: '80%',
      label: { position: 'inside', formatter: '{c}%', color: '#fff' },
      itemStyle: { opacity: 0.5, borderColor: '#fff', borderWidth: 2 },
      emphasis: { label: { position: 'inside', formatter: '{b}Actual: {c}%' } },
      data: actualData, z: 100,
    },
  ],
}

<ReactECharts option={option} theme="carbon-white" />`}
        />
      }
    />
  )
}
