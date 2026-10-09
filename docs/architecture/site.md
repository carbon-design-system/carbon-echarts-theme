# Site Architecture

`packages/site` is a Vite + React application. It serves as the **development harness** while building presets and as the **public-facing showcase** once deployed.

---

## Stack

| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| Bundler            | Vite                            |
| UI framework       | React + TypeScript              |
| Chart rendering    | `echarts-for-react` + `echarts` |
| UI components      | `@carbon/react`                 |
| Chart descriptions | MDX                             |
| Deployment         | Netlify (see ADR 0006)          |

---

## Source structure

```
src/
├── content/        MDX design-guidance files (one per chart type)
├── charts/         Page component per chart type
├── data/
│   ├── carboncharts/   Reference data for Carbon Charts panels
│   └── echarts/        ECharts data files — call preset functions only, no logic
└── components/
    ├── SiteLayout.tsx      Navigation shell, theme switcher
    ├── ChartPage.tsx       Per-chart wrapper (Overview / Examples tabs)
    ├── Compare.tsx         Side-by-side comparison panel
    ├── CompareContext.tsx  Comparison state
    ├── ThemeContext.tsx    Active Carbon theme state (white / g10 / g90 / g100)
    └── IbmFooter.tsx       IBM web platform mandatory footer
```

---

## Routes

### Carbon Charts parity pages

| Route         | Chart                                        |
| ------------- | -------------------------------------------- |
| `/alluvial`   | Alluvial / Sankey                            |
| `/area`       | Area                                         |
| `/bar`        | Bar                                          |
| `/boxplot`    | Boxplot                                      |
| `/bubble`     | Bubble                                       |
| `/bullet`     | Bullet _(stub)_                              |
| `/choropleth` | Choropleth _(stub)_                          |
| `/circlepack` | Circle pack _(stub — no ECharts equivalent)_ |
| `/combo`      | Combo                                        |
| `/donut`      | Donut                                        |
| `/gauge`      | Gauge                                        |
| `/heatmap`    | Heatmap                                      |
| `/histogram`  | Histogram                                    |
| `/line`       | Line                                         |
| `/lollipop`   | Lollipop                                     |
| `/meter`      | Meter                                        |
| `/network`    | Network Diagram                              |
| `/pie`        | Pie                                          |
| `/radar`      | Radar                                        |
| `/scatter`    | Scatter                                      |
| `/tree`       | Tree                                         |
| `/treemap`    | Treemap                                      |
| `/wordcloud`  | Word Cloud                                   |

### ECharts-extended pages

These chart types have no Carbon Charts equivalent. Single ECharts panel, no comparison layout.

| Route                   | Chart                          |
| ----------------------- | ------------------------------ |
| `/extended/candlestick` | Candlestick (OHLC)             |
| `/extended/funnel`      | Funnel                         |
| `/extended/gantt`       | Gantt                          |
| `/extended/graph`       | Graph (force-directed network) |
| `/extended/parallel`    | Parallel coordinates           |
| `/extended/sunburst`    | Sunburst                       |
| `/extended/themeriver`  | Theme River                    |

---

## Per-page pattern

Each chart page follows the same two-layer pattern:

1. **Data file** (`src/data/echarts/<chart>.ts`) — calls preset functions with typed data. No option construction logic.
2. **Page file** (`src/charts/<Chart>Page.tsx`) — imports from the data file, wires props to `<ChartPage>` / `<Compare>`. No option construction.

MDX content (`src/content/<chart>.mdx`) provides the Overview tab copy — design guidance, when to use, dos/don'ts. Authored separately from the component code.

---

## Theme switching

`ThemeContext` holds the active Carbon theme key (`white` | `g10` | `g90` | `g100`). The global theme switcher in `SiteLayout` updates this context. Both the Carbon Charts panel and the ECharts panel read from the same context, so switching themes updates both sides of the comparison simultaneously.

---

## IBM platform requirements

These are launch blockers — not polish items.

| Requirement          | Implementation                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `window.digitalData` | Inline `<script>` as the first element in `<head>` in `index.html`                                           |
| `ibm-common.js`      | Loaded via `<script src="//1.www.s81c.com/common/stats/ibm-common.js" defer>` after `digitalData`            |
| IBM footer           | `IbmFooter.tsx` wrapping `<c4d-footer>` from `@carbon/ibmdotcom-web-components`, mounted once in root layout |
| Cookie Preferences   | Wired automatically by `ibm-common.js` when `id="teconsent"` is present inside `<c4d-footer>`                |
| Site ID              | `CARBON_CHARTS_ECHARTS` — must be registered with IBM Digital Analytics before GA                            |

---

## Deployment

- **Production:** Netlify, triggered by non-RC tag push via `deploy-site.yml`.
- **PR previews:** Netlify automatically deploys each PR to a unique preview URL.
- Config: [`netlify.toml`](../../netlify.toml).
