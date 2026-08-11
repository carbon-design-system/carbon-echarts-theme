import type { EChartsOption } from 'echarts'
import { pickColors, pillLabel } from './_transform'

// ── ThemeRiver preset ─────────────────────────────────────────────────────────

/**
 * A single ThemeRiver data point.
 * ECharts native format: [date, value, streamName]
 */
export type ThemeRiverDatum = [string, number, string]

export interface ThemeRiverPresetOptions {
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection ('light' or 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
  /** Whether to show the legend. Default: true */
  showLegend?: boolean
  /** Top padding for the singleAxis (space for legend). Default: 50 */
  axisTop?: number
  /** Bottom padding for the singleAxis. Default: 50 */
  axisBottom?: number
}

/**
 * Build an ECharts option object for a ThemeRiver (stream graph) chart.
 *
 * Accepts the native ECharts ThemeRiver data format — an array of
 * `[dateString, value, streamName]` tuples — and applies Carbon's N-color
 * palette so every stream is colored with a Carbon token. No hex strings
 * are hardcoded; all colors come from `@carbon/colors` via `pickColors`.
 *
 * @example
 * const data: ThemeRiverDatum[] = [
 *   ['2015-11-08', 10, 'Search Engine'],
 *   ['2015-11-08', 35, 'Direct'],
 *   ...
 * ]
 * const option = createThemeRiverOptions(data)
 * // <ReactECharts option={option} theme="carbon-white" />
 */
export function createThemeRiverOptions(
  data: ThemeRiverDatum[],
  opts: ThemeRiverPresetOptions = {},
): EChartsOption {
  const { title, colorScheme = 'light', showLegend = true, axisTop = 70, axisBottom = 50 } = opts

  // Collect unique stream names in insertion order
  const streamSet = new Set<string>()
  for (const [, , name] of data) {
    streamSet.add(name)
  }
  const streams = [...streamSet]
  const colors = pickColors(streams.length, colorScheme)

  // Title sits at top: 8px. Legend sits below it at ~32px so they never overlap.
  const legendTop = title ? 32 : 8

  return {
    ...(title ? { title: { text: title, left: 'center', top: 8 } } : {}),

    color: colors,

    ...(showLegend
      ? {
          legend: {
            data: streams,
            left: 'center',
            top: legendTop,
          },
        }
      : { legend: { show: false } }),

    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'line' as const },
    },

    singleAxis: {
      top: axisTop,
      bottom: axisBottom,
      type: 'time' as const,
    },

    series: [
      {
        type: 'themeRiver' as const,
        emphasis: {
          focus: 'self' as const,
        },
        label: {
          // White text on black pill — same treatment as alluvial node labels,
          // ensuring readability regardless of the stream colour beneath.
          ...pillLabel,
        },
        data,
      },
    ],
  }
}
