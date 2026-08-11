import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import PieMdx from '../content/pie.mdx'
import { chartTypes, examples } from '../data/carboncharts/pie'
import {
  pie,
  pieCentered,
  pieValueMapsTo,
  data,
  dataMapsTo,
  pieShowcaseRose,
  pieShowcaseNested,
  pieShowcaseRichLabel,
} from '../data/echarts/donut'

// Filter to test-tagged examples only
// Carbon test order: [0] Pie, [1] Pie (centered), [2] Pie (value maps to count)
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

const titles = ['Pie', 'Pie (centered)', 'Pie (value maps to count)']

const echartsOptions = [pie, pieCentered, pieValueMapsTo]

const codeSamples = [
  `import { createPieOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

const option = createPieOptions(data)`,

  `import { createPieOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

const option = createPieOptions(data, { alignment: 'center' })`,

  `import { createPieOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: '2V2N 9KYPM version 1', value: 0, count: 28000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 0, count: 65000 },
  { group: 'JQAI 2M4L1', value: 0, count: 75000 },
  { group: 'J9DZ F37AP', value: 0, count: 3200 },
  { group: 'YEL48 Q6XK YEL48', value: 0, count: 15000 },
  { group: 'Misc', value: 0, count: 25000 },
]

const option = createPieOptions(data, { valueMapsTo: 'count' })`,
]

const chartDataSamples = [
  data, // [0] Pie
  data, // [1] Pie (centered)
  dataMapsTo, // [2] Pie (value maps to count)
]

export function PiePage() {
  return (
    <ChartPage
      title="Pie"
      description="Show part-to-whole relationships as proportional slices."
      overview={<PieMdx />}
      examples={
        <>
          {/* ── Showcase: impressive ECharts examples from the official gallery ── */}
          <Compare
            title="Nightingale Rose — polar-area chart (roseType: 'area')"
            echartsOption={pieShowcaseRose}
            extended
            height="440px"
            optionCode={`import type { EChartsOption } from 'echarts'
import { pickColors } from '@carbon/echarts-theme/presets'

const option: EChartsOption = {
  title: { text: 'Department Resource Allocation', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  color: pickColors(8),
  series: [{
    name: 'Resources',
    type: 'pie',
    radius: ['15%', '70%'],
    roseType: 'area',           // ← Nightingale rose: radius encodes magnitude
    itemStyle: { borderRadius: 4 },
    label: { formatter: '{b}\\n{d}%' },
    data: [
      { value: 40, name: 'Analytics' },
      { value: 38, name: 'Marketing' },
      { value: 32, name: 'Product' },
      // ...
    ],
  }],
}

<ReactECharts option={option} theme="carbon-white" />`}
          />
          <Compare
            title="Nested Rings — inner channel ring + outer sub-source ring"
            echartsOption={pieShowcaseNested}
            extended
            height="440px"
            optionCode={`import type { EChartsOption } from 'echarts'
import { white, black } from '@carbon/colors'
import { pickColors } from '@carbon/echarts-theme/presets'

// Carbon palette — sourced from pickColors so slices stay in sync with the theme
const inner = pickColors(5)
const outer = pickColors(7)

// Black pill label style — white text on black background reads against any slice fill
const pillLabel = { color: white, backgroundColor: black, borderRadius: 2, padding: [2, 4] }

const option: EChartsOption = {
  title: { text: 'Traffic Source — Channel & Sub-source', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [
    {
      name: 'Channel (inner)',
      type: 'pie',
      radius: ['18%', '40%'],
      color: inner,
      label: { ...pillLabel, show: true, position: 'inner', fontSize: 10, formatter: '{b}: {d}%' },
      labelLine: { show: false },
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        // ...
      ],
    },
    {
      name: 'Source (outer)',
      type: 'pie',
      radius: ['46%', '62%'],
      label: { ...pillLabel, show: true, fontSize: 11, formatter: '{b}: {d}%' },
      data: [
        { value: 335, name: 'Direct',    itemStyle: { color: outer[0] } },
        { value: 310, name: 'Email',     itemStyle: { color: outer[1] } },
        { value: 234, name: 'Union Ads', itemStyle: { color: outer[2] } },
        // ...
      ],
    },
  ],
}

<ReactECharts option={option} theme="carbon-white" />`}
          />
          <Compare
            title="Rich-label Pie — polyline connectors with name, value &amp; unit callouts"
            echartsOption={pieShowcaseRichLabel}
            extended
            height="460px"
            optionCode={`import type { EChartsOption } from 'echarts'
import { gray60 } from '@carbon/colors'

const option: EChartsOption = {
  title: { text: 'Website Traffic Sources', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c} visits ({d}%)' },
  series: [{
    name: 'Traffic',
    type: 'pie',
    radius: '55%',
    itemStyle: { borderRadius: 6 },
    label: {
      show: true,
      formatter: (p) =>
        \`{name|\${p.name}}\\n{value|\${p.value.toLocaleString()}}{unit| visits}\`,
      rich: {
        name:  { fontSize: 12, fontWeight: 'bold', lineHeight: 18 },
        value: { fontSize: 14, fontWeight: 600,    lineHeight: 20 },
        unit:  { fontSize: 10, lineHeight: 20, color: gray60 },
      },
    },
    labelLine: { show: true, smooth: true, length: 16, length2: 24 },
    data: [
      { value: 1048, name: 'Search Engine' },
      { value:  735, name: 'Direct' },
      { value:  580, name: 'Email' },
      { value:  484, name: 'Union Ads' },
      { value:  300, name: 'Video Ads' },
    ],
  }],
}

<ReactECharts option={option} theme="carbon-white" />`}
          />

          {/* ── Carbon Charts parity comparisons ── */}
          {testExamples.map((ex, i) => (
            <Compare
              key={i}
              title={titles[i] ?? `Example ${i + 1}`}
              echartsOption={echartsOptions[i] ?? pie}
              carbonExample={ex}
              chartClass={chartTypes.vanilla}
              optionCode={codeSamples[i]}
              chartData={chartDataSamples[i]}
            />
          ))}
        </>
      }
    />
  )
}
