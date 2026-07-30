import { describe, it, expect } from 'vitest'
import {
  groupByGroup,
  pickColors,
  createAlluvialOptions,
  createAlluvialOptionsFromTabular,
  createTreeOptions,
  createTreeOptionsFromTabular,
  createBarOptions,
  createGroupedBarOptions,
  createStackedBarOptions,
  createHorizontalBarOptions,
  createFloatingBarOptions,
  createLineOptions,
  createStepLineOptions,
  createTimeSeriesLineOptions,
  createAreaOptions,
  createStackedAreaOptions,
  createDonutOptions,
  createPieOptions,
  createScatterOptions,
  createBubbleOptions,
  createHeatmapOptions,
  createGaugeOptions,
  createMeterOptions,
  createHistogramOptions,
  createTreemapOptions,
  createRadarOptions,
  createBoxplotOptions,
  createComboOptions,
  createLollipopOptions,
  createSparklineOptions,
} from '../presets/index'
import type { ChartTabularData } from '../presets/_transform'

// ── Shared test fixtures ──────────────────────────────────────────────────────

/** Two groups, three categories */
const groupedBarData: ChartTabularData = [
  { group: 'Alpha', key: 'Jan', value: 10 },
  { group: 'Alpha', key: 'Feb', value: 20 },
  { group: 'Alpha', key: 'Mar', value: 15 },
  { group: 'Beta', key: 'Jan', value: 8 },
  { group: 'Beta', key: 'Feb', value: 30 },
  { group: 'Beta', key: 'Mar', value: 12 },
]

const singleGroupData: ChartTabularData = [
  { group: 'Dataset', key: 'Q1', value: 40 },
  { group: 'Dataset', key: 'Q2', value: 55 },
  { group: 'Dataset', key: 'Q3', value: 50 },
]

const pieData: ChartTabularData = [
  { group: 'Slice A', value: 30 },
  { group: 'Slice B', value: 50 },
  { group: 'Slice C', value: 20 },
]

/** Simple bar: no `key` field — group IS the category axis */
const simpleBarData: ChartTabularData = [
  { group: 'Dataset 1', value: 65000 },
  { group: 'Dataset 2', value: 29123 },
  { group: 'Dataset 3', value: 35213 },
  { group: 'Dataset 4', value: 51213 },
  { group: 'Dataset 5', value: 16988 },
]

// ── _transform ────────────────────────────────────────────────────────────────

describe('groupByGroup', () => {
  it('groups data by the group field', () => {
    const { groups, categories } = groupByGroup(groupedBarData, 'key')
    expect(groups).toHaveLength(2)
    expect(categories).toEqual(['Jan', 'Feb', 'Mar'])
  })

  it('preserves category insertion order', () => {
    const data: ChartTabularData = [
      { group: 'A', key: 'Z', value: 1 },
      { group: 'A', key: 'A', value: 2 },
    ]
    const { categories } = groupByGroup(data, 'key')
    expect(categories[0]).toBe('Z')
    expect(categories[1]).toBe('A')
  })

  it('fills missing group/category intersections with null', () => {
    const sparse: ChartTabularData = [
      { group: 'X', key: 'a', value: 5 },
      { group: 'Y', key: 'b', value: 7 },
    ]
    const { groups } = groupByGroup(sparse, 'key')
    const xGroup = groups.find((g) => g.name === 'X')!
    // X has no 'b' entry → null
    expect(xGroup.data.find((d) => d.name === 'b')?.value).toBeNull()
  })

  it('handles date field correctly', () => {
    const timeData: ChartTabularData = [
      { group: 'A', date: '2024-01-01', value: 10 },
      { group: 'A', date: '2024-02-01', value: 20 },
    ]
    const { categories } = groupByGroup(timeData, 'date')
    expect(categories).toHaveLength(2)
  })
})

// ── pickColors ────────────────────────────────────────────────────────────────

