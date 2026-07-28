import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true } as const

// ── Boxplot preset ────────────────────────────────────────────────────────────

export interface BoxplotPresetOptions {
  /** Chart title text */
  title?: string
}

type BoxplotStats = [number, number, number, number, number] // min, Q1, median, Q3, max

function computeBoxStats(values: number[]): BoxplotStats {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const q1 = sorted[Math.floor(n * 0.25)]!
  const median = sorted[Math.floor(n * 0.5)]!
  const q3 = sorted[Math.floor(n * 0.75)]!
  return [sorted[0]!, q1, median, q3, sorted[n - 1]!]
}

/**
 * Build an ECharts option object for boxplot charts.
 *
 * Carbon Charts `BoxplotChart` equivalent.
 *
 * Data format: multiple rows with the same `group` containing raw values.
 * Stats (min, Q1, median, Q3, max) are computed automatically.
 */
export function createBoxplotOptions(
  data: ChartTabularData,
  opts: BoxplotPresetOptions = {},
): EChartsOption {
  const { title } = opts

  // Collect all values per group
  const groupMap = new Map<string, number[]>()
  for (const d of data) {
    if (!groupMap.has(d.group)) groupMap.set(d.group, [])
    groupMap.get(d.group)!.push(d.value)
  }

  const categories = [...groupMap.keys()]
  const boxData: BoxplotStats[] = categories.map((g) => computeBoxStats(groupMap.get(g)!))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    grid: GRID,
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'boxplot',
        data: boxData,
      },
    ],
  }
}
