# `@carbon/echarts-theme`

An official [Apache ECharts](https://echarts.apache.org) theme that ports the **Carbon Charts v11** visual language — IBM Design Language data-vis color palettes, spacing tokens, type tokens, and interaction patterns — so any team already using ECharts can adopt Carbon's design system without migrating to `@carbon/charts`.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io)

**[→ echarts-theme.carbondesignsystem.com](https://echarts-theme.carbondesignsystem.com)**

---

## Packages

| Package                                  | Description                                                                        |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| [`packages/theme`](packages/theme)       | `@carbon/echarts-theme` — core theme objects, published to npm                     |
| [`packages/site`](packages/site)         | Showcase site and development harness (Vite + React)                               |
| [`packages/toolbar`](packages/toolbar)   | `@carbon/echarts-toolbar` — chart toolbar + CSV/image export _(planned)_           |
| [`packages/codemods`](packages/codemods) | `@carbon/echarts-codemod` — migration transforms, published separately _(planned)_ |

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

| Framework        | Adapter                 |
| ---------------- | ----------------------- |
| React            | `echarts-for-react`     |
| Angular          | `ngx-echarts`           |
| Vue              | `vue-echarts`           |
| Svelte / vanilla | `echarts.init(domNode)` |

---

## Theme Variants

Four themes track the four Carbon color modes:

| Theme name     | Carbon mode |
| -------------- | ----------- |
| `carbon-white` | White       |
| `carbon-g10`   | Gray 10     |
| `carbon-g90`   | Gray 90     |
| `carbon-g100`  | Gray 100    |

All design tokens are derived from `@carbon/themes` at build time and inlined into the bundle — there is **zero runtime dependency** on Carbon.

---

## Project Goals

- **Theme parity** — every Carbon Charts v11 visual decision (color, typography, spacing, animation) faithfully reproduced in ECharts.
- **Showcase site** — a side-by-side comparison of every Carbon Charts variant alongside its ECharts equivalent, deployed at [echarts-theme.carbondesignsystem.com](https://echarts-theme.carbondesignsystem.com).
- **Migration paths** — written guides and automated codemods for teams moving from Carbon Charts to ECharts, or from another ECharts theme to this one.

---

## Roadmap

### Phase 1 — Theme Core ✅

Scaffold the monorepo, derive token maps from `@carbon/themes`, encode all four IBM data-vis palette types (categorical, sequential, diverging, alert), generate and publish `@carbon/echarts-theme@0.1.0`.

### Phase 2 — Chart Presets + Site 🚧

`createXxxOptions(data, opts)` helpers for all Carbon Charts types — returning a spec-accurate ECharts option object with theme tokens, palette, and layout already applied. Presets are exported from the `@carbon/echarts-theme/presets` subpath. Live examples and MDX design-guidance pages for each chart type are published to the showcase site.

### Phase 3 — Toolbar

`@carbon/echarts-toolbar` — a standalone package providing a chart toolbar with CSV download, image export, and fullscreen support. Includes a zero-dependency core and a thin React adapter built on `@carbon/react`.

### Phase 4 — Site Polish & Documentation

Complete MDX design-direction content for all chart types, pixel-diff toggle, Playwright visual regression baselines per chart × theme, production deploy. Each chart example includes an embedded **StackBlitz** sandbox so users can fork and experiment without a local setup.

### Phase 5 — Migration Guides & Codemods

`docs/migration-carbon-charts-to-echarts.md`, `docs/migration-echarts-to-carbon.md`, and `@carbon/echarts-codemod` with two automated transforms:

```sh
npx @carbon/echarts-codemod carbon-charts-to-echarts ./src
npx @carbon/echarts-codemod echarts-theme-swap ./src
```

---

## Chart Coverage

The site targets full parity with [charts.carbondesignsystem.com](https://charts.carbondesignsystem.com), with charts listed alphabetically. All 24 Carbon Charts types have an ECharts mapping; 7 additional ECharts-native types (Candlestick, Funnel, Gantt, Graph, Parallel, Sunburst, Theme River) are demonstrated under `/extended/*`.

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
│       ├── skeleton.ts     # showSkeleton / createSkeletonCSS loading state
│       ├── presets/        # createBarOptions, createLineOptions, … (30+ helpers)
│       ├── themes/         # white.ts · g10.ts · g90.ts · g100.ts
│       └── index.ts        # Public API
│
├── site/           # Showcase site + dev harness (Vite + React)
│   └── src/
│       ├── content/        # MDX design-guidance docs (one per chart type)
│       ├── charts/         # Page component per chart type
│       └── components/     # ChartPage, SideBySide, ThemeSwitcher, CodeTabs
│
├── toolbar/        # @carbon/echarts-toolbar — chart toolbar + export (planned)
│
└── codemods/       # @carbon/echarts-codemod (published separately)
```

---

## Contributing

This project uses [Release Please](https://github.com/googleapis/release-please) for versioning and changelog generation. Releases are triggered automatically from the `main` branch based on [Conventional Commits](https://www.conventionalcommits.org).

### Commit format

```
type(scope): subject
```

**Conventional Commits are enforced.** Commitlint runs on every commit via Husky and will
block the commit if the message does not conform.

#### Length limits

| Part            | Limit     |
| --------------- | --------- |
| Header (line 1) | 100 chars |
| Body lines      | 100 chars |

The header is `type(scope): subject` in full. Keep the subject concise — if more detail is
needed, put it in the body (separated by a blank line), with each line wrapped at 100 chars.

#### Allowed scopes

Scope maps to the **package or area being changed** and drives which package release-please
bumps. Using a sub-feature name (e.g. `area`, `bar`) instead of a package name causes
incorrect version bumps across the monorepo.

| Scope      | When to use                                                           |
| ---------- | --------------------------------------------------------------------- |
| `theme`    | Changes to `packages/theme` (`@carbon/echarts-theme`)                 |
| `toolbar`  | Changes to `packages/toolbar` (`@carbon/echarts-toolbar`)             |
| `codemods` | Changes to `packages/codemods` (`@carbon/echarts-codemod`)            |
| `site`     | Changes to `packages/site` (showcase site, docs, MDX content)         |
| `deps`     | Dependency updates (Dependabot PRs, manual version bumps)             |
| `release`  | Release infrastructure (release-please config, manifests, tags)       |
| `repo`     | Root-level tooling — commitlint, lint-staged, husky, eslint, prettier |

#### Examples

```sh
# minor bump on @carbon/echarts-theme
feat(theme): add createRadarOptions preset helper

# patch bump on @carbon/echarts-theme
fix(theme): correct duplicate tooltip key in area preset

# minor bump on @carbon/echarts-toolbar
feat(toolbar): add CSV export button

# no release
docs(site): update contributing section

# no release
chore(deps): update dev dependencies
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`,
`build`, `revert`.

PRs trigger a preview deploy to Netlify for visual review.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
