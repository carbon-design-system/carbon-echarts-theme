import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'

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
   * Monochrome mode: all nodes receive the same single-colour from the
   * Carbon Charts 1-colour palette (purple-70 light / purple-30 dark).
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
  for (const d of data) {
    nodeSet.add(d.source)
    nodeSet.add(d.target)
  }
  const nodeNames = [...nodeSet]

  // Resolve node colours
  let nodeColorMap: Record<string, string>
  if (monochrome) {
    const monoColor = pickColors(1, colorScheme)[0]!
    nodeColorMap = Object.fromEntries(nodeNames.map((n) => [n, monoColor]))
  } else if (Object.keys(colors).length > 0) {
    // Only override nodes that have an explicit entry; leave others uncoloured
    nodeColorMap = colors
  } else {
    // Auto-assign palette colours per source node; target-only nodes get no
    // explicit colour so ECharts assigns them automatically.
    const paletteColors = pickColors(nodeNames.length, colorScheme)
    nodeColorMap = Object.fromEntries(nodeNames.map((n, i) => [n, paletteColors[i]!]))
  }

  const nodes = nodeNames.map((name) => {
    const color = nodeColorMap[name]
    return color ? { name, itemStyle: { color } } : { name }
  })

  // Link style: gradient blends from source to target colour
  const lineStyle: Record<string, unknown> = { opacity: 0.3, curveness: 0.5 }
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
        label: { fontSize: 12 },
        lineStyle,
        emphasis: {
          focus: 'adjacency',
          lineStyle: { opacity: 0.6 },
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
