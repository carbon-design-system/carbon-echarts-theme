import type { EChartsOption } from 'echarts'
import { sunburstPalette } from './_transform'

// ── Sunburst preset ───────────────────────────────────────────────────────────

export interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
}

export interface SunburstPresetOptions {
  /** Chart title text */
  title?: string
  /**
   * Color scheme for palette selection ('light' or 'dark').
   * Currently both use the same mid-range sunburstPalette; this option is
   * reserved for when design provides a dark-specific set. Default: 'light'.
   */
  colorScheme?: 'light' | 'dark'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SunburstDataNode = any

/**
 * Recursively assign a colour to a root node and enable ECharts'
 * `colorSaturation` so all descendants get auto-shaded variants of the same
 * hue — identical to how the treemap preset handles child inheritance.
 */
function colorizeNode(node: SunburstNode, color: string): SunburstDataNode {
  const built: SunburstDataNode = {
    name: node.name,
    ...(node.value !== undefined ? { value: node.value } : {}),
    itemStyle: { color },
  }
  if (node.children?.length) {
    // colorSaturation tells ECharts to shade children between these two
    // lightness extremes, deriving their colours from the parent's hue.
    built.colorSaturation = [0.35, 0.85]
    built.children = node.children.map((child) => colorizeNode(child, color))
  }
  return built
}

/**
 * Build an ECharts option object for a sunburst chart.
 *
 * Accepts the same nested hierarchy format as treemap:
 * `[{ name, value?, children?: [...] }]`
 *
 * Top-level nodes are each assigned a colour from `sunburstPalette` (45
 * Carbon token colours covering all 9 hues at mid-range stops). Children
 * inherit the parent colour with auto-shaded saturation variants via ECharts'
 * `colorSaturation`, so no per-node `itemStyle.color` is needed in the data.
 *
 * The palette cycles if there are more than 45 top-level nodes.
 */
export function createSunburstOptions(
  roots: SunburstNode[],
  opts: SunburstPresetOptions = {},
): EChartsOption {
  const { title } = opts
  const palette = sunburstPalette as string[]

  const data: SunburstDataNode[] = roots.map((root, i) =>
    colorizeNode(root, palette[i % palette.length]!),
  )

  return {
    ...(title ? { title: { text: title, left: 'center' } } : {}),
    series: [
      {
        type: 'sunburst',
        data,
        radius: [0, '90%'],
        emphasis: { focus: 'ancestor' },
        itemStyle: { borderWidth: 1, borderColor: 'white' },
        levels: [
          {},
          {
            // Ring 1 — top-level categories: hide labels (too narrow); shown on hover
            r0: '15%',
            r: '35%',
            itemStyle: { borderWidth: 2 },
            label: { show: false },
          },
          {
            // Ring 2 — sub-categories: radial labels, white text with shadow for contrast
            r0: '35%',
            r: '70%',
            label: {
              align: 'right',
              color: '#fff',
              textShadowBlur: 3,
              textShadowColor: 'rgba(0,0,0,0.6)',
              minAngle: 8,
            },
          },
          {
            // Ring 3 — leaf nodes: thin outer ring, labels positioned outside
            r0: '70%',
            r: '72%',
            label: { position: 'outside', padding: 3, silent: false },
            itemStyle: { borderWidth: 3 },
          },
        ],
      },
    ],
  }
}
