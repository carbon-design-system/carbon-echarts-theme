import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

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
  /** Minimum gap between nodes in pixels (default: 8) */
  nodeGap?: number
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
  const { title, orient = 'horizontal', nodeAlign = 'justify', nodeWidth = 20, nodeGap = 8 } = opts

  // Collect unique node names in insertion order
  const nodeSet = new Set<string>()
  for (const d of data) {
    nodeSet.add(d.source)
    nodeSet.add(d.target)
  }
  const nodes = [...nodeSet].map((name) => ({ name }))

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
        lineStyle: { opacity: 0.3, curveness: 0.5 },
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
    value: d.value,
  }))
  return createAlluvialOptions(links, opts)
}
