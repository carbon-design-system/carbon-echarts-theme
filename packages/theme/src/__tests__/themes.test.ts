import { describe, it, expect } from 'vitest'
import {
  carbonWhite,
  carbonG10,
  carbonG90,
  carbonG100,
  IBM_PLEX_FONT_FAMILY,
  IBM_PLEX_FONT_FAMILY_CONDENSED,
} from '../index'

describe('themes', () => {
  describe('carbonWhite', () => {
    it('backgroundColor is #ffffff', () => {
      expect(carbonWhite.backgroundColor.toLowerCase()).toBe('#ffffff')
    })

    it('color array (light categorical palette) has 14 entries', () => {
      expect(carbonWhite.color).toHaveLength(14)
    })

    it('uses IBM Plex Sans font family', () => {
      expect(carbonWhite.textStyle.fontFamily).toContain('IBM Plex Sans')
    })

    it('animation settings match Carbon Charts defaults', () => {
      expect(carbonWhite.animation).toBe(true)
      expect(carbonWhite.animationDuration).toBe(300)
      expect(carbonWhite.animationEasing).toBe('cubicOut')
    })
  })

  describe('carbonG100', () => {
    it('backgroundColor is #161616', () => {
      expect(carbonG100.backgroundColor.toLowerCase()).toBe('#161616')
    })

    it('color array (dark categorical palette) has 14 entries', () => {
      expect(carbonG100.color).toHaveLength(14)
      // dark themes use the dark categorical palette
      expect(carbonG100.color[0].toLowerCase()).toBe('#8a3ffc') // purple60
    })
  })

  it('white and g100 have different backgrounds', () => {
    expect(carbonWhite.backgroundColor).not.toBe(carbonG100.backgroundColor)
  })

  it('white and g10 have different backgrounds', () => {
    expect(carbonWhite.backgroundColor).not.toBe(carbonG10.backgroundColor)
  })

  it('g90 and g100 have different backgrounds', () => {
    expect(carbonG90.backgroundColor).not.toBe(carbonG100.backgroundColor)
  })

  it('all themes use IBM_PLEX_FONT_FAMILY constant', () => {
    expect(carbonWhite.textStyle.fontFamily).toBe(IBM_PLEX_FONT_FAMILY)
    expect(carbonG10.textStyle.fontFamily).toBe(IBM_PLEX_FONT_FAMILY)
    expect(carbonG90.textStyle.fontFamily).toBe(IBM_PLEX_FONT_FAMILY)
    expect(carbonG100.textStyle.fontFamily).toBe(IBM_PLEX_FONT_FAMILY)
  })

  it('IBM_PLEX_FONT_FAMILY contains IBM Plex Sans', () => {
    expect(IBM_PLEX_FONT_FAMILY).toContain('IBM Plex Sans')
  })

  it('IBM_PLEX_FONT_FAMILY_CONDENSED contains IBM Plex Sans Condensed', () => {
    expect(IBM_PLEX_FONT_FAMILY_CONDENSED).toContain('IBM Plex Sans Condensed')
  })

  it('pie itemStyle borderColor matches theme background', () => {
    // Slice gap is achieved by matching borderColor to background
    expect(carbonWhite.pie.itemStyle.borderColor).toBe(carbonWhite.backgroundColor)
    expect(carbonG100.pie.itemStyle.borderColor).toBe(carbonG100.backgroundColor)
  })

  describe('Track B — ECharts-extended series keys', () => {
    const themes = [carbonWhite, carbonG10, carbonG90, carbonG100] as const

    it('all themes have candlestick with support-success/error colours', () => {
      for (const t of themes) {
        expect(t.candlestick.itemStyle.color.toLowerCase()).toBe('#198038')
        expect(t.candlestick.itemStyle.color0.toLowerCase()).toBe('#da1e28')
      }
    })

    it('all themes have sankey key', () => {
      for (const t of themes) expect(t.sankey).toBeDefined()
    })

    it('all themes have funnel key', () => {
      for (const t of themes) expect(t.funnel).toBeDefined()
    })

    it('all themes have graph key', () => {
      for (const t of themes) expect(t.graph).toBeDefined()
    })

    it('all themes have sunburst key', () => {
      for (const t of themes) expect(t.sunburst).toBeDefined()
    })

    it('all themes have parallel key', () => {
      for (const t of themes) expect(t.parallel).toBeDefined()
    })

    it('all themes have themeRiver key', () => {
      for (const t of themes) expect(t.themeRiver).toBeDefined()
    })

    it('sankey label color matches textPrimary in each theme', () => {
      expect(carbonWhite.sankey.label.color).toBe(carbonWhite.textStyle.color)
      expect(carbonG100.sankey.label.color).toBe(carbonG100.textStyle.color)
    })
  })
})
