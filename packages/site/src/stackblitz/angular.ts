import type { Project, ProjectTemplate } from '@stackblitz/sdk'
import type { ProjectInput } from './types'
import { CHART_HEIGHT, PLEX_FONT_LINKS, toJson } from './shared'
import { runtimeDeps, toolchain } from './versions'

export function getAngularProject({ title, optionSource }: ProjectInput): Project {
  const packageJson = {
    name: 'carbon-echarts-angular-example',
    private: true,
    version: '0.0.0',
    scripts: { ng: 'ng', start: 'ng serve', build: 'ng build' },
    dependencies: {
      ...runtimeDeps,
      '@angular/common': toolchain.angular,
      '@angular/compiler': toolchain.angular,
      '@angular/core': toolchain.angular,
      '@angular/platform-browser': toolchain.angular,
      rxjs: toolchain.rxjs,
      tslib: toolchain.tslib,
      'zone.js': toolchain.zoneJs,
    },
    devDependencies: {
      '@angular/build': toolchain.angular,
      '@angular/cli': toolchain.angular,
      '@angular/compiler-cli': toolchain.angular,
      typescript: toolchain.typescriptAngular,
    },
  }

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
${PLEX_FONT_LINKS}
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`

  const stylesCss = `@import '@carbon/styles/css/styles.min.css';
@import '@carbon/echarts-toolbar/styles';

body {
  margin: 0;
  padding: 2rem;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
}
`

  const mainTs = `import { bootstrapApplication } from '@angular/platform-browser'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { AppComponent } from './app.component'

// Register the carbon-white, carbon-g10, carbon-g90 and carbon-g100 themes once at startup.
registerCarbonThemes(echarts)

bootstrapApplication(AppComponent).catch((err) => console.error(err))
`

  const appComponentTs = `import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import * as echarts from 'echarts'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
import { option } from './option'

@Component({
  selector: 'app-root',
  standalone: true,
  template: \`
    <div #wrap style="position: relative">
      <div #chart style="height: ${CHART_HEIGHT}px; width: 100%"></div>
    </div>
  \`,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('wrap', { static: true }) wrapRef!: ElementRef<HTMLDivElement>
  @ViewChild('chart', { static: true }) chartRef!: ElementRef<HTMLDivElement>

  private cleanup?: () => void

  ngOnInit() {
    const wrap = this.wrapRef.nativeElement
    const el = this.chartRef.nativeElement
    const chart = echarts.init(el, 'carbon-white')
    chart.setOption(option)

    // Toolbar: fullscreen, export image / CSV, view data table.
    const toolbar = createChartToolbar(wrap, chart, { title: ${JSON.stringify(title)}, fullscreenTarget: wrap })
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(el)

    this.cleanup = () => {
      observer.disconnect()
      toolbar.destroy()
      chart.dispose()
    }
  }

  ngOnDestroy() {
    this.cleanup?.()
  }
}
`

  const angularJson = {
    $schema: './node_modules/@angular/cli/lib/config/schema.json',
    version: 1,
    cli: { analytics: false },
    newProjectRoot: 'projects',
    projects: {
      demo: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        prefix: 'app',
        architect: {
          build: {
            builder: '@angular/build:application',
            options: {
              outputPath: 'dist/demo',
              index: 'src/index.html',
              browser: 'src/main.ts',
              polyfills: ['zone.js'],
              tsConfig: 'tsconfig.app.json',
              styles: ['src/styles.css'],
              assets: [],
              scripts: [],
            },
            configurations: {
              production: { optimization: true, outputHashing: 'all', sourceMap: false },
              development: { optimization: false, extractLicenses: false, sourceMap: true },
            },
            defaultConfiguration: 'production',
          },
          serve: {
            builder: '@angular/build:dev-server',
            configurations: {
              production: { buildTarget: 'demo:build:production' },
              development: { buildTarget: 'demo:build:development' },
            },
            defaultConfiguration: 'development',
          },
        },
      },
    },
  }

  const tsConfigJson = {
    compileOnSave: false,
    compilerOptions: {
      outDir: './dist/out-tsc',
      strict: true,
      noImplicitOverride: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      isolatedModules: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      importHelpers: true,
      moduleResolution: 'bundler',
      target: 'ES2022',
      module: 'ES2022',
      useDefineForClassFields: false,
      lib: ['ES2022', 'dom'],
    },
    angularCompilerOptions: {
      enableI18nLegacyMessageIdFormat: false,
      strictInjectionParameters: true,
      strictInputAccessModifiers: true,
      strictTemplates: true,
    },
  }

  const tsConfigAppJson = {
    extends: './tsconfig.json',
    compilerOptions: { outDir: './out-tsc/app', types: [] },
    files: ['src/main.ts'],
    include: ['src/**/*.d.ts'],
  }

  return {
    template: 'node' as ProjectTemplate,
    title: `${title} — Angular`,
    files: {
      'angular.json': toJson(angularJson),
      'package.json': toJson(packageJson),
      'tsconfig.json': toJson(tsConfigJson),
      'tsconfig.app.json': toJson(tsConfigAppJson),
      'src/index.html': indexHtml,
      'src/styles.css': stylesCss,
      'src/main.ts': mainTs,
      'src/app.component.ts': appComponentTs,
      'src/option.ts': optionSource,
    },
  }
}
