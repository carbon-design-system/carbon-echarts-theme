# `charts.carbondesignsystem.com` — Phase 3 Site Assessment

> Navigation inventory, content lift-and-shift analysis, and mapping strategy
> for the `@carbon/echarts-theme` showcase site.

---

## 1. Current site overview

The existing site ([charts.carbondesignsystem.com](https://charts.carbondesignsystem.com))
is a Svelte-based SPA (Carbon Charts v1.27.17, deployed on Netlify) with a
consistent shell: a fixed black header bar carrying the product name + version

- search + GitHub link, a collapsible left-nav (~195 px wide), and a
  full-bleed black hero banner per page followed by a white content well.

The shell is **directly reusable** as a design reference — the Vite + React
site must match it to feel familiar. Content splits cleanly into four buckets:

| Symbol   | Meaning                                                              |
| -------- | -------------------------------------------------------------------- |
| ✅ Lift  | Copy MDX verbatim or near-verbatim; only code snippets need updating |
| 🔄 Adapt | Same page structure, substantial content rewrite for ECharts         |
| ❌ Drop  | Carbon Charts–specific; no ECharts equivalent in scope               |
| 🆕 New   | No counterpart on the current site                                   |

The current site has **4 nav groups** and **30 routable pages** (3 getting-started

- 11 data & config + 6 design + 21 chart types). The Phase 3 plan mirrors this
  shape with one new group appended at the bottom.

---

## 2. Navigation structure comparison

The left-nav accordion keeps the same **four-group structure**, with one new
group appended at the bottom. Users switching between the two sites should feel
no disorientation.

| Group                | Current site items                                                                                                                                                   | New site items                                                  | Delta                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------- |
| **Getting started**  | Introduction, Installation & setup, Chart anatomy                                                                                                                    | same                                                            | —                               |
| **Configuration**    | API, Analytics Instrumentation, Chart data, Chart display options, Event Listeners, Highlights, Locales, Thresholds, Toolbar customization, Truncation, Zoombar (11) | Chart data, Toolbar, Zoombar (3)                                | −8 Carbon Charts–specific pages |
| **Design**           | Themes (dark & light), Axes, Color palette, Dashboards, Legends, Tooltips (6)                                                                                        | same                                                            | —                               |
| **Chart types**      | 21 chart types                                                                                                                                                       | 19 chart types (−Circle pack, −Network Diagrams)                | −2                              |
| **ECharts extended** | —                                                                                                                                                                    | Sunburst, Graph, Funnel, Parallel, Theme River, Candlestick (6) | +6 new                          |

### Full route map

```
/                          → Introduction + getting started

# Getting started
/installation              → Installation & setup
/anatomy                   → Chart anatomy (link to Carbon Design System)

# Configuration
/data                      → Chart data shape
/toolbar                   → Toolbar customization
/zoombar                   → Zoombar / dataZoom

# Design
/themes                    → Themes (dark & light)
/axes                      → Axes
/palettes                  → Color palette
/dashboards                → Dashboards
/legends                   → Legends
/tooltips                  → Tooltips

# Chart types — Carbon Charts parity (side-by-side: Carbon Charts left, ECharts right)
/bar                       → Bar (simple, grouped, stacked, horizontal, floating)
/line                      → Line (discrete, time-series, log, step, dual-axis)
/area                      → Area (simple, stacked)
/scatter                   → Scatter + Bubble
/donut                     → Donut + Pie
/gauge                     → Gauge + Meter
/heatmap                   → Heatmap
/treemap                   → Treemap
/radar                     → Radar
/boxplot                   → Boxplot
/histogram                 → Histogram
/combo                     → Combo
/lollipop                  → Lollipop + Sparkline
/alluvial                  → Alluvial / Sankey
/tree                      → Tree
/bullet                    → Bullet           ⚑ v2 — Overview-only badge until preset ships
/choropleth                → Choropleth        ⚑ v2 — Overview-only badge until preset ships
/wordcloud                 → Word cloud        ⚑ v2 — Overview-only badge until preset ships

# ECharts extended — single panel, no Carbon Charts equivalent
/extended/sunburst         → Sunburst
/extended/graph            → Graph (network)
/extended/funnel           → Funnel
/extended/parallel         → Parallel coordinates
/extended/theme-river      → Theme River
/extended/candlestick      → Candlestick (OHLC)
```

**Chart types dropped vs. current site:**

- **Circle pack** — no viable ECharts equivalent at v1 fidelity.
- **Network Diagrams** — Carbon Charts uses a custom D3 engine; covered by
  `/extended/graph` instead.

**Overview-only pages (v2 badge):** Bullet, Choropleth, and Word cloud ship
with a populated Overview tab and an _"Examples coming in v2"_ banner in place
of the Examples tab. The nav item renders but is visually marked as
in-progress.

---

## 3. Page-by-page disposition

### Getting started

| Page                 | Disposition | Notes                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Introduction         | 🔄 Adapt    | Keep hero layout, chart-type taxonomy grid (Comparisons / Trends / Part-to-whole / Correlations / Connections / Geospatial), and intro structure. Replace `@carbon/charts` references; swap StackBlitz links; change thumbnail components to live ECharts previews. Add migration callout: _"Coming from Carbon Charts? See the migration guide."_ |
| Installation & setup | 🔄 Adapt    | Keep framework-tab UI (Vanilla JS / React / Vue / Angular). Swap install command to `npm i @carbon/echarts-theme echarts`. Replace per-file table with `registerCarbonThemes(echarts)` usage. Remove Svelte tab (works fine; just no dedicated adapter to document).                                                                               |
| Chart anatomy        | ✅ Lift     | Current page is a single sentence linking to the Carbon Design System anatomy page. Keep as-is — the anatomy diagram is framework-agnostic.                                                                                                                                                                                                        |

### Configuration

| Page                      | Disposition | Notes                                                                                                                                                                                                     |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chart data                | 🔄 Adapt    | Replace `ChartTabularData` explanation with ECharts `series[].data` shape and the `createXxxOptions(data, opts)` preset contract. Keep the "Dates / Rectangular charts / Polar charts" section structure. |
| Toolbar                   | 🔄 Adapt    | Keep concept and live-chart demo pattern. Replace Carbon Charts `toolbar.enabled` options with ECharts `toolbox` config. Show Carbon-styled toolbox icons.                                                |
| Zoombar                   | 🔄 Adapt    | Keep concept. Replace Carbon Charts zoombar snippet with ECharts `dataZoom` slider config.                                                                                                                |
| API                       | ❌ Drop     | TypeDoc link for `@carbon/charts` types. Replace with an outbound link to the ECharts option API at echarts.apache.org — no dedicated page needed.                                                        |
| Analytics Instrumentation | ❌ Drop     | IBM analytics hook — Carbon Charts–specific.                                                                                                                                                              |
| Chart display options     | ❌ Drop     | Documents `BaseChartOptions`. Link to ECharts option docs instead.                                                                                                                                        |
| Event Listeners           | ❌ Drop     | Carbon Charts event bus. ECharts uses `chart.on()` — out of theme scope.                                                                                                                                  |
| Highlights                | ❌ Drop     | Carbon Charts–specific feature.                                                                                                                                                                           |
| Locales                   | ❌ Drop     | Carbon Charts i18n. ECharts has its own locale system — out of theme scope.                                                                                                                               |
| Thresholds                | ❌ Drop     | Carbon Charts threshold lines. ECharts uses `markLine` — out of theme scope.                                                                                                                              |
| Truncation                | ❌ Drop     | Carbon Charts label truncation logic. ECharts handles this natively.                                                                                                                                      |

> **Recommendation:** Rather than eight silent stub pages, collapse the three
> surviving items into a single lean "Configuration" group. A leaner nav is
> better than placeholder stubs.

### Design

| Page                  | Disposition | Notes                                                                                                                                                                                                                 |
| --------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Themes (dark & light) | 🔄 Adapt    | Keep four-theme grid and code snippet pattern. Replace `theme: 'g100'` options with `registerCarbonThemes(echarts)` + `theme="carbon-g100"`. Upgrade to live theme switcher rendering all four themes simultaneously. |
| Axes                  | ✅ Lift     | Single vs. dual axis design guidance is framework-agnostic. Code snippets become ECharts `yAxis: [{…}, {…}]` pattern.                                                                                                 |
| Color palette         | ✅ Lift     | IBM data-vis palette docs (categorical, sequential, diverging, alert) are 100 % shared — about IBM Design Language, not Carbon Charts. Swap code snippet to use `palettes` export from `@carbon/echarts-theme`.       |
| Dashboards            | ✅ Lift     | Dashboard layout guidance is framework-agnostic. Remove Carbon Charts import snippets; everything else is CSS grid / layout advice.                                                                                   |
| Legends               | ✅ Lift     | Position/visibility guidance lifts entirely. Code becomes ECharts `legend: {}` config.                                                                                                                                |
| Tooltips              | ✅ Lift     | Design rules for tooltips and grouping behaviour lift entirely. Code becomes ECharts `tooltip: {}` config.                                                                                                            |

### Chart types

| Page                           | Disposition | What to reuse from current site                                                                                                         |
| ------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Bar (simple, grouped, stacked) | ✅ Lift     | Variant tabs (Vertical & Horizontal / Grouped / Stacked) lift exactly. Design guidance, dos/don'ts, colour rules lift verbatim.         |
| Line                           | ✅ Lift     | Discrete / time-series / step / dual-axis variants all map 1-to-1.                                                                      |
| Area (standard, stacked)       | ✅ Lift     | Two-variant tab structure lifts.                                                                                                        |
| Scatter + Bubble               | ✅ Lift     | Bubble maps to `scatter` + `symbolSize` fn. Same tab structure.                                                                         |
| Donut + Pie                    | ✅ Lift     | Current site has separate pages; new site merges under `/donut`. Nav label: "Donut & Pie".                                              |
| Gauge                          | ✅ Lift     | ECharts gauge is feature-rich. Arc track styling covered by theme.                                                                      |
| Meter                          | 🔄 Adapt    | Carbon Charts meter is a distinct component; ECharts emulates via `gauge`. Overview tab notes the implementation delta.                 |
| Heatmap                        | ✅ Lift     | ECharts `heatmap` + `visualMap`. Sequential palette → `visualMap` colours.                                                              |
| Treemap                        | ✅ Lift     | Native ECharts `treemap`.                                                                                                               |
| Radar                          | ✅ Lift     | Native ECharts `radar`.                                                                                                                 |
| Boxplot                        | ✅ Lift     | Native ECharts `boxplot`.                                                                                                               |
| Histogram                      | ✅ Lift     | Gapless bar — same visual result.                                                                                                       |
| Combo                          | ✅ Lift     | Mixed series.                                                                                                                           |
| Lollipop                       | ✅ Lift     | Scatter + `markLine` — medium fidelity, documented in Overview tab.                                                                     |
| Alluvial / Sankey              | ✅ Lift     | ECharts `sankey` — high fidelity.                                                                                                       |
| Tree                           | ✅ Lift     | Native ECharts `tree` with LR/TB/RL/BT orient.                                                                                          |
| Bullet                         | 🔄 Adapt    | v2 scope. Custom layered-bar approach. Overview tab documents implementation delta. Ships with "Examples coming in v2" banner.          |
| Choropleth                     | 🔄 Adapt    | v2 scope. Needs `echarts.registerMap()` + GeoJSON. Overview tab notes requirement. Ships with "Examples coming in v2" banner.           |
| Word cloud                     | 🔄 Adapt    | v2 scope. Needs `echarts-wordcloud` peer dep. Overview tab documents the extra install step. Ships with "Examples coming in v2" banner. |
| Circle pack                    | ❌ Drop     | No viable ECharts equivalent at v1 fidelity.                                                                                            |
| Network Diagrams               | ❌ Drop     | Carbon Charts uses a custom D3 engine. Covered by `/extended/graph` instead.                                                            |

### ECharts extended (new group)

All six pages are new — no content to lift, no Carbon Charts equivalent. Each
renders a single ECharts panel with an Overview tab authored from scratch, and
a banner: _"This chart type has no Carbon Charts equivalent. Styled with
`@carbon/echarts-theme`."_

| Route                   | Chart                |
| ----------------------- | -------------------- |
| `/extended/sunburst`    | Sunburst             |
| `/extended/graph`       | Graph (network)      |
| `/extended/funnel`      | Funnel               |
| `/extended/parallel`    | Parallel coordinates |
| `/extended/theme-river` | Theme River          |
| `/extended/candlestick` | Candlestick (OHLC)   |

---

## 4. Content that lifts verbatim

These sections can be copy-pasted from the current site into MDX files with
only cosmetic edits (swap import paths, update component names):

- **Color palette page** — entire Overview, all four palette-type descriptions
  (categorical, sequential, diverging, alert), and IBM Design Language colour
  swatches.
- **Axes page** — "Single vs. Dual" and "Logarithmic scale" design guidance.
- **Dashboards page** — layout principles and CSS grid examples are entirely
  framework-agnostic.
- **Legends / Tooltips pages** — position, visibility, and grouping guidance.
- **Chart type Overview tabs** — "when to use", anatomy descriptions,
  dos/don'ts for Bar, Line, Area, Scatter, Donut, Gauge, Heatmap, Treemap,
  Radar, Boxplot, Histogram, Combo, Lollipop, Alluvial, Tree. This guidance is
  about charts, not the library.
- **Introduction chart-type grid** — the Comparisons / Trends / Part-to-whole
  / Correlations / Connections / Geospatial taxonomy is IBM data-vis IA and
  lifts without change.

---

## 5. What cannot be lifted

- **Live chart components** — all rendered demos are Carbon Charts components;
  every demo must be rebuilt as an ECharts instance with the Carbon theme.
- **StackBlitz links** — all current links point to Carbon Charts projects;
  replace with ECharts equivalents per chart type.
- **Framework tabs on chart pages** — current site tabs are JavaScript /
  Svelte / React / Vue / Angular. New site shows adapter-agnostic ECharts
  snippets with brief per-framework wiring notes in the Code tab.
- **API, event system, analytics, highlights, thresholds, locales, truncation**
  — all Carbon Charts library internals with no theme-scope equivalent.
- **Site tech stack** — current site is a Svelte SPA on Netlify. New site is
  Vite + React on GitHub Pages; same visual shell, different runtime.

---

## 6. IBM web platform requirements

Both items are mandatory for any IBM-hosted site and must be treated as
non-negotiable launch blockers — not post-launch polish.

### `digitalData` object

IBM's analytics and consent infrastructure requires a `window.digitalData`
object to be present in the page **before `ibm-common.js` executes**. It must
be set as an inline `<script>` in `index.html` — the first script in `<head>`
— so it is available on first parse, before any JavaScript bundle loads.

```html
<!-- index.html — first <script> in <head> -->
<script>
  window.digitalData = {
    page: {
      category: { primaryCategory: 'IBM_DESIGN_SYSTEMS' },
      pageInfo: {
        ibm: {
          siteID: 'CARBON_CHARTS_ECHARTS',
          country: 'US',
          language: 'en',
          owner: 'Carbon Design System',
        },
      },
    },
  }
</script>
```

The `siteID` must be registered with IBM's Digital Analytics team before GA.
Use `CARBON_CHARTS_ECHARTS_DEV` during development.

### `ibm-common.js`

Loaded immediately after the `digitalData` inline script, using the
IBM-maintained canonical URL. Must not be self-hosted or pinned to a versioned
path.

```html
<!-- index.html — after digitalData, in <head> -->
<script src="//1.www.s81c.com/common/stats/ibm-common.js" defer></script>
```

`ibm-common.js` provides analytics event capture, the consent/cookie
management layer, and the Cookie Preferences modal trigger. The `defer`
attribute ensures it does not block page render.

### IBM footer component

Every page must render the IBM mandatory footer — matching the footer on
`charts.carbondesignsystem.com`: Contact IBM, Privacy, Terms of use,
Accessibility, and the Cookie Preferences modal trigger.

Use `@carbon/ibmdotcom-web-components` (`<c4d-footer>`) wrapped in a thin
React component (`IbmFooter.tsx`). Mount it once in the root layout, outside
the router outlet, so it appears on every route without re-mounting on
navigation. `ibm-common.js` wires the Cookie Preferences modal automatically
when it detects the `id="teconsent"` element rendered inside `<c4d-footer>`.

### What the current site already provides (lifts directly)

The current site's footer HTML and link set (`/contact`, `/privacy`, `/legal`,
`/able`) plus the cookie consent banner are already correct. Use them as the
reference implementation — the IBM footer component reproduces this exactly.

---

## 7. Summary

| Disposition              | Pages  |
| ------------------------ | ------ |
| ✅ Lift                  | 20     |
| 🔄 Adapt                 | 8      |
| ❌ Drop                  | 9      |
| 🆕 New                   | 6      |
| **Total new site pages** | **34** |

### IBM platform checklist

- [ ] `window.digitalData` inline script is the first `<script>` in `<head>`
- [ ] `siteID` registered with IBM Digital Analytics before GA
- [ ] `ibm-common.js` loaded from `//1.www.s81c.com/common/stats/ibm-common.js` (not self-hosted)
- [ ] IBM footer renders on every route
- [ ] Cookie Preferences modal trigger present and functional
- [ ] Footer links match current site: Contact IBM, Privacy, Terms of use, Accessibility

~65 % of the current site's content can be lifted directly into MDX files. The
shell, nav structure, hero layout, tab pattern, and all IBM data-vis design
guidance (palettes, axes, legends, tooltips, dashboards) are completely
reusable. The only work that cannot be lifted is the live chart components,
StackBlitz links, and Carbon Charts–specific API/options pages.
