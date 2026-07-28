import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup } from './_transform'
import type { ChartTabularData } from './_transform'
import { lightCategorical, darkCategorical } from '../palettes'

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

  const { groups, categories } = groupByGroup(data, xField)

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

  // Single-series simple bar: colour each bar individually to match Carbon Charts'
  // per-N categorical palette behaviour (each category gets a distinct palette colour).
  const isSingleSeries = groups.length === 1
  const palette = (opts.colorScheme === 'dark' ? darkCategorical : lightCategorical) as string[]

  series = groups.map((g, gi) =>
    isSingleSeries
      ? {
          type: 'bar' as const,
          name: g.name,
          data: g.data.map((d, di) => ({
            ...d,
            itemStyle: { color: palette[di % palette.length] },
          })),
        }
      : {
          type: 'bar' as const,
          name: g.name,
          data: g.data,
          ...(stacked ? { stack: 'total' } : {}),
        },
  )

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { type: 'scroll', bottom: 0 },
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
