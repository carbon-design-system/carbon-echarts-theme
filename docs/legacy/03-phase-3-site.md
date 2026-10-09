# Phase 3 — Site (`packages/site/`)

> **Status: ✅ Complete** (ongoing visual parity improvements — see `docs/08-chart-parity-gap-analysis.md`)

---

## Stack

- Vite + React + TypeScript
- MDX for chart description content
- `echarts-for-react` + `echarts` for chart rendering
- `@carbon/react` for UI components
- Deployed to Netlify (see `netlify.toml`)

## Site structure

All chart pages exist and are routed. The site covers:

**Carbon Charts parity pages** (alphabetical nav order matching Carbon Charts site):
Alluvial, Area, Bar, Boxplot, Bubble, Bullet (stub), Choropleth (stub), Circlepack (stub), Combo, Donut, Gauge, Heatmap, Histogram, Line, Lollipop, Meter, Network Diagram, Pie, Radar, Scatter, Tree, Treemap, Word Cloud

**ECharts-extended pages** (under `/extended`):
Candlestick, Funnel, Gantt, Graph, Parallel, Sunburst, Theme River

## Key components

| Component                            | Purpose                                 |
| ------------------------------------ | --------------------------------------- |
| `SiteLayout.tsx`                     | Navigation shell, theme switcher        |
| `ChartPage.tsx`                      | Per-chart page wrapper with MDX content |
| `Compare.tsx` / `CompareContext.tsx` | Side-by-side comparison panel           |
| `ThemeContext.tsx`                   | Active Carbon theme state               |
| `IbmFooter.tsx`                      | IBM web platform footer                 |

## What was planned vs what landed

- ✅ All chart pages created and routed
- ✅ Alphabetical nav order matching Carbon Charts site
- ✅ Page splits done: Donut/Pie, Gauge/Meter, Scatter/Bubble all separate
- ✅ Stub pages for Bullet, Choropleth, Circlepack
- ✅ IBM footer integrated
- ✅ Deployed to Netlify (not GitHub Pages as originally planned)
- ⚠️ StackBlitz "View in Carbon Charts" links — not implemented; comparison uses live Carbon Charts React components or plain description panels
- ⚠️ AVT (IBM Equal Access) automated tests — not wired into CI

## Deployment

Deploys via Netlify on push to `main`. Config in [`netlify.toml`](../netlify.toml).
