# Engine-neutral packages — implementation

**Status:** In progress (Phase 1 partly done)
**Last updated:** November 2026

This document holds the implementation detail for the approach described in [`engine-neutral-proposal.md`](./engine-neutral-proposal.md). Read the proposal first for the what, the benefits, the costs and the risks. This document covers how it is built, what is done, and what is left.

---

## 1. Where the packages are coupled to ECharts today

| Layer                                                          | ECharts-coupled?                                        |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| Design data: tokens, palettes, font constants                  | No                                                      |
| Data shaping: colour picking, grouping, the flat data type     | Logic no; some output types are named as ECharts series |
| Skeleton loader                                                | No                                                      |
| ECharts theme and 20 presets (about 4,900 lines)               | Yes                                                     |
| Toolbar UI, CSS, fullscreen, table modal, CSV and image export | No, once the toolbar takes a neutral chart source       |
| Toolbar table extraction (about 1,080 lines)                   | Yes: it reads an ECharts `option`                       |

Runtime ECharts imports are minimal: one preset imports a value from `echarts/core`, and everything else is a type import.

---

## 2. Proof of concept so far

Enough has been built to show the approach works. It covers one chart type (simple bar) plus the line chart variations.

- **Toolbar** accepts an ECharts instance **or** a small neutral "chart source" with three methods: table data, optional native image, optional SVG. Existing ECharts usage is unchanged.
- **Theme package** has a Semiotic entry with a Carbon-to-Semiotic theme mapper and bar and line presets, plus matching table builders for the toolbar. It has no `semiotic` dependency.
- **Shared helpers** (colour picking, grouping, the flat data type) are exported from the neutral root.
- **Site** has side-by-side Semiotic and ECharts bar and line pages, both themed from the same tokens and both using the same toolbar.

It was checked with unit tests, typechecks, builds and server-side renders, and verified on the local dev server.

---

## 3. Target layout

Package names follow the proposal: `@carbon/charts-theme` and `@carbon/charts-toolbar` after the Phase 2 rename (they are `@carbon/echarts-theme` and `@carbon/echarts-toolbar` until then).

```
theme package (@carbon/charts-theme)
  .          tokens, palettes, colour picking, grouping, flat data type,
             font constants, skeleton                        engine-neutral, no engine imports
  ./echarts  Carbon ECharts themes, registration helper,
             ECharts presets                                 peer: echarts (optional)
  ./semiotic Semiotic theme mapper, Semiotic presets         no semiotic dependency

toolbar package (@carbon/charts-toolbar)
  .          chart-source interface, SVG source helper,
             fullscreen, CSV and image export, table type    engine-neutral
  ./vanilla  toolbar UI
  ./styles   CSS
  ./echarts  ECharts adapter and table extractors            peer: echarts (optional)
```

Adopter experience: one import path per engine.

```tsx
// ECharts
import { registerCarbonThemes, createBarOptions } from '@carbon/charts-theme/echarts'
// Semiotic
import { createSemioticTheme, createBarProps } from '@carbon/charts-theme/semiotic'
```

The adopter installs only the engine they use, and sets no colours, fonts or axis options themselves.

### No Semiotic dependency

A Semiotic theme is a plain object, so the theme package declares its own matching type instead of importing `semiotic`. The site package, which does depend on Semiotic, checks at compile time that the two stay compatible. The ECharts side already works the same way.

---

## 4. Shared vs per-engine pieces

