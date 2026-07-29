import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

// ── Shared grid defaults (mirrors Carbon Charts spacing) ─────────────────────
const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Bar preset ────────────────────────────────────────────────────────────────

export interface BarPresetOptions {
  /** Render as horizontal bar chart (category on Y axis) */
  horizontal?: boolean
  /** Stack all series into a single bar */
  stacked?: boolean
  /**
   * Floating bar: each row must have `base` and `value` fields.
   * The preset emits a transparent base series + a visible offset series.
   */
  floating?: boolean
  /** Chart title text */
  title?: string
  /** Override the x-axis field ('key' or 'date') */
  xField?: 'key' | 'date'
  /**
   * When 'dark', use the dark categorical palette for per-bar colouring.
   * Defaults to 'light'. Only applies to single-series (simple) bar charts.
   */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for bar / column charts.
 *
 * Supports simple, grouped (multi-series), stacked, horizontal, and floating
 * variants — all using Carbon Charts' flat tabular input format.
 */
export function createBarOptions(
  data: ChartTabularData,
  opts: BarPresetOptions = {},
): EChartsOption {
  const { horizontal = false, stacked = false, floating = false, title, xField = 'key' } = opts

  // If none of the rows have the requested xField, fall back to 'group' as the
  // category axis (matches Carbon Charts' simple bar behaviour where `group` is
  // both the series name and the axis label).
  const hasXField = data.some((d) => d[xField] !== undefined)
  const resolvedXField = hasXField ? xField : ('group' as const)
  const { groups, categories } = groupByGroup(data, resolvedXField)

  let series: SeriesOption[]

  if (floating) {
    // Floating bar: transparent base + visible top bar
    // Carbon Charts floating data: { group, key, value (end), base (start) }
    const baseGroups = new Map<string, Map<string, number>>()
    const topGroups = new Map<string, Map<string, number>>()

    for (const d of data) {
      const cat = String(d.key ?? '')
      const base = typeof d['base'] === 'number' ? d['base'] : 0
      const top = d.value - base

      if (!baseGroups.has(d.group)) baseGroups.set(d.group, new Map())
      if (!topGroups.has(d.group)) topGroups.set(d.group, new Map())
      baseGroups.get(d.group)!.set(cat, base)
      topGroups.get(d.group)!.set(cat, top)
    }

    const cats = [...new Set(data.map((d) => String(d.key ?? '')))]

    series = [...baseGroups.entries()].flatMap(([name, baseMap]) => [
      // Invisible base
      {
        type: 'bar' as const,
        name,
        stack: `float_${name}`,
        data: cats.map((c) => ({ value: baseMap.get(c) ?? 0, name: c })),
        itemStyle: { color: 'transparent' },
      },
      // Visible offset
      {
        type: 'bar' as const,
        name,
        stack: `float_${name}`,
        data: cats.map((c) => ({ value: topGroups.get(name)?.get(c) ?? 0, name: c })),
      },
    ])

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { type: 'scroll', bottom: 0 },
      grid: GRID,
      ...(horizontal
        ? { xAxis: { type: 'value' }, yAxis: { type: 'category', data: cats } }
        : { xAxis: { type: 'category', data: cats }, yAxis: { type: 'value' } }),
      series,
    }
  }

  const colorScheme = opts.colorScheme ?? 'light'
  const isSingleSeries = groups.length === 1

  if (resolvedXField === 'group') {
    // Simple bar: one series, one bar per category, each bar individually coloured.
    //
    // The correct ECharts model is a SINGLE series with per-item itemStyle.color.
    // Multi-series (one per group) causes ECharts to reserve N sub-slots per
    // category, making each bar narrow and misaligned under its label.
    //
    // The legend is driven by a discrete visualMap component — the standard
    // ECharts mechanism for colouring individual bars in a single series and
    // showing a matching colour legend.
    const colors = pickColors(groups.length, colorScheme)

    series = [
      {
        type: 'bar' as const,
        name: 'value',
        data: groups.map((g, gi) => ({
          value: g.data.find((d) => d.name === g.name)?.value ?? null,
          itemStyle: { color: colors[gi] },
        })),
      },
    ]

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        type: 'scroll' as const,
        bottom: 0,
        data: groups.map((g, gi) => ({ name: g.name, itemStyle: { color: colors[gi] } })),
        // Legend entries are cosmetic only — they display the colour swatch for
        // each group but do not map to a series name, so selectedMode is false.
        selectedMode: false as const,
      },
      grid: GRID,
      ...(horizontal
        ? { xAxis: { type: 'value' }, yAxis: { type: 'category', data: categories } }
        : { xAxis: { type: 'category', data: categories }, yAxis: { type: 'value' } }),
      series,
    }
  }

  // Multi-series or single-series with explicit key/date axis.
  const colors = isSingleSeries
    ? // Single series: colour each category bar individually
      pickColors(groups[0].data.length, colorScheme)
    : // Multi-series: one colour per series
      pickColors(groups.length, colorScheme)

  series = groups.map((g, i) =>
    isSingleSeries
      ? {
          type: 'bar' as const,
          name: g.name,
          data: g.data.map((d, di) => ({
            ...d,
            itemStyle: { color: colors[di] },
          })),
        }
      : {
          type: 'bar' as const,
          name: g.name,
          itemStyle: { color: colors[i] },
          data: g.data,
          ...(stacked ? { stack: 'total' } : {}),
        },
  )

  const legend = { type: 'scroll' as const, bottom: 0 }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend,
    grid: GRID,
    ...(horizontal
      ? { xAxis: { type: 'value' }, yAxis: { type: 'category', data: categories } }
      : { xAxis: { type: 'category', data: categories }, yAxis: { type: 'value' } }),
    series,
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export const createGroupedBarOptions = (
  data: ChartTabularData,
  opts?: Omit<BarPresetOptions, 'stacked' | 'horizontal' | 'floating'>,
): EChartsOption => createBarOptions(data, { ...opts })

export const createStackedBarOptions = (
  data: ChartTabularData,
  opts?: Omit<BarPresetOptions, 'stacked'>,
): EChartsOption => createBarOptions(data, { ...opts, stacked: true })

export const createHorizontalBarOptions = (
  data: ChartTabularData,
  opts?: Omit<BarPresetOptions, 'horizontal'>,
): EChartsOption => createBarOptions(data, { ...opts, horizontal: true })

export const createFloatingBarOptions = (
  data: ChartTabularData,
  opts?: Omit<BarPresetOptions, 'floating'>,
): EChartsOption => createBarOptions(data, { ...opts, floating: true })
