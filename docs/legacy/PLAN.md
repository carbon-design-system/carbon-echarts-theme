# `@carbon/echarts-theme` — Project Plan

## Goal & Scope

Build an official Apache ECharts theme that ports the Carbon Charts v11 visual
language — IBM Design Language data-vis color palettes, spacing tokens, type
tokens, and interaction patterns — so any team already using ECharts can adopt
Carbon's design language without migrating to `@carbon/charts`.

Secondary deliverables:

- A **side-by-side showcase site** pairing every Carbon Charts variant with its
  ECharts equivalent.
- **Migration guides** — "Carbon Charts → ECharts" and "ECharts (other theme) →
  `@carbon/echarts-theme`".
- **Codemods** (`@carbon/echarts-codemod`) to automate the mechanical parts of
  migration.

---

## No Framework Adapters

ECharts is the framework adapter. This package's output is a plain
JSON-compatible JavaScript object. Users plug it into whichever ECharts adapter
they already use:

| Framework        | Adapter                 |
| ---------------- | ----------------------- |
| React            | `echarts-for-react`     |
| Angular          | `ngx-echarts`           |
| Vue              | `vue-echarts`           |
| Svelte / vanilla | `echarts.init(domNode)` |

`echarts` is a **peer dependency** — never bundled, never wrapped.

---

## Repository Structure

```
@carbon/echarts-theme/
├── packages/
│   ├── theme/                  # @carbon/echarts-theme (core, published to npm)
│   │   └── src/
│   │       ├── tokens.ts       # Derived from @carbon/themes — never hardcoded
│   │       ├── palettes.ts     # Categorical, sequential, diverging, alert
│   │       ├── themes/
│   │       │   ├── white.ts
│   │       │   ├── g10.ts
│   │       │   ├── g90.ts
│   │       │   └── g100.ts
│   │       └── index.ts        # Public API (see below)
│   │
│   ├── site/                   # Showcase site + dev harness (Vite + React)
│   │   └── src/
│   │       ├── content/        # One MDX file per chart type (design docs)
│   │       ├── charts/         # One page file per chart type
│   │       └── components/
│   │           ├── ChartPage.tsx      # Tab shell: Overview / Examples / Code
│   │           ├── SideBySide.tsx
│   │           ├── ThemeSwitcher.tsx
│   │           └── CodeTabs.tsx
│   │
│   └── codemods/               # @carbon/echarts-codemod (published separately)
│       ├── carbon-charts-to-echarts/
│       └── echarts-theme-to-carbon/
│
├── docs/
│   ├── migration-carbon-charts-to-echarts.md
│   └── migration-echarts-to-carbon.md
├── pnpm-workspace.yaml
└── package.json
```

---

## Package API

```ts
// @carbon/echarts-theme

// Raw theme objects — use directly or pass to echarts.registerTheme()
export { carbonWhite, carbonG10, carbonG90, carbonG100 }

// Convenience: registers all four themes on your echarts instance
export function registerCarbonThemes(echarts: EChartsType): void

// IBM data-vis palettes — for consumers who want the raw color arrays
export { palettes } // { categorical, sequential, diverging, alert }

// Flat token map — for consumers building custom extensions
export { tokens } // { white, g10, g90, g100 }
```

Usage in any framework is identical:

```ts
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'

registerCarbonThemes(echarts)
// then pass theme="carbon-white" to your adapter
```

`registerCarbonThemes` accepts the user's `echarts` instance as an argument to
avoid SSR issues — no `window` access at module load time. Raw theme objects are
also exported so SSR users can pass them directly to their adapter's `theme`
prop without registration.

---

## Token Mapping Strategy

All values are **derived from `@carbon/themes` at build time**. When Carbon
ships a token update a version bump and rebuild gives automatic parity.

