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
  /** Label for the x-axis (bottom), e.g. `'Age'`. */
  xAxisLabel?: string
  /** Label for the y-axis (left), e.g. `'No. of participants'`. */
  yAxisLabel?: string
}

/**
 * Build an ECharts option object for histogram charts.
 *
 * Carbon Charts `HistogramChart` equivalent.
 *
 * Uses a numeric value x-axis with bars positioned at each bin's centre and
 * `barWidth` set to exactly the bin width in data units (via `barMaxWidth`
 * workaround). Each bin edge therefore aligns with tick marks on the axis,
 * producing a gapless histogram identical to Carbon Charts' layout.
 * Multi-group data is rendered as stacked bars, matching Carbon Charts.
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

  // groupCounts[groupName][binIndex] = count
  const groupCounts: Record<string, number[]> = {}
  let binKeys: number[] = []

  if (binWidth !== undefined && binWidth > 0) {
    // Auto-bucket raw values per group
    const rawValues = data.map((d) => d[valueField] as number)
    const min = Math.floor(Math.min(...rawValues) / binWidth) * binWidth
    const max = Math.ceil(Math.max(...rawValues) / binWidth) * binWidth

    for (let b = min; b < max; b += binWidth) binKeys.push(b)

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
    const g = groupOrder[0] ?? 'Dataset 1'
    binKeys = data.map((d) => d[valueField] as number)
    groupCounts[g] = data.map((d) => d[valueField] as number)
  }

  const colors = pickColors(groupOrder.length)

  // Build the x-axis label list: bin-start values plus the closing boundary.
  // e.g. [20, 25, 30 … 85, 90] for binWidth=5 over age data.
  const closingLabel = binWidth
    ? String(Math.ceil(Math.max(...data.map((d) => d[valueField] as number)) / binWidth) * binWidth)
    : undefined
  const xAxisData = closingLabel ? [...binKeys.map(String), closingLabel] : binKeys.map(String)

  // barCategoryGap: '0%' makes stacked bars fill their category slot completely
  // (no gap between adjacent bins). Setting it on every series ensures ECharts
  // picks it up as the chart-level gap for the whole bar group.
  // barMaxWidth: Infinity overrides the global theme default of 48px — without
  // this the bars are capped at 48px and leave gaps to the grid lines.
  const series = groupOrder.map((g, i) => ({
    name: g,
    type: 'bar' as const,
    stack: 'total',
    // One value per bin; append null for the closing-boundary label slot
    data: closingLabel ? [...groupCounts[g], null] : groupCounts[g],
    barCategoryGap: '0%',
    barMaxWidth: Infinity,
    itemStyle: { color: colors[i], borderColor: '#ffffff', borderWidth: 0.5 },
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: groupOrder.length > 1 ? { bottom: 0 } : undefined,
    grid: GRID,
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: opts.xAxisLabel ?? '',
      nameLocation: 'middle',
      nameGap: 40,
      // alignWithLabel: false moves both ticks and splitLines from the category
      // centre to the slot boundary, so vertical grid lines are flush with
      // the edges of each histogram bar — matching Carbon Charts' layout.
      axisTick: { alignWithLabel: false },
      splitLine: { show: true },
    },
    yAxis: {
      type: 'value',
      name: opts.yAxisLabel ?? '',
      nameLocation: 'middle',
      nameGap: 48,
    },
    series,
  }
}
