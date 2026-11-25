import type { Project, ProjectTemplate } from '@stackblitz/sdk'
import type { ProjectInput } from './types'
import { CHART_HEIGHT, STYLE_IMPORTS, toJson, viteIndexHtml } from './shared'
import { runtimeDeps, toolchain } from './versions'

export function getSvelteProject({ title, optionSource }: ProjectInput): Project {
  const packageJson = {
    name: 'carbon-echarts-svelte-example',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: { dev: 'vite', start: 'vite', build: 'vite build' },
    dependencies: { ...runtimeDeps },
    devDependencies: {
      '@sveltejs/vite-plugin-svelte': toolchain.sveltePluginVite,
      '@tsconfig/svelte': toolchain.tsconfigSvelte,
      svelte: toolchain.svelte,
      'svelte-check': toolchain.svelteCheck,
      typescript: toolchain.typescript,
      vite: toolchain.vite,
    },
  }

  const mainTs = `import { mount } from 'svelte'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
${STYLE_IMPORTS}
import App from './App.svelte'

// Register the carbon-white, carbon-g10, carbon-g90 and carbon-g100 themes once at startup.
registerCarbonThemes(echarts)

mount(App, { target: document.getElementById('app')! })
`

  const appSvelte = `<script lang="ts">
  import { onMount } from 'svelte'
  import * as echarts from 'echarts'
  import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
  import { option } from './option'

  let wrapEl: HTMLDivElement
  let chartEl: HTMLDivElement

  onMount(() => {
    const chart = echarts.init(chartEl, 'carbon-white')
    chart.setOption(option)

    // Toolbar: fullscreen, export image / CSV, view data table.
    const toolbar = createChartToolbar(wrapEl, chart, { title: ${JSON.stringify(title)}, fullscreenTarget: wrapEl })
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(chartEl)

    return () => {
      observer.disconnect()
      toolbar.destroy()
      chart.dispose()
    }
  })
</script>

<div bind:this={wrapEl} style="position: relative">
  <div bind:this={chartEl} style="height: ${CHART_HEIGHT}px; width: 100%"></div>
</div>
`

  const svelteConfigJs = `import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
}
`

  const viteConfigTs = `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({ plugins: [svelte()] })
`

  const envDts = `/// <reference types="svelte" />
/// <reference types="vite/client" />
`

  const tsConfigJson = {
    extends: '@tsconfig/svelte/tsconfig.json',
    compilerOptions: {
      target: 'ESNext',
      module: 'ESNext',
      moduleResolution: 'bundler',
      skipLibCheck: true,
      isolatedModules: true,
      resolveJsonModule: true,
    },
    include: ['src/**/*.ts', 'src/**/*.svelte'],
  }

  return {
    template: 'node' as ProjectTemplate,
    title: `${title} — Svelte`,
    files: {
      'index.html': viteIndexHtml(title, '    <div id="app"></div>', '/src/main.ts'),
      'package.json': toJson(packageJson),
      'tsconfig.json': toJson(tsConfigJson),
      'svelte.config.js': svelteConfigJs,
      'vite.config.ts': viteConfigTs,
      'src/main.ts': mainTs,
      'src/App.svelte': appSvelte,
      'src/option.ts': optionSource,
      'src/env.d.ts': envDts,
    },
  }
}
