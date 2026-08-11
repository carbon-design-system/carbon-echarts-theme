/**
 * ECharts equivalents for the Donut and Pie chart pages.
 *
 * Data matches carboncharts/pie.ts (pieData / pieDataMapsTo) exactly.
 */
import type { EChartsOption } from 'echarts'
import { gray60 } from '@carbon/colors'
import { createDonutOptions, createPieOptions, pickColors } from '@carbon/echarts-theme/presets'

// ── Shared data — mirrors carboncharts/pie.ts exactly ────────────────────────

export const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

// valueMapsTo data — mirrors carboncharts/pie.ts pieDataMapsTo exactly
export const dataMapsTo = [
  { group: '2V2N 9KYPM version 1', value: 0, count: 28000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 0, count: 65000 },
  { group: 'JQAI 2M4L1', value: 0, count: 75000 },
  { group: 'J9DZ F37AP', value: 0, count: 3200 },
  { group: 'YEL48 Q6XK YEL48', value: 0, count: 15000 },
  { group: 'Misc', value: 0, count: 25000 },
]

// ── Donut exports ─────────────────────────────────────────────────────────────

/** Slot [0] — basic donut with 'Browsers' center label, left-aligned (default) */
export const donut: EChartsOption = createDonutOptions(data, {
  centerLabel: 'Browsers',
})

/** Slot [1] — donut centered in container */
export const donutCentered: EChartsOption = createDonutOptions(data, {
  centerLabel: 'Browsers',
  alignment: 'center',
})

/** Slot [2] — donut using `count` field as the slice value */
export const donutValueMapsTo: EChartsOption = createDonutOptions(dataMapsTo, {
  valueMapsTo: 'count',
})

// ── Pie exports ───────────────────────────────────────────────────────────────

/** Slot [0] — basic full-circle pie, left-aligned (default) */
export const pie: EChartsOption = createPieOptions(data)

/**
 * Slot [1] — pie centered in container.
 * Carbon Charts pieCenteredOptions uses `alignment: Alignments.CENTER`.
 * In ECharts, centering means moving the legend+chart to the center.
 * We use the same pie data but apply legend positioning to center.
 */
export const pieCentered: EChartsOption = createPieOptions(data, {
  alignment: 'center',
})

/** Slot [1] variant with percentage labels (kept for reference, not used by PiePage) */
export const pieWithPercentage: EChartsOption = createPieOptions(data, {
  showPercentageLabels: true,
})

/** Slot [2] — pie using `count` field as the slice value (valueMapsTo: 'count') */
export const pieValueMapsTo: EChartsOption = createPieOptions(dataMapsTo, {
  valueMapsTo: 'count',
})

// ══════════════════════════════════════════════════════════════════════════════
// SHOWCASE — Pie Charts
// Inspired by official Apache ECharts gallery examples, re-themed with Carbon.
// https://echarts.apache.org/examples/en/index.html#chart-type-pie
// ══════════════════════════════════════════════════════════════════════════════

// ── Showcase Pie 1: Nightingale Rose ─────────────────────────────────────────
// https://echarts.apache.org/examples/en/editor.html?c=pie-roseType
//
// 8 slices — top-level color array sourced from pickColors(8) so the theme
// drives all slice colours. No per-item itemStyle.color needed.

export const pieShowcaseRose: EChartsOption = {
  title: { text: 'Department Resource Allocation', left: 'center', top: 8 },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, type: 'scroll' },
  color: pickColors(8),
  series: [
    {
      name: 'Resources',
      type: 'pie',
      radius: ['15%', '70%'],
      center: ['50%', '48%'],
      roseType: 'area',
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 4 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11 },
      labelLine: { show: true, length: 8, length2: 4 },
      data: [
        { value: 40, name: 'Analytics' },
        { value: 38, name: 'Marketing' },
        { value: 32, name: 'Product' },
        { value: 30, name: 'Engineering' },
        { value: 28, name: 'Design' },
        { value: 24, name: 'Finance' },
        { value: 22, name: 'Legal' },
        { value: 18, name: 'Operations' },
      ],
    },
  ],
}