describe('pickColors', () => {
  it('returns the N-optimised 2-color light palette for 2 series', () => {
    const colors = pickColors(2, 'light')
    expect(colors).toEqual(['#6929c4', '#009d9a'])
  })

  it('returns a single color for 1 series (light)', () => {
    const colors = pickColors(1, 'light')
    expect(colors).toEqual(['#6929c4'])
  })

  it('returns the N-optimised 2-color dark palette for 2 series', () => {
    const colors = pickColors(2, 'dark')
    expect(colors).toEqual(['#8a3ffc', '#08bdba'])
  })

  it('defaults to light scheme', () => {
    expect(pickColors(2)).toEqual(['#6929c4', '#009d9a'])
  })

  it('returns correct length array for all N=1..5', () => {
    for (let n = 1; n <= 5; n++) {
      expect(pickColors(n)).toHaveLength(n)
    }
  })

  it('falls back to 14-color sequential palette for N > 5', () => {
    const colors = pickColors(6, 'light')
    expect(colors).toHaveLength(6)
    // First color should match start of light categorical palette (purple70)
    expect(colors[0]).toBe('#6929c4')
  })
})

// ── Bar ───────────────────────────────────────────────────────────────────────

describe('createBarOptions', () => {
  it('returns a valid ECharts option with series', () => {
    const opt = createBarOptions(groupedBarData)
    expect(opt.series).toBeDefined()
    expect(Array.isArray(opt.series)).toBe(true)
  })

  it('produces the same number of series as distinct groups', () => {
    const opt = createBarOptions(groupedBarData)
    expect((opt.series as unknown[]).length).toBe(2)
  })

  it('vertical layout — xAxis type is category', () => {
    const opt = createBarOptions(groupedBarData)
    expect((opt.xAxis as { type: string }).type).toBe('category')
  })

  it('horizontal layout — yAxis type is category', () => {
    const opt = createHorizontalBarOptions(groupedBarData)
    expect((opt.yAxis as { type: string }).type).toBe('category')
  })

  it('stacked — all series carry stack: "total"', () => {
    const opt = createStackedBarOptions(groupedBarData)
    const series = opt.series as Array<{ stack?: string }>
    expect(series.every((s) => s.stack === 'total')).toBe(true)
  })

  it('grouped — no series has a stack property', () => {
    const opt = createGroupedBarOptions(groupedBarData)
    const series = opt.series as Array<{ stack?: string }>
    expect(series.every((s) => s.stack === undefined)).toBe(true)
  })

  it('sets title when provided', () => {
    const opt = createBarOptions(singleGroupData, { title: 'My Chart' })
    expect((opt.title as { text: string }).text).toBe('My Chart')
  })

  it('floating — emits 2x series per group (base + offset)', () => {
    const floatData: ChartTabularData = [
      { group: 'A', key: 'Jan', value: 20, base: 5 },
      { group: 'A', key: 'Feb', value: 35, base: 10 },
    ]
    const opt = createFloatingBarOptions(floatData)
    // 1 group × 2 (base + top) = 2 series
    expect((opt.series as unknown[]).length).toBe(2)
  })

  // ── Simple bar (no key field) — the resolvedXField === 'group' code path ──
  // Single series, one bar per category, per-item itemStyle.color for colouring.
  // Multi-series would reserve N sub-slots per category causing misalignment.

  it('simple bar — produces exactly 1 series with N data items', () => {
    const opt = createBarOptions(simpleBarData)
    const series = opt.series as Array<{ data: unknown[] }>
    expect(series).toHaveLength(1)
    expect(series[0].data).toHaveLength(simpleBarData.length)
  })

  it('simple bar — per-item colours match pickColors(N, "light")', () => {
    const opt = createBarOptions(simpleBarData)
    const series = opt.series as Array<{ data: Array<{ itemStyle: { color: string } }> }>
    const expected = pickColors(simpleBarData.length, 'light')
    series[0].data.forEach((item, i) => {
      expect(item.itemStyle.color).toBe(expected[i])
    })
  })

  it('simple bar — dark colorScheme uses pickColors(N, "dark") per-item colours', () => {
    const opt = createBarOptions(simpleBarData, { colorScheme: 'dark' })
    const series = opt.series as Array<{ data: Array<{ itemStyle: { color: string } }> }>
    const expected = pickColors(simpleBarData.length, 'dark')
    series[0].data.forEach((item, i) => {
      expect(item.itemStyle.color).toBe(expected[i])
    })
  })

  it('simple bar — legend has N entries with correct names and colours', () => {
    const opt = createBarOptions(simpleBarData)
    const legend = opt.legend as {
      data: Array<{ name: string; itemStyle: { color: string } }>
      selectedMode: unknown
    }
    const expected = pickColors(simpleBarData.length, 'light')
    expect(legend.data).toHaveLength(simpleBarData.length)
    expect(legend.selectedMode).toBe(false)
    legend.data.forEach((entry, i) => {
      expect(entry.name).toBe(simpleBarData[i].group)
      expect(entry.itemStyle.color).toBe(expected[i])
    })
  })

  it('horizontal simple bar — yAxis is category, 1 series with N items', () => {
    const opt = createHorizontalBarOptions(simpleBarData)
    expect((opt.yAxis as { type: string }).type).toBe('category')
    const series = opt.series as Array<{ data: unknown[] }>
    expect(series).toHaveLength(1)
    expect(series[0].data).toHaveLength(simpleBarData.length)
  })

  it('simple bar — scales to any N without hardcoding (N=2 uses pickColors(2))', () => {
    const twoBarData: ChartTabularData = [
      { group: 'A', value: 10 },
      { group: 'B', value: 20 },
    ]
    const opt = createBarOptions(twoBarData)
    const series = opt.series as Array<{ data: Array<{ itemStyle: { color: string } }> }>
    const expected = pickColors(2, 'light')
    expect(series).toHaveLength(1)
    series[0].data.forEach((item, i) => {
      expect(item.itemStyle.color).toBe(expected[i])
    })
  })
})

