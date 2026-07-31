import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'

// ── Treemap preset ────────────────────────────────────────────────────────────

export interface TreemapPresetOptions {
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
  /**
   * Explicit per-group color map `{ [groupName]: hexColor }`.
   * When provided, each parent group is rendered in the given color and
   * children inherit it via ECharts' `colorSaturation`. Takes precedence over
   * the auto-generated `pickColors()` palette.
   */
  colors?: Record<string, string>
}

/** Hierarchical node matching Carbon Charts' treemap data format */
export interface TreemapHierarchyNode {
  name: string
  value?: number
  children?: TreemapHierarchyNode[]
  showLabel?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TreemapNode = any

/**
 * Build an ECharts option object for treemap charts.
 *
 * Carbon Charts `TreemapChart` equivalent.
 *
 * Data format: flat `{ group (parent/category), key (leaf name), value }`.
 * Rows with the same `group` are placed under one parent node.
 * Colors are assigned per parent group (matching Carbon Charts' behavior),
 * not per leaf node. Children inherit the parent color via `colorSaturation`.
 *
 * If all rows belong to the same group the flat list is used directly and
 * each leaf is individually colored as before.
 */
export function createTreemapOptions(
  data: ChartTabularData,
  opts: TreemapPresetOptions = {},
): EChartsOption {
  const { title, colorScheme = 'light' } = opts

  // Build group → children map in insertion order
  const groupMap = new Map<string, TreemapNode[]>()
  for (const d of data) {
    if (!groupMap.has(d.group)) groupMap.set(d.group, [])
    const leaf = String(d.key ?? d.group)
    groupMap.get(d.group)!.push({
      name: leaf,
      value: d.value as number,
    })
  }

  const groupNames = [...groupMap.keys()]
  const isSingleGroup = groupNames.length === 1

  // Colors: per-group when multiple groups (Carbon Charts behavior), per-leaf otherwise
  const paletteColors = opts.colors
    ? groupNames.map((g) => opts.colors![g] ?? pickColors(1, colorScheme)[0]!)
    : pickColors(
        isSingleGroup ? groupMap.get(groupNames[0]!)!.length : groupNames.length,
        colorScheme,
      )

  let treeData: TreemapNode[]
  // Legend proxy names: groups for multi-group, leaves for single-group
  let legendNames: string[]
  let legendColors: string[]

  if (isSingleGroup) {
    // Single group — flat list, color each leaf individually
    const leaves = groupMap.get(groupNames[0]!)!
    treeData = leaves.map((leaf, i) => ({
      ...leaf,
      itemStyle: { color: paletteColors[i] },
    }))
    legendNames = leaves.map((l) => l.name)
    legendColors = paletteColors
  } else {
    // Multi-group — color by parent, children inherit via colorSaturation
    treeData = groupNames.map((name, i) => {
      const parentColor = paletteColors[i]!
      return {
        name,
        value: groupMap.get(name)!.reduce((s, c) => s + c.value, 0),
        itemStyle: { color: parentColor },
        colorSaturation: [0.4, 0.8],
        children: groupMap.get(name)!.map((child) => ({
          ...child,
          // Children don't need explicit color — they inherit from parent's colorSaturation
        })),
      }
    })
    legendNames = groupNames
    legendColors = paletteColors
  }

  // ECharts assigns color[i] to series[i] in order.
  // series[0] = treemap (ignores its series-level color; uses per-node itemStyle).
  // series[1..N] = scatter legend proxies — they must align with the group palette.
  // Prepend a transparent placeholder so the scatter slots start at index 1.
  const colorArray = ['transparent', ...legendColors]

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    // ECharts legend only binds to series names, not treemap data node names.
    // Invisible scatter series (one per group, data:[]) act as legend proxies.
    color: colorArray,
    legend: { type: 'scroll', bottom: 0, icon: 'rect' },
    series: [
      {
        type: 'treemap',
        data: treeData,
        breadcrumb: { show: false },
        label: { show: true, fontSize: 12, overflow: 'truncate' },
        upperLabel: { show: false },
        itemStyle: { gapWidth: 2 },
        levels: isSingleGroup
          ? []
          : [
              // level 0 — parent nodes: colored block, label shown
              { upperLabel: { show: true }, itemStyle: { gapWidth: 4, borderWidth: 4 } },
              // level 1 — leaf nodes: inherit parent colorSaturation
              { colorSaturation: [0.4, 0.8], itemStyle: { gapWidth: 2 } },
            ],
      },
      // Legend proxies — one invisible scatter series per group/leaf
      ...legendNames.map((name) => ({
        type: 'scatter' as const,
        name,
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

/**
 * Build an ECharts option object for a hierarchical treemap.
 *
 * Accepts Carbon Charts' native nested data format directly:
 * `[{ name, children: [{ name, value }] }]` — one entry per top-level category.
 *
 * Parent nodes are assigned categorical colors from `pickColors()`.
 * Children inherit the parent color with a lightness range via ECharts'
 * `colorSaturation` so siblings are visually distinct shades of the same hue.
 */
export function createTreemapOptionsFromHierarchy(
  roots: TreemapHierarchyNode[],
  opts: TreemapPresetOptions = {},
): EChartsOption {
  const { title, colorScheme = 'light' } = opts

  const colors = pickColors(roots.length, colorScheme)

  // Sum a subtree's leaf values to produce a parent value
  function sumNode(node: TreemapHierarchyNode): number {
    if (node.children && node.children.length > 0) {
      return node.children.reduce((s, c) => s + sumNode(c), 0)
    }
    return node.value ?? 0
  }

  function buildNode(node: TreemapHierarchyNode, color?: string): TreemapNode {
    const value = sumNode(node)
    const built: TreemapNode = { name: node.name, value }
    if (color) built.itemStyle = { color }
    if (node.children && node.children.length > 0) {
      built.children = node.children.map((child) => buildNode(child, color))
    }
    return built
  }

  const treeData: TreemapNode[] = roots.map((root, i) => {
    const color = colors[i]!
    const node = buildNode(root, color)
    // colorSaturation is a top-level node property in ECharts (not inside itemStyle)
    node.itemStyle = { color }
    node.colorSaturation = [0.35, 0.85] // ECharts-specific node-level property
    return node
  })

  // Legend proxies — one per top-level category (parent node)
  const colorArray = ['transparent', ...colors]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const levels: any[] = [
    {
      // level 0 — top-level parent nodes: colored border + bright label
      itemStyle: { borderColor: '#555', borderWidth: 4, gapWidth: 4 },
      upperLabel: { show: true },
    },
    {
      // level 1 — leaf nodes: inherit parent color via colorSaturation
      colorSaturation: [0.35, 0.85],
      itemStyle: { borderColorSaturation: 0.6, gapWidth: 2, borderWidth: 2 },
    },
  ]

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    color: colorArray,
    legend: { type: 'scroll', bottom: 0, icon: 'rect' },
    series: [
      {
        type: 'treemap',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: treeData as any,
        breadcrumb: { show: true },
        label: { show: true, fontSize: 12, overflow: 'truncate' },
        upperLabel: { show: true, height: 24 },
        itemStyle: { gapWidth: 2 },
        levels,
      },
      // Legend proxies — one invisible scatter series per parent category
      ...roots.map((root, i) => ({
        type: 'scatter' as const,
        name: root.name,
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
   * axis field values found in the data with max = highest value for that axis.
   */
  indicators?: Array<{ name: string; max?: number }>
  /**
   * Global maximum value for all indicators (e.g. Carbon Charts `radar.maxValue`).
   * Overrides per-indicator auto-calculated max when set.
   */
  maxValue?: number
  /**
   * Field name used as the series/group dimension (default: 'group').
   * Carbon Charts option: `data.groupMapsTo` (e.g. 'product', 'month').
   */
  groupField?: string
  /**
   * Field name used as the axis/spoke dimension (default: 'key').
   * Carbon Charts option: `radar.axes.angle` (e.g. 'feature', 'activity').
   */
  axisField?: string
  /**
   * Field name used as the numeric value (default: 'value').
   * Carbon Charts option: `radar.axes.value` (e.g. 'score', 'hoursAvg').
   */
  valueField?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
}

/**
 * Build an ECharts option object for radar charts.
 *
 * Carbon Charts `RadarChart` equivalent.
 * Each unique `groupField` value becomes one polygon on the radar.
 *
 * Supports custom field mappings for datasets that use non-standard field names
 * (e.g. `product`/`feature`/`score` or `month`/`activity`/`hoursAvg`).
 */
export function createRadarOptions(
  data: ChartTabularData,
  opts: RadarPresetOptions = {},
): EChartsOption {
  const {
    title,
    colorScheme = 'light',
    groupField = 'group',
    axisField = 'key',
    valueField = 'value',
    maxValue,
  } = opts

  // Collect axis values (spokes) in insertion order
  const keyOrder: string[] = []
  const keySet = new Set<string>()
  for (const d of data) {
    const k = String((d as Record<string, unknown>)[axisField] ?? d.key ?? '')
    if (!keySet.has(k)) {
      keySet.add(k)
      keyOrder.push(k)
    }
  }

  // Max per axis key for indicator — used only when maxValue is not set
  const keyMax = new Map<string, number>()
  for (const d of data) {
    const k = String((d as Record<string, unknown>)[axisField] ?? d.key ?? '')
    const v = ((d as Record<string, unknown>)[valueField] ?? d.value) as number
    keyMax.set(k, Math.max(keyMax.get(k) ?? 0, v ?? 0))
  }

  const indicators =
    opts.indicators ??
    keyOrder.map((k) => ({
      name: k,
      max: maxValue ?? (keyMax.get(k) ?? 100) * 1.2, // 20% headroom unless global max set
    }))

  // Build one series item per group
  const groupMap = new Map<string, Map<string, number>>()
  for (const d of data) {
    const grp = String((d as Record<string, unknown>)[groupField] ?? d.group ?? '')
    const k = String((d as Record<string, unknown>)[axisField] ?? d.key ?? '')
    const v = ((d as Record<string, unknown>)[valueField] ?? d.value) as number
    if (!groupMap.has(grp)) groupMap.set(grp, new Map())
    groupMap.get(grp)!.set(k, v ?? 0)
  }

  const groups = [...groupMap.keys()]
  const colors = pickColors(groups.length, colorScheme)

  const seriesData = [...groupMap.entries()].map(([name, kvMap], i) => ({
    name,
    value: keyOrder.map((k) => kvMap.get(k) ?? 0),
    lineStyle: { color: colors[i] },
    itemStyle: { color: colors[i] },
    areaStyle: { color: colors[i], opacity: 0.3 },
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
