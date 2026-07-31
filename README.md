# `@carbon/echarts-theme`

An official [Apache ECharts](https://echarts.apache.org) theme that ports the **Carbon Charts v11** visual language — IBM Design Language data-vis color palettes, spacing tokens, type tokens, and interaction patterns — so any team already using ECharts can adopt Carbon's design system without migrating to `@carbon/charts`.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io)

---

## Packages

| Package | Description |
| --- | --- |
| [`packages/theme`](packages/theme) | `@carbon/echarts-theme` — core theme objects, published to npm |
| [`packages/site`](packages/site) | Showcase site and development harness (Vite + React) |
| [`packages/codemods`](packages/codemods) | `@carbon/echarts-codemod` — migration transforms, published separately |

---

## Quick Start

```sh
npm install echarts @carbon/echarts-theme
```

```ts
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'

// Register all four Carbon themes once at app startup
registerCarbonThemes(echarts)

// Then pass a theme name to your ECharts adapter
// e.g. theme="carbon-white" | "carbon-g10" | "carbon-g90" | "carbon-g100"
```

ECharts is a **peer dependency** — it is never bundled or wrapped. The output is a plain JavaScript object you can pass directly to any ECharts adapter:

| Framework | Adapter |
| --- | --- |
| React | `echarts-for-react` |
| Angular | `ngx-echarts` |
| Vue | `vue-echarts` |
| Svelte / vanilla | `echarts.init(domNode)` |

---

## Theme Variants

Four themes track the four Carbon color modes:

| Theme name | Carbon mode |
| --- | --- |
| `carbon-white` | White |
| `carbon-g10` | Gray 10 |
| `carbon-g90` | Gray 90 |
| `carbon-g100` | Gray 100 |

All design tokens are derived from `@carbon/themes` at build time and inlined into the bundle — there is **zero runtime dependency** on Carbon.

---

## Project Goals

- **Theme parity** — every Carbon Charts v11 visual decision (color, typography, spacing, animation) faithfully reproduced in ECharts.
- **Showcase site** — a side-by-side comparison of every Carbon Charts variant alongside its ECharts equivalent, deployed at `charts.carbondesignsystem.com/echarts`.
- **Migration paths** — written guides and automated codemods for teams moving from Carbon Charts to ECharts, or from another ECharts theme to this one.

---

## Roadmap

### Phase 1 — Theme Core ✅
Scaffold the monorepo, derive token maps from `@carbon/themes`, encode all four IBM data-vis palette types (categorical, sequential, diverging, alert), generate and publish `@carbon/echarts-theme@0.1.0`.

### Phase 2 — Chart Presets + Site
`createXxxOptions(data, opts)` helper per chart type — returning a spec-accurate ECharts option object. Every new preset lands alongside an MDX design-guidance page and live examples on the showcase site. Priority order: Bar, Line, Area, Donut, Scatter, Heatmap, Gauge.

### Phase 3 — Site Polish & Documentation
Complete MDX design-direction content for all chart types, pixel-diff toggle, Playwright visual regression baselines per chart × theme, production deploy.

### Phase 4 — Migration Guides & Codemods
`docs/migration-carbon-charts-to-echarts.md`, `docs/migration-echarts-to-carbon.md`, and `@carbon/echarts-codemod` with two automated transforms:

```sh
npx @carbon/echarts-codemod carbon-charts-to-echarts ./src
npx @carbon/echarts-codemod echarts-theme-swap ./src
```

---

## Chart Coverage

The site targets full parity with [charts.carbondesignsystem.com](https://charts.carbondesignsystem.com), with charts listed alphabetically. All 24 Carbon Charts types have an ECharts mapping; 7 additional ECharts-native types (Candlestick, Funnel, Gantt, Graph, Parallel, Sunburst, Theme River) are demonstrated under `/extended/*`.

See [`PLAN.md`](PLAN.md) for the full chart-type mapping table and fidelity notes.

---

## Development

**Requirements:** Node ≥ 22, pnpm ≥ 9

```sh
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the showcase site locally
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint
```

### Repository structure

```
packages/
├── theme/          # @carbon/echarts-theme (core, published to npm)
│   └── src/
│       ├── tokens.ts       # Derived from @carbon/themes — never hardcoded
│       ├── palettes.ts     # Categorical, sequential, diverging, alert
│       ├── themes/         # white.ts · g10.ts · g90.ts · g100.ts
│       └── index.ts        # Public API
│
├── site/           # Showcase site + dev harness (Vite + React)
│   └── src/
│       ├── content/        # MDX design-guidance docs (one per chart type)
│       ├── charts/         # Page component per chart type
│       └── components/     # ChartPage, SideBySide, ThemeSwitcher, CodeTabs
│
└── codemods/       # @carbon/echarts-codemod (published separately)
    ├── carbon-charts-to-echarts/
    └── echarts-theme-to-carbon/
```

---

## Contributing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning.

```sh
# Create a changeset before opening a PR
pnpm changeset
```

PRs trigger a preview build deployed to GitHub Pages for visual review.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
