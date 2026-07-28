import { describe, it, expect, vi } from 'vitest'
import { registerCarbonThemes, THEME_NAMES, type EChartsNamespace } from '../index'

describe('registerCarbonThemes', () => {
  it('calls echarts.registerTheme for all four themes', () => {
    const registerTheme = vi.fn()
    const fakeEcharts: EChartsNamespace = { registerTheme }

    registerCarbonThemes(fakeEcharts)

    expect(registerTheme).toHaveBeenCalledTimes(4)
    expect(registerTheme).toHaveBeenCalledWith('carbon-white', expect.any(Object))
    expect(registerTheme).toHaveBeenCalledWith('carbon-g10', expect.any(Object))
    expect(registerTheme).toHaveBeenCalledWith('carbon-g90', expect.any(Object))
    expect(registerTheme).toHaveBeenCalledWith('carbon-g100', expect.any(Object))
  })
})

describe('THEME_NAMES', () => {
  it('exports correct theme name strings', () => {
    expect(THEME_NAMES.white).toBe('carbon-white')
    expect(THEME_NAMES.g10).toBe('carbon-g10')
    expect(THEME_NAMES.g90).toBe('carbon-g90')
    expect(THEME_NAMES.g100).toBe('carbon-g100')
  })
})
