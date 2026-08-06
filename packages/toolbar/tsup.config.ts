import { defineConfig } from 'tsup'

export default defineConfig({
  // JS bundles — core + vanilla adapter
  // CSS is compiled separately via `sass` CLI in the build script
  entry: {
    index: 'src/index.ts',
    'vanilla/index': 'src/vanilla/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  splitting: false,
  clean: true,
  external: ['echarts'],
})
