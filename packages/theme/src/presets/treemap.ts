import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'

// ── Treemap preset ────────────────────────────────────────────────────────────

export interface TreemapPresetOptions {
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

type TreemapNode = {
  name: string
  value: number
  children?: TreemapNode[]
  itemStyle?: { color?: string }
}

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
  const { title, colorScheme = 'light' } = opts

  // Collect leaf names in insertion order to assign colors consistently
  const leafNames: string[] = []
  const leafNameSet = new Set<string>()
  for (const d of data) {
    const leaf = String(d.key ?? d.group)
    if (!leafNameSet.has(leaf)) {
      leafNameSet.add(leaf)
      leafNames.push(leaf)
    }
  }

  const colors = pickColors(leafNames.length, colorScheme)
  const colorByLeaf = new Map(leafNames.map((name, i) => [name, colors[i]]))

  const groupMap = new Map<string, TreemapNode[]>()
  for (const d of data) {
    if (!groupMap.has(d.group)) groupMap.set(d.group, [])
    const leaf = String(d.key ?? d.group)
    groupMap.get(d.group)!.push({
      name: leaf,
      value: d.value,
      itemStyle: { color: colorByLeaf.get(leaf) },
    })
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

  // ECharts assigns color[i] to series[i] in order.
  // series[0] = treemap (ignores its series-level color; uses per-node itemStyle).
  // series[1..N] = scatter legend proxies — they must align with the leaf palette.
  // Prepend a transparent placeholder so the scatter slots start at index 1.
  const colorArray = ['transparent', ...leafNames.map((name) => colorByLeaf.get(name) as string)]

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    // ECharts legend only binds to series names, not treemap data node names.
    // Invisible scatter series (one per leaf, data:[]) act as legend proxies.
    color: colorArray,
    legend: { type: 'scroll', bottom: 0, icon: 'rect' },
    series: [
      {
        type: 'treemap',
        data: treeData,
        breadcrumb: { show: false },
        // Labels render natively on each tile — ECharts truncates automatically
        // when the tile is too small. This is intentionally kept on (unlike the
        // previous `show: false`) as it is a built-in ECharts feature that adds
        // useful at-a-glance readability Carbon Charts does not provide.
        label: { show: true, fontSize: 12, overflow: 'truncate' },
        upperLabel: { show: false },
        itemStyle: { gapWidth: 2 },
      },
      // TODO: Replace these scatter legend proxies with a custom legend component.
      //
      // ECharts' standard `legend` only binds to series names, not to treemap
      // data node names. The workaround here is one invisible `scatter` series
      // per leaf (data:[], symbolSize:0) so the legend has real series entries
      // to display. This has two known limitations:
      //   1. Clicking a legend item toggles the scatter proxy but does NOT hide
      //      the corresponding tile in the treemap (the two are not linked).
      //   2. The ghost series appear in the ECharts ARIA label string, so screen
      //      readers will announce series names that have nothing drawn.
      //
      // A proper fix requires a legendselectchanged event handler at the app
      // layer that re-filters and re-renders the treemap data on toggle, plus
      // an aria-hidden mechanism for the proxy entries. Track as a follow-up.
      ...leafNames.map((name) => ({
        type: 'scatter' as const,
        name,
        // coordinateSystem: 'none' prevents ECharts from looking for xAxis/yAxis
        // which don't exist in a treemap-only option — without this it throws
        // "xAxis 0 not found" and the entire chart fails to render.
        coordinateSystem: 'none' as const,
        data: [] as number[],
        symbolSize: 0,
        silent: true,
        animation: false,
        legendHoverLink: false,
      })),
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
