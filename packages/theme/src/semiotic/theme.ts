import { darkCategorical, lightCategorical } from '../palettes'
import { tokens, type ThemeKey } from '../tokens'
import { IBM_PLEX_FONT_FAMILY } from '../themes/factory'

/**
 * Structural subset of Semiotic's `SemioticTheme`. Declared locally so this
 * package does not depend on `semiotic`. Assignable to `SemioticTheme`.
 */
export interface CarbonSemioticTheme {
  mode: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
    categorical: string[]
    sequential: string
    background: string
    surface: string
    text: string
    textSecondary: string
    grid: string
    border: string
    cellBorder: string
    focus: string
    annotation: string
    success: string
    danger: string
    warning: string
    error: string
    info: string
  }
  typography: {
    fontFamily: string
    titleSize: number
    labelSize: number
    tickSize: number
    titleFontWeight: number
    titleFontSize: number
    titleFontFamily: string
    legendSize: number
    legendFontFamily: string
    tickFontFamily: string
  }
  tooltip: {
    chrome: 'default'
    background: string
    text: string
    fontSize: string
    shadow: string
  }
}

const DARK_THEMES: readonly ThemeKey[] = ['g90', 'g100']

/** `'light'` or `'dark'` colour scheme for a Carbon theme (used to pick palettes). */
export function colorSchemeFor(themeKey: ThemeKey): 'light' | 'dark' {
  return DARK_THEMES.includes(themeKey) ? 'dark' : 'light'
}

/**
 * Maps a Carbon theme (tokens + palettes) to a Semiotic theme. Pass the result
 * to Semiotic's `ThemeProvider`.
 *
 * Every colour comes from the shared Carbon tokens and categorical palettes,
 * so Semiotic and ECharts charts stay in sync.
 */
export function createSemioticTheme(themeKey: ThemeKey = 'white'): CarbonSemioticTheme {
  const t = tokens[themeKey]
  const mode = colorSchemeFor(themeKey)
  const categorical = mode === 'dark' ? darkCategorical : lightCategorical

  return {
    mode,
    colors: {
      primary: t.interactive,
      // Second Carbon categorical colour, so primary/secondary match series 1/2.
      secondary: categorical[1],
      categorical: [...categorical],
      // Semiotic takes a d3-scale-chromatic scheme *name* here, not an array,
      // so Carbon's sequential palettes cannot be passed through.
      sequential: 'blues',
      background: t.background,
      surface: t.layer01,
      text: t.textPrimary,
      textSecondary: t.textSecondary,
      grid: t.borderSubtle00,
      border: t.borderSubtle01,
      // Gap between slices/tiles/cells = background, as in the ECharts theme.
      cellBorder: t.background,
      focus: t.interactive,
      annotation: t.textSecondary,
      success: t.supportSuccess,
      danger: t.supportError,
      warning: t.supportWarning,
      error: t.supportError,
      info: t.supportInfo,
    },
    typography: {
      fontFamily: IBM_PLEX_FONT_FAMILY,
      titleSize: 14,
      labelSize: 12,
      tickSize: 12,
      titleFontWeight: 600,
      titleFontSize: 14,
      titleFontFamily: IBM_PLEX_FONT_FAMILY,
      legendSize: 12,
      legendFontFamily: IBM_PLEX_FONT_FAMILY,
      tickFontFamily: IBM_PLEX_FONT_FAMILY,
    },
    tooltip: {
      chrome: 'default',
      background: t.layer01,
      text: t.textPrimary,
      fontSize: '12px',
      // Same shadow as the ECharts theme tooltip.
      shadow: '0 2px 6px rgba(0,0,0,.20)',
    },
  }
}
