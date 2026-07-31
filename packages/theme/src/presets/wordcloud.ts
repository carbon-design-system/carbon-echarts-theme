import type { EChartsOption } from 'echarts'
import { pickColors } from './_transform'

// ── Word Cloud preset ─────────────────────────────────────────────────────────

export interface WordCloudPresetOptions {
  /** Chart title text */
  title?: string
  /** Color scheme for palette selection (default: 'light') */
  colorScheme?: 'light' | 'dark'
  /** Min font size in px (default: 12) */
  minFontSize?: number
  /** Max font size in px (default: 60) */
  maxFontSize?: number
  /** Shape: 'circle' | 'cardioid' | 'diamond' | 'triangle' (default: 'circle') */
  shape?: 'circle' | 'cardioid' | 'diamond' | 'triangle'
}

export interface WordCloudDatum {
  name: string
  value: number
}

/**
 * Build an ECharts option object for word cloud charts.
 *
 * Requires the `echarts-wordcloud` extension to be imported as a side effect
 * before rendering: `import 'echarts-wordcloud'`
 *
 * Data format: `{ name: string, value: number }[]`
 *
 * Colors are cycled from the Carbon categorical palette so each word gets a
 * distinct color regardless of dataset size.
 */
export function createWordCloudOptions(
  data: WordCloudDatum[],
  opts: WordCloudPresetOptions = {},
): EChartsOption {
  const {
    title,
    colorScheme = 'light',
    minFontSize = 12,
    maxFontSize = 60,
    shape = 'circle',
  } = opts

  // Use 14 colors (full categorical palette) for cycling across all words
  const paletteSize = Math.min(data.length, 14)
  const colors = pickColors(paletteSize > 0 ? paletteSize : 1, colorScheme)

  const coloredData = data.map((d, i) => ({
    ...d,
    textStyle: { color: colors[i % colors.length] },
  }))

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { show: true },
    series: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {
        type: 'wordCloud',
        shape,
        sizeRange: [minFontSize, maxFontSize],
        rotationRange: [-90, 90],
        data: coloredData,
      } as any,
    ],
  }
}
