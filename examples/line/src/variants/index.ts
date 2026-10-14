import type { EChartsOption } from 'echarts'

// ── Import every variant option ───────────────────────────────────────────────
import { option as rainfall } from './rainfall'
import { option as stock } from './stock'
import { option as stackedArea } from './stacked-area'
import { option as step } from './step'
import { option as spark } from './spark'
import { option as zoom } from './zoom'
import { option as discrete } from './discrete'
import { option as rotatedTicks } from './rotated-ticks'
import { option as locale } from './locale'
import { option as logAxis } from './log-axis'
import { option as customColors } from './custom-colors'
import { option as selectedGroups } from './selected-groups'
import { option as legendOrientation } from './legend-orientation'
import { option as thresholds } from './thresholds'
import { option as longLabel } from './long-label'
import { option as timeSeries } from './time-series'
import { option as timeSeriesDense } from './time-series-dense'
import { option as dualAxis } from './dual-axis'

export interface Variant {
  slug: string
  label: string
  option: EChartsOption
  /** Chart height in px (default 400) */
  height?: number
}

export const VARIANTS: Variant[] = [
  // ── Showcase ───────────────────────────────────────────────────────────────
  { slug: 'rainfall', label: 'Rainfall vs Evaporation', option: rainfall, height: 360 },
  { slug: 'stock', label: 'Weekly Stock Price Trends', option: stock, height: 420 },
  {
    slug: 'stacked-area',
    label: 'Channel Traffic (Stacked Area)',
    option: stackedArea,
    height: 360,
  },
  { slug: 'step', label: 'Server Alert States (Step)', option: step, height: 320 },
  { slug: 'spark', label: 'Spark Line', option: spark, height: 120 },
  { slug: 'zoom', label: 'Daily KPI Trends (Zoom)', option: zoom, height: 420 },
  // ── Carbon Charts parity ───────────────────────────────────────────────────
  { slug: 'discrete', label: 'Line (discrete)', option: discrete },
  { slug: 'rotated-ticks', label: 'Line (time series, rotated ticks)', option: rotatedTicks },
  { slug: 'locale', label: 'Line (time series, locale)', option: locale },
  { slug: 'log-axis', label: 'Line (log axis)', option: logAxis },
  { slug: 'custom-colors', label: 'Line (custom colors)', option: customColors },
  { slug: 'selected-groups', label: 'Line (selected groups)', option: selectedGroups },
  { slug: 'legend-orientation', label: 'Line (legend orientation)', option: legendOrientation },
  { slug: 'thresholds', label: 'Line (time series, thresholds)', option: thresholds },
  { slug: 'long-label', label: 'Line (truncated labels)', option: longLabel },
  { slug: 'time-series', label: 'Line (time series)', option: timeSeries },
  { slug: 'time-series-dense', label: 'Line (time series, dense)', option: timeSeriesDense },
  { slug: 'dual-axis', label: 'Line (dual axis)', option: dualAxis },
]

export const DEFAULT_SLUG = VARIANTS[0].slug

export function findVariant(slug: string): Variant {
  return VARIANTS.find((v) => v.slug === slug) ?? VARIANTS[0]
}
