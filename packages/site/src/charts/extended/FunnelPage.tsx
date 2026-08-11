import React from 'react'
import { white, gray30, gray70 } from '@carbon/colors'
import { ChartPage } from '../../components/ChartPage'
import { Compare } from '../../components/Compare'
import FunnelMdx from '../../content/extended/funnel.mdx'
import { pickColors } from '@carbon/echarts-theme/presets'
import { useTheme } from '../../components/ThemeContext'

// ── Example 1 — Customized Funnel (Expected vs Actual) ───────────────────────
// Based on: https://echarts.apache.org/examples/en/editor.html?c=funnel-customize
//
// Two overlapping funnel series share the same data categories.
// The outer "Expected" series is rendered at reduced opacity so the inner
// "Actual" series is visually distinct.

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
          color: white,
        },
        itemStyle: {
          opacity: 0.5,
          borderColor: white,
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

// ── Example 2 — Funnel with Multiple Aligned Series ──────────────────────────
// Based on: https://echarts.apache.org/examples/en/editor.html?c=funnel-align
//
// Four independent funnel series placed side by side, each representing a
// different acquisition channel. Labels appear inside the bands. This layout
// makes cross-channel comparison very readable at a glance.

const channels = ['Organic', 'Paid Search', 'Social', 'Referral']
const channelStages = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase']

// Per-channel conversion values (awareness = 100 baseline, then drop-offs)
const channelData: Record<string, number[]> = {
  Organic: [100, 72, 48, 30, 18],
  'Paid Search': [100, 85, 64, 42, 28],
  Social: [100, 60, 35, 20, 10],
  Referral: [100, 78, 58, 38, 24],
}

function makeAlignedFunnelOption(colorScheme: 'light' | 'dark') {
  const colors = pickColors(channels.length, colorScheme)

  // Each series occupies a 22%-wide slot with 2% gap on each side
  const slotWidth = 22
  const gapBetween = 3
  const totalWidth = channels.length * slotWidth + (channels.length - 1) * gapBetween
  const startLeft = Math.round((100 - totalWidth) / 2)

  const series = channels.map((channel, i) => {
    const left = startLeft + i * (slotWidth + gapBetween)
    return {
      name: channel,
      type: 'funnel' as const,
      left: `${left}%`,
      width: `${slotWidth}%`,
      sort: 'descending' as const,
      gap: 2,
      label: {
        show: true,
        position: 'inside' as const,
        formatter: '{c}%',
        fontSize: 11,
        color: white,
      },
      itemStyle: {
        color: colors[i],
        opacity: 0.9,
        borderWidth: 0,
      },
      emphasis: {
        label: {
          fontSize: 13,
          formatter: '{b}\n{c}%',
        },
      },
      data: channelStages.map((stage, j) => ({
        name: stage,
        value: channelData[channel][j],
      })),
    }
  })

  return {
    backgroundColor: 'transparent',
    title: {
      text: 'Acquisition Channel Comparison',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' as const },
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: unknown) => {
        const p = params as { seriesName?: string; name: string; value: number }
        return `${p.seriesName ?? ''}<br/>${p.name}: <b>${p.value}%</b>`
      },
    },
    legend: {
      data: channels,
      top: 30,
    },
    // Channel name annotations above each funnel
    graphic: channels.map((channel, i) => {
      const slotLeft = startLeft + i * (slotWidth + gapBetween)
      return {
        type: 'text',
        left: `${slotLeft + slotWidth / 2}%`,
        top: 62,
        style: {
          text: channel,
          textAlign: 'center' as const,
          fill: colorScheme === 'dark' ? gray30 : gray70,
          fontSize: 12,
          fontWeight: 'bold' as const,
        },
      }
    }),
    series,
  }
}

// ── Example 3 — Pyramid (Inverted Funnel) ────────────────────────────────────
// Based on: https://echarts.apache.org/examples/en/editor.html?c=funnel
//
// Uses sort: 'ascending' so the smallest value is at the top and the shape
// widens downward, creating a classic pyramid diagram. Labels alternate
// left/right and a rich tooltip shows the percentage.

const pyramidLevels = [
  { name: 'Strategy', value: 100 },
  { name: 'Technology', value: 80 },
  { name: 'Operations', value: 60 },
  { name: 'Processes', value: 40 },
  { name: 'Data', value: 20 },
]

