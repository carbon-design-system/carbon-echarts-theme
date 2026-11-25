import type { Project, ProjectTemplate } from '@stackblitz/sdk'
import type { ProjectInput } from './types'
import { CHART_HEIGHT, STYLE_IMPORTS, toJson, viteIndexHtml } from './shared'
import { runtimeDeps, toolchain } from './versions'

export const reactMainFile = 'src/App.tsx'

export function getReactProject({ title, optionSource }: ProjectInput): Project {
  const packageJson = {
    name: 'carbon-echarts-react-example',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: { dev: 'vite', start: 'vite', build: 'vite build' },
    dependencies: {
      ...runtimeDeps,
      react: toolchain.react,
      'react-dom': toolchain.reactDom,
    },
    devDependencies: {
      '@types/react': toolchain.typesReact,
      '@types/react-dom': toolchain.typesReactDom,
      '@vitejs/plugin-react': toolchain.vitePluginReact,
      typescript: toolchain.typescript,
      vite: toolchain.vite,
    },
  }

  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
${STYLE_IMPORTS}
import { App } from './App'

// Register the carbon-white, carbon-g10, carbon-g90 and carbon-g100 themes once at startup.
registerCarbonThemes(echarts)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`

  const appTsx = `import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
import { option } from './option'

export function App() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const el = chartRef.current!
    const chart = echarts.init(el, 'carbon-white')
    chart.setOption(option)

    // Toolbar: fullscreen, export image / CSV, view data table.
    const toolbar = createChartToolbar(wrap, chart, { title: ${JSON.stringify(title)}, fullscreenTarget: wrap })
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(el)

    return () => {
      observer.disconnect()
      toolbar.destroy()
      chart.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div ref={chartRef} style={{ height: ${CHART_HEIGHT}, width: '100%' }} />
    </div>
  )
}
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
      jsx: 'react-jsx',
      strict: true,
    },
    include: ['src'],
  }

  const viteConfigTs = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ plugins: [react()] })
`

  return {
    template: 'node' as ProjectTemplate,
    title: `${title} — React`,
    files: {
      'index.html': viteIndexHtml(title, '    <div id="root"></div>', '/src/main.tsx'),
      'package.json': toJson(packageJson),
      'tsconfig.json': toJson(tsConfigJson),
      'vite.config.ts': viteConfigTs,
      'src/main.tsx': mainTsx,
      [reactMainFile]: appTsx,
      'src/option.ts': optionSource,
    },
  }
}
