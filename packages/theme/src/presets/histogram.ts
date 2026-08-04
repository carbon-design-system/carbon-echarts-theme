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
 * Uses a gapless bar series (`barCategoryGap: '0%'`) on a category axis
 * whose labels represent bin start values. An extra label for the closing
 * boundary is appended so the final tick matches Carbon Charts' x-axis.
 * The axis tick is un-aligned from the label so ticks fall on bin boundaries.
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
  // The closing boundary label (one past the last bin) for the x-axis
  let closingBoundary: string | undefined

  if (binWidth !== undefined && binWidth > 0) {
    // Auto-bucket raw values per group
    const rawValues = data.map((d) => d[valueField] as number)
    const min = Math.floor(Math.min(...rawValues) / binWidth) * binWidth
    const max = Math.ceil(Math.max(...rawValues) / binWidth) * binWidth

    const binKeys: number[] = []
    for (let b = min; b < max; b += binWidth) binKeys.push(b)

    categories = binKeys.map((k) => String(k))
    // Append the closing boundary as an extra label so the last tick matches
    // Carbon Charts' x-axis which shows binStart…binEnd for every bin.
    closingBoundary = String(max)

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

  // Append a zero-count placeholder for the closing boundary tick so every
  // real data bar aligns with the bin-start label and the last tick shows the
  // bin end — matching Carbon Charts' histogram x-axis layout.
  const xAxisCategories = closingBoundary ? [...categories, closingBoundary] : categories

  const series = groupOrder.map((g, i) => ({
    name: g,
    type: 'bar' as const,
    stack: 'total',
    // Each series has one fewer data point than xAxisCategories (the closing
    // boundary label has no bar). Push a null placeholder to keep alignment.
    data: closingBoundary ? [...groupCounts[g], null] : groupCounts[g],
    // barCategoryGap: '0%' removes all inter-category spacing so adjacent bins
    // touch each other — the defining visual trait of a histogram.
    barCategoryGap: '0%',
    itemStyle: { color: colors[i] },
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: groupOrder.length > 1 ? { bottom: 0 } : undefined,
    grid: GRID,
    xAxis: {
      type: 'category',
      data: xAxisCategories,
      // alignWithLabel: false places tick marks at category boundaries rather
      // than at category centers, so each tick aligns with a bin edge —
      // matching Carbon Charts' continuous-scale histogram appearance.
      axisTick: { alignWithLabel: false },
    },
    yAxis: { type: 'value' },
    series,
  }
}
