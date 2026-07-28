import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

// ── Tree preset ───────────────────────────────────────────────────────────────

export interface TreePresetOptions {
  /** Chart title text */
  title?: string
  /**
   * Tree layout direction.
   * - `'LR'` — left to right (default, matches Carbon Charts `TreeChart`)
   * - `'TB'` — top to bottom
   * - `'RL'` — right to left
   * - `'BT'` — bottom to top
   */
  orient?: 'LR' | 'RL' | 'TB' | 'BT'
  /**
   * Initial collapse depth. Nodes deeper than this value are collapsed.
   * `undefined` = all nodes expanded (default).
   */
  initialDepth?: number
  /** Show expand/collapse symbols on branch nodes (default: true) */
  expandAndCollapse?: boolean
}

/** Recursive tree node — mirrors Carbon Charts' tree data format */
export interface TreeNode {
  name: string
  value?: number
  children?: TreeNode[]
}

/**
 * Build an ECharts option object for tree (org chart / dendrogram) charts.
 *
 * Carbon Charts `TreeChart` equivalent.
 *
 * Accepts either a pre-built `TreeNode` hierarchy or flat tabular data
 * (via `createTreeOptionsFromTabular`).
 */
export function createTreeOptions(
  root: TreeNode,
  opts: TreePresetOptions = {},
): EChartsOption {
  const {
    title,
    orient = 'LR',
    initialDepth,
    expandAndCollapse = true,
  } = opts

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item', formatter: '{b}' },
    series: [
      {
        type: 'tree',
        data: [root],
        orient,
        ...(initialDepth !== undefined ? { initialTreeDepth: initialDepth } : {}),
        expandAndCollapse,
        symbol: 'emptyCircle',
        symbolSize: 8,
        label: {
          fontSize: 12,
          // Position labels based on orientation
          position: orient === 'LR' ? 'left' : orient === 'RL' ? 'right' : 'top',
          verticalAlign: 'middle',
          align: orient === 'LR' ? 'right' : orient === 'RL' ? 'left' : 'center',
        },
        leaves: {
          label: {
            position: orient === 'LR' ? 'right' : orient === 'RL' ? 'left' : 'bottom',
            verticalAlign: 'middle',
            align: orient === 'LR' ? 'left' : orient === 'RL' ? 'right' : 'center',
          },
        },
        animationDurationUpdate: 300,
      },
    ],
  }
}

/**
 * Adapter: build tree options from Carbon Charts flat tabular data.
 *
 * Expected row format: `{ group (parent name), key (child name), value? }`.
 * A synthetic root node named after the first unique `group` that never
 * appears as a `key` is used as the tree root.
 *
 * For deeply nested trees supply a pre-built `TreeNode` to `createTreeOptions`
 * directly.
 */
export function createTreeOptionsFromTabular(
  data: ChartTabularData,
  opts: TreePresetOptions = {},
): EChartsOption {
  // Build parent → children map
  const childMap = new Map<string, TreeNode[]>()
  const allChildren = new Set<string>()

  for (const d of data) {
    const parent = d.group
    const child = String(d.key ?? '')
    if (!childMap.has(parent)) childMap.set(parent, [])
    childMap.get(parent)!.push({ name: child, value: d.value })
    allChildren.add(child)
  }

  // Root = a group name that never appears as a child key
  const rootName = [...childMap.keys()].find(k => !allChildren.has(k)) ?? [...childMap.keys()][0] ?? 'root'

  function buildNode(name: string): TreeNode {
    const children = childMap.get(name)
    if (!children || children.length === 0) return { name }
    return {
      name,
      children: children.map(c => buildNode(c.name)),
    }
  }

  return createTreeOptions(buildNode(rootName), opts)
}