// ── Line ──────────────────────────────────────────────────────────────────────

describe('createLineOptions', () => {
  it('produces series of type "line"', () => {
    const opt = createLineOptions(groupedBarData)
    const series = opt.series as Array<{ type: string }>
    expect(series.every((s) => s.type === 'line')).toBe(true)
  })

  it('step option sets step property on all series', () => {
    const opt = createStepLineOptions(singleGroupData)
    const series = opt.series as Array<{ step?: string }>
    expect(series[0]?.step).toBe('start')
  })

  it('timeSeries — xAxis type is "time"', () => {
    const tsData: ChartTabularData = [{ group: 'A', date: '2024-01-01', value: 10 }]
    const opt = createTimeSeriesLineOptions(tsData)
    expect((opt.xAxis as { type: string }).type).toBe('time')
  })

  it('dual-axis — yAxis is an array', () => {
    const opt = createLineOptions(groupedBarData, { secondaryGroups: ['Beta'] })
    expect(Array.isArray(opt.yAxis)).toBe(true)
  })

  it('log scale — yAxis type is "log"', () => {
    const opt = createLineOptions(singleGroupData, { logScale: true })
    expect((opt.yAxis as { type: string }).type).toBe('log')
  })
})

// ── Area ──────────────────────────────────────────────────────────────────────

describe('createAreaOptions', () => {
  it('produces series with areaStyle', () => {
    const opt = createAreaOptions(groupedBarData)
    const series = opt.series as Array<{ areaStyle?: object }>
    expect(series.every((s) => s.areaStyle !== undefined)).toBe(true)
  })

  it('stacked — all series carry stack: "total"', () => {
    const opt = createStackedAreaOptions(groupedBarData)
    const series = opt.series as Array<{ stack?: string }>
    expect(series.every((s) => s.stack === 'total')).toBe(true)
  })
})

// ── Donut + Pie ───────────────────────────────────────────────────────────────

