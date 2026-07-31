import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'

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
  /**
   * The field name on each data item that holds the numeric observation value.
   * Defaults to `'value'`.
   */
  valueField?: string
}

/**
 * Build an ECharts option object for histogram charts.
 *
 * Carbon Charts `HistogramChart` equivalent.
 * Uses a gapless bar series (`barCategoryGap: '1%'`) to simulate histogram bins.
 * Accepts either pre-binned data (key = bin label, value = count) or raw
 * value data that is auto-bucketed when `binWidth` is provided.
 * Multi-group data is rendered as stacked bars, matching Carbon Charts behaviour.
 */
export function createHistogramOptions(
  data: ChartTabularData,
  opts: HistogramPresetOptions = {},
): EChartsOption {
  const { title, binWidth, valueField = 'value' } = opts

  // Collect unique groups in insertion order
  const groupOrder: string[] = []
  const groupSet = new Set<string>()
  for (const d of data) {
    const g = String(d.group ?? 'Dataset 1')
    if (!groupSet.has(g)) {
      groupSet.add(g)
      groupOrder.push(g)
    }
  }

  let categories: string[]
  // groupCounts[groupName][binIndex] = count
  const groupCounts: Record<string, number[]> = {}

  if (binWidth !== undefined && binWidth > 0) {
    // Auto-bucket raw values per group
    const rawValues = data.map((d) => d[valueField] as number)
    const min = Math.floor(Math.min(...rawValues) / binWidth) * binWidth
    const max = Math.ceil(Math.max(...rawValues) / binWidth) * binWidth

    const binKeys: number[] = []
    for (let b = min; b < max; b += binWidth) binKeys.push(b)

    categories = binKeys.map((k) => String(k))

    // Initialise all groups with zero counts
    for (const g of groupOrder) {
      groupCounts[g] = new Array<number>(binKeys.length).fill(0)
    }

    for (const d of data) {
      const g = String(d.group ?? 'Dataset 1')
      const v = d[valueField] as number
      const idx = Math.floor((v - min) / binWidth)
      const safeIdx = Math.min(idx, binKeys.length - 1)
      groupCounts[g][safeIdx]++
    }
  } else {
    // Pre-binned: key → label, value → count
    categories = data.map((d) => String(d.key ?? d.group))
    const g = groupOrder[0] ?? 'Dataset 1'
    groupCounts[g] = data.map((d) => d[valueField] as number)
  }

  const colors = pickColors(groupOrder.length)

  const series = groupOrder.map((g, i) => ({
    name: g,
    type: 'bar' as const,
    stack: 'total',
    data: groupCounts[g],
    barCategoryGap: '1%', // near-zero gap → histogram look
    itemStyle: { color: colors[i] },
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: groupOrder.length > 1 ? { top: 'bottom' } : undefined,
    grid: GRID,
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series,
  }
}
