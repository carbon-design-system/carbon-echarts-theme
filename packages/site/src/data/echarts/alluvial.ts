/**
 * ECharts equivalents for the Alluvial / Sankey chart page.
 * Data mirrors packages/site/src/data/carboncharts/alluvial.ts exactly.
 */
import type { EChartsOption } from 'echarts'
import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import type { AlluvialDatum } from '@carbon/echarts-theme/presets'
import {
  red60,
  yellow50,
  green60,
  magenta50,
  teal40,
  cyan50,
  purple50,
  teal50,
  red50,
  magenta60,
  green30,
} from '@carbon/colors'

// ── Shared datasets ────────────────────────────────────────────────────────────

// Basic / Gradient / Custom-colors all use the same flow data
export const basicData: AlluvialDatum[] = [
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
export const multiCategoryData: AlluvialDatum[] = [
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
export const monochromeData: AlluvialDatum[] = [
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
export const alignedData: AlluvialDatum[] = [
  { source: 'A', target: 'X', value: 3 },
  { source: 'A', target: 'Y', value: 7 },
  { source: 'B', target: 'X', value: 8 },
  { source: 'B', target: 'Y', value: 3 },
  { source: 'C', target: 'X', value: 5 },
  { source: 'Y', target: 'Z', value: 13 },
]

// ── Gradient color scale — matches Carbon Charts optionsGradient.color.scale ──
// All values are Carbon design tokens from @carbon/colors (imported at top of file).
// Note: the Carbon Charts storybook used '#ee538b' for Page Header which is not
// a valid Carbon token (off by one digit from magenta50 #ee5396); corrected here.
const gradientColors: Record<string, string> = {
  Cards: red60,
  'About Modal': yellow50,
  'Create Flow': green60,
  'Page Header': magenta50,
  Notifications: teal40,
  'Data and AI, AI Apps': cyan50,
  'Data and AI, Info Architecture': purple50,
  Security: teal50,
  Automation: red50,
  'Public Cloud': green60,
}

// Custom colors — keys A/B/C don't match any nodes in basicData,
// so both Carbon Charts and ECharts render with their default auto-palette.
// Values: magenta60 (#d02670), teal40 (#08bdba), green30 (#6fdc8c)
const customColors: Record<string, string> = {
  A: magenta60,
  B: teal40,
  C: green30,
}

// ── Exports ────────────────────────────────────────────────────────────────────

/** [0] Basic alluvial — auto-palette node colours */
export const alluvialBasic: EChartsOption = createAlluvialOptions(basicData)

/** [1] Gradient — links blend from source colour to target colour.
 *  Colors match the Carbon Charts storybook's explicit color.scale overrides.
 *  gradient: true alone is sufficient when auto-palette colors are acceptable. */
export const alluvialGradient: EChartsOption = createAlluvialOptions(basicData, {
  gradient: true,
  colors: gradientColors, // optional: overrides auto-palette with storybook-matching colors
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

/** [5] Custom colours — uses basicData matching Carbon Charts optionsCustomColors.
 *  The color scale keys (A/B/C) don't match any node names in basicData, so
 *  both Carbon Charts and ECharts render with their default auto-palette. */
export const alluvialCustomColors: EChartsOption = createAlluvialOptions(basicData, {
  colors: customColors,
})