| ECharts theme key           | Carbon token          | White                                    | G100      |
| --------------------------- | --------------------- | ---------------------------------------- | --------- |
| `backgroundColor`           | `$background`         | `#ffffff`                                | `#161616` |
| `textStyle.color`           | `$text-primary`       | `#161616`                                | `#f4f4f4` |
| `textStyle.fontFamily`      | IBM Plex Sans         | `"IBM Plex Sans", system-ui, sans-serif` | ← same    |
| `textStyle.fontSize` (axis) | `$label-01` → 12px    | `12 / 400 / 0.32px`                      | ← same    |
| `title.textStyle`           | `$heading-compact-01` | `14px / 600`                             | ← same    |
| `axisLine.lineStyle.color`  | `$border-subtle-01`   | `#e0e0e0`                                | `#393939` |
| `splitLine.lineStyle.color` | `$border-subtle-00`   | `#e0e0e0`                                | `#393939` |
| `axisTick.lineStyle.color`  | `$border-strong-01`   | `#8d8d8d`                                | `#6f6f6f` |
| `tooltip.backgroundColor`   | `$layer-01`           | `#f4f4f4`                                | `#262626` |
| `tooltip.borderColor`       | `$border-subtle-01`   | `#e0e0e0`                                | `#393939` |
| `tooltip.textStyle.color`   | `$text-primary`       | `#161616`                                | `#f4f4f4` |
| `legend.textStyle.color`    | `$text-secondary`     | `#525252`                                | `#c6c6c6` |

### Data Visualization Color Palettes

| Type                  | When to use                         | Light sequence (first 4)                             |
| --------------------- | ----------------------------------- | ---------------------------------------------------- |
| **Categorical**       | Discrete unordered categories       | Purple 70, Cyan 50, Teal 70, Magenta 70 … (14 total) |
| **Sequential (mono)** | Single-hue ordered data / heat maps | Single IBM color ramp 10–100                         |
| **Diverging**         | Data with a neutral midpoint        | Palette 1 (Red–Cyan), Palette 2 (Purple–Teal)        |
| **Alert**             | Status / severity                   | Red 60, Orange 40, Yellow 30, Green 60               |

---

## Chart Type Mapping

### Carbon Charts equivalents

| Carbon Charts type           | ECharts equivalent             | Fidelity | Notes                                                              |
| ---------------------------- | ------------------------------ | -------- | ------------------------------------------------------------------ |
| Bar (simple)                 | `bar` series                   | High     | Vertical & horizontal via axis swap                                |
| Bar (grouped)                | `bar` × N series               | High     | `barGap: 0`                                                        |
| Bar (stacked)                | `bar` + `stack`                | High     | `stack: 'total'`                                                   |
| Bar (floating)               | `bar` with base offset         | Med      | Transparent base bar encodes start value                           |
| Line                         | `line` series                  | High     | Time-series: `xAxis.type: 'time'`                                  |
| Area (simple)                | `line` + `areaStyle`           | High     |                                                                    |
| Area (stacked)               | `line` + `stack` + `areaStyle` | High     |                                                                    |
| Scatter                      | `scatter` series               | High     |                                                                    |
| Bubble                       | `scatter` + `symbolSize` fn    | High     | 3rd dimension → symbol size                                        |
| Donut                        | `pie` with inner radius        | High     | `radius: ['40%', '70%']`                                           |
| Pie                          | `pie` series                   | High     |                                                                    |
| Gauge                        | `gauge` series                 | Med      | Custom arc track styling required                                  |
| Meter / Meter (proportional) | `gauge` or custom `bar`        | Med      | ECharts gauge emulates meter arc                                   |
| Heatmap                      | `heatmap` + `visualMap`        | High     | Sequential palette → `visualMap` colors                            |
| Treemap                      | `treemap` series               | High     |                                                                    |
| Radar                        | `radar` series                 | High     |                                                                    |
| Boxplot                      | `boxplot` series               | High     |                                                                    |
| Histogram                    | `bar` (gapless)                | High     | `barCategoryGap: '1%'`                                             |
| Combo                        | Mixed `bar` + `line`           | High     | Dual Y-axis for different scales                                   |
| Lollipop                     | `scatter` + `markLine`         | Med      | Custom render or `markLine` combo                                  |
| Sparkline                    | `line` (no axes)               | High     | Strip all decoration                                               |
| Step                         | `line` + `step: 'start'`       | High     |                                                                    |
| Alluvial                     | `sankey` series                | High     | `createAlluvialOptions` — nodes inferred from source/target pairs  |
| Tree                         | `tree` series                  | High     | `createTreeOptions` — LR/TB/RL/BT orient; tabular adapter included |
| Bullet                       | Custom layered `bar`           | Hard     | v2 — three overlapping bars (range / actual / marker); see §2.8    |
| Word Cloud                   | `wordCloud` (ext)              | Med      | v2 — needs `echarts-wordcloud` peer; see §2.9                      |
| Choropleth                   | `map` + `visualMap`            | Hard     | v2 — needs GeoJSON + `echarts.registerMap()`; see §2.10            |

