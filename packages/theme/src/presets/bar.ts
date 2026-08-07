import type { EChartsOption, SeriesOption } from 'echarts'
import { groupByGroup, pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

// ── Shared grid defaults (mirrors Carbon Charts spacing) ─────────────────────
const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Label truncation helper ───────────────────────────────────────────────────

/**
 * Build a category axis label formatter that truncates long labels to fit
 * within `maxChars` characters using Carbon Charts' start…end ellipsis style:
 *   e.g. "58B01AA…C46B86E"
 *
 * ECharts `overflow: 'truncate'` + `width` is unreliable when `containLabel:
 * true` is set on the grid (the label area expands to fit, so the overflow
 * never triggers). A formatter that manually shortens the string is the only
 * reliable approach.
 *
 * Carbon Charts uses ~7 px per character at the default axis label font size
 * (12 px IBM Plex Sans), so the pixel value passed in `truncateLabels` is
 * converted to a character budget by dividing by 7.
 */
function makeTruncateFormatter(maxPx: number): (value: string) => string {
  const maxChars = Math.max(8, Math.round(maxPx / 7))
  return (value: string) => {
    if (value.length <= maxChars) return value
    const half = Math.floor((maxChars - 1) / 2)
    return `${value.slice(0, half)}...${value.slice(-half)}`
  }
}

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
   * Maximum bar width in pixels for grouped (multi-series) bar charts.
   * Mirrors Carbon Charts' default bar width cap (~16 px per bar in a group).
   * Defaults to 16 for grouped bars; has no effect on single-series or stacked charts.
   */
  barMaxWidth?: number
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
  /**
   * Truncate category axis labels to this maximum character count.
   * Maps to Carbon Charts `axes.left.truncation` (horizontal bars).
   * Uses a formatter that keeps the first and last characters with `…` in the
   * middle — matching Carbon Charts' truncation style. The numeric value is
   * treated as a maximum character budget (not pixel width).
   */
  truncateLabels?: number
  /**
   * BCP 47 locale code for formatting date axis labels (e.g. `'ja-JP'`).
   * Maps to Carbon Charts `locale.code`.
   * When set together with `xField: 'date'`, the category axis labels are
   * formatted using `Intl.DateTimeFormat` with the given locale.
   */
  locale?: string
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

  // Build a locale-aware date formatter for the category axis labels.
  // Only active when a locale is specified and the xField is 'date'.
  const localeFormatter =
    opts.locale && xField === 'date'
      ? (value: string) => {
          // Parse ISO date strings (YYYY-MM-DD) as local midnight to avoid
          // UTC-to-local timezone shifts that flip the date to the previous day.
          const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
          const d = parts
            ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
            : new Date(value)
          return isNaN(d.getTime())
            ? value
            : new Intl.DateTimeFormat(opts.locale, { month: 'long', day: 'numeric' }).format(d)
        }
      : undefined

  // If none of the rows have the requested xField, fall back to 'group' as the
  // category axis (matches Carbon Charts' simple bar behaviour where `group` is
  // both the series name and the axis label).
  const hasXField = data.some((d) => d[xField] !== undefined)
  const resolvedXField = hasXField ? xField : ('group' as const)
  const { groups, categories } = groupByGroup(data, resolvedXField)

  // When the x-axis is a date field, format the category axis tick labels to
  // match Carbon Charts' style (e.g. "Jan 1", "Jan 2").  We stay on a category
  // axis so bars are evenly spaced regardless of calendar gaps — exactly what
  // Carbon Charts does for grouped/stacked bar time series.
  const dateAxisFormatter =
    resolvedXField === 'date'
      ? (value: string) => {
          const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
          const d = parts
            ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
            : new Date(value)
          if (isNaN(d.getTime())) return value
          // Match Carbon Charts: show month name only on the first tick of that
          // month; subsequent ticks show just the day number.
          const day = d.getDate()
          const month = d.toLocaleString('en-US', { month: 'short' })
          return day === 1 ? `${month} ${day}` : String(day)
        }
      : undefined

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
    // Simple bar: N series, one per category, each individually coloured.
    //
    // ECharts legend only surfaces entries for named series, so we use one series
    // per group (matching Carbon Charts' model). To prevent ECharts from dividing
    // each category band into N sub-slots, we set barGap: '-100%' on every series
    // so the bars overlap at full width — only one bar exists per category
    // position, so the overlap is harmless and each bar fills its slot correctly.
    //
    // Each series carries a single value at its own category index; all other
    // positions are null. barCategoryGap is kept at the default (~'20%') so the
    // bar width relative to the category band matches Carbon Charts.
    const colors = pickColors(groups.length, colorScheme)

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
        // selectedMode:false — legend is cosmetic only, matching Carbon Charts'
        // simple bar where clicking a legend item does not hide the bar.
        selectedMode: false as const,
      },
      grid: GRID,
      ...(horizontal
        ? {
            xAxis: {
              type: 'value',
              ...(opts.yDomain ? { min: opts.yDomain[0], max: opts.yDomain[1] } : {}),
            },
            yAxis: {
              type: 'category',
              data: categories,
              ...(opts.truncateLabels || localeFormatter
                ? {
                    axisLabel: {
                      ...(opts.truncateLabels && !localeFormatter
                        ? { formatter: makeTruncateFormatter(opts.truncateLabels) }
                        : {}),
                      ...(localeFormatter ? { formatter: localeFormatter } : {}),
                    },
                  }
                : {}),
            },
          }
        : {
            xAxis: {
              type: 'category',
              data: categories,
              ...(opts.truncateLabels || localeFormatter
                ? {
                    axisLabel: {
                      ...(opts.truncateLabels && !localeFormatter
                        ? { formatter: makeTruncateFormatter(opts.truncateLabels) }
                        : {}),
                      ...(localeFormatter ? { formatter: localeFormatter } : {}),
                    },
                  }
                : {}),
            },
            yAxis: {
              type: 'value',
              ...(opts.yDomain ? { min: opts.yDomain[0], max: opts.yDomain[1] } : {}),
            },
          }),
      series: groups.map((g, gi) => ({
        type: 'bar' as const,
        name: g.name,
        barGap: '-100%' as const,
        itemStyle: { color: resolvedColors[gi] },
        // Each series contributes exactly one bar at its own category index;
        // all other positions are null so they don't affect the layout.
        data: categories.map((cat) =>
          cat === g.name ? (g.data.find((d) => d.name === g.name)?.value ?? null) : null,
        ),
      })),
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

  // Grouped multi-series: cap bar width to match Carbon Charts' compact grouping.
  // Carbon Charts uses ~16 px per bar within a group. barMaxWidth prevents bars
  // from stretching to fill the full category band when there are few categories.
  // barCategoryGap and barGap are set on the first series (ECharts applies them
  // chart-wide when set on any bar series).
  const barMaxWidth = !isSingleSeries && !stacked ? (opts.barMaxWidth ?? 16) : undefined

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
          // Apply grouping geometry on all series (ECharts honours the last value seen)
          ...(barMaxWidth ? { barMaxWidth } : {}),
          // barGap: gap between bars within the same category group (~Carbon Charts tight packing)
          // barCategoryGap: gap between category groups (wider, matching Carbon Charts)
          ...(!stacked ? { barGap: '5%', barCategoryGap: '40%' } : {}),
        },
  )

  const legend = { type: 'scroll' as const, bottom: 0 }

  // Value axis with optional domain clamp
  const valueAxis = {
    type: 'value' as const,
    ...(opts.yDomain ? { min: opts.yDomain[0], max: opts.yDomain[1] } : {}),
  }
  // Active formatter: locale override wins, then date formatter, then truncation.
  const activeFormatter = localeFormatter ?? dateAxisFormatter
  const categoryAxis = {
    type: 'category' as const,
    data: categories,
    ...(opts.truncateLabels || activeFormatter
      ? {
          axisLabel: {
            ...(opts.truncateLabels && !activeFormatter
              ? { formatter: makeTruncateFormatter(opts.truncateLabels) }
              : {}),
            ...(activeFormatter ? { formatter: activeFormatter } : {}),
          },
        }
      : {}),
  }

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
