import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const require = createRequire(import.meta.url)

const themePkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../packages/theme/package.json'), 'utf-8'),
) as { version: string }

// @carbon/styles is a peer dep of @carbon/react. In pnpm's virtual store each
// package gets its own isolated node_modules, so we resolve the styles package
// through @carbon/react's own require paths to find the correct store location.
const reactPkg = require.resolve('@carbon/react/package.json')
const stylesPkg = require.resolve('@carbon/styles/package.json', {
  paths: [path.dirname(reactPkg)],
})
// loadPaths needs the node_modules directory that contains @carbon/styles and
// all of its SCSS dependencies (@carbon/themes, @carbon/colors, etc.)
const carbonNodeModules = path.resolve(path.dirname(stylesPkg), '../..')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkFrontmatter],
      }),
    },
    react({
      include: /\.(tsx|ts|jsx|js|mdx)$/,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [carbonNodeModules],
      },
    },
  },
  define: {
    __IBM_SITE_ID__: JSON.stringify(
      process.env.NODE_ENV === 'production' ? 'CARBON_CHARTS_ECHARTS' : 'CARBON_CHARTS_ECHARTS_DEV',
    ),
    __THEME_VERSION__: JSON.stringify(themePkg.version),
  },
  resolve: {
    alias: {
      // In dev, point directly at the theme TypeScript source so Vite
      // compiles it on-the-fly and HMR picks up changes immediately —
      // no need to rebuild the theme package separately.
      '@carbon/echarts-theme/presets': path.resolve(
        __dirname,
        '../../packages/theme/src/presets/index.ts',
      ),
      '@carbon/echarts-theme': path.resolve(__dirname, '../../packages/theme/src/index.ts'),
    },
  },
})
