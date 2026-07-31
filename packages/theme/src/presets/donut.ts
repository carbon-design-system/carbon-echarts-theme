import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'

// ── Donut / Pie shared ────────────────────────────────────────────────────────

export interface PiePresetOptions {
  /** Chart title text */
  title?: string
  /** Show percentage labels on slices */
  showLabels?: boolean
  /** Show percentage labels (e.g. '25%') directly on each slice */
  showPercentageLabels?: boolean
  /** Use light or dark Carbon Charts palette selection */
  colorScheme?: 'light' | 'dark'
  /**
   * When set, use `d[valueMapsTo]` as the numeric value for each slice
   * instead of the standard `d.value` field. Carbon Charts parity alias.
   */
  valueMapsTo?: string
  /**
   * Layout alignment. 'center' centres the pie in the container.
   * 'left' (default) offsets it to leave room for a left legend.
   * Maps to Carbon Charts `Alignments.CENTER`.
   */
  alignment?: 'left' | 'center'
}

export interface DonutPresetOptions extends PiePresetOptions {
  /** Inner radius as a percentage string (default: '40%') */
  innerRadius?: string
  /** Outer radius as a percentage string (default: '70%') */
  outerRadius?: string
  /** Text to display in the donut hole center (replaces default total) */
  centerLabel?: string
  /** Smaller subtitle text displayed below centerLabel */
  centerSubLabel?: string
  /**
   * Layout alignment. 'center' centres the donut in the container.
   * 'left' (default) offsets it to leave room for a left legend.
   */
  alignment?: 'left' | 'center'
  /**
   * When set, use `d[valueMapsTo]` as the numeric value for each slice
   * instead of the standard `d.value` field.
   */
  valueMapsTo?: string
}

type PieDataItem = { name: string; value: number }

/** Aggregate flat tabular data into { name, value } pairs for pie/donut. */
function toPieData(data: ChartTabularData, valueMapsTo?: string): PieDataItem[] {
  const map = new Map<string, number>()
  for (const d of data) {
    let scalar: number
    if (valueMapsTo) {
      const raw = d[valueMapsTo]
      scalar = typeof raw === 'number' ? raw : 0
    } else {
      scalar = Array.isArray(d.value) ? (d.value[1] ?? 0) : (d.value ?? 0)
    }
    map.set(d.group, (map.get(d.group) ?? 0) + scalar)
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
    showPercentageLabels,
    colorScheme = 'light',
    innerRadius = '40%',
    outerRadius = '70%',
    centerLabel,
    centerSubLabel,
    alignment = 'left',
    valueMapsTo,
  } = opts

  const pieData = toPieData(data, valueMapsTo)
  const total = pieData.reduce((sum, item) => sum + item.value, 0)
  const totalLabel = new Intl.NumberFormat('en-US').format(total)

  // 'center' layout places the donut at the true midpoint of the container.
  // 'left' offsets the donut slightly left to visually balance with the legend.
  const centerPos: [string, string] = alignment === 'center' ? ['50%', '50%'] : ['50%', '42%']

  // Center label text: prefer explicit centerLabel, else total aggregate
  const centerText = centerLabel ?? totalLabel

  // Whether outer percentage labels are shown (showPercentageLabels overrides showLabels)
  const labelVisible = showPercentageLabels !== undefined ? showPercentageLabels : showLabels

  // ECharts renders center text via a second transparent series with position:'center'.
  // This is the canonical approach — graphic elements can't reliably vertically-center text.

  // Build the center-label ghost series entry
  const centerLabelEntry: object = {
    type: 'pie',
    radius: [0, innerRadius],
    center: centerPos,
    silent: true,
    animation: false,
    tooltip: { show: false },
    legendHoverLink: false,
    label: {
      show: true,
      position: 'center',
      fontSize: centerSubLabel ? 22 : 14,
      fontWeight: centerSubLabel ? 700 : 400,
      formatter: () => centerText,
    },
    labelLine: { show: false },
    itemStyle: { color: 'transparent', borderWidth: 0 },
    data: [{ value: 1, name: '_total_', itemStyle: { color: 'transparent' } }],
  }

  // If a sub-label was requested, add a second ghost series for it
  const subLabelEntry: object[] = centerSubLabel
    ? [
        {
          type: 'pie',
          radius: [0, innerRadius],
          center: centerPos,
          silent: true,
          animation: false,
          tooltip: { show: false },
          legendHoverLink: false,
          label: {
            show: true,
            position: 'center',
            fontSize: 12,
            fontWeight: 400,
            // Push the sub-label below the main label with a leading newline
            formatter: () => `\n\n${centerSubLabel}`,
          },
          labelLine: { show: false },
          itemStyle: { color: 'transparent', borderWidth: 0 },
          data: [{ value: 1, name: '_sublabel_', itemStyle: { color: 'transparent' } }],
        },
      ]
    : []

  return {
    ...(title ? { title: { text: title } } : {}),
    color: pickColors(pieData.length, colorScheme),
    tooltip: { trigger: 'item' },
    // Explicitly list real series names so ghost items are excluded from legend.
    legend: { type: 'scroll', bottom: 0, data: pieData.map((d) => d.name) },
    series: [
      {
        type: 'pie',
        radius: [innerRadius, outerRadius],
        center: centerPos,
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: true,
        minShowLabelAngle: 0,
        labelLine: { show: labelVisible, length: 10, length2: 5 },
        label: {
          show: labelVisible,
          position: 'outer',
          formatter: ({ percent }: { percent?: number }) =>
            `${Math.round((percent ?? 0) * 10) / 10}%`,
        },
        data: pieData,
      },
      centerLabelEntry,
      ...subLabelEntry,
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
  const {
    title,
    showLabels = true,
    showPercentageLabels,
    colorScheme = 'light',
    valueMapsTo,
    alignment = 'left',
  } = opts
  const pieData = toPieData(data, valueMapsTo)

  const labelVisible = showPercentageLabels !== undefined ? showPercentageLabels : showLabels
  const centerPos: [string, string] = alignment === 'center' ? ['50%', '50%'] : ['50%', '42%']

  return {
    ...(title ? { title: { text: title } } : {}),
    color: pickColors(pieData.length, colorScheme),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: centerPos,
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: true,
        minShowLabelAngle: 0,
        labelLine: { show: labelVisible, length: 10, length2: 5 },
        label: {
          show: labelVisible,
          position: 'outer',
          formatter: ({ percent }: { percent?: number }) =>
            `${Math.round((percent ?? 0) * 10) / 10}%`,
        },
        data: pieData,
      },
    ],
  }
}
