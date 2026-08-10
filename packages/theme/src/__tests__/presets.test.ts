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
  createBoundedAreaOptions,
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
  createWordCloudOptions,
  createThemeRiverOptions,
} from '../presets/index'
import type { ChartTabularData, ThemeRiverDatum } from '../presets/index'

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
  // N series (one per category), each named after its group, with barGap:'-100%'
  // so bars overlap at full width without ECharts creating N sub-slots per band.

  it('simple bar — produces N series (one per group)', () => {
    const opt = createBarOptions(simpleBarData)
    const series = opt.series as Array<{ name: string; data: unknown[] }>
    expect(series).toHaveLength(simpleBarData.length)
  })

  it('simple bar — each series is named after its group', () => {
    const opt = createBarOptions(simpleBarData)
    const series = opt.series as Array<{ name: string }>
    series.forEach((s, i) => {
      expect(s.name).toBe(simpleBarData[i].group)
    })
  })

  it('simple bar — each series has the group colour from pickColors(N, "light")', () => {
    const opt = createBarOptions(simpleBarData)
    const series = opt.series as Array<{ itemStyle: { color: string } }>
    const expected = pickColors(simpleBarData.length, 'light')
    series.forEach((s, i) => {
      expect(s.itemStyle.color).toBe(expected[i])
    })
  })

  it('simple bar — dark colorScheme uses pickColors(N, "dark") per-series colour', () => {
    const opt = createBarOptions(simpleBarData, { colorScheme: 'dark' })
    const series = opt.series as Array<{ itemStyle: { color: string } }>
    const expected = pickColors(simpleBarData.length, 'dark')
    series.forEach((s, i) => {
      expect(s.itemStyle.color).toBe(expected[i])
    })
  })

  it('simple bar — legend has selectedMode:false and no explicit data (auto-discovers series names)', () => {
    const opt = createBarOptions(simpleBarData)
    const legend = opt.legend as { selectedMode: unknown; data?: unknown }
    expect(legend.selectedMode).toBe(false)
    expect(legend.data).toBeUndefined()
  })

  it('horizontal simple bar — yAxis is category, N series', () => {
    const opt = createHorizontalBarOptions(simpleBarData)
    expect((opt.yAxis as { type: string }).type).toBe('category')
    const series = opt.series as Array<{ name: string }>
    expect(series).toHaveLength(simpleBarData.length)
  })

  it('simple bar — scales to any N without hardcoding (N=2 uses pickColors(2))', () => {
    const twoBarData: ChartTabularData = [
      { group: 'A', value: 10 },
      { group: 'B', value: 20 },
    ]
    const opt = createBarOptions(twoBarData)
    const series = opt.series as Array<{ name: string; itemStyle: { color: string } }>
    const expected = pickColors(2, 'light')
    expect(series).toHaveLength(2)
    series.forEach((s, i) => {
      expect(s.name).toBe(twoBarData[i].group)
      expect(s.itemStyle.color).toBe(expected[i])
    })
  })

  it('truncateLabels — yAxis axisLabel formatter truncates long labels', () => {
    const longLabelData: ChartTabularData = [
      { group: '6591DA8668C339B1B39297C61091E320C35391AB7AFC15B469F96B8A2DD0C231', value: 65000 },
      { group: 'Qty', value: 16932 },
    ]
    const opt = createHorizontalBarOptions(longLabelData, { truncateLabels: 120 })
    const yAxis = opt.yAxis as { axisLabel?: { formatter?: (v: string) => string } }
    expect(typeof yAxis.axisLabel?.formatter).toBe('function')
    // Long label (64 chars) should be truncated; short label ('Qty') should be unchanged
    const fmt = yAxis.axisLabel!.formatter!
    expect(fmt('Qty')).toBe('Qty')
    const truncated = fmt('6591DA8668C339B1B39297C61091E320C35391AB7AFC15B469F96B8A2DD0C231')
    expect(truncated.length).toBeLessThan(64)
    expect(truncated).toContain('...')
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

  it('yDomain — yAxis min/max are set', () => {
    const opt = createLineOptions(groupedBarData, { yDomain: [10000, 50000] })
    const yAxis = opt.yAxis as { min: number; max: number }
    expect(yAxis.min).toBe(10000)
    expect(yAxis.max).toBe(50000)
  })

  it('xDomain — category axis data is replaced with domain subset', () => {
    const opt = createLineOptions(groupedBarData, { xDomain: ['Jan', 'Mar'] })
    const xAxis = opt.xAxis as { type: string; data: string[] }
    expect(xAxis.type).toBe('category')
    expect(xAxis.data).toEqual(['Jan', 'Mar'])
  })

  it('legendPosition "left" — legend has orient vertical and left: 0', () => {
    const opt = createLineOptions(groupedBarData, { legendPosition: 'left' })
    const legend = opt.legend as { orient?: string; left?: number }
    expect(legend.orient).toBe('vertical')
    expect(legend.left).toBe(0)
  })

  it('legendPosition "top" — legend has top: 0', () => {
    const opt = createLineOptions(groupedBarData, { legendPosition: 'top' })
    const legend = opt.legend as { top?: number; bottom?: number }
    expect(legend.top).toBe(0)
    expect(legend.bottom).toBeUndefined()
  })

  it('default legend — bottom: 0', () => {
    const opt = createLineOptions(groupedBarData)
    const legend = opt.legend as { bottom?: number }
    expect(legend.bottom).toBe(0)
  })
})

