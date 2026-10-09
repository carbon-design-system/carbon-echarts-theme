# Phase 4 — `packages/toolbar` (`@carbon/echarts-toolbar`)

> **Status: ✅ Complete**

---

## Overview

`@carbon/echarts-toolbar` is a framework-agnostic, vanilla TypeScript toolbar package for Apache ECharts that replicates the toolbar experience of `@carbon/charts`.

| Layer       | Entry point                       | What it contains                                                |
| ----------- | --------------------------------- | --------------------------------------------------------------- |
| **Core**    | `@carbon/echarts-toolbar`         | Zero-dep TS — data extraction, CSV/image export, fullscreen API |
| **Vanilla** | `@carbon/echarts-toolbar/vanilla` | `createChartToolbar` + `autoToolbar` imperative DOM API         |
| **Styles**  | `@carbon/echarts-toolbar/styles`  | Pre-compiled `dist/styles.css`                                  |

## Source structure (as built)

```
packages/toolbar/src/
├── index.ts                    ← core entry
├── core/
│   ├── extract.ts              ← backwards-compat shim (re-exports from extract/)
│   ├── extract/                ← split into per-chart-type files after refactor
│   │   ├── index.ts            ← buildTableData dispatch + barrel
│   │   ├── types.ts            ← TableData interface
│   │   ├── boxplot.ts
│   │   ├── category-axis.ts
│   │   ├── gauge.ts
│   │   ├── heatmap.ts
│   │   ├── hierarchy.ts
│   │   ├── histogram.ts
│   │   ├── links.ts
│   │   ├── lollipop.ts
│   │   ├── parallel.ts
│   │   ├── pie.ts
│   │   ├── radar.ts
│   │   ├── scatter.ts
│   │   └── time-series.ts
│   ├── export.ts               ← downloadCSV, exportImage
│   └── fullscreen.ts           ← enterFullscreen, exitFullscreen, isFullscreen, onFullscreenChange
├── vanilla/
│   ├── index.ts
│   ├── toolbar.ts              ← createChartToolbar, autoToolbar
│   ├── modal.ts                ← createTableModal
│   └── icons.ts                ← inline SVG path strings
└── styles/
    └── toolbar.scss
```

## What was planned vs what landed

- ✅ `createChartToolbar(container, instance, opts)` with `destroy()` / `update()` handle
- ✅ `autoToolbar(container, getInstanceByDom, opts)` — auto-wires to ECharts instance via MutationObserver
- ✅ Show-as-table modal (Carbon `cds--modal` classes)
- ✅ Fullscreen with Safari webkit fallback
- ✅ CSV export
- ✅ PNG / JPG image export (canvas renderer + SVG renderer fallback)
- ✅ Overflow menu with all three export options
- ✅ SCSS compiled to `dist/styles.css`
- ✅ `extract.ts` refactored into per-chart-type modules under `extract/`
- ❌ `__tests__/` directory exists but no tests written (tracked in `docs/11-code-review.md`)
- ❌ React / Angular / Vue adapter wrappers — deferred

## Release

Versioned and released via Release Please alongside `@carbon/echarts-theme`. Tags follow the pattern `toolbar-v<version>`.
