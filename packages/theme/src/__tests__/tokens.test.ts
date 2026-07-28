import { describe, it, expect } from 'vitest'
import { tokens } from '../tokens'
import type { ThemeKey } from '../tokens'

// Some Carbon tokens are hex (#rrggbb), others are rgba() — both are valid CSS colors.
const HEX_RE = /^#[0-9a-f]{6}$/i
const RGBA_RE = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/i
const CSS_COLOR_RE = new RegExp(`${HEX_RE.source}|${RGBA_RE.source}`, 'i')

describe('tokens', () => {
  const themeKeys: ThemeKey[] = ['white', 'g10', 'g90', 'g100']

  it('exports all four theme variants', () => {
    for (const key of themeKeys) {
      expect(tokens[key], `tokens.${key} should be defined`).toBeDefined()
    }
  })

  it('every token value is a non-empty CSS color string', () => {
    for (const key of themeKeys) {
      const theme = tokens[key]
      for (const [tokenName, value] of Object.entries(theme)) {
        expect(
          typeof value === 'string' && CSS_COLOR_RE.test(value),
          `tokens.${key}.${tokenName} = "${value}" is not a valid CSS color`,
        ).toBe(true)
      }
    }
  })

  it('light and dark backgrounds differ', () => {
    expect(tokens.white.background).not.toBe(tokens.g100.background)
    expect(tokens.g10.background).not.toBe(tokens.g90.background)
  })

  it('white background is #ffffff', () => {
    expect(tokens.white.background.toLowerCase()).toBe('#ffffff')
  })

  it('g100 background is #161616', () => {
    expect(tokens.g100.background.toLowerCase()).toBe('#161616')
  })

  it('white and g10 have differing backgrounds', () => {
    // g10 uses a slightly off-white background
    expect(tokens.white.background).not.toBe(tokens.g10.background)
  })
})
