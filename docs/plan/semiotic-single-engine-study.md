# Semiotic as the single engine — study

**Status:** Study — findings only, no decision taken
**Target:** Carbon v12 (light and dark themes only)
**Last updated:** November 2026

---

## 1. Question

Leadership asked about Semiotic. Could Semiotic replace Apache ECharts as the one engine behind the Carbon helper packages (theme, toolbar, presets), instead of Carbon supporting two engines?

This study measures Semiotic v3.13.3 against what this repo ships today. It does not recommend a visual-design verdict: only the simple bar was ever compared visually (§6).

---

## 2. Verdict

**Not as a drop-in single engine today.** Semiotic covers most chart families and is stronger on accessibility, but these block it from replacing ECharts for this repo:

1. It is React-only. ECharts is framework-agnostic, which ADR 0001 names as the deciding factor. Carbon Charts ships React, Angular, Vue and Svelte wrappers.
2. Three charts that exist in **both** Carbon Charts and ECharts have no Semiotic equivalent: lollipop, meter and wordcloud (§4). Adopters moving from Carbon Charts would lose them.
3. Its own README points to ECharts for million-point datasets.
4. Its adoption is about 800 times smaller than ECharts (§3), with two npm maintainers.

Semiotic also does two things better than ECharts: it has a native circle-pack and a bullet recipe, both of which Carbon Charts has and ECharts lacks (§4).

It is a reasonable **second engine** or a reasonable **single engine for a React-only product**. Those are different decisions; §8 lists what each would take.

---

## 3. Project health

| Fact                  | Semiotic                                                        | ECharts            | `@carbon/charts` (d3)                                                               |
| --------------------- | --------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| npm downloads, 1 week | 11,560                                                          | 9,342,306          | 109,721                                                                             |
| First published       | 2017-04                                                         | 2015-07            | 2018-08                                                                             |
| npm last modified     | 2026-10-29                                                      | 2026-05-19         | 2026-10-29                                                                          |
| Versions published    | 288                                                             | 117                | 606                                                                                 |
| Latest version        | 3.13.3                                                          | 6.1.0              | 1.27.25                                                                             |
| Licence               | Apache-2.0                                                      | Apache-2.0         | Apache-2.0                                                                          |
| Frameworks            | React 18.1+ / 19 only                                           | Any                | Any (React, Angular, Vue, Svelte wrappers)                                          |
| Runtime dependencies  | d3 sub-modules (d3-geo, d3-zoom, d3-force, d3-scale and others) | `tslib`, `zrender` | `d3`, `d3-cloud`, `d3-sankey`, `lodash-es`, `dompurify`, `html-to-image` and others |
| npm maintainers       | 2                                                               | not obtained       | not obtained                                                                        |

"npm last modified" is the registry's `time.modified`, which can differ from the last release date.

Not obtained: GitHub stars, open issues, contributor count. The GitHub API was rate-limited during the study. Re-check before relying on any health claim.

Semiotic's own README says that for GPU-accelerated rendering of millions of points, ECharts handles that scale. Semiotic positions itself for projects that outgrow Recharts and ECharts for coordinated views.

---

## 4. Chart coverage

All three engines are compared for every chart in this repo's site.

How each column was determined:

- **Carbon Charts (d3):** the chart class is exported from `packages/core/src/index.ts` in `/Users/amalkjoy/Projects/carbonCharts`. "Yes" means exported. It was not run.
- **ECharts (this repo):** a preset in `packages/theme/src/presets/` or a page in `packages/site/src/charts/` uses a native ECharts series type. "Workaround" means the page itself says there is no native series and shows a composition. It was not re-rendered in this study.
- **Semiotic:** "Rendered" means a server-side render of the component with tiny sample data produced an `<svg>` without throwing. It does not mean it looks right or matches Carbon Charts. "Docs" means the component or recipe is named in Semiotic's `ai/reference.md` or type files and was not rendered.

### 4.1 Charts on the Carbon Charts parity pages

