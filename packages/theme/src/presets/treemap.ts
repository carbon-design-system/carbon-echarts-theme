import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

// ── Treemap preset ────────────────────────────────────────────────────────────

export interface TreemapPresetOptions {
  /** Chart title text */
  title?: string
  /** Show breadcrumb trail (default: true) */
  breadcrumb?: boolean
}

type TreemapNode = { name: string; value: number; children?: TreemapNode[] }

/**
 * Build an ECharts option object for treemap charts.
 *
 * Carbon Charts `TreemapChart` equivalent.
 *
 * Data format: flat `{ group (parent/category), key (leaf name), value }`.
 * Rows with the same `group` are placed under one parent node.
 * If all rows belong to the same group the flat list is used directly.
 */
export function createTreemapOptions(
  data: ChartTabularData,
  opts: TreemapPresetOptions = {},
): EChartsOption {
  const { title, breadcrumb = true } = opts

  const groupMap = new Map<string, TreemapNode[]>()
  for (const d of data) {
    if (!groupMap.has(d.group)) groupMap.set(d.group, [])
    groupMap.get(d.group)!.push({ name: String(d.key ?? d.group), value: d.value })
  }

  let treeData: TreemapNode[]
  if (groupMap.size === 1) {
    // Single group — flat list
    treeData = [...groupMap.values()][0]!
  } else {
    treeData = [...groupMap.entries()].map(([name, children]) => ({
      name,
      value: children.reduce((s, c) => s + c.value, 0),
      children,
    }))
  }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'treemap',
        data: treeData,
        breadcrumb: { show: breadcrumb },
        label: { fontSize: 12, overflow: 'truncate' },
        upperLabel: { show: true, height: 24, fontSize: 12 },
        itemStyle: { gapWidth: 2 },
      },
    ],
  }
}

// ── Radar preset ──────────────────────────────────────────────────────────────

export interface RadarPresetOptions {
  /** Chart title text */
  title?: string
  /**
   * Indicator definitions. If omitted, indicators are inferred from the
   * `key` values found in the data with max = highest value for that key.
   */
  indicators?: Array<{ name: string; max?: number }>
}

/**
 * Build an ECharts option object for radar charts.
 *
 * Carbon Charts `RadarChart` equivalent.
 * Each `group` becomes one polygon on the radar.
 */
export function createRadarOptions(
  data: ChartTabularData,
  opts: RadarPresetOptions = {},
): EChartsOption {
  const { title } = opts

  // Collect keys in insertion order
  const keyOrder: string[] = []
  const keySet = new Set<string>()
  for (const d of data) {
    const k = String(d.key ?? '')
    if (!keySet.has(k)) {
      keySet.add(k)
      keyOrder.push(k)
    }
  }

  // Max per key for indicator
  const keyMax = new Map<string, number>()
  for (const d of data) {
    const k = String(d.key ?? '')
    keyMax.set(k, Math.max(keyMax.get(k) ?? 0, d.value))
  }

  const indicators =
    opts.indicators ??
    keyOrder.map((k) => ({
      name: k,
      max: (keyMax.get(k) ?? 100) * 1.2, // 20% headroom
    }))

  // Build one series item per group
  const groupMap = new Map<string, Map<string, number>>()
  for (const d of data) {
    if (!groupMap.has(d.group)) groupMap.set(d.group, new Map())
    groupMap.get(d.group)!.set(String(d.key ?? ''), d.value)
  }

  const seriesData = [...groupMap.entries()].map(([name, kvMap]) => ({
    name,
    value: keyOrder.map((k) => kvMap.get(k) ?? 0),
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    radar: { indicator: indicators },
    series: [
      {
        type: 'radar',
        data: seriesData,
      },
    ],
  }
}
