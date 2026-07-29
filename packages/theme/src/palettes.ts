/**
 * IBM data-vis color palettes, derived from @carbon/colors.
 *
 * All values come from named exports of @carbon/colors — zero hardcoded hex
 * strings, with the two noted exceptions where Carbon Charts itself uses
 * explicit values (yellow50, orange60/70) because those tokens are present in
 * @carbon/colors but historically were missing from the SCSS map used by
 * Carbon Charts. We import them directly.
 *
 * Palette definitions match the authoritative Carbon Charts source:
 * packages/core/scss/_color-palette.scss
 */
import {
  white,
  // Categorical — light (14-color, set 1)
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  yellow50, // #b28600 — present in @carbon/colors
  teal50,
  cyan90,
  orange70, // #8a3800 — present in @carbon/colors
  purple50,

  // Categorical — dark (14-color, set 1)
  purple60,
  cyan40,
  teal60,
  magenta40,
  red40,
  red10,
  green30,
  blue50,
  magenta60, // #d02670
  yellow40, // #d2a106
  teal40,
  cyan20,
  orange60, // #ba4e00
  purple30,

  // Sequential — purple
  purple10,
  purple20,
  purple40,
  purple80,
  purple90,
  purple100,

  // Sequential — blue
  blue10,
  blue20,
  blue30,
  blue40,
  blue60,
  blue70,
  blue90,
  blue100,

  // Sequential — cyan
  cyan10,
  cyan30,
  cyan60,
  cyan70,
  cyan80,
  cyan100,

  // Sequential — teal
  teal10,
  teal20,
  teal30,
  teal80,
  teal90,
  teal100,

  // Diverging — red↔cyan
  red20,
  red30,
  red60,
  red70,
  red80,

  // Diverging — purple↔teal
  // (colors already imported above)

  // Alert
  red60 as alertDanger,
  orange40,
  yellow30,
  green60 as alertSuccess,
} from '@carbon/colors'

// ─── Palette interfaces ───────────────────────────────────────────────────────

export interface CarbonSequentialPalette {
  /** 11 stops, light → dark, for use with quantize/heatmap scales */
  purple: readonly string[]
  blue: readonly string[]
  cyan: readonly string[]
  teal: readonly string[]
}

export interface CarbonDivergingPalette {
  /** 17 stops: 8 left-hue → white midpoint → 8 right-hue */
  redCyan: readonly string[]
  purpleTeal: readonly string[]
}

export interface CarbonPalettes {
  /** 14-color IBM categorical palette in display order */
  categorical: readonly string[]
  sequential: CarbonSequentialPalette
  diverging: CarbonDivergingPalette
  /** [danger, warning, caution, success] */
  alert: readonly [string, string, string, string]
}

// ─── Light theme palettes ─────────────────────────────────────────────────────

/**
 * 14-color categorical palette for light themes (white / g10).
 * Source: Carbon Charts _color-palette.scss $white-theme-colors '14' > '1'
 */
const lightCategorical: readonly string[] = [
  purple70, // 1
  cyan50, // 2
  teal70, // 3
  magenta70, // 4
  red90, // 5  matches Carbon Charts 5-series variant '5-1-5'
  red50, // 6
  green60, // 7
  blue80, // 8
  magenta50, // 9
  yellow50, // 10  #b28600
  teal50, // 11
  cyan90, // 12
  orange70, // 13  #8a3800
  purple50, // 14
]

/**
 * 14-color categorical palette for dark themes (g90 / g100).
 * Source: Carbon Charts _color-palette.scss $dark-theme-colors '14' > '1'
 */
const darkCategorical: readonly string[] = [
  purple60, // 1
  cyan40, // 2
  teal60, // 3
  magenta40, // 4
  red50, // 5  (same as light)
  red10, // 6
  green30, // 7
  blue50, // 8
  magenta60, // 9  #d02670
  yellow40, // 10  #d2a106
  teal40, // 11
  cyan20, // 12
  orange60, // 13  #ba4e00
  purple30, // 14
]

// ─── Sequential palettes (11 stops each, shared light/dark) ──────────────────
// Source: Carbon Charts _color-palette.scss $monochrome-quantize-colors
// Direction: lightest → darkest (white prepended as stop 1)

const sequentialPurple: readonly string[] = [
  white,
  purple10,
  purple20,
  purple30,
  purple40,
  purple50,
  purple60,
  purple70,
  purple80,
  purple90,
  purple100,
]

const sequentialBlue: readonly string[] = [
  white,
  blue10,
  blue20,
  blue30,
  blue40,
  blue50,
  blue60,
  blue70,
  blue80,
  blue90,
  blue100,
]

const sequentialCyan: readonly string[] = [
  white,
  cyan10,
  cyan20,
  cyan30,
  cyan40,
  cyan50,
  cyan60,
  cyan70,
  cyan80,
  cyan90,
  cyan100,
]

const sequentialTeal: readonly string[] = [
  white,
  teal10,
  teal20,
  teal30,
  teal40,
  teal50,
  teal60,
  teal70,
  teal80,
  teal90,
  teal100,
]

// ─── Diverging palettes (17 stops each, shared light/dark) ───────────────────
// Source: Carbon Charts _color-palette.scss $divergent-quantize-colors
// Direction: left-extreme → white midpoint → right-extreme

const divergingRedCyan: readonly string[] = [
  red80,
  red70,
  red60,
  red50,
  red40,
  red30,
  red20,
  red10,
  white,
  cyan10,
  cyan20,
  cyan30,
  cyan40,
  cyan50,
  cyan60,
  cyan70,
  cyan80,
]

const divergingPurpleTeal: readonly string[] = [
  purple80,
  purple70,
  purple60,
  purple50,
  purple40,
  purple30,
  purple20,
  purple10,
  white,
  teal10,
  teal20,
  teal30,
  teal40,
  teal50,
  teal60,
  teal70,
  teal80,
]

// ─── Alert palette ────────────────────────────────────────────────────────────
// [danger, warning, caution, success] — same in light and dark

const alertColors: readonly [string, string, string, string] = [
  alertDanger, // red60   #da1e28
  orange40, // orange40  #ff832b
  yellow30, // yellow30  #f1c21b
  alertSuccess, // green60  #198038
]

// ─── Assembled palette exports ────────────────────────────────────────────────

export const palettesLight: CarbonPalettes = {
  categorical: lightCategorical,
  sequential: {
    purple: sequentialPurple,
    blue: sequentialBlue,
    cyan: sequentialCyan,
    teal: sequentialTeal,
  },
  diverging: {
    redCyan: divergingRedCyan,
    purpleTeal: divergingPurpleTeal,
  },
  alert: alertColors,
}

export const palettesDark: CarbonPalettes = {
  categorical: darkCategorical,
  // sequential, diverging, alert are palette-spec shared between light and dark
  sequential: palettesLight.sequential,
  diverging: palettesLight.diverging,
  alert: palettesLight.alert,
}

// ─── Re-export raw color sets for preset consumers ────────────────────────────

export {
  sequentialPurple,
  sequentialBlue,
  sequentialCyan,
  sequentialTeal,
  divergingRedCyan,
  divergingPurpleTeal,
  alertColors,
  lightCategorical,
  darkCategorical,
}
