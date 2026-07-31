/**
 * ECharts equivalents for the Donut and Pie chart pages.
 *
 * Data matches carboncharts/pie.ts (pieData / pieDataMapsTo) exactly.
 */
import type { EChartsOption } from 'echarts'
import { createDonutOptions, createPieOptions } from '@carbon/echarts-theme/presets'

// ── Shared data — mirrors carboncharts/pie.ts exactly ────────────────────────

const data = [
  { group: '2V2N 9KYPM version 1', value: 20000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 65000 },
  { group: 'JQAI 2M4L1', value: 75000 },
  { group: 'J9DZ F37AP', value: 1200 },
  { group: 'YEL48 Q6XK YEL48', value: 10000 },
  { group: 'Misc', value: 25000 },
]

// valueMapsTo data — mirrors carboncharts/pie.ts pieDataMapsTo exactly
const dataMapsTo = [
  { group: '2V2N 9KYPM version 1', value: 0, count: 28000 },
  { group: 'L22I P66EP L22I P66EP L22I P66EP', value: 0, count: 65000 },
  { group: 'JQAI 2M4L1', value: 0, count: 75000 },
  { group: 'J9DZ F37AP', value: 0, count: 3200 },
  { group: 'YEL48 Q6XK YEL48', value: 0, count: 15000 },
  { group: 'Misc', value: 0, count: 25000 },
]

// ── Donut exports ─────────────────────────────────────────────────────────────

/** Slot [0] — basic donut with 'Browsers' center label, left-aligned (default) */
export const donut: EChartsOption = createDonutOptions(data, {
  centerLabel: 'Browsers',
})

/** Slot [1] — donut centered in container */
export const donutCentered: EChartsOption = createDonutOptions(data, {
  centerLabel: 'Browsers',
  alignment: 'center',
})

/** Slot [2] — donut using `count` field as the slice value */
export const donutValueMapsTo: EChartsOption = createDonutOptions(dataMapsTo, {
  valueMapsTo: 'count',
})

// ── Pie exports ───────────────────────────────────────────────────────────────

/** Slot [0] — basic full-circle pie, left-aligned (default) */
export const pie: EChartsOption = createPieOptions(data)

/**
 * Slot [1] — pie centered in container.
 * Carbon Charts pieCenteredOptions uses `alignment: Alignments.CENTER`.
 * In ECharts, centering means moving the legend+chart to the center.
 * We use the same pie data but apply legend positioning to center.
 */
export const pieCentered: EChartsOption = createPieOptions(data, {
  alignment: 'center',
})

/** Slot [1] variant with percentage labels (kept for reference, not used by PiePage) */
export const pieWithPercentage: EChartsOption = createPieOptions(data, {
  showPercentageLabels: true,
})

/** Slot [2] — pie using `count` field as the slice value (valueMapsTo: 'count') */
export const pieValueMapsTo: EChartsOption = createPieOptions(dataMapsTo, {
  valueMapsTo: 'count',
})