| Chart       | Carbon Charts            | ECharts (this repo)                                                   | Semiotic                                                  | Semiotic rating                              |
| ----------- | ------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------- |
| Bar simple  | Yes                      | Yes (`bar`)                                                           | `BarChart`, rendered, site page                           | Covered                                      |
| Bar grouped | Yes                      | Yes (`bar`)                                                           | `GroupedBarChart`, rendered                               | Covered                                      |
| Bar stacked | Yes                      | Yes (`bar`)                                                           | `StackedBarChart`, rendered                               | Covered                                      |
| Boxplot     | Yes                      | Yes (`boxplot`)                                                       | `BoxPlot`, rendered                                       | Covered                                      |
| Histogram   | Yes                      | Yes (`bar` series, binning done in the preset)                        | `Histogram`, rendered                                     | Covered                                      |
| Pie         | Yes                      | Yes (`pie`)                                                           | `PieChart`, rendered                                      | Covered                                      |
| Donut       | Yes                      | Yes (`pie` with radius)                                               | `DonutChart`, rendered                                    | Covered                                      |
| Gauge       | Yes                      | Yes (`gauge`)                                                         | `GaugeChart`, rendered                                    | Covered                                      |
| Radar       | Yes                      | Yes (`radar`)                                                         | `RadarChart`, rendered                                    | Covered                                      |
| Line        | Yes                      | Yes (`line`)                                                          | `LineChart`, rendered                                     | Covered                                      |
| Area        | Yes (area, stacked area) | Yes (`line` with area)                                                | `AreaChart`, `StackedAreaChart`, rendered                 | Covered                                      |
| Scatter     | Yes                      | Yes (`scatter`)                                                       | `Scatterplot`, rendered                                   | Covered                                      |
| Bubble      | Yes                      | Yes (`scatter` with size)                                             | `BubbleChart`, rendered                                   | Covered                                      |
| Heatmap     | Yes                      | Yes (`heatmap`)                                                       | `Heatmap`, rendered                                       | Covered                                      |
| Treemap     | Yes                      | Yes (`treemap`)                                                       | `Treemap`, rendered                                       | Covered                                      |
| Circle pack | Yes                      | **No.** Page is a stub; no native series                              | `CirclePack`, rendered                                    | Covered                                      |
| Tree        | Yes                      | Yes (`tree`)                                                          | `TreeDiagram`, rendered                                   | Covered                                      |
| Choropleth  | Yes                      | Yes (`map`, needs `registerMap`)                                      | `ChoroplethMap` (`semiotic/geo`), docs only               | Likely covered                               |
| Combo       | Yes                      | Yes (bar, line, scatter mixed in one option)                          | `MultiAxisLineChart`, rendered; two y-axes, lines only    | Partial: no bar + line mix found             |
| Alluvial    | Yes                      | Yes (`sankey`)                                                        | `SankeyDiagram`, `ProcessSankey`; Sankey rendered         | Partial: Sankey is not alluvial; not checked |
| Bullet      | Yes                      | **No.** Page is a stub; workaround is `bar` + `markLine` + `markArea` | `bulletLayout` recipe via `OrdinalCustomChart`, docs only | Partial: recipe, not a component             |
| Meter       | Yes                      | Yes (`bar`-based preset `createMeterOptions`)                         | None found                                                | **Missing**                                  |
| Lollipop    | Yes                      | Yes (`scatter` + `bar` preset)                                        | None found; `DotPlot` is close but not the same           | **Missing**                                  |
| Wordcloud   | Yes                      | Yes, but needs the separate `echarts-wordcloud` extension             | None found; `wordTrailsLayout` is a different chart       | **Missing**                                  |

The site navigation lists Wordcloud under "ECharts only", but Carbon Charts does export a `WordCloudChart`. That label looks wrong; it was not changed here.

### 4.2 Extra charts on the site

Carbon Charts has none of these. They are in the repo because ECharts provides them.

