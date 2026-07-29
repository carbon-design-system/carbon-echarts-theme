import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

// ── Donut / Pie shared ────────────────────────────────────────────────────────

export interface PiePresetOptions {
  /** Chart title text */
  title?: string
  /** Show percentage labels on slices */
  showLabels?: boolean
}

export interface DonutPresetOptions extends PiePresetOptions {
  /** Inner radius as a percentage string (default: '40%') */
  innerRadius?: string
  /** Outer radius as a percentage string (default: '70%') */
  outerRadius?: string
}

type PieDataItem = { name: string; value: number }

/** Aggregate flat tabular data into { name, value } pairs for pie/donut.
 *  Sorted largest-first so ECharts assigns colors in the same order as
 *  Carbon Charts, which renders slices largest → smallest.
 */
function toPieData(data: ChartTabularData): PieDataItem[] {
  const map = new Map<string, number>()
  for (const d of data) {
    map.set(d.group, (map.get(d.group) ?? 0) + d.value)
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

// ── Donut preset ──────────────────────────────────────────────────────────────

/**
 * Build an ECharts option object for donut charts.
 *
 * Carbon Charts `DonutChart` equivalent.
 */
export function createDonutOptions(
  data: ChartTabularData,
  opts: DonutPresetOptions = {},
): EChartsOption {
  const { title, showLabels = true, innerRadius = '40%', outerRadius = '70%' } = opts

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: [innerRadius, outerRadius],
        label: { show: showLabels },
        data: toPieData(data),
      },
    ],
  }
}

// ── Pie preset ────────────────────────────────────────────────────────────────

/**
 * Build an ECharts option object for pie charts.
 *
 * Carbon Charts `PieChart` equivalent.
 */
export function createPieOptions(
  data: ChartTabularData,
  opts: PiePresetOptions = {},
): EChartsOption {
  const { title, showLabels = true } = opts

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: '60%',
        label: { show: showLabels },
        data: toPieData(data),
      },
    ],
  }
}