### ECharts extended (no Carbon Charts equivalent)

These chart types have no Carbon Charts counterpart. They are implemented in the showcase site under `/extended/*` to demonstrate Carbon theme application on ECharts-native series types.

| Chart type  | ECharts series / mechanism              | Site page               | Notes                                                                     |
| ----------- | --------------------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| Candlestick | `candlestick` series                    | `/extended/candlestick` | OHLC financial chart; theme colors applied to wick/body                   |
| Funnel      | `funnel` series                         | `/extended/funnel`      | Conversion pipeline; `sort: 'descending'`, `gap: 2`                       |
| **Gantt**   | `bar` (horizontal stacked floating bar) | `/extended/gantt`       | Transparent offset bar + visible duration bar; supports time-axis variant |
| Graph       | `graph` series                          | `/extended/graph`       | Force-directed network; theme edge/node colors                            |
| Parallel    | `parallel` + `parallelAxis`             | `/extended/parallel`    | Multi-dimensional comparison across parallel axes                         |
| Sunburst    | `sunburst` series                       | `/extended/sunburst`    | Hierarchical part-of-whole; concentric rings                              |
| Theme River | `themeRiver` series                     | `/extended/theme-river` | Stacked flow over time; categorical palette applied per stream            |

---

## Site Architecture

**Bespoke Vite + React site** — no Storybook.

`packages/site` serves as both the **development harness during Phase 2** (add a
preset → add a page, visual verification happens in the same environment that
ships to production) and the **public-facing showcase**. There is no separate
Storybook setup; adding a chart type means adding one MDX content file and one
page component — not a story and a page.

### Per-page tab structure

Every chart-type route exposes three tabs, mirroring
`charts.carbondesignsystem.com`:

| Tab          | Content                                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview** | Design direction — when to use, anatomy, dos/don'ts, colour guidance. Authored in MDX (`src/content/<chart>.mdx`) so it is editable without touching component code. |
| **Examples** | Side-by-side live panels: Carbon Charts (left) / ECharts + theme (right). Pixel-diff toggle overlay. Global theme switcher drives both panels.                       |
| **Code**     | Copy-pasteable minimal snippets per variant (ECharts, Carbon Charts, raw options).                                                                                   |

### Layout

- Left panel: live **Carbon Charts** component
- Right panel: **ECharts** with `@carbon/echarts-theme` applied
- Global theme switcher (White / G10 / G90 / G100) drives both panels
- Pixel-diff toggle: CSS `mix-blend-mode: difference` overlay to surface
  divergence
- Left nav mirrors `charts.carbondesignsystem.com` structure
- Deployed to `charts.carbondesignsystem.com/echarts` (or similar) via GitHub
  Actions on every merge to `main`

---

## Codemods (`@carbon/echarts-codemod`)

Lives in `packages/codemods/` in this repo — versioned and released here,
independently of the Carbon core monorepo codemods.

**Why separate from Carbon core codemods:**

- Release independence — chart type additions ship without Carbon core review
- Co-location — theme maintainers own the transforms
- Different concern — migrating _to_ this theme vs. Carbon's internal API changes

### Transform 1: `carbon-charts-to-echarts`

Converts `@carbon/charts-react` JSX to `echarts-for-react` + theme:

```
// Input
import { BarChart } from '@carbon/charts-react';
<BarChart data={myData} options={myOptions} />

// Output
import ReactECharts from 'echarts-for-react';
import { createBarOptions } from '@carbon/echarts-theme/presets';
<ReactECharts option={createBarOptions(myData, myOptions)} theme="carbon-white" />
```