describe('createDonutOptions', () => {
  it('produces a pie series', () => {
    const opt = createDonutOptions(pieData)
    const s = (opt.series as Array<{ type: string }>)[0]
    expect(s?.type).toBe('pie')
  })

  it('has inner radius set (donut shape)', () => {
    const opt = createDonutOptions(pieData)
    const s = (opt.series as Array<{ radius: unknown }>)[0]
    const radius = s?.radius as [string, string]
    expect(radius[0]).toBeTruthy() // innerRadius
    expect(radius[1]).toBeTruthy() // outerRadius
  })

  it('aggregates values by group', () => {
    const dupeData: ChartTabularData = [
      { group: 'A', key: 'q1', value: 10 },
      { group: 'A', key: 'q2', value: 20 },
      { group: 'B', key: 'q1', value: 30 },
    ]
    const opt = createDonutOptions(dupeData)
    const s = opt.series as Array<{ data: Array<{ name: string; value: number }> }>
    const aEntry = s[0]?.data.find((d) => d.name === 'A')
    expect(aEntry?.value).toBe(30)
  })

  it('sorts slices by value for palette assignment', () => {
    const opt = createDonutOptions(pieData)
    const s = opt.series as Array<{ data: Array<{ name: string }> }>
    expect(s[0]?.data.map((d) => d.name)).toEqual(['Slice B', 'Slice A', 'Slice C'])
  })

  it('uses Carbon N-color palette and percentage labels', () => {
    const opt = createDonutOptions(pieData)
    const series = opt.series as Array<{
      label: { formatter: ((...args: unknown[]) => string) | string; position: string }
    }>
    const s = series[0]
    const ghostSeries = series[1] as { label: { formatter: () => string; position: string } }
    expect(opt.color).toEqual(pickColors(pieData.length, 'light'))
    expect(s?.label.formatter({ percent: 46.2 })).toBe('46.2%')
    expect(s?.label.position).toBe('outer')
    // Ghost series renders the total in the donut center
    expect(typeof ghostSeries?.label.formatter).toBe('function')
    expect(ghostSeries?.label.formatter()).toBe('100')
    expect(ghostSeries?.label.position).toBe('center')
  })
})

describe('createPieOptions', () => {
  it('produces a pie series without inner radius array', () => {
    const opt = createPieOptions(pieData)
    const s = (opt.series as Array<{ type: string; radius: unknown }>)[0]
    expect(s?.type).toBe('pie')
    // radius should be a string (not tuple)
    expect(typeof s?.radius).toBe('string')
  })

  it('uses Carbon N-color palette and percentage labels', () => {
    const opt = createPieOptions(pieData, { colorScheme: 'dark' })
    const s = (opt.series as Array<{
      label: { formatter: ({ percent }: { percent?: number }) => string; position: string }
    }>)[0]
    expect(opt.color).toEqual(pickColors(pieData.length, 'dark'))
    expect(s?.label.formatter({ percent: 46.2 })).toBe('46.2%')
    expect(s?.label.position).toBe('outer')
  })
})

// ── Scatter + Bubble ──────────────────────────────────────────────────────────

describe('createScatterOptions', () => {
  it('produces scatter series', () => {
    const opt = createScatterOptions(groupedBarData)
    const s = opt.series as Array<{ type: string }>
    expect(s.every((e) => e.type === 'scatter')).toBe(true)
  })

  it('has 2 series for 2 groups', () => {
    const opt = createScatterOptions(groupedBarData)
    expect((opt.series as unknown[]).length).toBe(2)
  })
})

describe('createBubbleOptions', () => {
  it('produces scatter series with symbolSize function', () => {
    const bubbleData: ChartTabularData = [
      { group: 'A', key: '1', value: 10, size: 100 },
      { group: 'A', key: '2', value: 20, size: 400 },
    ]
    const opt = createBubbleOptions(bubbleData)
    const s = opt.series as Array<{ type: string; symbolSize: unknown }>
    expect(s[0]?.type).toBe('scatter')
    expect(typeof s[0]?.symbolSize).toBe('function')
  })
})

