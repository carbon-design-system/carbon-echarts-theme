import type { Project, ProjectTemplate } from '@stackblitz/sdk'
import type { ProjectInput } from './types'
import { CHART_HEIGHT, STYLE_IMPORTS, toJson, viteIndexHtml } from './shared'
import { runtimeDeps, toolchain } from './versions'

export function getVanillaProject({ title, optionSource }: ProjectInput): Project {
  const packageJson = {
    name: 'carbon-echarts-vanilla-example',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: { dev: 'vite', start: 'vite', build: 'vite build' },
    dependencies: { ...runtimeDeps },
    devDependencies: {
      typescript: toolchain.typescript,
      vite: toolchain.vite,
    },
  }

  const bodyHtml = `    <div id="chart-wrap" style="position: relative">
      <div id="chart" style="height: ${CHART_HEIGHT}px; width: 100%"></div>
    </div>`

  const mainTs = `import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
${STYLE_IMPORTS}
import { option } from './option'

// Register the carbon-white, carbon-g10, carbon-g90 and carbon-g100 themes once at startup.
registerCarbonThemes(echarts)

const wrap = document.getElementById('chart-wrap')!
const el = document.getElementById('chart')!

const chart = echarts.init(el, 'carbon-white')
chart.setOption(option)

// Toolbar: fullscreen, export image / CSV, view data table.
createChartToolbar(wrap, chart, { title: ${JSON.stringify(title)}, fullscreenTarget: wrap })

new ResizeObserver(() => chart.resize()).observe(el)
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
      strict: true,
    },
    include: ['src'],
  }

  return {
    template: 'node' as ProjectTemplate,
    title: `${title} — Vanilla JS`,
    files: {
      'index.html': viteIndexHtml(title, bodyHtml, '/src/main.ts'),
      'package.json': toJson(packageJson),
      'tsconfig.json': toJson(tsConfigJson),
      'src/main.ts': mainTs,
      'src/option.ts': optionSource,
    },
  }
}