// ── Area ──────────────────────────────────────────────────────────────────────

describe('createAreaOptions', () => {
  it('produces series with areaStyle', () => {
    const opt = createAreaOptions(groupedBarData)
    const series = opt.series as Array<{ areaStyle?: object }>
    expect(series.every((s) => s.areaStyle !== undefined)).toBe(true)
  })

  it('areaStyle opacity is 0.4 (lighter fill)', () => {
    const opt = createAreaOptions(groupedBarData)
    const series = opt.series as Array<{ areaStyle?: { opacity?: number } }>
    expect(series.every((s) => s.areaStyle?.opacity === 0.4)).toBe(true)
  })

  it('showSymbol is false on all series', () => {
    const opt = createAreaOptions(groupedBarData)
    const series = opt.series as Array<{ showSymbol?: boolean }>
    expect(series.every((s) => s.showSymbol === false)).toBe(true)
  })

  it('stacked — all series carry stack: "total"', () => {
    const opt = createStackedAreaOptions(groupedBarData)
    const series = opt.series as Array<{ stack?: string }>
    expect(series.every((s) => s.stack === 'total')).toBe(true)
  })

  it('time axis has axisLabel formatter when timeSeries: true', () => {
    const opt = createAreaOptions(groupedBarData, { timeSeries: false })
    // non-time axis — no formatter needed
    const xAxis = opt.xAxis as { type: string; axisLabel?: unknown }
    expect(xAxis.type).toBe('category')

    const tsOpt = createAreaOptions([{ group: 'A', date: '2023-01-01', value: 1 }], {
      timeSeries: true,
    })
    const tsXAxis = tsOpt.xAxis as { type: string; axisLabel?: { formatter?: unknown } }
    expect(tsXAxis.type).toBe('time')
    expect(typeof tsXAxis.axisLabel?.formatter).toBe('function')
  })

  it('yAxisLabel adds name to yAxis', () => {
    const opt = createAreaOptions(groupedBarData, { yAxisLabel: 'Conversion rate' })
    const yAxis = opt.yAxis as { name?: string }
    expect(yAxis.name).toBe('Conversion rate')
  })

  it('yAxisLabel absent — yAxis has no name', () => {
    const opt = createAreaOptions(groupedBarData)
    const yAxis = opt.yAxis as { name?: string }
    expect(yAxis.name).toBeUndefined()
  })

  it('xAxisTitle adds name to category xAxis', () => {
    const opt = createAreaOptions(groupedBarData, { xAxisTitle: '2023 Annual Sales Figures' })
    const xAxis = opt.xAxis as { name?: string; nameLocation?: string }
    expect(xAxis.name).toBe('2023 Annual Sales Figures')
    expect(xAxis.nameLocation).toBe('middle')
  })

  it('xAxisTitle adds name to time xAxis', () => {
    const opt = createAreaOptions([{ group: 'A', date: '2023-01-01', value: 1 }], {
      timeSeries: true,
      xAxisTitle: '2023 Annual Sales Figures',
    })
    const xAxis = opt.xAxis as { name?: string; nameLocation?: string }
    expect(xAxis.name).toBe('2023 Annual Sales Figures')
    expect(xAxis.nameLocation).toBe('middle')
  })

  it('legend icon is roundRect (filled square matching Carbon Charts)', () => {
    const opt = createAreaOptions(groupedBarData)
    const legend = opt.legend as { icon?: string }
    expect(legend.icon).toBe('roundRect')
  })

  it('areaStyle includes explicit color matching itemStyle', () => {
    const opt = createAreaOptions(groupedBarData)
    const series = opt.series as Array<{
      areaStyle?: { color?: string }
      itemStyle?: { color?: string }
    }>
    series.forEach((s) => {
      expect(s.areaStyle?.color).toBe(s.itemStyle?.color)
    })
  })
})