// ── Heatmap ───────────────────────────────────────────────────────────────────

describe('createHeatmapOptions', () => {
  const heatData: ChartTabularData = [
    { group: 'Mon', key: 'Morning', value: 3 },
    { group: 'Mon', key: 'Afternoon', value: 8 },
    { group: 'Tue', key: 'Morning', value: 5 },
    { group: 'Tue', key: 'Afternoon', value: 2 },
  ]

  it('produces a heatmap series', () => {
    const opt = createHeatmapOptions(heatData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('heatmap')
  })

  it('has visualMap with min/max derived from data', () => {
    const opt = createHeatmapOptions(heatData)
    const vm = opt.visualMap as { min: number; max: number }
    expect(vm.min).toBe(2)
    expect(vm.max).toBe(8)
  })
})

// ── Gauge + Meter ─────────────────────────────────────────────────────────────

describe('createGaugeOptions', () => {
  const gaugeData: ChartTabularData = [{ group: 'Speed', value: 72 }]

  it('produces a gauge series', () => {
    const opt = createGaugeOptions(gaugeData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('gauge')
  })

  it('passes through min/max', () => {
    const opt = createGaugeOptions(gaugeData, { min: 0, max: 200 })
    const s = opt.series as Array<{ min: number; max: number }>
    expect(s[0]?.min).toBe(0)
    expect(s[0]?.max).toBe(200)
  })

  it('reads value from first datum', () => {
    const opt = createGaugeOptions(gaugeData)
    const s = opt.series as Array<{ data: Array<{ value: number }> }>
    expect(s[0]?.data[0]?.value).toBe(72)
  })
})

describe('createMeterOptions', () => {
  it('simple meter — produces a bar series', () => {
    const opt = createMeterOptions([{ group: 'Progress', value: 60 }], { total: 100 })
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('bar')
  })

  it('proportional meter — produces stacked bar series', () => {
    const proportionalData: ChartTabularData = [
      { group: 'Used', value: 60 },
      { group: 'Free', value: 40 },
    ]
    const opt = createMeterOptions(proportionalData, { proportional: true })
    const s = opt.series as Array<{ type: string; stack: string }>
    expect(s[0]?.type).toBe('bar')
    expect(s[0]?.stack).toBe('meter')
  })
})

// ── Histogram ─────────────────────────────────────────────────────────────────

describe('createHistogramOptions', () => {
  it('pre-binned data — renders one bar series', () => {
    const binned: ChartTabularData = [
      { group: 'count', key: '0-10', value: 5 },
      { group: 'count', key: '10-20', value: 12 },
      { group: 'count', key: '20-30', value: 7 },
    ]
    const opt = createHistogramOptions(binned)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('bar')
  })

  it('auto-bucket — creates bins from binWidth', () => {
    const rawData: ChartTabularData = Array.from({ length: 20 }, (_, i) => ({
      group: 'raw',
      value: i * 5,
    }))
    const opt = createHistogramOptions(rawData, { binWidth: 20 })
    const xAxis = opt.xAxis as { data: string[] }
    expect(xAxis.data.length).toBeGreaterThan(0)
  })
})

// ── Treemap + Radar ───────────────────────────────────────────────────────────

describe('createTreemapOptions', () => {
  const tmData: ChartTabularData = [
    { group: 'A', key: 'a1', value: 10 },
    { group: 'A', key: 'a2', value: 20 },
    { group: 'B', key: 'b1', value: 30 },
  ]

  it('produces a treemap series', () => {
    const opt = createTreemapOptions(tmData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('treemap')
  })

  it('multi-group data builds parent nodes', () => {
    const opt = createTreemapOptions(tmData)
    const s = opt.series as Array<{ data: Array<{ name: string; children?: unknown[] }> }>
    expect(s[0]?.data.length).toBe(2) // 2 parent groups
  })

  it('single-group data uses flat list', () => {
    const opt = createTreemapOptions(singleGroupData)
    const s = opt.series as Array<{ data: unknown[] }>
    expect(s[0]?.data.length).toBe(3) // 3 leaf nodes directly
  })
})

describe('createRadarOptions', () => {
  const radarData: ChartTabularData = [
    { group: 'Team A', key: 'Speed', value: 80 },
    { group: 'Team A', key: 'Strength', value: 60 },
    { group: 'Team B', key: 'Speed', value: 70 },
    { group: 'Team B', key: 'Strength', value: 90 },
  ]

  it('produces a radar series', () => {
    const opt = createRadarOptions(radarData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('radar')
  })

  it('creates one seriesData entry per group', () => {
    const opt = createRadarOptions(radarData)
    const s = opt.series as Array<{ data: unknown[] }>
    expect(s[0]?.data.length).toBe(2)
  })

  it('infers indicator count from distinct keys', () => {
    const opt = createRadarOptions(radarData)
    const radar = opt.radar as { indicator: unknown[] }
    expect(radar.indicator.length).toBe(2)
  })
})

// ── Boxplot ───────────────────────────────────────────────────────────────────

describe('createBoxplotOptions', () => {
  const bpData: ChartTabularData = [
    { group: 'Set A', value: 1 },
    { group: 'Set A', value: 3 },
    { group: 'Set A', value: 5 },
    { group: 'Set A', value: 7 },
    { group: 'Set A', value: 9 },
    { group: 'Set B', value: 2 },
    { group: 'Set B', value: 4 },
    { group: 'Set B', value: 6 },
    { group: 'Set B', value: 8 },
    { group: 'Set B', value: 10 },
  ]

  it('produces a boxplot series', () => {
    const opt = createBoxplotOptions(bpData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('boxplot')
  })

  it('produces one box per group', () => {
    const opt = createBoxplotOptions(bpData)
    const s = opt.series as Array<{ data: unknown[] }>
    expect(s[0]?.data.length).toBe(2)
  })

  it('each box has 5 stat values', () => {
    const opt = createBoxplotOptions(bpData)
    const s = opt.series as Array<{ data: number[][] }>
    expect(s[0]?.data[0]?.length).toBe(5)
  })
})

// ── Combo ─────────────────────────────────────────────────────────────────────

describe('createComboOptions', () => {
  it('defaults all series to bar', () => {
    const opt = createComboOptions(groupedBarData)
    const s = opt.series as Array<{ type: string }>
    expect(s.every((e) => e.type === 'bar')).toBe(true)
  })

  it('lineGroups changes specified series to line type', () => {
    const opt = createComboOptions(groupedBarData, { lineGroups: ['Beta'] })
    const s = opt.series as Array<{ type: string; name: string }>
    expect(s.find((e) => e.name === 'Beta')?.type).toBe('line')
    expect(s.find((e) => e.name === 'Alpha')?.type).toBe('bar')
  })

  it('dual-axis — yAxis is an array', () => {
    const opt = createComboOptions(groupedBarData, { secondaryGroups: ['Beta'] })
    expect(Array.isArray(opt.yAxis)).toBe(true)
  })
})

// ── Lollipop + Sparkline ──────────────────────────────────────────────────────

describe('createLollipopOptions', () => {
  it('produces series (scatter + bar pairs)', () => {
    const opt = createLollipopOptions(groupedBarData)
    // 2 groups × 2 (dot + stick) = 4 series
    expect((opt.series as unknown[]).length).toBe(4)
  })

  it('horizontal — yAxis type is category', () => {
    const opt = createLollipopOptions(groupedBarData, { horizontal: true })
    expect((opt.yAxis as { type: string }).type).toBe('category')
  })
})

describe('createSparklineOptions', () => {
  it('strips grid/axis decorations', () => {
    const opt = createSparklineOptions(singleGroupData)
    expect((opt.xAxis as { show: boolean }).show).toBe(false)
    expect((opt.yAxis as { show: boolean }).show).toBe(false)
  })

  it('area variant adds areaStyle to series', () => {
    const opt = createSparklineOptions(singleGroupData, { area: true })
    const s = opt.series as Array<{ areaStyle?: object }>
    expect(s[0]?.areaStyle).toBeDefined()
  })

  it('disables animation', () => {
    const opt = createSparklineOptions(singleGroupData)
    expect(opt.animation).toBe(false)
  })
})

// ── Alluvial ──────────────────────────────────────────────────────────────────

describe('createAlluvialOptions', () => {
  const alluvialData = [
    { source: 'A', target: 'B', value: 10 },
    { source: 'A', target: 'C', value: 5 },
    { source: 'B', target: 'D', value: 8 },
  ]

  it('produces a sankey series', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('sankey')
  })

  it('infers unique nodes from source/target pairs', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ data: Array<{ name: string }> }>
    // A, B, C, D = 4 nodes
    expect(s[0]?.data.length).toBe(4)
  })

  it('preserves all links', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ links: unknown[] }>
    expect(s[0]?.links.length).toBe(3)
  })

  it('sets orient from options', () => {
    const opt = createAlluvialOptions(alluvialData, { orient: 'vertical' })
    const s = opt.series as Array<{ orient: string }>
    expect(s[0]?.orient).toBe('vertical')
  })
})

