# Current State

> Last updated: June 2025 — post `extract.ts` refactor.

---

## Package status

| Package                   | Status             | Version                |
| ------------------------- | ------------------ | ---------------------- |
| `@carbon/echarts-theme`   | ✅ Published       | tracks Carbon v11      |
| `@carbon/echarts-toolbar` | ✅ Published       | independent versioning |
| `@carbon/echarts-codemod` | ❌ Not started     | scaffolded only        |
| Showcase site             | ✅ Live on Netlify | all 30 pages routed    |

---

## What is complete

### Theme core

- Four ECharts theme objects (White, G10, G90, G100) — all tokens derived from `@carbon/themes`
- IBM data-vis palettes: categorical, sequential, diverging, alert — light and dark variants
- `registerCarbonThemes(echarts)` public API — SSR-safe
- Skeleton / loading-state helpers (`skeleton.ts`)

### Presets (`@carbon/echarts-theme/presets`)

All 18 preset files shipping; 192 tests passing.

| Preset          | Exports                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `bar.ts`        | `createBarOptions`, `createGroupedBarOptions`, `createStackedBarOptions`, `createHorizontalBarOptions`, `createFloatingBarOptions` |
| `line.ts`       | `createLineOptions`, `createStepLineOptions`, `createTimeSeriesLineOptions`                                                        |
| `area.ts`       | `createAreaOptions`, `createStackedAreaOptions`, `createBoundedAreaOptions`                                                        |
| `donut.ts`      | `createDonutOptions`, `createPieOptions`                                                                                           |
| `scatter.ts`    | `createScatterOptions`, `createBubbleOptions`                                                                                      |
| `heatmap.ts`    | `createHeatmapOptions`                                                                                                             |
| `choropleth.ts` | `createChoroplethOptions`                                                                                                          |
| `gauge.ts`      | `createGaugeOptions`, `createMeterOptions`                                                                                         |
| `histogram.ts`  | `createHistogramOptions`                                                                                                           |
| `treemap.ts`    | `createTreemapOptions`, `createTreemapOptionsFromHierarchy`, `createRadarOptions`                                                  |
| `sunburst.ts`   | `createSunburstOptions`                                                                                                            |
| `boxplot.ts`    | `createBoxplotOptions`                                                                                                             |
| `combo.ts`      | `createComboOptions`                                                                                                               |
| `lollipop.ts`   | `createLollipopOptions`, `createSparklineOptions`                                                                                  |
| `alluvial.ts`   | `createAlluvialOptions`, `createAlluvialOptionsFromTabular`                                                                        |
| `tree.ts`       | `createTreeOptions`, `createTreeOptionsFromTabular`                                                                                |
| `network.ts`    | `createNetworkOptions`                                                                                                             |
| `wordcloud.ts`  | `createWordCloudOptions`                                                                                                           |

### Toolbar (`@carbon/echarts-toolbar`)

- `createChartToolbar` / `autoToolbar` vanilla DOM API
- Show-as-table modal (Carbon `cds--modal` classes)
- CSV export, PNG/JPG image export
- Fullscreen with Safari webkit fallback
- `extract/` refactored into 14 per-chart-type files under `core/extract/`

### Site

- All 30 chart pages exist and are routed (23 parity + 7 extended)
- Alphabetical nav matching `charts.carbondesignsystem.com`
- Side-by-side comparison panels with global theme switcher
- IBM footer integrated
- Deployed to Netlify

### CI / CD

- `ci.yml` — dedupe, format, lint, build + test, typecheck
- `release-please.yml` — automated Release PRs on push to main
- `publish.yml` — npm publish on tag push
- `deploy-site.yml` — Netlify deploy on non-RC tag push
- `dco.yml` — Developer Certificate of Origin check

---

## What is incomplete

| Area                                           | Status                                              | Reference                                   |
| ---------------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| Visual parity — critical (🔴) issues C1–C11    | ⚠️ Broken or empty renders                          | `docs/legacy/09-visual-audit-report.md`     |
| Visual parity — significant (🟠) issues S1–S15 | ⚠️ Wrong data or missing features                   | `docs/legacy/09-visual-audit-report.md`     |
| Code block coverage on chart pages             | ⚠️ Only 10 of 108 slots have code                   | `docs/legacy/09-visual-audit-report.md`     |
| Toolbar tests                                  | ❌ `__tests__/` is empty                            | `docs/plan/roadmap.md` W1                   |
| `skeleton.ts` tests                            | ❌ No test file                                     | `docs/plan/roadmap.md` W2                   |
| Codemods implementation                        | ❌ Not started                                      | `docs/plan/roadmap.md` W7                   |
| Migration guides                               | ❌ Not written                                      | `docs/plan/roadmap.md` W8                   |
| Community health files                         | ❌ CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, SUPPORT | `docs/plan/roadmap.md` W6                   |
| Mend / PSIRT scan                              | ❌ Blocked on IBM PSIRT registration                | `.github/ISSUE_TEMPLATE/mend-scan-setup.md` |
| AVT (IBM Equal Access) in CI                   | ❌ Not wired                                        | `docs/plan/roadmap.md` W10                  |
