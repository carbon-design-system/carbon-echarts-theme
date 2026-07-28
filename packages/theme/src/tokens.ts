import { white, g10, g90, g100 } from '@carbon/themes'

export type ThemeKey = 'white' | 'g10' | 'g90' | 'g100'

export interface CarbonChartTokens {
  // Backgrounds & layers
  background: string
  layer01: string
  layer02: string
  // Text
  textPrimary: string
  textSecondary: string
  textDisabled: string
  // Borders
  borderSubtle00: string
  borderSubtle01: string
  borderStrong01: string
  // Interactive
  interactive: string
}

export const tokens: Record<ThemeKey, CarbonChartTokens> = {
  white: {
    background: white.background,
    layer01: white.layer01,
    layer02: white.layer02,
    textPrimary: white.textPrimary,
    textSecondary: white.textSecondary,
    textDisabled: white.textDisabled,
    borderSubtle00: white.borderSubtle00,
    borderSubtle01: white.borderSubtle01,
    borderStrong01: white.borderStrong01,
    interactive: white.interactive,
  },
  g10: {
    background: g10.background,
    layer01: g10.layer01,
    layer02: g10.layer02,
    textPrimary: g10.textPrimary,
    textSecondary: g10.textSecondary,
    textDisabled: g10.textDisabled,
    borderSubtle00: g10.borderSubtle00,
    borderSubtle01: g10.borderSubtle01,
    borderStrong01: g10.borderStrong01,
    interactive: g10.interactive,
  },
  g90: {
    background: g90.background,
    layer01: g90.layer01,
    layer02: g90.layer02,
    textPrimary: g90.textPrimary,
    textSecondary: g90.textSecondary,
    textDisabled: g90.textDisabled,
    borderSubtle00: g90.borderSubtle00,
    borderSubtle01: g90.borderSubtle01,
    borderStrong01: g90.borderStrong01,
    interactive: g90.interactive,
  },
  g100: {
    background: g100.background,
    layer01: g100.layer01,
    layer02: g100.layer02,
    textPrimary: g100.textPrimary,
    textSecondary: g100.textSecondary,
    textDisabled: g100.textDisabled,
    borderSubtle00: g100.borderSubtle00,
    borderSubtle01: g100.borderSubtle01,
    borderStrong01: g100.borderStrong01,
    interactive: g100.interactive,
  },
}