describe('createAlluvialOptionsFromTabular', () => {
  it('maps group → target, key → source', () => {
    const tabular: ChartTabularData = [
      { group: 'B', key: 'A', value: 10 },
      { group: 'C', key: 'A', value: 5 },
    ]
    const opt = createAlluvialOptionsFromTabular(tabular)
    const s = opt.series as Array<{ links: Array<{ source: string; target: string }> }>
    expect(s[0]?.links[0]?.source).toBe('A')
    expect(s[0]?.links[0]?.target).toBe('B')
  })
})

// ── Tree ──────────────────────────────────────────────────────────────────────

describe('createTreeOptions', () => {
  const root = {
    name: 'Root',
    children: [
      { name: 'Child A', children: [{ name: 'Leaf 1' }, { name: 'Leaf 2' }] },
      { name: 'Child B' },
    ],
  }

  it('produces a tree series', () => {
    const opt = createTreeOptions(root)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('tree')
  })

  it('wraps the root node in a single-element data array', () => {
    const opt = createTreeOptions(root)
    const s = opt.series as Array<{ data: unknown[] }>
    expect(s[0]?.data.length).toBe(1)
  })

  it('defaults to LR orientation', () => {
    const opt = createTreeOptions(root)
    const s = opt.series as Array<{ orient: string }>
    expect(s[0]?.orient).toBe('LR')
  })

  it('respects orient option', () => {
    const opt = createTreeOptions(root, { orient: 'TB' })
    const s = opt.series as Array<{ orient: string }>
    expect(s[0]?.orient).toBe('TB')
  })

  it('sets initialTreeDepth when provided', () => {
    const opt = createTreeOptions(root, { initialDepth: 1 })
    const s = opt.series as Array<{ initialTreeDepth: number }>
    expect(s[0]?.initialTreeDepth).toBe(1)
  })
})

describe('createTreeOptionsFromTabular', () => {
  const tabular: ChartTabularData = [
    { group: 'Root', key: 'Child A', value: 1 },
    { group: 'Root', key: 'Child B', value: 2 },
    { group: 'Child A', key: 'Leaf 1', value: 3 },
  ]

  it('produces a tree series', () => {
    const opt = createTreeOptionsFromTabular(tabular)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('tree')
  })

  it('infers root as the group that is never a key', () => {
    const opt = createTreeOptionsFromTabular(tabular)
    const s = opt.series as Array<{ data: Array<{ name: string }> }>
    expect(s[0]?.data[0]?.name).toBe('Root')
  })
})