// ── Showcase Pie 2: Nested Rings ──────────────────────────────────────────────
// https://echarts.apache.org/examples/en/editor.html?c=pie-nest
//
// Two separate pie series on different radii require two separate color arrays.
// Inner ring: 5 slices → pickColors(5). Outer ring: 7 slices → pickColors(7).
// Per-item itemStyle.color is still needed on the outer ring because ECharts only
// auto-rotates the top-level color array across series, not across items within
// a series — and there is no series-level color array on the second pie series.

const _innerColors = pickColors(5)
const _outerColors = pickColors(7)

export const pieShowcaseNested: EChartsOption = {
  title: { text: 'Traffic Source — Channel & Sub-source', left: 'center', top: 8 },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, type: 'scroll' },
  series: [
    {
      name: 'Channel (inner)',
      type: 'pie',
      radius: ['18%', '40%'],
      center: ['50%', '48%'],
      // Inner labels sit inside the slice — black pill ensures legibility on any fill colour
      label: {
        show: true,
        position: 'inner',
        fontSize: 10,
        color: '#ffffff',
        backgroundColor: '#000000',
        borderRadius: 2,
        padding: [2, 4],
        formatter: '{b}: {d}%',
      },
      labelLine: { show: false },
      color: _innerColors,
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 274, name: 'Union Ads' },
        { value: 235, name: 'Video Ads' },
        { value: 400, name: 'Search Engine' },
      ],
    },
    {
      name: 'Source (outer)',
      type: 'pie',
      radius: ['46%', '62%'],
      center: ['50%', '48%'],
      avoidLabelOverlap: true,
      // Outer labels also get black pills so they read over any neighbouring slice colour
      label: {
        show: true,
        fontSize: 11,
        color: '#ffffff',
        backgroundColor: '#000000',
        borderRadius: 2,
        padding: [2, 4],
        formatter: '{b}: {d}%',
      },
      labelLine: { show: true },
      // Per-item colors from pickColors(7) — required because ECharts color rotation
      // is per-series, not per-item within a series
      data: [
        { value: 335, name: 'Direct', itemStyle: { color: _outerColors[0] } },
        { value: 310, name: 'Email', itemStyle: { color: _outerColors[1] } },
        { value: 234, name: 'Union Ads', itemStyle: { color: _outerColors[2] } },
        { value: 40, name: 'Youtube', itemStyle: { color: _outerColors[3] } },
        { value: 135, name: 'Baidu', itemStyle: { color: _outerColors[4] } },
        { value: 147, name: 'Google', itemStyle: { color: _outerColors[5] } },
        { value: 118, name: 'Bing', itemStyle: { color: _outerColors[6] } },
      ],
    },
  ],
}

// ── Showcase Pie 3: Rich-label Pie ────────────────────────────────────────────
// https://echarts.apache.org/examples/en/editor.html?c=pie-labelLine-adjust
//
// 5 slices — top-level color array from pickColors(5), no per-item overrides.

export const pieShowcaseRichLabel: EChartsOption = {
  title: { text: 'Website Traffic Sources', left: 'center', top: 8 },
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c} visits ({d}%)' },
  legend: { bottom: 0 },
  color: pickColors(5),
  series: [
    {
      name: 'Traffic',
      type: 'pie',
      radius: '55%',
      center: ['50%', '48%'],
      startAngle: 90,
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: 'transparent' },
      label: {
        show: true,
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number }
          return `{name|${p.name}}\n{value|${p.value.toLocaleString()}}{unit| visits}`
        },
        rich: {
          name: { fontSize: 12, fontWeight: 'bold', lineHeight: 18 },
          value: { fontSize: 14, fontWeight: 600, lineHeight: 20 },
          unit: { fontSize: 10, lineHeight: 20, color: gray60 },
        },
      },
      labelLine: { show: true, length: 16, length2: 24, smooth: true },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
}
