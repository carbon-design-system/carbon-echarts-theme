import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Scatter / Bubble shared types ─────────────────────────────────────────────

export interface ScatterPresetOptions {
  /** Use date field as x-axis (time-series mode) */
  timeSeries?: boolean
  /** Chart title text */
  title?: string
}

export interface BubblePresetOptions extends ScatterPresetOptions {
  /**
   * Name of the extra field used as bubble size.
   * Default: 'size'. The field must exist on the datum.
   */
  sizeField?: string
  /** Maximum rendered bubble diameter in pixels (default: 60) */
  maxSize?: number
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
  const { timeSeries = false, title } = opts

  // Group by series name
  const seriesMap = new Map<string, Array<[string | number, number]>>()
  for (const d of data) {
    if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
    const xVal = timeSeries
      ? d.date instanceof Date
        ? d.date.getTime()
        : String(d.date ?? '')
      : String(d.key ?? '')
    seriesMap.get(d.group)!.push([xVal, d.value])
  }

  const series = [...seriesMap.entries()].map(([name, pts]) => ({
    type: 'scatter' as const,
    name,
    data: pts,
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
 */
export function createBubbleOptions(
  data: ChartTabularData,
  opts: BubblePresetOptions = {},
): EChartsOption {
  const { timeSeries = false, title, sizeField = 'size', maxSize = 60 } = opts

  const seriesMap = new Map<string, Array<[string | number, number, number]>>()
  for (const d of data) {
    if (!seriesMap.has(d.group)) seriesMap.set(d.group, [])
    const xVal = timeSeries
      ? d.date instanceof Date
        ? d.date.getTime()
        : String(d.date ?? '')
      : String(d.key ?? '')
    const sz = typeof d[sizeField] === 'number' ? (d[sizeField] as number) : d.value
    seriesMap.get(d.group)!.push([xVal, d.value, sz])
  }

  // Compute max raw size for normalising symbolSize
  let maxRaw = 0
  for (const pts of seriesMap.values()) {
    for (const [, , sz] of pts) if (sz > maxRaw) maxRaw = sz
  }
  const scale = maxRaw > 0 ? maxSize / Math.sqrt(maxRaw) : 1

  const series = [...seriesMap.entries()].map(([name, pts]) => ({
    type: 'scatter' as const,
    name,
    data: pts,
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
