# `@carbon/echarts-theme`

An official [Apache ECharts](https://echarts.apache.org) theme that ports the **Carbon Charts v11** visual language — IBM Design Language data-vis color palettes, spacing tokens, type tokens, and interaction patterns — so any team already using ECharts can adopt Carbon's design system without migrating to `@carbon/charts`.

[![npm](https://img.shields.io/npm/v/@carbon/echarts-theme)](https://www.npmjs.com/package/@carbon/echarts-theme)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](../../LICENSE)

**[→ echarts-theme.carbondesignsystem.com](https://echarts-theme.carbondesignsystem.com)**

---

## Installation

```sh
npm install echarts @carbon/echarts-theme
# or
pnpm add echarts @carbon/echarts-theme
# or
yarn add echarts @carbon/echarts-theme
```

ECharts is a **peer dependency** — it is never bundled. Any version `>=5` is supported.

---

## Usage

### Register themes

Call `registerCarbonThemes` once at app startup, passing your ECharts instance. This registers all four Carbon color-mode themes globally.

```ts
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'

registerCarbonThemes(echarts)
```

Then pass a theme name to your ECharts adapter:

```ts
// e.g. with echarts-for-react
<ReactECharts option={option} theme="carbon-white" />
```

| Theme name     | Carbon mode |
| -------------- | ----------- |
| `carbon-white` | White       |
| `carbon-g10`   | Gray 10     |
| `carbon-g90`   | Gray 90     |
| `carbon-g100`  | Gray 100    |

All design tokens are derived from `@carbon/themes` at build time and inlined into the bundle — there is **zero runtime dependency** on Carbon.

---

### Framework adapters

| Framework        | Adapter                 |
| ---------------- | ----------------------- |
| React            | `echarts-for-react`     |
| Angular          | `ngx-echarts`           |
| Vue              | `vue-echarts`           |
| Svelte / vanilla | `echarts.init(domNode)` |

---

## Chart presets

The `/presets` subpath exports a `create*Options` helper for every Carbon Charts type. Each helper accepts your data and returns a spec-accurate `EChartsOption` object — theme tokens, palette, and layout already applied.

```ts
import { createBarOptions } from '@carbon/echarts-theme/presets'

const option = createBarOptions(data, { title: 'Sales by region' })
```

### Available presets

| Helper                              | Chart type                    |
| ----------------------------------- | ----------------------------- |
| `createBarOptions`                  | Simple bar                    |
| `createGroupedBarOptions`           | Grouped bar                   |
| `createStackedBarOptions`           | Stacked bar                   |
| `createHorizontalBarOptions`        | Horizontal bar                |
| `createFloatingBarOptions`          | Floating / range bar          |
| `createLineOptions`                 | Line                          |
| `createStepLineOptions`             | Step line                     |
| `createTimeSeriesLineOptions`       | Time-series line              |
| `createAreaOptions`                 | Area                          |
| `createStackedAreaOptions`          | Stacked area                  |
| `createBoundedAreaOptions`          | Bounded area                  |
| `createDonutOptions`                | Donut                         |
| `createPieOptions`                  | Pie                           |
| `createScatterOptions`              | Scatter                       |
| `createBubbleOptions`               | Bubble                        |
| `createHeatmapOptions`              | Heatmap                       |
| `createGaugeOptions`                | Gauge                         |
| `createMeterOptions`                | Meter                         |
| `createHistogramOptions`            | Histogram                     |
| `createTreemapOptions`              | Treemap                       |
| `createTreemapOptionsFromHierarchy` | Treemap (hierarchy input)     |
| `createRadarOptions`                | Radar                         |
| `createBoxplotOptions`              | Boxplot                       |
| `createComboOptions`                | Combo (bar + line)            |
| `createLollipopOptions`             | Lollipop                      |
| `createSparklineOptions`            | Sparkline                     |
| `createAlluvialOptions`             | Alluvial / Sankey             |
| `createAlluvialOptionsFromTabular`  | Alluvial (tabular input)      |
| `createTreeOptions`                 | Tree (org chart / dendrogram) |
| `createTreeOptionsFromTabular`      | Tree (tabular input)          |
| `createNetworkOptions`              | Network diagram               |
| `createWordCloudOptions`            | Word cloud                    |

---

## Individual theme objects

If you only need one theme, import it directly:

```ts
import { carbonWhite } from '@carbon/echarts-theme'
// also: carbonG10, carbonG90, carbonG100

echarts.registerTheme('carbon-white', carbonWhite)
```

---

## Theme name constants

Use the `THEME_NAMES` object and `CarbonThemeName` type to avoid hard-coding strings:

```ts
import { THEME_NAMES } from '@carbon/echarts-theme'
import type { CarbonThemeName } from '@carbon/echarts-theme'

const theme: CarbonThemeName = THEME_NAMES.g90 // 'carbon-g90'
```

---

## Loading skeleton

The `./skeleton` subpath provides a Carbon Charts-matching shimmer grid overlay for loading states. No global stylesheet is required — all styles are injected inline.

```ts
import { showSkeleton } from '@carbon/echarts-theme/skeleton'

const hide = showSkeleton(chartContainerEl) // show
const hide = showSkeleton(chartContainerEl, 'g90') // dark theme variant
// later, once data has loaded:
hide()
```

For SSR or CSS-in-JS, generate a stylesheet instead:

```ts
import { createSkeletonCSS, skeletonCSS } from '@carbon/echarts-theme/skeleton'

// One theme
const css = createSkeletonCSS('g100', '.my-skeleton')

// Pre-built strings for all four themes
const { white, g10, g90, g100 } = skeletonCSS
```

---

## Font constants

IBM Plex font-family strings are exported for use in custom chart options:

```ts
import { IBM_PLEX_FONT_FAMILY, IBM_PLEX_FONT_FAMILY_CONDENSED } from '@carbon/echarts-theme'
```

---

## Links

- [Showcase site](https://echarts-theme.carbondesignsystem.com) — live side-by-side comparison with Carbon Charts
- [GitHub](https://github.com/carbon-design-system/carbon-echarts-theme)
- [Carbon Design System](https://carbondesignsystem.com)
- [Apache ECharts](https://echarts.apache.org)

---

## License

Apache 2.0 — see [LICENSE](../../LICENSE).
