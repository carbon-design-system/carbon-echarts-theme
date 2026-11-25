// Dependency versions for the generated StackBlitz projects.
//
// Carbon packages and echarts use `latest` so a project always picks up the newest
// published theme/toolbar; unreleased changes on `main` are intentionally not reflected.
// Toolchain versions are pinned to ranges known to work with the generated boilerplate.

export const runtimeDeps = {
  '@carbon/colors': 'latest',
  '@carbon/echarts-theme': 'latest',
  '@carbon/echarts-toolbar': 'latest',
  '@carbon/styles': 'latest',
  echarts: 'latest',
} as const

export const toolchain = {
  vite: '^6.3.5',
  typescript: '^5.8.3',
  react: '^19.1.0',
  reactDom: '^19.1.0',
  typesReact: '^19.1.5',
  typesReactDom: '^19.1.5',
  vitePluginReact: '^4.4.1',
  vue: '^3.5.0',
  vuePluginVite: '^5.2.0',
  vueTsc: '^2.2.0',
  svelte: '^5.0.0',
  sveltePluginVite: '^6.2.0',
  svelteCheck: '^4.0.0',
  tsconfigSvelte: '^5.0.0',
  angular: '^20.0.0',
  typescriptAngular: '~5.8.3',
  rxjs: '~7.8.0',
  tslib: '^2.5.0',
  zoneJs: '~0.15.0',
} as const
