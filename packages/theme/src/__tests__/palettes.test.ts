import { describe, it, expect } from 'vitest'
import {
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
} from '../palettes'

const HEX_RE = /^#[0-9a-f]{6}$/i

function assertAllHex(colors: readonly string[], label: string) {
  for (const c of colors) {
    expect(HEX_RE.test(c), `${label}: "${c}" is not a valid hex color`).toBe(true)
  }
}

describe('lightCategorical', () => {
  it('has exactly 14 entries', () => {
    expect(lightCategorical).toHaveLength(14)
  })

  it('all entries are valid hex strings', () => {
    assertAllHex(lightCategorical, 'lightCategorical')
  })

  it('first color is purple70 (#6929c4)', () => {
    expect(lightCategorical[0].toLowerCase()).toBe('#6929c4')
  })
})

describe('darkCategorical', () => {
  it('has exactly 14 entries', () => {
    expect(darkCategorical).toHaveLength(14)
  })

  it('all entries are valid hex strings', () => {
    assertAllHex(darkCategorical, 'darkCategorical')
  })

  it('differs from lightCategorical', () => {
    expect(darkCategorical).not.toEqual(lightCategorical)
  })

  it('first color is purple60 (#8a3ffc)', () => {
    expect(darkCategorical[0].toLowerCase()).toBe('#8a3ffc')
  })
})

describe('sequential palettes', () => {
  const palettes = { sequentialPurple, sequentialBlue, sequentialCyan, sequentialTeal }

  for (const [name, palette] of Object.entries(palettes)) {
    it(`${name} has exactly 11 stops`, () => {
      expect(palette).toHaveLength(11)
    })

    it(`${name} starts with #ffffff`, () => {
      expect(palette[0].toLowerCase()).toBe('#ffffff')
    })

    it(`all ${name} entries are valid hex strings`, () => {
      assertAllHex(palette, name)
    })
  }
})

describe('diverging palettes', () => {
  const palettes = { divergingRedCyan, divergingPurpleTeal }

  for (const [name, palette] of Object.entries(palettes)) {
    it(`${name} has exactly 17 stops`, () => {
      expect(palette).toHaveLength(17)
    })

    it(`${name} has #ffffff at the midpoint (index 8)`, () => {
      expect(palette[8].toLowerCase()).toBe('#ffffff')
    })

    it(`all ${name} entries are valid hex strings`, () => {
      assertAllHex(palette, name)
    })
  }
})

describe('alertColors', () => {
  it('has exactly 4 entries', () => {
    expect(alertColors).toHaveLength(4)
  })

  it('all entries are valid hex strings', () => {
    assertAllHex([...alertColors], 'alertColors')
  })

  it('danger is red60 (#da1e28)', () => {
    expect(alertColors[0].toLowerCase()).toBe('#da1e28')
  })

  it('success is green60 (#198038)', () => {
    expect(alertColors[3].toLowerCase()).toBe('#198038')
  })
})

describe('palettesLight', () => {
  it('categorical matches lightCategorical', () => {
    expect(palettesLight.categorical).toBe(lightCategorical)
  })

  it('sequential includes blue hue', () => {
    expect(palettesLight.sequential.blue).toBeDefined()
    expect(palettesLight.sequential.blue).toHaveLength(11)
  })
})

describe('palettesDark', () => {
  it('categorical matches darkCategorical', () => {
    expect(palettesDark.categorical).toBe(darkCategorical)
  })

  it('sequential/diverging/alert are shared references with palettesLight', () => {
    expect(palettesDark.sequential).toBe(palettesLight.sequential)
    expect(palettesDark.diverging).toBe(palettesLight.diverging)
    expect(palettesDark.alert).toBe(palettesLight.alert)
  })
})