### Transform 2: `echarts-theme-swap`

Replaces any existing ECharts theme string with `carbon-white` and adds the
`registerCarbonThemes` import.

### CLI

```sh
npx @carbon/echarts-codemod carbon-charts-to-echarts ./src
npx @carbon/echarts-codemod echarts-theme-swap ./src
```

---

## Phased Delivery

### Phase 1 — Theme Core (weeks 1–3)

- Scaffold monorepo: pnpm workspaces + Turborepo
- `tokens.ts` — import from `@carbon/themes`; map to ECharts keys; unit tests
  assert values match source
- `palettes.ts` — all 4 IBM data-vis palette types with light/dark variants
- Generate four ECharts theme objects (white / g10 / g90 / g100)
- Publish `@carbon/echarts-theme@0.1.0` to npm

### Phase 2 — Chart Presets + Site (weeks 3–8, run in parallel)

- Scaffold `packages/site` from day one of Phase 2 — it is the dev harness
- `createXxxOptions(data, opts)` helper per chart type returning a spec-accurate
  ECharts option object
- For each preset: add an MDX content file (design guidance) + a `ChartPage`
  route (Examples + Code tabs) to the site simultaneously
- Prioritise: Bar, Line, Area, Donut, Scatter, Heatmap, Gauge
- Deploy preview builds to GitHub Pages on every PR for visual review

### Phase 3 — Site Polish & Documentation (weeks 6–9, overlaps Phase 2)

- Complete all MDX design-direction content (porting and adapting from
  Carbon Charts docs where applicable — Overview / when-to-use / anatomy
  sections; add ECharts-specific implementation notes alongside)
- Pixel-diff toggle, getting-started page, migration guide links in nav
- Playwright visual regression baselines per chart × theme
- Deploy production build to `charts.carbondesignsystem.com/echarts`

### Phase 4 — Migration Guides & Codemods (weeks 7–10)

- `docs/migration-carbon-charts-to-echarts.md`
- `docs/migration-echarts-to-carbon.md`
- `@carbon/echarts-codemod` with both transforms + CLI
- Publish `@carbon/echarts-codemod@0.1.0`

---

## Key Design Decisions

| Decision                    | Resolution                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| Ship theme as JSON or JS?   | Both — JS module + exported raw JSON for non-JS consumers                                    |
| React/Angular/Vue wrappers? | None — ECharts adapters handle this; one package works everywhere                            |
| Codemods location           | This repo (`packages/codemods`), separate npm package `@carbon/echarts-codemod`              |
| Token derivation            | Build-time import from `@carbon/themes` — never hardcoded                                    |
| Gradient fills              | Omitted from v1; Carbon Charts does not support them either                                  |
| Animation                   | `animationDuration: 300`, `animationEasing: 'cubicOut'` (Carbon Charts default)              |
| Toolbar / zoom bar          | Carbon-styled `toolbox` SVG icons + `dataZoom` slider config                                 |
| SSR                         | `registerCarbonThemes(echarts)` takes the echarts instance as arg; raw objects also exported |
| Versioning                  | `@carbon/echarts-theme@11.x` tracks Carbon v11 tokens                                        |

---

## Success Criteria

- All 24 chart types have an ECharts preset with visual regression baseline.
- Theme passes WCAG AA 4.5:1 contrast on all text elements across all 4 themes.
- Showcase site loads < 2 s on 3G (charts below fold are lazy-loaded).
- Codemods transform the Carbon Charts demo app with zero manual follow-ups for
  the core chart set (Bar, Line, Area, Donut, Scatter).
- Zero peer-dep warnings on ECharts 5.x.

---

## Immediate Next Steps

1. Confirm v1 chart scope vs backlog.
2. Scaffold monorepo — `pnpm init`, `pnpm-workspace.yaml`, Turborepo pipeline.
3. Build `tokens.ts` — import `@carbon/themes`, map to ECharts keys, write tests.
4. Build `palettes.ts` — encode all 4 IBM palette types with light/dark variants.
5. Register themes — generate white/g10/g90/g100, publish `@carbon/echarts-theme@0.1.0`.
6. Start Storybook dev harness — one story per high-priority chart type.
