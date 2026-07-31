/**
 * ECharts equivalents for the Radar chart page.
 * Pairs with 'test'-tagged examples from data/carboncharts/radar.ts.
 *
 * Carbon test order (5 test examples):
 *  [0] Radar                  — product/feature/score fields
 *  [1] Radar (centered)       — same data, same layout
 *  [2] Radar (missing data)   — radarWithMissingDataData: group/key/value (Sugar/Oil/Water × cities)
 *  [3] Radar (dense)          — radarDenseData: month/activity/hoursAvg
 *  [4] Radar (custom max)     — radarWithCustomMaxScore: product/feature/score, maxValue:100
 */
import type { EChartsOption } from 'echarts'
import { createRadarOptions } from '@carbon/echarts-theme/presets'
import type { ChartTabularData } from '@carbon/echarts-theme/presets'

// ── Slot [0] and [1] — standard product × feature data ───────────────────────
// Matches carboncharts/radar.ts radarData (product/feature/score fields)
const radarData = [
  { group: 'Product 1', key: 'Price', value: 60 },
  { group: 'Product 1', key: 'Usability', value: 92 },
  { group: 'Product 1', key: 'Availability', value: 5 },
  { group: 'Product 1', key: 'Performance', value: 85 },
  { group: 'Product 1', key: 'Quality', value: 60 },
  { group: 'Product 2', key: 'Price', value: 70 },
  { group: 'Product 2', key: 'Usability', value: 63 },
  { group: 'Product 2', key: 'Availability', value: 78 },
  { group: 'Product 2', key: 'Performance', value: 50 },
  { group: 'Product 2', key: 'Quality', value: 30 },
]

// ── Slot [2] — missing datapoints: Sugar/Oil/Water × cities ──────────────────
// Matches carboncharts/radar.ts radarWithMissingDataData
// Note: Water missing Sydney (only 14 rows instead of 15) — the null position
// is preserved by the preset's sparse fill (kvMap.get(k) ?? 0).
const radarMissingData = [
  { group: 'Sugar', key: 'London', value: 25 },
  { group: 'Oil', key: 'London', value: 6 },
  { group: 'Water', key: 'London', value: 12 },
  { group: 'Sugar', key: 'Milan', value: 13 },
  { group: 'Oil', key: 'Milan', value: 6 },
  { group: 'Water', key: 'Milan', value: 28 },
  { group: 'Sugar', key: 'Paris', value: 19 },
  { group: 'Oil', key: 'Paris', value: 16 },
  { group: 'Water', key: 'Paris', value: 10 },
  { group: 'Sugar', key: 'New York', value: 11 },
  { group: 'Oil', key: 'New York', value: 18 },
  { group: 'Water', key: 'New York', value: 8 },
  { group: 'Sugar', key: 'Sydney', value: 12 },
  { group: 'Oil', key: 'Sydney', value: 16 },
  // Water/Sydney is intentionally absent (missing datapoint)
]

// ── Slot [3] — dense: month × activity × hoursAvg ────────────────────────────
// Matches carboncharts/radar.ts radarDenseData (custom field names)
const radarDenseData = [
  { month: 'January', activity: 'Eating', hoursAvg: 2 },
  { month: 'January', activity: 'Drinking', hoursAvg: 6 },
  { month: 'January', activity: 'Sleeping', hoursAvg: 6 },
  { month: 'January', activity: 'Working', hoursAvg: 8 },
  { month: 'January', activity: 'Walking', hoursAvg: 1 },
  { month: 'January', activity: 'Running', hoursAvg: 0.5 },
  { month: 'January', activity: 'Cycling', hoursAvg: 1 },
  { month: 'January', activity: 'Swimming', hoursAvg: 0 },
  { month: 'February', activity: 'Eating', hoursAvg: 1.5 },
  { month: 'February', activity: 'Drinking', hoursAvg: 9 },
  { month: 'February', activity: 'Sleeping', hoursAvg: 7 },
  { month: 'February', activity: 'Working', hoursAvg: 9 },
  { month: 'February', activity: 'Walking', hoursAvg: 2 },
  { month: 'February', activity: 'Running', hoursAvg: 2 },
  { month: 'February', activity: 'Cycling', hoursAvg: 0 },
  { month: 'February', activity: 'Swimming', hoursAvg: 1.5 },
  { month: 'March', activity: 'Eating', hoursAvg: 3 },
  { month: 'March', activity: 'Drinking', hoursAvg: 5 },
  { month: 'March', activity: 'Sleeping', hoursAvg: 5 },
  { month: 'March', activity: 'Working', hoursAvg: 6 },
  { month: 'March', activity: 'Walking', hoursAvg: 3 },
  { month: 'March', activity: 'Running', hoursAvg: 9 },
  { month: 'March', activity: 'Cycling', hoursAvg: 1 },
  { month: 'March', activity: 'Swimming', hoursAvg: 7 },
  { month: 'April', activity: 'Eating', hoursAvg: 5 },
  { month: 'April', activity: 'Drinking', hoursAvg: 1 },
  { month: 'April', activity: 'Sleeping', hoursAvg: 4 },
  { month: 'April', activity: 'Working', hoursAvg: 2 },
  { month: 'April', activity: 'Walking', hoursAvg: 5 },
  { month: 'April', activity: 'Running', hoursAvg: 4 },
  { month: 'April', activity: 'Cycling', hoursAvg: 6 },
  { month: 'April', activity: 'Swimming', hoursAvg: 3 },
  { month: 'May', activity: 'Eating', hoursAvg: 7 },
  { month: 'May', activity: 'Drinking', hoursAvg: 0 },
  { month: 'May', activity: 'Sleeping', hoursAvg: 5 },
  { month: 'May', activity: 'Working', hoursAvg: 4 },
  { month: 'May', activity: 'Walking', hoursAvg: 8 },
  { month: 'May', activity: 'Running', hoursAvg: 2 },
  { month: 'May', activity: 'Cycling', hoursAvg: 3 },
  { month: 'May', activity: 'Swimming', hoursAvg: 1 },
]

// ── Slot [4] — custom max score: single product, values ≤60, maxValue:100 ────
// Matches carboncharts/radar.ts radarWithCustomMaxScore
const radarCustomMaxData = [
  { group: 'Product 1', key: 'Price', value: 50 },
  { group: 'Product 1', key: 'Usability', value: 20 },
  { group: 'Product 1', key: 'Availability', value: 5 },
  { group: 'Product 1', key: 'Performance', value: 45 },
  { group: 'Product 1', key: 'Quality', value: 60 },
]

// ── Exports ───────────────────────────────────────────────────────────────────

/** Slot [0] — Radar (two products) */
export const radar: EChartsOption = createRadarOptions(radarData)

/** Slot [1] — Radar (centered) — same data, same options */
export const radarMultiSeries: EChartsOption = createRadarOptions(radarData)

/** Slot [2] — Radar missing datapoints (Sugar/Oil/Water × cities) */
export const radarMissingDatapoints: EChartsOption = createRadarOptions(radarMissingData)

/** Slot [3] — Radar dense (month × activity × hoursAvg) */
export const radarDense: EChartsOption = createRadarOptions(
  radarDenseData as unknown as ChartTabularData,
  {
    groupField: 'month',
    axisField: 'activity',
    valueField: 'hoursAvg',
  },
)

/** Slot [4] — Radar custom max score (single product, maxValue: 100) */
export const radarCustomMax: EChartsOption = createRadarOptions(radarCustomMaxData, {
  maxValue: 100,
})