| Piece                                                           | Shared or per engine |
| --------------------------------------------------------------- | -------------------- |
| Tokens, palettes, colour picking, data transform, skeleton      | Shared               |
| Toolbar UI, CSS, fullscreen, CSV and image export, chart source | Shared               |
| Theme mapping (Carbon tokens to the engine's theme format)      | Per engine           |
| Presets (Carbon chart object to ready-to-use engine config)     | Per engine           |
| Toolbar adapter (engine chart to chart source)                  | Per engine           |

Colours come from the shared colour picking, so a bar chart gets the same colours in either engine without the presets knowing about each other.

### Preset contract

Same contract as the ECharts presets, different output:

```ts
createBarOptions(rows, opts) // ECharts: returns an EChartsOption
createBarProps(rows, opts) // Semiotic: returns props for <BarChart>
```

Input is the Carbon flat format (`{ group, value }` rows plus options such as title, axis labels, orientation and per-group colours). The output is something the adopter spreads into the engine's own component, so the adopter keeps ownership of rendering.

Each Semiotic preset ships with:

- the preset itself, written for one chart type;
- a table builder for the toolbar, because the ECharts extractors read an ECharts `option`;
- unit tests;
- a visual-parity check against Carbon Charts.

---

## 5. What building the Bar and Line presets showed

These affect how much each Semiotic preset has to carry, and highlight key engine differences.

- **The Semiotic theme is small, so presets carry more.** Its theme covers colours, typography and tooltip chrome. Bar width, legend icon, axis and grid styling and per-series defaults have no theme slot, so they are set per chart in the preset or left at Semiotic's defaults. The ECharts theme carries these.
- **Categorical coordinate index mapping (XY vs ordinal).** Semiotic's `LineChart` is continuous XY (`StreamXYFrame`), which expects numerical or Date X coordinates. Passing raw discrete category strings (`'Qty'`, `'More'`, `'Sold'`) coerces them to `NaN`. The preset detects discrete category keys, maps them to `0..N-1` coordinate indices, pins `xExtent: [0, N-1]`, and applies formatted tick labels with `xFormat: (v) => categories[Math.round(v)]`.
- **Tick rotation (`axisLabelRotate`).**
  - ECharts: unconditional rotation (`xAxis.axisLabel.rotate: -45`) forces tick labels to an exact angle regardless of viewport width.
  - Semiotic: responsive, collision-aware auto-rotation (`axes[bottom].autoRotate = true`). Labels rotate to `-45°` when they collide at narrower viewports and stay horizontal when there is room.
- **Label truncation and overflow.**
  - ECharts: declarative truncation (`axisLabel.overflow: 'truncate'`, `width: 80`) with an ellipsis.
  - Semiotic: evaluates tick label bounding boxes against the pixel distance between ticks. Overlapping labels are dropped, or full labels are formatted via `xFormat` / custom SVG `tickFormat`.
- **Legend selection vs focus-and-context isolation.**
  - ECharts / Carbon Charts: declarative initial series visibility via `legend: { selected: { ... } }` / `selectedGroups`. Unselected series are hidden from the plot and their legend swatches start deselected. Clicking toggles full show/hide.
  - Semiotic: built around focus-plus-context. `legendInteraction: 'isolate'` shows all series initially and lets the user click to isolate series, with checkmark indicators and non-isolated series dimmed to 30% opacity. Semiotic's component state does not expose an initial selection filter prop.
- **Per-chart internationalisation (e.g. French locale).**
  - ECharts: global browser locale only (`echarts.registerLocale`); no per-chart locale.
  - Semiotic: accepts standard JavaScript / D3 formatters (`xFormat`, `yFormat`, `valueFormat`), so per-chart `Intl.DateTimeFormat` or custom locale formatters work.
- **Dual-axis charts.**
  - ECharts: secondary Y-axes on the same `LineChart` instance via `yAxis: [ { ... }, { ... } ]` and `yAxisIndex: 1`.
  - Semiotic: requires the distinct `MultiAxisLineChart` component rather than spreading into `LineChart`.
- **Bar width cannot be matched through props.** Semiotic spaces bars with a fixed pixel gap, while ECharts uses a proportional gap with a 48 px cap. No maximum bar width was found in Semiotic's types.
- **Responsive by choice.** Semiotic charts are a fixed 600 px wide unless told to follow their container. The preset turns on `responsiveWidth` unless the caller sets an explicit width.
- **Sequential palettes do not fit the theme.** Semiotic's theme takes a d3 scheme name, not a colour array, so Carbon's sequential ramps cannot go through it.
- **Dark mode is set in two places:** the theme's mode, and the theme key passed to the preset, which picks the right palette.
- **Known gap.** The Semiotic bar preset drops floating `[base, end]` values and nulls today.

---

## 6. Work, in order

Sizes are relative (S/M/L), not time estimates.

### Phase 1 — non-breaking, no rename

| #   | Change                                                                                                                  | Size   | Status                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| 1   | Neutral chart source in the toolbar                                                                                     | —      | Done                                                 |
| 2   | Export the shared helpers from the theme root, and add a test that the built root entry has no `echarts` import         | S      | Exports done; automated test not written             |
| 3   | Make `echarts` an optional peer dependency in both packages, and note it in the READMEs                                 | S      | Not done                                             |
| 4   | Add the `./semiotic` entry to the theme package: theme mapper, bar preset and table builder, with no `semiotic` dep     | M      | Done                                                 |
| 5   | Compile-time compatibility check against Semiotic's types, and use the new entry in the site                            | S      | Done                                                 |
| 6   | Add a `./echarts` entry to the toolbar (adapter and extractors), keeping the current root exports as deprecated aliases | S      | Not done                                             |
| 7   | Fill the Semiotic theme slots that have a Carbon value: status colours, legend and title fonts, tooltip shadow          | S      | Done                                                 |
| 8   | Record the decision as an ADR, and correct ADR 0001's claim that `@carbon/charts` migrated to ECharts (it is d3)        | S      | Not done                                             |
| 9   | Write further Semiotic presets one chart type at a time (line and donut first), each with tests and a table builder     | M each | Bar and Line done (all 14 line variations showcased) |

### Phase 2 — rename and breaking moves; only if Semiotic is offered (0.x minor bump)

| #   | Change                                                                                                                                                                                                        | Size |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 10  | Get approval for `@carbon/charts-theme` and `@carbon/charts-toolbar` (proposal Q3)                                                                                                                            | —    |
| 11  | Move ECharts exports out of the theme root into `./echarts`; remove the deprecated root aliases in both packages                                                                                              | M    |
| 12  | Rename to `@carbon/charts-theme` / `@carbon/charts-toolbar`; update references, release configuration, workflows and telemetry; publish; deprecate the old `@carbon/echarts-*` names pointing to the new ones | M    |
| 13  | Add commit scopes for any new package or component                                                                                                                                                            | S    |

---

## 7. What a rename touches

Only relevant if Phase 2 goes ahead.

- About 96 files reference `@carbon/echarts-theme` (63 of them in the site) and 23 reference `@carbon/echarts-toolbar`.
- About 12 files use the `carbon-echarts-theme` repo and PR-title strings: release configuration, workflows and issue templates. The GitHub repo name is a separate decision.
- Release configuration keeps its component names (`theme`, `toolbar`), so existing tags and commit scopes stay valid.
- IBM telemetry registers a `projectId` per project. The owners need to confirm whether it carries over.
- npm: publish under the new names and deprecate the old ones, optionally with a final release that re-exports the new names.
- READMEs and npm descriptions of the new packages state that they are the helpers for the replacement model and not extensions of the d3 `@carbon/charts`, because the prefix is shared (see the proposal's naming trade-off).
- The version number can continue or reset. Who installs the current packages has not been checked.

---

## 8. Verification still to do

- Add the automated test that the built theme root entry has no `echarts` import (item 2).
- Cross-browser check of the Semiotic bar and line pages; so far they have been verified on the local dev server only.
- Visual-parity check of each Semiotic preset against Carbon Charts.
- Test canvas-rendered Semiotic charts with the toolbar's image export (proposal Q6).

---

## 9. Related

- [`engine-neutral-proposal.md`](./engine-neutral-proposal.md): the proposal, benefits, costs, risks and open questions.
- [`semiotic-single-engine-study.md`](./semiotic-single-engine-study.md): ECharts vs Semiotic as a single engine, including the chart coverage table.
