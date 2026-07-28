import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({
      include: /\.(tsx|ts|jsx|js|mdx)$/,
    }),
  ],
  define: {
    __IBM_SITE_ID__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'CARBON_CHARTS_ECHARTS'
        : 'CARBON_CHARTS_ECHARTS_DEV',
    ),
  },
  resolve: {
    alias: {
      // Allow importing from @carbon/echarts-theme source directly in dev
    },
  },
})
