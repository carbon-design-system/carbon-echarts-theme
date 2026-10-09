# Phase 6 — Migration Guides & Codemods

> **Status: ❌ Not started** — `packages/codemods/src/` directory exists but is empty.

---

## What was planned

### Part A — Migration guides

- `docs/migration-carbon-charts-to-echarts.md` — human-readable migration guide
- `docs/migration-echarts-to-carbon.md` — "why use this theme" guide

Neither file has been created.

### Part B — `@carbon/echarts-codemod` package

A CLI tool (`carbon-echarts-codemod`) with two jscodeshift transforms:

1. `carbon-charts-to-echarts` — converts `@carbon/charts-react` JSX to `echarts-for-react` + preset calls
2. `echarts-theme-swap` — replaces existing ECharts theme prop with Carbon theme names

The `packages/codemods/` directory was scaffolded (has a `src/` folder) but contains no source files.

---

## If / when this is picked up

The component → preset function mapping is:

```ts
const CHART_MAP: Record<string, string> = {
  SimpleBarChart: 'createBarOptions',
  GroupedBarChart: 'createGroupedBarOptions',
  StackedBarChart: 'createStackedBarOptions',
  LineChart: 'createLineOptions',
  AreaChart: 'createAreaOptions',
  ScatterChart: 'createScatterOptions',
  BubbleChart: 'createBubbleOptions',
  DonutChart: 'createDonutOptions',
  PieChart: 'createPieOptions',
  GaugeChart: 'createGaugeOptions',
  HeatmapChart: 'createHeatmapOptions',
  TreemapChart: 'createTreemapOptions',
  RadarChart: 'createRadarOptions',
  BoxplotChart: 'createBoxplotOptions',
  HistogramChart: 'createHistogramOptions',
  ComboChart: 'createComboOptions',
  LollipopChart: 'createLollipopOptions',
  AlluvialChart: 'createAlluvialOptions',
  TreeChart: 'createTreeOptions',
  WordCloudChart: 'createWordCloudOptions',
}
```

Components with no automatic transform (BulletChart, MeterChart, NetworkDiagramChart) should emit a `// TODO: @carbon/echarts-codemod` comment.
