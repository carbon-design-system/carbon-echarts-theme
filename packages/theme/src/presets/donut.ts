import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'

// ── Donut / Pie shared ────────────────────────────────────────────────────────

export interface PiePresetOptions {
  /** Chart title text */
  title?: string
  /** Show percentage labels on slices */
  showLabels?: boolean
  /** Use light or dark Carbon Charts palette selection */
  colorScheme?: 'light' | 'dark'
}

export interface DonutPresetOptions extends PiePresetOptions {
  /** Inner radius as a percentage string (default: '40%') */
  innerRadius?: string
  /** Outer radius as a percentage string (default: '70%') */
  outerRadius?: string
}

type PieDataItem = { name: string; value: number }

/** Aggregate flat tabular data into { name, value } pairs for pie/donut. */
function toPieData(data: ChartTabularData): PieDataItem[] {
  const map = new Map<string, number>()
  for (const d of data) {
    map.set(d.group, (map.get(d.group) ?? 0) + d.value)
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }))
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
  const {
    title,
    showLabels = true,
    colorScheme = 'light',
    innerRadius = '40%',
    outerRadius = '70%',
  } = opts
  const pieData = toPieData(data)

  return {
    ...(title ? { title: { text: title } } : {}),
    color: pickColors(pieData.length, colorScheme),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: [innerRadius, outerRadius],
        label: { show: showLabels, formatter: '{d}%' },
        data: pieData,
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
  const { title, showLabels = true, colorScheme = 'light' } = opts
  const pieData = toPieData(data)

  return {
    ...(title ? { title: { text: title } } : {}),
    color: pickColors(pieData.length, colorScheme),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: '60%',
        label: { show: showLabels, formatter: '{d}%' },
        data: pieData,
      },
    ],
  }
}