| Chart           | Carbon Charts | ECharts (this repo)         | Semiotic                                                                                                     | Semiotic rating                                  |
| --------------- | ------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Candlestick     | No            | Yes (`candlestick`)         | `CandlestickChart`, rendered                                                                                 | Covered                                          |
| Funnel          | No            | Yes (`funnel`)              | `FunnelChart`, rendered                                                                                      | Covered                                          |
| Graph / network | No            | Yes (`graph`)               | `ForceDirectedGraph`, rendered                                                                               | Covered                                          |
| ThemeRiver      | No            | Yes (`themeRiver`)          | `StackedAreaChart baseline="wiggle"` (streamgraph), rendered                                                 | Partial: similar shape, not the same interaction |
| Gantt           | No            | Workaround (floating `bar`) | `packIntervals` / `intervalLanesLayout` recipe, docs only                                                    | Partial: layout helper, not a component          |
| Parallel        | No            | Yes (`parallel`)            | `parallelCoordinatesLayout` recipe via `OrdinalCustomChart`, docs only                                       | Partial: recipe                                  |
| Sunburst        | No            | Yes (`sunburst`)            | No component by that name. `TreeDiagram layout="partition"` renders, but I did not check that it draws rings | Unconfirmed                                      |

### 4.3 Count

31 rows: 24 in §4.1 (bar counted as three) and 7 in §4.2.

| Semiotic rating | Rows | Which                                                |
| --------------- | ---- | ---------------------------------------------------- |
| Covered         | 20   | 17 in §4.1, 3 in §4.2                                |
| Likely covered  | 1    | Choropleth (docs only)                               |
| Partial         | 6    | Combo, alluvial, bullet, ThemeRiver, gantt, parallel |
| Missing         | 3    | Meter, lollipop, wordcloud                           |
| Unconfirmed     | 1    | Sunburst                                             |

Reading across engines:

- **Parity with Carbon Charts.** Of the 24 Carbon Charts rows, ECharts lacks 2 natively (circle pack, bullet) and needs an extension for 1 (wordcloud). Semiotic lacks 3 (meter, lollipop, wordcloud) and only partly covers 3 more (combo, alluvial, bullet).
- **Where Semiotic is ahead of ECharts.** Circle pack, and bullet as a recipe.
- **Where ECharts is ahead of Semiotic.** Meter, lollipop, wordcloud (via extension), a true combo, and the extended charts (sunburst, gantt and parallel as ready presets or pages).
- Partial and missing rows would need custom work through `OrdinalCustomChart` or `XYCustomChart`, or would be dropped.

---

## 5. Theme and Carbon fit

Semiotic already ships `carbon` and `carbon-dark` theme presets and exports `CARBON_CATEGORICAL_14` and `CARBON_ALERT`. Compared with `@carbon/echarts-theme`:

| Item                              | `carbon` vs `tokens.white`       | `carbon-dark` vs `tokens.g100`   |
| --------------------------------- | -------------------------------- | -------------------------------- |
| background, text, grid, primary   | identical                        | identical (plus surface)         |
| border                            | differs (`#e0e0e0` vs `#c6c6c6`) | differs (`#393939` vs `#525252`) |
| surface                           | differs (`#ffffff` vs `#f4f4f4`) | identical                        |
| textSecondary                     | identical                        | differs (`#a8a8a8` vs `#c6c6c6`) |
| categorical colours (4 in preset) | all 4 match                      | 2 of 4 match                     |

**Scope: Carbon v12.** The team has said these helpers are planned for the next Carbon version (v12), which supports only a light and a dark theme. This repo still ships four (`white`, `g10`, `g90`, `g100`). For v12 the comparison that matters is light vs dark, and Semiotic already ships exactly those two presets, so the missing g10 / g90 equivalents are not a gap for the target. I am assuming v12 light maps to `white` and v12 dark maps to `g100`; if v12 defines its own light and dark tokens, the table above must be redone against them.

### 5.1 How the two theming mechanisms differ

Both engines read the same Carbon tokens and palettes. What differs is how each engine receives them and how much of the Carbon look the theme can carry.