function makePyramidOption(colorScheme: 'light' | 'dark') {
  const colors = pickColors(pyramidLevels.length, colorScheme)

  return {
    color: colors,
    tooltip: {
      trigger: 'item' as const,
      formatter: '{a} <br/>{b}: {c}',
    },
    legend: {
      data: pyramidLevels.map((l) => l.name),
      orient: 'vertical' as const,
      left: 'left',
      top: 'center',
    },
    series: [
      {
        name: 'Enterprise Architecture',
        type: 'funnel' as const,
        colorBy: 'data' as const,
        sort: 'ascending' as const,
        gap: 2,
        left: '20%',
        width: '60%',
        top: 40,
        bottom: 20,
        label: {
          show: true,
          position: 'inside' as const,
          formatter: '{b}',
          color: white,
          fontWeight: 'bold' as const,
          fontSize: 13,
        },
        itemStyle: {
          borderWidth: 0,
          opacity: 0.92,
        },
        emphasis: {
          label: {
            fontSize: 15,
            formatter: '{b}: {c}',
          },
        },
        data: pyramidLevels.map(({ name, value }) => ({ name, value })),
      },
    ],
  }
}

// ── Page component ────────────────────────────────────────────────────────────

export function FunnelPage() {
  const { theme } = useTheme()
  const colorScheme: 'light' | 'dark' = theme === 'g90' || theme === 'g100' ? 'dark' : 'light'

  const funnelOption = makeFunnelOption(colorScheme)
  const alignedOption = makeAlignedFunnelOption(colorScheme)
  const pyramidOption = makePyramidOption(colorScheme)

  return (
    <ChartPage
      title="Funnel"
      description="Show conversion rates through a sequential multi-step process."
      overview={<FunnelMdx />}
      examples={
        <>
          {/* Example 1 — Expected vs Actual overlay */}
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
      label: { position: 'inside', formatter: '{c}%', color: white },
      itemStyle: { opacity: 0.5, borderColor: white, borderWidth: 2 },
      emphasis: { label: { position: 'inside', formatter: '{b}Actual: {c}%' } },
      data: actualData, z: 100,
    },
  ],
}

<ReactECharts option={option} theme="carbon-white" />`}
          />

          {/* Example 2 — Multiple aligned funnels (channel comparison) */}
          <Compare
            title="Funnel — Multi-Channel Acquisition Comparison"
            echartsOption={alignedOption}
            extended
            height="460px"
            optionCode={`import { pickColors } from '@carbon/echarts-theme/presets'

const channels = ['Organic', 'Paid Search', 'Social', 'Referral']
const stages   = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase']

const channelData = {
  Organic:      [100, 72, 48, 30, 18],
  'Paid Search':[100, 85, 64, 42, 28],
  Social:       [100, 60, 35, 20, 10],
  Referral:     [100, 78, 58, 38, 24],
}

const colors = pickColors(channels.length)

// Place four funnels side by side — each 22% wide with a 3% gap
const series = channels.map((channel, i) => ({
  name: channel,
  type: 'funnel',
  left: \`\${3 + i * 25}%\`,
  width: '22%',
  sort: 'descending',
  gap: 2,
  label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 11, color: white },
  itemStyle: { color: colors[i], opacity: 0.9, borderWidth: 0 },
  data: stages.map((stage, j) => ({ name: stage, value: channelData[channel][j] })),
}))

const option = {
  title: { text: 'Acquisition Channel Comparison', left: 'center' },
  tooltip: { trigger: 'item', formatter: (p) => \`\${p.seriesName}<br/>\${p.name}: <b>\${p.value}%</b>\` },
  legend: { data: channels, top: 30 },
  series,
}

<ReactECharts option={option} theme="carbon-white" style={{ height: '460px' }} />`}
          />

          {/* Example 3 — Pyramid (ascending funnel) */}
          <Compare
            title="Pyramid — Enterprise Architecture Layers"
            echartsOption={pyramidOption}
            extended
            height="380px"
            optionCode={`import { pickColors } from '@carbon/echarts-theme/presets'

const levels = [
  { name: 'Strategy',   value: 100 },
  { name: 'Technology', value: 80  },
  { name: 'Operations', value: 60  },
  { name: 'Processes',  value: 40  },
  { name: 'Data',       value: 20  },
]

const option = {
  color: pickColors(levels.length),
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}' },
  legend: { data: levels.map((l) => l.name), orient: 'vertical', left: 'left', top: 'center' },
  series: [{
    name: 'Enterprise Architecture',
    type: 'funnel',
    colorBy: 'data',
    sort: 'ascending',   // ← pyramid shape: smallest at top, widens downward
    gap: 2,
    left: '20%', width: '60%',
    label: { show: true, position: 'inside', formatter: '{b}', color: white, fontWeight: 'bold' },
    itemStyle: { borderWidth: 0, opacity: 0.92 },
    data: levels.map(({ name, value }) => ({ name, value })),
  }],
}

<ReactECharts option={option} theme="carbon-white" style={{ height: '380px' }} />`}
          />
        </>
      }
    />
  )
}
