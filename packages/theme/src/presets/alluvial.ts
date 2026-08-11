import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors, pillLabel } from './_transform'

// ── Alluvial (Sankey) preset ──────────────────────────────────────────────────

export interface AlluvialPresetOptions {
  /** Chart title text */
  title?: string
  /**
   * Orientation of the flow: 'horizontal' (left → right, default) or
   * 'vertical' (top → bottom).
   */
  orient?: 'horizontal' | 'vertical'
  /**
   * Node alignment: 'justify' (default), 'left', 'right'.
   * Maps to ECharts `nodeAlign`.
   */
  nodeAlign?: 'justify' | 'left' | 'right'
  /** Node width in pixels (default: 20) */
  nodeWidth?: number
  /** Minimum gap between nodes in pixels (default: 8).
   *  Also accepted as `nodePadding` for Carbon Charts parity. */
  nodeGap?: number
  /** Carbon Charts parity alias for `nodeGap` */
  nodePadding?: number
  /**
   * Gradient links: sets `lineStyle.color: 'gradient'` so each link
   * blends from its source node colour to its target node colour.
   * Requires ECharts ≥ 5.
   */
  gradient?: boolean
  /**
   * Per-node colour overrides.  Keys are node names; values are hex colours.
   * Applied as `itemStyle.color` on each matching node.
   */
  colors?: Record<string, string>
  /**
   * Monochrome mode: all nodes and links share a single colour.
   * The colour is the first slot of the N-color palette (where N = number of
   * source nodes), matching Carbon Charts' monochrome behaviour.
   * e.g. 3 source nodes → 3-color palette option 1 → magenta50 (#ee5396) light.
   */
  monochrome?: boolean
  /** Color scheme used when deriving palette colors (default: 'light') */
  colorScheme?: 'light' | 'dark'
}

/**
 * A single flow link in alluvial/Sankey data.
 * Carbon Charts `AlluvialChart` uses `{ source, target, value }` rows.
 */
export interface AlluvialDatum {
  /** Source node name */
  source: string
  /** Target node name */
  target: string
  /** Flow magnitude */
  value: number
}

/**
 * Build an ECharts option object for alluvial (Sankey flow) charts.
 *
 * Carbon Charts `AlluvialChart` equivalent.
 *
 * Data format: `{ source, target, value }` — each row is a directed link.
 * Nodes are inferred automatically from the union of all source and target names.
 *
 * The `group` field from `ChartTabularData` is ignored; this preset accepts
 * either the native `AlluvialDatum[]` format or flat tabular rows where
 * `key` = source and `group` = target.
 */
export function createAlluvialOptions(
  data: AlluvialDatum[],
  opts: AlluvialPresetOptions = {},
): EChartsOption {
  const {
    title,
    orient = 'horizontal',
    nodeAlign = 'justify',
    nodeWidth = 20,
    // nodePadding is the Carbon Charts name; nodeGap is the ECharts name.
    // Accept either, with nodeGap taking precedence.
    nodePadding,
    nodeGap = nodePadding ?? 8,
    gradient = false,
    colors = {},
    monochrome = false,
    colorScheme = 'light',
  } = opts

  // Collect unique node names in insertion order
  const nodeSet = new Set<string>()
  const targetSet = new Set<string>()
  for (const d of data) {
    nodeSet.add(d.source)
    nodeSet.add(d.target)
    targetSet.add(d.target)
  }
  const nodeNames = [...nodeSet]
  // Source-only nodes: appear as source but never as target (left-side nodes).
  // Carbon Charts assigns palette colours only to these nodes; right-side
  // (target-only) nodes are coloured implicitly by the links flowing into them.
  const sourceOnlyNodes = nodeNames.filter((n) => !targetSet.has(n))

  // Resolve node colours
  let nodeColorMap: Record<string, string>
  if (monochrome) {
    // Carbon Charts monochrome: all links use dataGroupName:0, which resolves to the
    // first slot of the N-color palette (N = number of source nodes), not the 1-color
    // palette. e.g. 3 source nodes → 3-color palette → first color = magenta50 (#ee5396).
    const monoColor = pickColors(sourceOnlyNodes.length, colorScheme)[0]!
    nodeColorMap = Object.fromEntries(nodeNames.map((n) => [n, monoColor]))
  } else if (Object.keys(colors).length > 0) {
    // Only override nodes that have an explicit entry; leave others uncoloured
    nodeColorMap = colors
  } else {
    // Auto-assign palette colours only to source-only nodes, matching Carbon
    // Charts which colours nodes by their left-side category group.
    const paletteColors = pickColors(sourceOnlyNodes.length, colorScheme)
    nodeColorMap = Object.fromEntries(sourceOnlyNodes.map((n, i) => [n, paletteColors[i]!]))
  }

  // Compute per-node total value for label "(n)" suffix, matching Carbon Charts
  const nodeTotals: Record<string, number> = {}
  for (const d of data) {
    nodeTotals[d.source] = (nodeTotals[d.source] ?? 0) + d.value
    nodeTotals[d.target] = (nodeTotals[d.target] ?? 0) + d.value
  }

  const nodes = nodeNames.map((name) => {
    const color = nodeColorMap[name]
    return color ? { name, itemStyle: { color } } : { name }
  })

  // Link style: gradient blends from source to target colour.
  // Default opacity 0.8 matches Carbon Charts Ke.opacity.default.
  const lineStyle: Record<string, unknown> = { opacity: 0.8, curveness: 0.5 }
  if (gradient) {
    lineStyle.color = 'gradient'
  }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
    },
    series: [
      {
        type: 'sankey',
        orient,
        nodeAlign,
        nodeWidth,
        nodeGap,
        data: nodes,
        links: data.map((d) => ({ source: d.source, target: d.target, value: d.value })),
        label: {
          fontSize: 12,
          ...pillLabel,
          // Show "NodeName (total)" matching Carbon Charts node label format
          formatter: (params: { name: string }) =>
            `${params.name} (${nodeTotals[params.name] ?? 0})`,
        },
        lineStyle,
        emphasis: {
          // selected: opacity 1 — hovered adjacent link, matching Carbon Charts Ke.opacity.selected
          focus: 'adjacency',
          lineStyle: { opacity: 1 },
        },
        // blur: unfocused non-adjacent links dimmed to 0.3 (Carbon Charts Ke.opacity.unfocus)
        // Keep node labels fully visible so they remain readable during hover.
        blur: {
          lineStyle: { opacity: 0.3 },
          label: { opacity: 1 },
        },
      },
    ],
  }
}

/**
 * Adapter: build alluvial options from Carbon Charts flat tabular data.
 *
 * Maps `{ group (target), key (source), value }` rows to alluvial links.
 * Use this when migrating from `AlluvialChart` with tabular data.
 */
export function createAlluvialOptionsFromTabular(
  data: ChartTabularData,
  opts: AlluvialPresetOptions = {},
): EChartsOption {
  const links: AlluvialDatum[] = data.map((d) => ({
    source: String(d.key ?? ''),
    target: d.group,
    value: d.value as number,
  }))
  return createAlluvialOptions(links, opts)
}