| Aspect                      | ECharts theme                                                                                                                                      | Semiotic theme                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Mechanism                   | Global registry: `registerTheme`, then `echarts.init(el, 'carbon-g100')`                                                                           | React context: `<ThemeProvider theme={...}>`                                             |
| Framework support           | Any                                                                                                                                                | React only                                                                               |
| Switching theme at runtime  | Dispose and re-`init` the chart                                                                                                                    | Pass a new theme object; the provider re-renders                                         |
| Scoping                     | Per chart, at `init`                                                                                                                               | Per subtree, through the provider                                                        |
| Partial overrides           | Deep-merge the option yourself                                                                                                                     | `SemioticThemeUpdate` makes every section optional                                       |
| Accessibility slots         | None                                                                                                                                               | `accessibility.colorBlindSafe` and `highContrast` exist in the type; not tested          |
| Where the Carbon look lives | Mostly in the theme (about 25 series and component types)                                                                                          | Colours, fonts and tooltip chrome in the theme; everything else in each chart's props    |
| Chart-specific styling      | In the theme: legend icon, `bar.barMaxWidth: 48`, axis and split lines, tooltip shadow, pie gaps, sankey, funnel, candlestick, dataZoom, visualMap | No slot. Set per chart through props, `styleRules` or `frameProps`                       |
| Sequential palettes         | `visualMap.inRange.color` takes Carbon's ramps directly                                                                                            | `colors.sequential` takes a d3 scheme name (`'blues'`); Carbon ramps cannot pass through |

For a single-engine decision this means:

- **Semiotic's mechanism is better** for runtime switching, subtree scoping, partial updates, built-in accessibility slots and a small surface to maintain.
- **ECharts' mechanism is better** for fidelity to Carbon Charts with little per-chart work, wide series coverage, framework independence and palettes that fit.

### 5.2 What the Semiotic theme cannot express

The theme has slots for colours, typography and tooltip chrome. Filling every slot that has a Carbon value (status colours, legend and title fonts, tooltip shadow, cell border) changed nothing visible on a bar chart: a server render with the old and new theme gave identical bar rectangles, fonts and sizes. The only difference was one CSS variable, `--semiotic-cell-border`, which affects cell-based charts such as heatmaps and treemaps.

These differences cannot be fixed through the theme:

- **Bar width.** Semiotic's `barPadding` is a fixed pixel gap, not a ratio. Measured with 5 bars: bar width was 79% of its band at a 400 px chart, 89% at 600, 93% at 900 and 96% at 1500. ECharts uses a proportional gap (default 20%) and the Carbon theme caps bars at 48 px. No `BarChart` prop or theme key sets a maximum bar width; none was found in Semiotic's type definitions. A fixed `barPadding` that matched ECharts at one chart width was tried and rejected, because it only matches at that width.
- **Axis line, tick and grid styling.** Only the single `grid` and `border` colours.
- **Legend icon shape.** No slot.
- **Per-series defaults** such as sankey, funnel, candlestick and dataZoom. No equivalent.

### 5.3 Responsiveness

Semiotic defaults to `width: 600` and `responsiveWidth: false`, so a chart stays 600 px wide whatever its container is. ECharts charts resize with their container. With `responsiveWidth: true`, a jsdom render with a mocked container and `ResizeObserver` followed the container (1000 px container: 1000 px chart; 500 px: 500 px). Not checked in a real browser.

---

## 6. What was and was not verified

Verified:

- **Bar and Line Charts in browser:** Rendered side-by-side with ECharts across all standard variations in the demo site, with Carbon toolbar integration (table modal, CSV export, fullscreen).
- **Categorical Coordinate Mapping:** Validated automatic category indexing (`0..N-1`) for continuous XY LineChart.
- **Tick Rotation:** Verified that `axes[bottom].autoRotate = true` triggers responsive `-45°` rotation on collision.
- **Legend Isolation:** Verified Semiotic's `legendInteraction: 'isolate'` focus-plus-context interaction (swatch click isolates series and dims non-isolated series to 30%).
- **Theme and Toolbar Parity:** Carbon theme tokens (`ThemeProvider`) and table generation (`createBarTableData`, `createLineTableData`) verified across light and dark themes.
- **23 other Semiotic components** render server-side without error (§4).
- Bundle size, measured with esbuild, minified, React external:

