/**
 * ECharts equivalents for the Treemap chart page.
 * Data mirrors carboncharts/treemap.ts exactly.
 */
import type { EChartsOption } from 'echarts'
import { teal30, teal40, teal50, teal60, teal70, teal80 } from '@carbon/colors'
import { createTreemapOptions } from '@carbon/echarts-theme/presets'

// ── Flat format for slot [0] — same hierarchy expressed as group/key rows ────
export const flatData = [
  { group: 'Oceania', key: 'A', value: 800 },
  { group: 'Oceania', key: 'B', value: 200 },
  { group: 'Oceania', key: 'C', value: 100 },
  { group: 'Oceania', key: 'D', value: 900 },
  { group: 'Europe', key: 'France', value: 2800 },
  { group: 'Europe', key: 'Germany', value: 10000 },
  { group: 'Europe', key: 'Sweden', value: 500 },
  { group: 'Europe', key: 'England', value: 500 },
  { group: 'Europe', key: 'Italy', value: 200 },
  { group: 'America', key: 'U.S.', value: 3500 },
  { group: 'America', key: 'Brazil', value: 3000 },
  { group: 'America', key: 'Mexico', value: 2000 },
  { group: 'America', key: 'AA', value: 500 },
  { group: 'America', key: 'BB', value: 100 },
  { group: 'America', key: 'CC', value: 500 },
  { group: 'America', key: 'DD', value: 500 },
  { group: 'America', key: 'EE', value: 400 },
  { group: 'America', key: 'FF', value: 600 },
  { group: 'America', key: 'GG', value: 200 },
  { group: 'America', key: 'HH', value: 800 },
  { group: 'America', key: 'II', value: 900 },
  { group: 'America', key: 'JJ', value: 100 },
  { group: 'America', key: 'KK', value: 900 },
  { group: 'Australia', key: 'KH', value: 2000 },
  { group: 'Australia', key: 'LL', value: 400 },
  { group: 'Australia', key: 'MM', value: 500 },
  { group: 'Australia', key: 'NN', value: 100 },
  { group: 'Australia', key: 'OO', value: 1000 },
  { group: 'Australia', key: 'PP', value: 800 },
  { group: 'Australia', key: 'QQ', value: 700 },
  { group: 'Australia', key: 'RR', value: 200 },
  { group: 'Australia', key: 'ST', value: 300 },
  { group: 'Africa', key: 'Nigeria', value: 2300 },
  { group: 'Africa', key: 'TT', value: 2000 },
  { group: 'Africa', key: 'UU', value: 500 },
  { group: 'Africa', key: 'VV', value: 1200 },
  { group: 'Africa', key: 'WW', value: 2000 },
  { group: 'Africa', key: 'XX', value: 800 },
  { group: 'Africa', key: 'YY', value: 2000 },
  { group: 'Africa', key: 'ZZ', value: 500 },
  { group: 'Africa', key: 'ABC', value: 1200 },
  { group: 'Africa', key: 'CBA', value: 1500 },
  { group: 'Asia', key: 'China', value: 12500 },
  { group: 'Asia', key: 'Iran', value: 22500 },
  { group: 'Asia', key: 'Myanmar', value: 12500 },
]

// Slot [0] — flat layout — colors assigned per parent group (6 groups)
export const treemap: EChartsOption = createTreemapOptions(flatData)

// Slot [1] — Custom colors (teal ramp) matching Carbon Charts customColorOptions
// teal30 #3ddbd9, teal40 #08bdba, teal50 #009d9a, teal60 #007d79, teal70 #005d5d, teal80 #004144
export const treemapNested: EChartsOption = createTreemapOptions(flatData, {
  colors: {
    Oceania: teal30,
    Europe: teal40,
    America: teal50,
    Australia: teal60,
    Africa: teal70,
    Asia: teal80,
  },
})
