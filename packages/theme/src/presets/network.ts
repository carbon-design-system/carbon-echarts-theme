import type { EChartsOption } from 'echarts'
import { gray50 } from '@carbon/colors'
import { pickColors } from './_transform'

// ── Network Diagram (graph) preset ───────────────────────────────────────────

export interface NetworkNode {
  id: string
  name: string
  value?: number
  category?: string
}

export interface NetworkLink {
  source: string
  target: string
  value?: number
}

export interface NetworkPresetOptions {
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
  /** Layout algorithm: 'force' (default) | 'circular' | 'none' */
  layout?: 'force' | 'circular' | 'none'
  /** Whether to enable node dragging in force layout (default: true) */
  draggable?: boolean
  /** Whether to show labels on nodes (default: true) */
  showLabels?: boolean
}

/**
 * Build an ECharts option object for network / graph charts.
 *
 * Uses the ECharts `graph` series type with force-directed layout by default.
 * Nodes are coloured by category via Carbon's N-colour palette.
 */
export function createNetworkOptions(
  nodes: NetworkNode[],
  links: NetworkLink[],
  opts: NetworkPresetOptions = {},
): EChartsOption {
  const {
    title,
    colorScheme = 'light',
    layout = 'force',
    draggable = true,
    showLabels = true,
  } = opts

  // Collect unique category names in insertion order
  const categorySet = new Set<string>()
  for (const node of nodes) {
    if (node.category !== undefined) {
      categorySet.add(node.category)
    }
  }
  const categories = [...categorySet]

  // Resolve per-category colours
  const paletteColors =
    categories.length > 0 ? pickColors(categories.length, colorScheme) : pickColors(1, colorScheme)

  const categoryColorMap = new Map<string, string>(
    categories.map((cat, i) => [cat, paletteColors[i]!]),
  )

  // Build ECharts node objects
  const echartsNodes = nodes.map((node) => {
    const color =
      node.category !== undefined ? categoryColorMap.get(node.category) : paletteColors[0]

    return {
      id: node.id,
      name: node.name,
      symbolSize: node.value !== undefined ? Math.max(10, Math.sqrt(node.value) * 3) : 20,
      ...(node.category !== undefined ? { category: node.category } : {}),
      itemStyle: color ? { color } : undefined,
      label: {
        show: showLabels,
        position: 'right' as const,
        fontSize: 11,
      },
    }
  })

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { trigger: 'item' as const },
    series: [
      {
        type: 'graph' as const,
        layout,
        data: echartsNodes,
        links: links.map((l) => ({ source: l.source, target: l.target, value: l.value })),
        roam: true,
        draggable,
        force: { repulsion: 100, gravity: 0.1, edgeLength: 80 },
        lineStyle: { color: gray50, width: 1, opacity: 0.5 },
        emphasis: { focus: 'adjacency' as const },
      },
    ],
  }
}