| Bundle                                | Min     | Gzip   |
| ------------------------------------- | ------- | ------ |
| Semiotic `BarChart` + `ThemeProvider` | 387 KB  | 131 KB |
| ECharts bar + canvas, tree-shaken     | 519 KB  | 177 KB |
| Whole Semiotic                        | 1408 KB | 463 KB |
| Whole ECharts                         | 1115 KB | 375 KB |

Not verified:

- Anything in a real browser: toolbar buttons, fullscreen, PNG/JPG export, hover, legends, visual match with Carbon Charts.
- How far Semiotic's `frameProps` and `styleRules` reach for the styling the theme cannot express (§5.2).
- The `accessibility.colorBlindSafe` and `highContrast` theme slots.
- Accessibility behaviour. Semiotic ships a Chart Access Contract (`semiotic/access`), keyboard navigation, an accessible data table, a skip link, and `summary` / `description` props. The ECharts presets in this repo have no aria configuration. No screen reader or automated audit was run on either.
- Large-data behaviour. Only Semiotic's own statement was used.
- Choropleth, bullet, gantt, parallel, alluvial and sunburst on the Semiotic side.
- The Carbon Charts and ECharts columns in §4 were read from source and exports, not re-run in this study.

---

## 7. Cost of switching

| Area                | Impact                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Theme design data   | Reusable as is (`tokens`, `palettes`, `skeleton`, `pickColors`).                                                                         |
| Theme ECharts parts | `themes/factory.ts`, `registerCarbonThemes` and 20 preset files (about 4,900 lines with helpers) would be rewritten as Semiotic presets. |
| Semiotic parts      | Each chart type needs its own preset and table builder, and the styling the theme cannot express (§5.2) has to be set in each preset.    |
| Toolbar             | Already engine-neutral through `ChartSource`. The ECharts table extractor (1,081 lines) would be replaced by per-chart table builders.   |
| Site                | About 60 files in the site package reference the theme package. Every chart page changes.                                                |
| Adopters            | Anyone not on React is cut off. Carbon Charts currently ships React, Angular, Vue and Svelte wrappers.                                   |
| Governance          | A two-maintainer project replaces an Apache top-level project that has about 9.3M weekly downloads.                                      |

---

## 8. Options

| Option                                          | What it takes                                                                                                      | Main risk                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| A. ECharts only (today)                         | Nothing new.                                                                                                       | Leadership interest in Semiotic goes unanswered.                                              |
| B. ECharts primary, Semiotic as a second engine | Phase 1 of the engine-neutral proposal, then Semiotic presets for the charts that are covered.                     | Two sets of presets to maintain; a team that has said it has little capacity for maintenance. |
| C. Semiotic only                                | Rewrite all presets, drop or hand-build 3 missing and 6 partial charts (1 more is unconfirmed), accept React-only. | Framework lock-out, coverage gaps, small-project dependency.                                  |

Option B limits Carbon's commitment if Semiotic presets are published for a small set of charts and marked as such. That is a scope decision for the team, not a technical one.

---

## 9. What would change this verdict

- Semiotic adds framework-neutral rendering, or Carbon decides React-only is acceptable for the helpers.
- The missing charts (meter, lollipop, wordcloud) are not needed by adopters.
- Browser checks show visual, hover and export parity.
- GitHub activity (issues, contributors, release cadence) shows a healthier bus factor than two npm maintainers suggest.

---

## 10. Next steps if the team wants to go further

1. Fetch the GitHub health data that was rate-limited (§3).
2. Render the partial and missing charts in the site package in a browser: choropleth, bullet, alluvial, meter, ThemeRiver, gantt, parallel.
3. Run an accessibility check on the Semiotic bar and the ECharts bar with the same tool.
4. Test a large dataset (100k+ points) on one Semiotic XY chart and the equivalent ECharts chart.
5. Decide between options A, B and C, and record it as an ADR. ADR 0001 also needs a correction (it says `@carbon/charts` migrated to ECharts; it is a d3 library).

---

## 11. Related

[`engine-neutral-proposal.md`](./engine-neutral-proposal.md) covers option B: benefits, costs, risks and naming. [`engine-neutral-implementation.md`](./engine-neutral-implementation.md) holds the package layout, work list and the files involved.
