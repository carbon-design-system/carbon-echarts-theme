import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Histogram preset ──────────────────────────────────────────────────────────

export interface HistogramPresetOptions {
  /** Chart title text */
  title?: string
  /**
   * Bin width for automatic bucketing.
   * If omitted the raw `key` values are used as-is (pre-binned data).
   */
  binWidth?: number
}

/**
 * Build an ECharts option object for histogram charts.
 *
 * Carbon Charts `HistogramChart` equivalent.
 * Uses a gapless bar series (`barCategoryGap: '1%'`) to simulate histogram bins.
 * Accepts either pre-binned data (key = bin label, value = count) or raw
 * value data that is auto-bucketed when `binWidth` is provided.
 */
export function createHistogramOptions(
  data: ChartTabularData,
  opts: HistogramPresetOptions = {},
): EChartsOption {
  const { title, binWidth } = opts

  let categories: string[]
  let counts: number[]

  if (binWidth !== undefined && binWidth > 0) {
    // Auto-bucket raw values
    const rawValues = data.map((d) => d.value)
    const min = Math.floor(Math.min(...rawValues) / binWidth) * binWidth
    const max = Math.ceil(Math.max(...rawValues) / binWidth) * binWidth
    const buckets = new Map<number, number>()
    for (let b = min; b < max; b += binWidth) buckets.set(b, 0)
    for (const v of rawValues) {
      const bucket = Math.floor((v - min) / binWidth) * binWidth + min
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1)
    }
    categories = [...buckets.keys()].map((k) => String(k))
    counts = [...buckets.values()]
  } else {
    // Pre-binned: key → label, value → count
    categories = data.map((d) => String(d.key ?? d.group))
    counts = data.map((d) => d.value)
  }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: GRID,
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: counts,
        barCategoryGap: '1%', // near-zero gap → histogram look
      },
    ],
  }
}
