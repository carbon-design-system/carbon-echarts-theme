import type { EChartsOption } from 'echarts'
import { pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Scatter / Bubble shared types ─────────────────────────────────────────────

export interface ScatterPresetOptions {
  /** Use date field as x-axis (time-series mode) */
  timeSeries?: boolean
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

export interface BubblePresetOptions extends ScatterPresetOptions {
  /**
   * Name of the extra field used as bubble size.
   * Default: 'size'. The field must exist on the datum.
   */
  sizeField?: string
  /** Maximum rendered bubble diameter in pixels (default: 60) */
  maxSize?: number
  /**
   * Dual discrete axes mode: x = xField (string), y = yField (string), size = sizeField.
   * When set, both axes are category type and the series groups plot [x, y, size] triples.
   */
  dualDiscrete?: {
    /** Field name for the x-axis category (default: 'key') */
    xField?: string
    /** Field name for the y-axis category (default: 'product') */
    yField?: string
  }
}

// ── Scatter preset ────────────────────────────────────────────────────────────

/**
 * Build an ECharts option object for scatter charts.
 *
 * Carbon Charts `ScatterChart` equivalent.
 * Each datum's `key`/`date` becomes X and `value` becomes Y.
 */
export function createScatterOptions(
  data: ChartTabularData,
  opts: ScatterPresetOptions = {},
): EChartsOption {
  const { timeSeries = false, title, colorScheme = 'light' } = opts

  // Group by series name
  const seriesMap = new Map<string, Array<[string | number, number]>>()
  for (const d of data) {
    if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
    const xVal = timeSeries
      ? d.date instanceof Date
        ? d.date.getTime()
        : String(d.date ?? '')
      : String(d.key ?? '')
    // Skip null/undefined values — they don't produce visible points
    if (d.value == null) continue
    seriesMap.get(d.group)!.push([xVal, d.value as number])
  }

  const entries = [...seriesMap.entries()]
  const colors = pickColors(entries.length, colorScheme)

  const series = entries.map(([name, pts], i) => ({
    type: 'scatter' as const,
    name,
    data: pts,
    itemStyle: { color: colors[i] },
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: timeSeries ? { type: 'time' } : { type: 'value' },
    yAxis: { type: 'value' },
    series,
  }
}

// ── Bubble preset ─────────────────────────────────────────────────────────────

/**
 * Build an ECharts option object for bubble charts.
 *
 * Carbon Charts `BubbleChart` equivalent.
 * The third dimension (bubble size) is read from `datum[sizeField]`.
 *
 * When `opts.dualDiscrete` is set, both axes become category axes and
 * the data encodes `[xField, yField, sizeField]` triples.
 */
export function createBubbleOptions(
  data: ChartTabularData,
  opts: BubblePresetOptions = {},
): EChartsOption {
  const {
    timeSeries = false,
    title,
    sizeField = 'size',
    maxSize = 60,
    colorScheme = 'light',
    dualDiscrete,
  } = opts

  // ── Dual discrete mode ─────────────────────────────────────────────────────
  if (dualDiscrete) {
    const xField = dualDiscrete.xField ?? 'key'
    const yField = dualDiscrete.yField ?? 'product'

    const xCategories = new Set<string>()
    const yCategories = new Set<string>()
    const seriesMap = new Map<string, Array<[string, string, number]>>()

    for (const d of data) {
      const xVal = String(d[xField] ?? '')
      const yVal = String(d[yField] ?? '')
      const sz = typeof d[sizeField] === 'number' ? (d[sizeField] as number) : 0
      xCategories.add(xVal)
      yCategories.add(yVal)
      if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
      seriesMap.get(d.group)!.push([xVal, yVal, sz])
    }

    // Compute max raw size for normalising symbolSize
    let maxRaw = 0
    for (const pts of seriesMap.values()) {
      for (const [, , sz] of pts) if (sz > maxRaw) maxRaw = sz
    }
    const scale = maxRaw > 0 ? maxSize / Math.sqrt(maxRaw) : 1

    const ddEntries = [...seriesMap.entries()]
    const ddColors = pickColors(ddEntries.length, colorScheme)

    const series = ddEntries.map(([name, pts], i) => ({
      type: 'scatter' as const,
      name,
      data: pts,
      itemStyle: { color: ddColors[i] },
      symbolSize: (val: [string, string, number]) =>
        Math.max(4, Math.round(Math.sqrt(val[2]) * scale)),
    }))

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'item' },
      legend: { type: 'scroll', bottom: 0 },
      grid: GRID,
      xAxis: { type: 'category', data: [...xCategories] },
      yAxis: { type: 'category', data: [...yCategories] },
      series,
    }
  }

  // ── Standard mode (linear / time series / discrete) ────────────────────────
  const seriesMap = new Map<string, Array<[string | number, number, number]>>()
  for (const d of data) {
    if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
    const xVal = timeSeries
      ? d.date instanceof Date
        ? d.date.getTime()
        : String(d.date ?? '')
      : String(d.key ?? '')
    // Skip null/undefined values
    if (d.value == null) continue
    const sz = typeof d[sizeField] === 'number' ? (d[sizeField] as number) : (d.value as number)
    seriesMap.get(d.group)!.push([xVal, d.value as number, sz])
  }

  // Compute max raw size for normalising symbolSize
  let maxRaw = 0
  for (const pts of seriesMap.values()) {
    for (const [, , sz] of pts) if (sz > maxRaw) maxRaw = sz
  }
  const scale = maxRaw > 0 ? maxSize / Math.sqrt(maxRaw) : 1

  const bubbleEntries = [...seriesMap.entries()]
  const bubbleColors = pickColors(bubbleEntries.length, colorScheme)

  const series = bubbleEntries.map(([name, pts], i) => ({
    type: 'scatter' as const,
    name,
    data: pts,
    itemStyle: { color: bubbleColors[i] },
    symbolSize: (val: [string | number, number, number]) =>
      Math.max(4, Math.round(Math.sqrt(val[2]) * scale)),
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: timeSeries ? { type: 'time' } : { type: 'value' },
    yAxis: { type: 'value' },
    series,
  }
}
