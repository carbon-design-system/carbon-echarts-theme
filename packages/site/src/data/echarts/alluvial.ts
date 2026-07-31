/**
 * ECharts equivalents for the Alluvial / Sankey chart page.
 * Data mirrors packages/site/src/data/carboncharts/alluvial.ts exactly.
 */
import type { EChartsOption } from 'echarts'
import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import type { AlluvialDatum } from '@carbon/echarts-theme/presets'

// ── Shared datasets ────────────────────────────────────────────────────────────

// Basic / Gradient / Custom-colors all use the same flow data
const basicData: AlluvialDatum[] = [
  { source: 'About Modal', target: 'Data and AI, AI Apps', value: 5 },
  { source: 'About Modal', target: 'Data and AI, Info Architecture', value: 4 },
  { source: 'About Modal', target: 'Public Cloud', value: 3 },
  { source: 'About Modal', target: 'Security', value: 4 },
  { source: 'About Modal', target: 'Automation', value: 8 },
  { source: 'Cards', target: 'Data and AI, AI Apps', value: 6 },
  { source: 'Cards', target: 'Data and AI, Info Architecture', value: 15 },
  { source: 'Cards', target: 'Public Cloud', value: 2 },
  { source: 'Cards', target: 'Security', value: 10 },
  { source: 'Cards', target: 'Automation', value: 13 },
  { source: 'Create Flow', target: 'Data and AI, AI Apps', value: 2 },
  { source: 'Create Flow', target: 'Data and AI, Info Architecture', value: 15 },
  { source: 'Create Flow', target: 'Public Cloud', value: 1 },
  { source: 'Create Flow', target: 'Security', value: 6 },
  { source: 'Create Flow', target: 'Automation', value: 15 },
  { source: 'Notifications', target: 'Data and AI, Info Architecture', value: 14 },
  { source: 'Notifications', target: 'Public Cloud', value: 3 },
  { source: 'Notifications', target: 'Security', value: 3 },
  { source: 'Page Header', target: 'Data and AI, AI Apps', value: 4 },
  { source: 'Page Header', target: 'Data and AI, Info Architecture', value: 8 },
  { source: 'Page Header', target: 'Automation', value: 13 },
]

// Multiple Categories — Titanic dataset
const multiCategoryData: AlluvialDatum[] = [
  { source: '1st', target: 'Female', value: 25 },
  { source: '1st', target: 'Male', value: 35 },
  { source: '2nd', target: 'Female', value: 35 },
  { source: '2nd', target: 'Male', value: 50 },
  { source: 'Crew', target: 'Male', value: 43 },
  { source: 'Crew', target: 'Female', value: 18 },
  { source: 'Male', target: 'Child', value: 38 },
  { source: 'Male', target: 'Adult', value: 90 },
  { source: 'Female', target: 'Adult', value: 52 },
  { source: 'Female', target: 'Child', value: 26 },
  { source: 'Child', target: 'Yes', value: 58 },
  { source: 'Child', target: 'No', value: 6 },
  { source: 'Adult', target: 'Yes', value: 22 },
  { source: 'Adult', target: 'No', value: 120 },
]

// Monochrome — simple A/B/C → X/Y/Z with custom node padding
const monochromeData: AlluvialDatum[] = [
  { source: 'A', target: 'X', value: 3 },
  { source: 'A', target: 'Y', value: 5 },
  { source: 'A', target: 'Z', value: 8 },
  { source: 'B', target: 'X', value: 6 },
  { source: 'B', target: 'Y', value: 1 },
  { source: 'B', target: 'Z', value: 7 },
  { source: 'C', target: 'X', value: 5 },
  { source: 'C', target: 'Y', value: 5 },
  { source: 'C', target: 'Z', value: 1 },
]

// Aligned Nodes — left-aligned with a 3-column flow (A/B/C → X/Y → Z)
const alignedData: AlluvialDatum[] = [
  { source: 'A', target: 'X', value: 3 },
  { source: 'A', target: 'Y', value: 7 },
  { source: 'B', target: 'X', value: 8 },
  { source: 'B', target: 'Y', value: 3 },
  { source: 'C', target: 'X', value: 5 },
  { source: 'Y', target: 'Z', value: 13 },
]

// Custom Colors — same A/B/C → X/Y/Z data with explicit per-node colours
const customColorData: AlluvialDatum[] = monochromeData

// ── Gradient color scale — matches Carbon Charts optionsGradient.color.scale ──
// These are the per-node hex colours from the Carbon Charts reference.
const gradientColors: Record<string, string> = {
  Cards: '#da1e28',
  'About Modal': '#b28600',
  'Create Flow': '#198038',
  'Page Header': '#ee538b',
  Notifications: '#08bdba',
  'Data and AI, AI Apps': '#1192e8',
  'Data and AI, Info Architecture': '#a56eff',
  Security: '#009d9a',
  Automation: '#fa4d56',
  'Public Cloud': '#198038',
}

// Custom colors for the A/B/C nodes
const customColors: Record<string, string> = {
  A: '#d12771',
  B: '#08bdba',
  C: '#6fdc8c',
}

// ── Exports ────────────────────────────────────────────────────────────────────

/** [0] Basic alluvial — auto-palette node colours */
export const alluvialBasic: EChartsOption = createAlluvialOptions(basicData)

/** [1] Gradient — links blend from source colour to target colour */
export const alluvialGradient: EChartsOption = createAlluvialOptions(basicData, {
  gradient: true,
  colors: gradientColors,
})

/** [2] Multiple categories — Titanic survival dataset */
export const alluvialMultiCategory: EChartsOption = createAlluvialOptions(multiCategoryData)

/** [3] Monochrome with custom node padding — single-colour palette, nodePadding: 33 */
export const alluvialMonochrome: EChartsOption = createAlluvialOptions(monochromeData, {
  monochrome: true,
  nodePadding: 33,
})

/** [4] Aligned nodes — left node alignment, 3-column flow */
export const alluvialAligned: EChartsOption = createAlluvialOptions(alignedData, {
  nodeAlign: 'left',
})

/** [5] Custom colours — per-node colour overrides on A/B/C nodes */
export const alluvialCustomColors: EChartsOption = createAlluvialOptions(customColorData, {
  colors: customColors,
})
