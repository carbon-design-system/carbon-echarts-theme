import type { EChartsOption } from 'echarts'
import {
  sequentialPurple,
  sequentialBlue,
  sequentialCyan,
  sequentialTeal,
  divergingRedCyan,
  divergingPurpleTeal,
} from '../palettes'

// ── Choropleth preset ─────────────────────────────────────────────────────────

/**
 * Sequential palette options — mirrors Carbon Charts `color.pairing.option`
 * for choropleth charts:
 *   1 = purple (default), 2 = blue, 3 = cyan, 4 = teal
 */
export type ChoroplethPairingOption = 1 | 2 | 3 | 4

/**
 * Diverging palette options — mirrors Carbon Charts diverging scheme:
 *   1 = red ↔ cyan, 2 = purple ↔ teal
 */
export type ChoroplethDivergingOption = 1 | 2

export interface ChoroplethPresetOptions {
  /** Chart title text */
  title?: string

  /**
   * The name of the registered ECharts map (passed to `echarts.registerMap`).
   * @default 'world'
   */
  map?: string

  /**
   * The GeoJSON feature property to match `data[].name` against.
   * Must match the key used in your boundary file (e.g. `'NAME'` for Natural Earth).
   * @default 'NAME'
   */
  nameProperty?: string

  /**
   * Sequential palette selection — mirrors Carbon Charts `color.pairing.option`.
   * 1 = purple (default), 2 = blue, 3 = cyan, 4 = teal.
   * Ignored when `diverging` is true or `colors` is provided.
   */
  pairing?: ChoroplethPairingOption

  /**
   * Provide an explicit color ramp to use instead of a Carbon sequential palette.
   * Mirrors Carbon Charts `color.gradient.colors`.
   * Takes precedence over `pairing`.
   */
  colors?: string[]

  /**
   * Use a diverging scale centred at zero.
   * Mirrors Carbon Charts behaviour when data spans negative and positive values.
   * When true, `divergingPairing` selects the palette.
   */
  diverging?: boolean

  /**
   * Diverging palette selection.
   * 1 = red ↔ cyan (default), 2 = purple ↔ teal.
   * Only used when `diverging: true`.
   */
  divergingPairing?: ChoroplethDivergingOption

  /**
   * Explicit minimum for the visualMap colour scale.
   * When omitted the scale minimum is derived from the data.
   */
  colorDomainMin?: number

  /**
   * Explicit maximum for the visualMap colour scale.
   * When omitted the scale maximum is derived from the data.
   */
  colorDomainMax?: number

  /** Allow panning and zooming the map. @default true */
  roam?: boolean
}

const SEQUENTIAL: Record<ChoroplethPairingOption, readonly string[]> = {
  1: sequentialPurple,
  2: sequentialBlue,
  3: sequentialCyan,
  4: sequentialTeal,
}

const DIVERGING: Record<ChoroplethDivergingOption, readonly string[]> = {
  1: divergingRedCyan,
  2: divergingPurpleTeal,
}

/**
 * Build an ECharts option object for choropleth (filled map) charts.
 *
 * Carbon Charts `ChoroplethChart` equivalent.
 *
 * Prerequisites — call once before rendering:
 * ```ts
 * import { feature } from 'topojson-client'
 * import worldTopoJson from './world-110m.json'
 * echarts.registerMap('world', feature(worldTopoJson, worldTopoJson.objects.countries))
 * ```
 *
 * Data format: `[{ name: string, value: number }]`
 * where `name` must match the `nameProperty` field in the GeoJSON feature properties.
 */
export function createChoroplethOptions(
  data: { name: string; value: number }[],
  opts: ChoroplethPresetOptions = {},
): EChartsOption {
  const {
    title,
    map = 'world',
    nameProperty = 'NAME',
    pairing = 1,
    colors,
    diverging = false,
    divergingPairing = 1,
    colorDomainMin,
    colorDomainMax,
    roam = true,
  } = opts

  const values = data.map((d) => d.value).filter((v) => v != null) as number[]
  const dataMin = values.length > 0 ? Math.min(...values) : 0
  const dataMax = values.length > 0 ? Math.max(...values) : 100

  const scaleMin =
    colorDomainMin ?? (diverging ? -Math.max(Math.abs(dataMin), Math.abs(dataMax)) : dataMin)
  const scaleMax =
    colorDomainMax ?? (diverging ? Math.max(Math.abs(dataMin), Math.abs(dataMax)) : dataMax)

  // Color ramp: explicit > diverging palette > sequential palette
  const colorRamp: readonly string[] = colors
    ? colors
    : diverging
      ? DIVERGING[divergingPairing]
      : SEQUENTIAL[pairing]

  return {
    ...(title ? { title: { text: title, left: 'center', top: 8 } } : {}),
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { name: string; value: number }
        return p.value != null ? `<b>${p.name}</b>: ${p.value}` : `<b>${p.name}</b>: No data`
      },
    },
    visualMap: {
      left: 'right',
      bottom: '5%',
      min: scaleMin,
      max: scaleMax,
      inRange: { color: colorRamp as string[] },
      text: ['High', 'Low'],
      calculable: true,
    },
    series: [
      {
        type: 'map',
        map,
        nameProperty,
        roam,
        data,
        label: { show: false },
        emphasis: { label: { show: false } },
      },
    ],
  }
}
