# Line chart example

A standalone React example of a line chart using Apache ECharts and the Carbon theme from
[`@carbon/echarts-theme`](../../packages/theme).

- [`src/option.ts`](src/option.ts) — the chart definition (data + `createLineOptions`)
- [`src/LineChart.tsx`](src/LineChart.tsx) — the reusable chart component (`echarts-for-react` + Carbon theme)
- [`src/App.tsx`](src/App.tsx) — demo page with a theme switcher
- [`src/main.tsx`](src/main.tsx) — registers the Carbon themes and mounts the app

This folder is self-contained: it depends only on published packages, so it can be opened in
StackBlitz and its code copied straight into your own project. The documentation site imports and renders the same `LineChart` component.

## Run locally

```bash
pnpm install
pnpm dev
```

## Open in StackBlitz

https://stackblitz.com/github/carbon-design-system/carbon-echarts-theme/tree/main/examples/line?file=src/App.tsx
