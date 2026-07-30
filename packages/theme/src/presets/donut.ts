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
  const {
    title,
    showLabels = true,
    colorScheme = 'light',
    innerRadius = '40%',
    outerRadius = '70%',
  } = opts
  const pieData = toPieData(data)
  const total = pieData.reduce((sum, item) => sum + item.value, 0)
  const totalLabel = new Intl.NumberFormat('en-US').format(total)

  // ECharts renders center text via a second transparent series with position:'center'.
  // This is the canonical approach — graphic elements can't reliably vertically-center text.
  return {
    ...(title ? { title: { text: title } } : {}),
    color: pickColors(pieData.length, colorScheme),
    tooltip: { trigger: 'item' },
    // Explicitly list real series names so the ghost "_total_" item is excluded.
    legend: { type: 'scroll', bottom: 0, data: pieData.map((d) => d.name) },
    series: [
      {
        type: 'pie',
        radius: [innerRadius, outerRadius],
        center: ['50%', '42%'],
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: true,
        minShowLabelAngle: 0,
        labelLine: { show: showLabels, length: 10, length2: 5 },
        label: {
          show: showLabels,
          position: 'outer',
          formatter: ({ percent }: { percent?: number }) =>
            `${Math.round((percent ?? 0) * 10) / 10}%`,
        },
        data: pieData,
      },
      {
        // Transparent ghost series solely to render the center total label.
        // ECharts requires a non-empty-name data item for the label to render;
        // we hide the slice and exclude it from the legend.
        type: 'pie',
        radius: [0, innerRadius],
        center: ['50%', '42%'],
        silent: true,
        animation: false,
        tooltip: { show: false },
        legendHoverLink: false,
        label: {
          show: true,
          position: 'center',
          fontSize: 14,
          fontWeight: 400,
          formatter: () => totalLabel,
        },
        labelLine: { show: false },
        itemStyle: { color: 'transparent', borderWidth: 0 },
        data: [{ value: 1, name: '_total_', itemStyle: { color: 'transparent' } }],
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
        center: ['50%', '42%'],
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: true,
        minShowLabelAngle: 0,
        labelLine: { show: showLabels, length: 10, length2: 5 },
        label: {
          show: showLabels,
          position: 'outer',
          formatter: ({ percent }: { percent?: number }) =>
            `${Math.round((percent ?? 0) * 10) / 10}%`,
        },
        data: pieData,
      },
    ],
  }
}
