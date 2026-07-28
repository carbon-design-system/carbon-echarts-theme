import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/presets/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Inline @carbon/themes + @carbon/colors — zero runtime dep
  noExternal: ['@carbon/themes', '@carbon/colors'],
})
