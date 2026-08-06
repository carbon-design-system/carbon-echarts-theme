import type { EChartsOption } from 'echarts'
import { pickColors } from './_transform'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Scatter / Bubble shared types ─────────────────────────────────────────────

export interface ScatterPresetOptions {
  /** Use date field as x-axis (time-series mode) */
  timeSeries?: boolean
  /**
   * Dual-axis: series names in this array go on the secondary (right) Y axis.
   * A second yAxis entry is added automatically.
   */
  secondaryGroups?: string[]
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
  /** Label for the x axis (shown in tabular view as column header) */
  xAxisName?: string
  /** Label for the y axis (shown in tabular view as column header) */
  yAxisName?: string
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
  const {
    timeSeries = false,
    secondaryGroups = [],
    title,
    colorScheme = 'light',
    xAxisName,
    yAxisName,
  } = opts
  const hasDualAxis = secondaryGroups.length > 0

  // Group by series name
  const seriesMap = new Map<string, Array<[string | number, number]>>()
  let isDiscrete = false
  for (const d of data) {
    if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
    let xVal: string | number
    if (timeSeries) {
      xVal = d.date instanceof Date ? d.date.getTime() : String(d.date ?? '')
    } else {
      const raw = d.key ?? ''
      const asNum = Number(raw)
      if (typeof raw === 'string' && isNaN(asNum)) {
        isDiscrete = true
        xVal = String(raw)
      } else {
        xVal = asNum
      }
    }
    // Skip null/undefined values — they don't produce visible points
    if (d.value == null) continue
    seriesMap.get(d.group)!.push([xVal, d.value as number])
  }

  const entries = [...seriesMap.entries()]
  const colors = pickColors(entries.length, colorScheme)

  // Collect ordered category labels for discrete mode
  const categoryLabels: string[] = isDiscrete
    ? [...new Set(data.map((d) => String(d.key ?? '')))]
    : []

  const series = entries.map(([name, pts], i) => ({
    type: 'scatter' as const,
    name,
    data: pts,
    itemStyle: { color: colors[i] },
    ...(hasDualAxis && secondaryGroups.includes(name) ? { yAxisIndex: 1 } : {}),
  }))

  const yAxis = hasDualAxis
    ? [{ type: 'value' as const }, { type: 'value' as const, splitLine: { show: false } }]
    : { type: 'value' as const }

  const xAxis = timeSeries
    ? { type: 'time' as const, ...(xAxisName ? { name: xAxisName } : {}) }
    : isDiscrete
      ? {
          type: 'category' as const,
          data: categoryLabels,
          boundaryGap: false,
          splitLine: { show: true },
          ...(xAxisName ? { name: xAxisName } : {}),
        }
      : { type: 'value' as const, ...(xAxisName ? { name: xAxisName } : {}) }

  type YAxisEntry = { type: 'value'; splitLine?: { show: boolean } }
  const yAxisWithName = hasDualAxis
    ? (yAxis as YAxisEntry[]).map((a: YAxisEntry, i: number) =>
        i === 0 && yAxisName ? { ...a, name: yAxisName } : a,
      )
    : yAxisName
      ? { ...(yAxis as object), name: yAxisName }
      : yAxis

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis,
    yAxis: yAxisWithName,
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
    maxSize = 30,
    colorScheme = 'light',
    dualDiscrete,
    xAxisName,
    yAxisName,
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
      itemStyle: { color: ddColors[i], opacity: 0.5 },
      symbolSize: (val: [string, string, number]) =>
        Math.max(4, Math.round(Math.sqrt(val[2]) * scale)),
    }))

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'item' },
      legend: { type: 'scroll', bottom: 0 },
      grid: GRID,
      xAxis: {
        type: 'category',
        data: [...xCategories],
        ...(xAxisName ? { name: xAxisName } : {}),
      },
      yAxis: {
        type: 'category',
        data: [...yCategories],
        ...(yAxisName ? { name: yAxisName } : {}),
      },
      series,
    }
  }

  // ── Standard mode (linear / time series / discrete) ────────────────────────
  const seriesMap = new Map<string, Array<[string | number, number, number]>>()
  let isDiscrete = false
  for (const d of data) {
    if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
    let xVal: string | number
    if (timeSeries) {
      xVal = d.date instanceof Date ? d.date.getTime() : String(d.date ?? '')
    } else {
      const raw = d.key ?? ''
      const asNum = Number(raw)
      if (typeof raw === 'string' && isNaN(asNum)) {
        isDiscrete = true
        xVal = String(raw)
      } else {
        xVal = asNum
      }
    }
    // Skip null/undefined values
    if (d.value == null) continue
    const sz = typeof d[sizeField] === 'number' ? (d[sizeField] as number) : (d.value as number)
    seriesMap.get(d.group)!.push([xVal, d.value as number, sz])
  }

  // Collect ordered category labels for discrete mode
  const categoryLabels: string[] = isDiscrete
    ? [...new Set(data.map((d) => String(d.key ?? '')))]
    : []

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
    itemStyle: { color: bubbleColors[i], opacity: 0.5 },
    symbolSize: (val: [string | number, number, number]) =>
      Math.max(4, Math.round(Math.sqrt(val[2]) * scale)),
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    grid: GRID,
    xAxis: timeSeries
      ? { type: 'time', ...(xAxisName ? { name: xAxisName } : {}) }
      : isDiscrete
        ? {
            type: 'category',
            data: categoryLabels,
            boundaryGap: true,
            splitLine: { show: true },
            ...(xAxisName ? { name: xAxisName } : {}),
          }
        : { type: 'value', ...(xAxisName ? { name: xAxisName } : {}) },
    yAxis: { type: 'value', ...(yAxisName ? { name: yAxisName } : {}) },
    series,
  }
}
