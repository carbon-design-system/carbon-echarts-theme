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
   * Floating bar: each row must have `value: [base, end]` tuple format (matching
   * Carbon Charts). The preset also accepts legacy `{ base, value }` separate fields.
   * Emits a transparent base series + a visible offset series per group.
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
  /**
   * Default bar width as a percentage string (e.g. '40%') or pixel number.
   * Applied to simple discrete bar charts where auto width produces narrow bars.
   * Defaults to '40%' for single-series discrete bars.
   */
  barWidth?: string | number
  /**
   * Explicit Y-axis domain `[min, max]`.
   * Maps to Carbon Charts `axes.left.domain` (or `axes.bottom.domain` for horizontal).
   * When provided, the value axis is clamped to this range regardless of the data.
   */
  yDomain?: [number, number]
  /**
   * Per-series color overrides `{ [groupName]: hexColor }`.
   * Maps to Carbon Charts `color.scale` — only the named groups are overridden;
   * unlisted groups fall back to `pickColors()` palette order.
   */
  colors?: Record<string, string>
}

/**
 * Build an ECharts option object for bar / column charts.
 *
 * Supports simple, grouped (multi-series), stacked, horizontal, and floating
 * variants — all using Carbon Charts' flat tabular input format.
 *
 * Floating data format: `{ group, value: [base, end] }` (Carbon Charts tuple).
 * Legacy format `{ group, key, value (end), base (start) }` is also supported.
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
    // ── Floating bar ──────────────────────────────────────────────────────────
    //
    // Carbon Charts floating data format:
    //   { group, value: [base, end] }              ← preferred tuple format
    //   { group, key, value (end), base (start) }  ← legacy separate fields
    //
    // ECharts model: one invisible base series + one visible offset series per
    // group, both sharing the same stack key.
    //
    // Color fix (Bug 2): ECharts assigns colors from the global list including
    // the invisible base series. Use colorBy:'series' + explicit itemStyle.color
    // from pickColors() on the visible series to bypass auto color assignment.

    type FloatRow = { group: string; base: number; top: number; cat: string }
    const rowsByGroup = new Map<string, FloatRow[]>()

    // Resolve the x-axis category from date or key field, falling back to group
    const hasDateField = data.some((d) => d['date'] !== undefined)
    const hasKeyField = data.some((d) => d['key'] !== undefined)
    const floatXField = hasDateField ? 'date' : hasKeyField ? 'key' : 'group'

    for (const d of data) {
      const cat = String(d[floatXField] ?? d.group ?? '')
      let base: number
      let top: number

      if (Array.isArray(d.value)) {
        // Tuple format: value = [base, end]
        base = (d.value as number[])[0] ?? 0
        top = ((d.value as number[])[1] ?? 0) - base
      } else {
        // Legacy separate-field format: base + value(end)
        base = typeof d['base'] === 'number' ? (d['base'] as number) : 0
        top = (d.value as number) - base
      }

      if (!rowsByGroup.has(d.group)) rowsByGroup.set(d.group, [])
      rowsByGroup.get(d.group)!.push({ group: d.group, base, top, cat })
    }

    const groupNames = [...rowsByGroup.keys()]
    const cats = [...new Set(data.map((d) => String(d[floatXField] ?? d.group ?? '')))]
    const colors = pickColors(groupNames.length, opts.colorScheme ?? 'light')

    series = groupNames.flatMap((name, gi) => {
      const rows = rowsByGroup.get(name)!
      const rowMap = new Map(rows.map((r) => [r.cat, r]))
      return [
        // Invisible base — must not appear in legend
        {
          type: 'bar' as const,
          name: `__base_${name}`,
          stack: `float_${name}`,
          data: cats.map((c) => ({ value: rowMap.get(c)?.base ?? 0, name: c })),
          itemStyle: { color: 'transparent' },
          legendHoverLink: false,
          silent: true,
          emphasis: { disabled: true },
        } as SeriesOption,
        // Visible offset — use explicit color to avoid index shift from base series
        {
          type: 'bar' as const,
          name,
          stack: `float_${name}`,
          colorBy: 'series' as const,
          data: cats.map((c) => ({ value: rowMap.get(c)?.top ?? 0, name: c })),
          itemStyle: { color: colors[gi] },
        } as SeriesOption,
      ]
    })

    // Legend shows only the visible group names (filter out __base_ series)
    const legendData = groupNames.map((name, gi) => ({
      name,
      itemStyle: { color: colors[gi] },
    }))

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { type: 'scroll', bottom: 0, data: legendData },
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
    // Bug 4 fix: set a default barWidth of '40%' for discrete simple bars so they
    // match Carbon Charts' proportional bar widths rather than ECharts' narrow auto.
    const colors = pickColors(groups.length, colorScheme)
    const barWidth = opts.barWidth ?? '40%'

    // Apply colors override for simple discrete bars
    const resolvedColors = colors.map((c, gi) => {
      const groupName = groups[gi]?.name
      return groupName && opts.colors?.[groupName] ? opts.colors[groupName] : c
    })

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        type: 'scroll' as const,
        bottom: 0,
        data: groups.map((g, gi) => ({ name: g.name, itemStyle: { color: resolvedColors[gi] } })),
        // Legend entries are cosmetic only — they display the colour swatch for
        // each group but do not map to a series name, so selectedMode is false.
        selectedMode: false as const,
      },
      grid: GRID,
      ...(horizontal
        ? {
            xAxis: {
              type: 'value',
              ...(opts.yDomain ? { min: opts.yDomain[0], max: opts.yDomain[1] } : {}),
            },
            yAxis: { type: 'category', data: categories },
          }
        : {
            xAxis: { type: 'category', data: categories },
            yAxis: {
              type: 'value',
              ...(opts.yDomain ? { min: opts.yDomain[0], max: opts.yDomain[1] } : {}),
            },
          }),
      series: [
        {
          type: 'bar' as const,
          name: 'value',
          barWidth,
          data: groups.map((g, gi) => ({
            value: g.data.find((d) => d.name === g.name)?.value ?? null,
            itemStyle: { color: resolvedColors[gi] },
          })),
        },
      ],
    }
  }

  // Multi-series or single-series with explicit key/date axis.
  const basePaletteColors = isSingleSeries
    ? // Single series: colour each category bar individually
      pickColors(groups[0].data.length, colorScheme)
    : // Multi-series: one colour per series
      pickColors(groups.length, colorScheme)

  // Apply colors override map on top of the base palette
  const resolvedMultiColors = basePaletteColors.map((c, i) => {
    if (!isSingleSeries) {
      const groupName = groups[i]?.name
      return groupName && opts.colors?.[groupName] ? opts.colors[groupName] : c
    }
    return c
  })

  // Bug 4 fix: apply barWidth for single-series key/date axis bars too
  const barWidth = opts.barWidth ?? (isSingleSeries ? '40%' : undefined)

  series = groups.map((g, i) =>
    isSingleSeries
      ? {
          type: 'bar' as const,
          name: g.name,
          ...(barWidth ? { barWidth } : {}),
          data: g.data.map((d, di) => ({
            ...d,
            itemStyle: { color: resolvedMultiColors[di] },
          })),
        }
      : {
          type: 'bar' as const,
          name: g.name,
          itemStyle: { color: resolvedMultiColors[i] },
          data: g.data,
          ...(stacked ? { stack: 'total' } : {}),
        },
  )

  const legend = { type: 'scroll' as const, bottom: 0 }

  // Value axis with optional domain clamp
  const valueAxis = {
    type: 'value' as const,
    ...(opts.yDomain ? { min: opts.yDomain[0], max: opts.yDomain[1] } : {}),
  }
  const categoryAxis = { type: 'category' as const, data: categories }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend,
    grid: GRID,
    ...(horizontal
      ? { xAxis: valueAxis, yAxis: categoryAxis }
      : { xAxis: categoryAxis, yAxis: valueAxis }),
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
