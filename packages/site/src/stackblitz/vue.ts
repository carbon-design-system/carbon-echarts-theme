import type { Project, ProjectTemplate } from '@stackblitz/sdk'
import type { ProjectInput } from './types'
import { CHART_HEIGHT, STYLE_IMPORTS, toJson, viteIndexHtml } from './shared'
import { runtimeDeps, toolchain } from './versions'

export function getVueProject({ title, optionSource }: ProjectInput): Project {
  const packageJson = {
    name: 'carbon-echarts-vue-example',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: { dev: 'vite', start: 'vite', build: 'vite build' },
    dependencies: { ...runtimeDeps, vue: toolchain.vue },
    devDependencies: {
      '@vitejs/plugin-vue': toolchain.vuePluginVite,
      typescript: toolchain.typescript,
      'vue-tsc': toolchain.vueTsc,
      vite: toolchain.vite,
    },
  }

  const mainTs = `import { createApp } from 'vue'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
${STYLE_IMPORTS}
import App from './App.vue'

// Register the carbon-white, carbon-g10, carbon-g90 and carbon-g100 themes once at startup.
registerCarbonThemes(echarts)

createApp(App).mount('#app')
`

  const appVue = `<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
import { option } from './option'

const wrapRef = ref<HTMLDivElement>()
const chartRef = ref<HTMLDivElement>()

let cleanup: (() => void) | undefined

onMounted(() => {
  const wrap = wrapRef.value!
  const el = chartRef.value!
  const chart = echarts.init(el, 'carbon-white')
  chart.setOption(option)

  // Toolbar: fullscreen, export image / CSV, view data table.
  const toolbar = createChartToolbar(wrap, chart, { title: ${JSON.stringify(title)}, fullscreenTarget: wrap })
  const observer = new ResizeObserver(() => chart.resize())
  observer.observe(el)

  cleanup = () => {
    observer.disconnect()
    toolbar.destroy()
    chart.dispose()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="wrapRef" style="position: relative">
    <div ref="chartRef" style="height: ${CHART_HEIGHT}px; width: 100%" />
  </div>
</template>
`

  const envDts = `/// <reference types="vite/client" />
`

  const tsConfigJson = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      skipLibCheck: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'preserve',
      strict: true,
    },
    include: ['src/**/*.ts', 'src/**/*.vue'],
  }

  const viteConfigTs = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({ plugins: [vue()] })
`

  return {
    template: 'node' as ProjectTemplate,
    title: `${title} — Vue`,
    files: {
      'index.html': viteIndexHtml(title, '    <div id="app"></div>', '/src/main.ts'),
      'package.json': toJson(packageJson),
      'tsconfig.json': toJson(tsConfigJson),
      'vite.config.ts': viteConfigTs,
      'src/main.ts': mainTs,
      'src/App.vue': appVue,
      'src/option.ts': optionSource,
      'src/env.d.ts': envDts,
    },
  }
}