// ── Bounded area ──────────────────────────────────────────────────────────────

describe('createBoundedAreaOptions', () => {
  const boundedData: ChartTabularData = [
    { group: 'Dataset 1', date: '2023-01-01', value: 47263, min: 40000, max: 50000 },
    { group: 'Dataset 1', date: '2023-01-05', value: 14178, min: 10000, max: 20000 },
    { group: 'Dataset 1', date: '2023-01-13', value: 45281, min: 42000, max: 50000 },
  ]

  it('produces 5 series per group (floor, delta, lower_line, upper_line, value)', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as unknown[]
    // 1 group × 5 series = 5
    expect(series).toHaveLength(5)
  })

  it('floor series has opacity-0 areaStyle (invisible, establishes stack baseline)', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as Array<{ name: string; areaStyle?: { opacity?: number } }>
    const floor = series.find((s) => s.name === 'Dataset 1__floor')
    expect(floor?.areaStyle?.opacity).toBe(0)
  })

  it('delta series has coloured areaStyle with opacity 0.3', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as Array<{ name: string; areaStyle?: { opacity?: number } }>
    const delta = series.find((s) => s.name === 'Dataset 1__delta')
    expect(delta?.areaStyle?.opacity).toBe(0.3)
  })

  it('floor and delta share the same stack key', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as Array<{ name: string; stack?: string }>
    const floor = series.find((s) => s.name === 'Dataset 1__floor')
    const delta = series.find((s) => s.name === 'Dataset 1__delta')
    expect(floor?.stack).toBe('Dataset 1__band')
    expect(delta?.stack).toBe('Dataset 1__band')
  })

  it('lower_line and upper_line have dashed lineStyle and no areaStyle', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as Array<{
      name: string
      lineStyle?: { type?: string }
      areaStyle?: unknown
    }>
    const lowerLine = series.find((s) => s.name === 'Dataset 1__lower_line')
    const upperLine = series.find((s) => s.name === 'Dataset 1__upper_line')
    expect(lowerLine?.lineStyle?.type).toBe('dashed')
    expect(upperLine?.lineStyle?.type).toBe('dashed')
    expect(lowerLine?.areaStyle).toBeUndefined()
    expect(upperLine?.areaStyle).toBeUndefined()
  })

  it('value series name matches the group name', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as Array<{ name: string }>
    expect(series.find((s) => s.name === 'Dataset 1')).toBeDefined()
  })

  it('markArea added to value series when highlights provided', () => {
    const opt = createBoundedAreaOptions(boundedData, {
      timeSeries: true,
      highlights: [{ start: '2023-01-03', end: '2023-01-08' }],
    })
    const series = opt.series as Array<{ name: string; markArea?: { data?: unknown[] } }>
    const valueSeries = series.find((s) => s.name === 'Dataset 1')
    expect(valueSeries?.markArea?.data).toHaveLength(1)
  })

  it('no markArea on value series when no highlights', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const series = opt.series as Array<{ name: string; markArea?: unknown }>
    const valueSeries = series.find((s) => s.name === 'Dataset 1')
    expect(valueSeries?.markArea).toBeUndefined()
  })

  it('legend data contains only group names (not floor/band internal series)', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const legend = opt.legend as { data?: Array<{ name: string }> }
    expect(legend.data).toEqual([{ name: 'Dataset 1' }])
  })

  it('showLegend:false hides the legend', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true, showLegend: false })
    const legend = opt.legend as { show?: boolean }
    expect(legend.show).toBe(false)
  })

  it('uses time axis type when timeSeries: true', () => {
    const opt = createBoundedAreaOptions(boundedData, { timeSeries: true })
    const xAxis = opt.xAxis as { type: string }
    expect(xAxis.type).toBe('time')
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
    expect(typeof s?.label.formatter).toBe('function')
    expect(
      (s?.label.formatter as ({ percent }: { percent?: number }) => string)({ percent: 46.2 }),
    ).toBe('46.2%')
    expect(s?.label.position).toBe('outer')
    // Ghost series renders the total in the donut center via rich-text markup
    expect(typeof ghostSeries?.label.formatter).toBe('function')
    expect(ghostSeries?.label.formatter()).toBe('{total|100}')
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
    const s = (
      opt.series as Array<{
        label: { formatter: ({ percent }: { percent?: number }) => string; position: string }
      }>
    )[0]
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

  it('dual-axis — yAxis is an array when secondaryGroups set', () => {
    const opt = createScatterOptions(groupedBarData, { secondaryGroups: ['Beta'] })
    expect(Array.isArray(opt.yAxis)).toBe(true)
  })

  it('dual-axis — secondary series has yAxisIndex: 1', () => {
    const opt = createScatterOptions(groupedBarData, { secondaryGroups: ['Beta'] })
    const series = opt.series as Array<{ name: string; yAxisIndex?: number }>
    const beta = series.find((s) => s.name === 'Beta')
    expect(beta?.yAxisIndex).toBe(1)
  })

  it('no secondaryGroups — yAxis is a plain object', () => {
    const opt = createScatterOptions(groupedBarData)
    expect(Array.isArray(opt.yAxis)).toBe(false)
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

  it('colorRange — sets two-stop inRange color', () => {
    const opt = createHeatmapOptions(heatData, { colorRange: ['#ffffff', '#491d8b'] })
    const vm = opt.visualMap as { inRange?: { color: string[] } }
    expect(vm.inRange?.color).toEqual(['#ffffff', '#491d8b'])
  })

  it('colorRange — takes precedence over colors', () => {
    const opt = createHeatmapOptions(heatData, {
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      colorRange: ['#ffffff', '#491d8b'],
    })
    const vm = opt.visualMap as { inRange?: { color: string[] } }
    expect(vm.inRange?.color).toEqual(['#ffffff', '#491d8b'])
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

  it('horizontal — yAxis type is category', () => {
    const opt = createBoxplotOptions(bpData, { horizontal: true })
    expect((opt.yAxis as { type: string }).type).toBe('category')
  })

  it('horizontal — xAxis type is value', () => {
    const opt = createBoxplotOptions(bpData, { horizontal: true })
    expect((opt.xAxis as { type: string }).type).toBe('value')
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

  it('loading returns an empty option shell', () => {
    const opt = createComboOptions(groupedBarData, {
      title: 'Combo Chart (loading)',
      loading: true,
    })
    expect(opt.series).toEqual([])
    expect(opt.xAxis).toEqual({ type: 'category', data: [] })
    expect(opt.yAxis).toEqual({ type: 'value' })
    expect(opt.title).toEqual({ text: 'Combo Chart (loading)' })
  })
})

// ── Lollipop + Sparkline ──────────────────────────────────────────────────────

describe('createLollipopOptions', () => {
  it('produces scatter + bar pairs per group (dot + stick)', () => {
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

  it('default link opacity is 0.8 (Carbon Charts Ke.opacity.default)', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ lineStyle: { opacity: number } }>
    expect(s[0]?.lineStyle.opacity).toBe(0.8)
  })

  it('hovered adjacent link opacity is 1.0 (Carbon Charts Ke.opacity.selected)', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ emphasis: { lineStyle: { opacity: number } } }>
    expect(s[0]?.emphasis.lineStyle.opacity).toBe(1)
  })

  it('blur link opacity is 0.3 (Carbon Charts Ke.opacity.unfocus)', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ blur: { lineStyle: { opacity: number } } }>
    expect(s[0]?.blur.lineStyle.opacity).toBe(0.3)
  })

  it('blur label opacity is 1 so labels remain visible during hover', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ blur: { label: { opacity: number } } }>
    expect(s[0]?.blur.label.opacity).toBe(1)
  })

  it('label formatter appends total value in parentheses', () => {
    // A total: 10+5=15, B total: 10+8=18, C total: 5, D total: 8
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ label: { formatter: (p: { name: string }) => string } }>
    const fmt = s[0]?.label.formatter
    expect(fmt?.({ name: 'A' })).toBe('A (15)')
    expect(fmt?.({ name: 'B' })).toBe('B (18)')
    expect(fmt?.({ name: 'C' })).toBe('C (5)')
    expect(fmt?.({ name: 'D' })).toBe('D (8)')
  })

  it('label uses white text on black background', () => {
    const opt = createAlluvialOptions(alluvialData)
    const s = opt.series as Array<{ label: { color: string; backgroundColor: string } }>
    expect(s[0]?.label.color).toBe('#ffffff')
    expect(s[0]?.label.backgroundColor).toBe('#000000')
  })

  it('monochrome: all nodes share the first color of the N-color palette', () => {
    // 3-source-node data: A/B/C → X/Y/Z
    const monoData = [
      { source: 'A', target: 'X', value: 1 },
      { source: 'B', target: 'X', value: 1 },
      { source: 'C', target: 'X', value: 1 },
    ]
    const opt = createAlluvialOptions(monoData, { monochrome: true })
    const s = opt.series as Array<{ data: Array<{ name: string; itemStyle?: { color: string } }> }>
    // 3 source nodes → 3-color light palette → first color = magenta50 (#ee5396)
    const expectedColor = '#ee5396'
    for (const node of s[0]!.data) {
      expect(node.itemStyle?.color).toBe(expectedColor)
    }
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

// ── Word Cloud ────────────────────────────────────────────────────────────────

describe('createWordCloudOptions', () => {
  const wordData = [
    { name: 'JavaScript', value: 1000 },
    { name: 'TypeScript', value: 850 },
    { name: 'Python', value: 800 },
  ]

  it('produces a wordCloud series', () => {
    const opt = createWordCloudOptions(wordData)
    const s = opt.series as Array<{ type: string }>
    expect(s[0]?.type).toBe('wordCloud')
  })

  it('passes all data items through', () => {
    const opt = createWordCloudOptions(wordData)
    const s = opt.series as Array<{ data: unknown[] }>
    expect(s[0]?.data.length).toBe(3)
  })

  it('applies default sizeRange [12, 60]', () => {
    const opt = createWordCloudOptions(wordData)
    const s = opt.series as Array<{ sizeRange: number[] }>
    expect(s[0]?.sizeRange).toEqual([12, 60])
  })

  it('respects custom minFontSize / maxFontSize', () => {
    const opt = createWordCloudOptions(wordData, { minFontSize: 8, maxFontSize: 80 })
    const s = opt.series as Array<{ sizeRange: number[] }>
    expect(s[0]?.sizeRange).toEqual([8, 80])
  })

  it('applies default shape circle', () => {
    const opt = createWordCloudOptions(wordData)
    const s = opt.series as Array<{ shape: string }>
    expect(s[0]?.shape).toBe('circle')
  })

  it('respects custom shape', () => {
    const opt = createWordCloudOptions(wordData, { shape: 'diamond' })
    const s = opt.series as Array<{ shape: string }>
    expect(s[0]?.shape).toBe('diamond')
  })

  it('assigns a textStyle color to every word', () => {
    const opt = createWordCloudOptions(wordData)
    const s = opt.series as Array<{ data: Array<{ textStyle: { color: string } }> }>
    for (const item of s[0]!.data) {
      expect(typeof item.textStyle.color).toBe('string')
      expect(item.textStyle.color.length).toBeGreaterThan(0)
    }
  })

  it('includes a title when provided', () => {
    const opt = createWordCloudOptions(wordData, { title: 'Tech Terms' })
    expect((opt.title as { text: string }).text).toBe('Tech Terms')
  })

  it('omits title when not provided', () => {
    const opt = createWordCloudOptions(wordData)
    expect(opt.title).toBeUndefined()
  })
})

// ── ThemeRiver ────────────────────────────────────────────────────────────────

describe('createThemeRiverOptions', () => {
  const themeRiverData: ThemeRiverDatum[] = [
    ['2023-01-01', 320, 'Pop'],
    ['2023-02-01', 302, 'Pop'],
    ['2023-01-01', 220, 'Hip-Hop'],
    ['2023-02-01', 182, 'Hip-Hop'],
    ['2023-01-01', 150, 'Electronic'],
    ['2023-02-01', 232, 'Electronic'],
  ]

  it('produces a themeRiver series', () => {
    const opt = createThemeRiverOptions(themeRiverData)
    const s = (opt.series as Array<{ type: string }>)[0]
    expect(s?.type).toBe('themeRiver')
  })

  it('passes data through to the series unchanged', () => {
    const opt = createThemeRiverOptions(themeRiverData)
    const s = (opt.series as Array<{ data: ThemeRiverDatum[] }>)[0]
    expect(s?.data).toBe(themeRiverData)
  })

  it('uses a time-type singleAxis', () => {
    const opt = createThemeRiverOptions(themeRiverData)
    expect((opt.singleAxis as { type: string }).type).toBe('time')
  })

  it('applies Carbon N-color palette derived from unique stream count', () => {
    const opt = createThemeRiverOptions(themeRiverData)
    const streamCount = 3 // Pop, Hip-Hop, Electronic
    expect(opt.color).toEqual(pickColors(streamCount, 'light'))
  })

  it('uses dark palette when colorScheme is dark', () => {
    const opt = createThemeRiverOptions(themeRiverData, { colorScheme: 'dark' })
    expect(opt.color).toEqual(pickColors(3, 'dark'))
  })

  it('includes a legend with stream names by default', () => {
    const opt = createThemeRiverOptions(themeRiverData)
    const legend = opt.legend as { data: string[]; show?: boolean }
    expect(legend.data).toEqual(['Pop', 'Hip-Hop', 'Electronic'])
  })

  it('hides legend when showLegend is false', () => {
    const opt = createThemeRiverOptions(themeRiverData, { showLegend: false })
    const legend = opt.legend as { show: boolean }
    expect(legend.show).toBe(false)
  })

  it('includes a title when provided', () => {
    const opt = createThemeRiverOptions(themeRiverData, { title: 'Streaming Trends' })
    expect((opt.title as { text: string }).text).toBe('Streaming Trends')
  })

  it('omits title when not provided', () => {
    const opt = createThemeRiverOptions(themeRiverData)
    expect(opt.title).toBeUndefined()
  })

  it('respects custom axisTop and axisBottom', () => {
    const opt = createThemeRiverOptions(themeRiverData, { axisTop: 80, axisBottom: 30 })
    const axis = opt.singleAxis as { top: number; bottom: number }
    expect(axis.top).toBe(80)
    expect(axis.bottom).toBe(30)
  })
})
