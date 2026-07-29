import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)

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
  },
  resolve: {
    alias: {
      // Allow importing from @carbon/echarts-theme source directly in dev
    },
  },
})
