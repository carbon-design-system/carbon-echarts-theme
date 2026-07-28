// ── Theme objects ─────────────────────────────────────────────────────────────
export { carbonWhite } from './themes/white'
export { carbonG10 } from './themes/g10'
export { carbonG90 } from './themes/g90'
export { carbonG100 } from './themes/g100'

// ── Tokens and palettes ───────────────────────────────────────────────────────
export { tokens } from './tokens'
export {
  palettesLight,
  palettesDark,
  lightCategorical,
  darkCategorical,
  sequentialPurple,
  sequentialBlue,
  sequentialCyan,
  sequentialTeal,
  divergingRedCyan,
  divergingPurpleTeal,
  alertColors,
} from './palettes'
export type { ThemeKey, CarbonChartTokens } from './tokens'
export type { CarbonPalettes, CarbonSequentialPalette, CarbonDivergingPalette } from './palettes'

// ── Font constants ────────────────────────────────────────────────────────────
export { IBM_PLEX_FONT_FAMILY, IBM_PLEX_FONT_FAMILY_CONDENSED } from './themes/factory'

// ── Registration helper ───────────────────────────────────────────────────────
import { carbonWhite } from './themes/white'
import { carbonG10 } from './themes/g10'
import { carbonG90 } from './themes/g90'
import { carbonG100 } from './themes/g100'

/**
 * Minimal interface for the echarts namespace object.
 * Accepts the full `echarts` module import without requiring a specific version.
 */
export interface EChartsNamespace {
  registerTheme(name: string, theme: Record<string, unknown>): void
}

/**
 * Register all four Carbon themes on the provided echarts namespace.
 * Call this once at app startup before rendering any charts.
 *
 * @example
 * import * as echarts from 'echarts'
 * import { registerCarbonThemes } from '@carbon/echarts-theme'
 * registerCarbonThemes(echarts)
 */
export function registerCarbonThemes(echarts: EChartsNamespace): void {
  echarts.registerTheme('carbon-white', carbonWhite as Record<string, unknown>)
  echarts.registerTheme('carbon-g10', carbonG10 as Record<string, unknown>)
  echarts.registerTheme('carbon-g90', carbonG90 as Record<string, unknown>)
  echarts.registerTheme('carbon-g100', carbonG100 as Record<string, unknown>)
}

// ── Theme name constants ──────────────────────────────────────────────────────
export const THEME_NAMES = {
  white: 'carbon-white',
  g10: 'carbon-g10',
  g90: 'carbon-g90',
  g100: 'carbon-g100',
} as const

export type CarbonThemeName = (typeof THEME_NAMES)[keyof typeof THEME_NAMES]
