/**
 * ECharts equivalents for the Treemap chart page.
 * Data mirrors carboncharts/treemap.ts exactly.
 */
import type { EChartsOption } from 'echarts'
import {
  createTreemapOptions,
  createTreemapOptionsFromHierarchy,
} from '@carbon/echarts-theme/presets'
import type { TreemapHierarchyNode } from '@carbon/echarts-theme/presets'

// ── Flat format for slot [0] — same hierarchy expressed as group/key rows ────
const flatData = [
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

// ── Hierarchical format for slot [1] — Carbon's native nested structure ──────
const hierarchyData: TreemapHierarchyNode[] = [
  {
    name: 'Oceania',
    children: [
      { name: 'A', value: 800 },
      { name: 'B', value: 200 },
      { name: 'C', value: 100 },
      { name: 'D', value: 900 },
    ],
  },
  {
    name: 'Europe',
    children: [
      { name: 'France', value: 2800 },
      { name: 'Germany', value: 10000 },
      { name: 'Sweden', value: 500 },
      { name: 'England', value: 500 },
      { name: 'Italy', value: 200 },
    ],
  },
  {
    name: 'America',
    children: [
      { name: 'U.S.', value: 3500 },
      { name: 'Brazil', value: 3000 },
      { name: 'Mexico', value: 2000 },
      { name: 'AA', value: 500 },
      { name: 'BB', value: 100 },
      { name: 'CC', value: 500 },
      { name: 'DD', value: 500 },
      { name: 'EE', value: 400 },
      { name: 'FF', value: 600 },
      { name: 'GG', value: 200 },
      { name: 'HH', value: 800 },
      { name: 'II', value: 900 },
      { name: 'JJ', value: 100 },
      { name: 'KK', value: 900 },
    ],
  },
  {
    name: 'Australia',
    children: [
      { name: 'KH', value: 2000 },
      { name: 'LL', value: 400 },
      { name: 'MM', value: 500 },
      { name: 'NN', value: 100 },
      { name: 'OO', value: 1000 },
      { name: 'PP', value: 800 },
      { name: 'QQ', value: 700 },
      { name: 'RR', value: 200 },
      { name: 'ST', value: 300 },
    ],
  },
  {
    name: 'Africa',
    children: [
      { name: 'Nigeria', value: 2300 },
      { name: 'TT', value: 2000 },
      { name: 'UU', value: 500 },
      { name: 'VV', value: 1200 },
      { name: 'WW', value: 2000 },
      { name: 'XX', value: 800 },
      { name: 'YY', value: 2000 },
      { name: 'ZZ', value: 500 },
      { name: 'ABC', value: 1200 },
      { name: 'CBA', value: 1500 },
    ],
  },
  {
    name: 'Asia',
    children: [
      { name: 'China', value: 12500 },
      { name: 'Iran', value: 22500 },
      { name: 'Myanmar', value: 12500 },
    ],
  },
]

// Slot [0] — flat layout — colors assigned per parent group (6 groups)
export const treemap: EChartsOption = createTreemapOptions(flatData)

// Slot [1] — Custom colors (teal ramp) matching Carbon Charts customColorOptions
// Carbon: { Oceania: '#3ddbd9', Europe: '#08bdba', America: '#009d9a',
//           Australia: '#007d79', Africa: '#005d5d', Asia: '#004144' }
export const treemapNested: EChartsOption = createTreemapOptions(flatData, {
  colors: {
    Oceania: '#3ddbd9',
    Europe: '#08bdba',
    America: '#009d9a',
    Australia: '#007d79',
    Africa: '#005d5d',
    Asia: '#004144',
  },
})
