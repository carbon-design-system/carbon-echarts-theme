# Chart Parity Gap Analysis

> **Status:** Updated after first-pass implementation. All presets, data files, and page wiring completed in first pass. Remaining items are visual-verification gaps and one minor slot mismatch (now fixed).  
> Companion to [`docs/07-parity-plan.md`](./07-parity-plan.md) (architectural decisions).  
> **Use this as the working checklist before merging any chart work.** Close every ⚠️ before declaring a chart type done.

---

## How to Work Against This Doc

Every chart fix follows the same loop — no shortcuts:

1. **Match the data first.** The ECharts data file must use the exact same values as Carbon's `data/carboncharts/<chart>.ts` for the corresponding example. Check field names, ranges, and counts row-by-row.
2. **Match the palette.** Color assignments must come from `pickColors()` in `presets/_transform.ts`, which already implements Carbon's N-optimised palettes. Never hardcode hex strings in a preset or data file. If a variant needs a different palette (e.g. monochrome, custom user colors), expose a typed option param that feeds `pickColors` or `palettesLight/Dark`.
3. **Fix in the preset, not the data file or page.** All structural logic (axis setup, series shape, color application, bar width, stack keys) lives in `packages/theme/src/presets/`. The site data files (`data/echarts/*.ts`) only call preset functions with data. The site page files only import from the data file. This separation keeps the theme package independently usable.
4. **Screenshot every pair before and after.** Use Chrome DevTools `take_screenshot` at each `SideBySide` comparison block. Both left (Carbon) and right (ECharts) must be visible in the same frame. Document any remaining delta as a known gap.
5. **Call out ECharts feature gaps explicitly.** Where Carbon Charts has a feature ECharts cannot replicate natively (see Section 2), document the gap and agreed workaround — do not silently drop the feature.

---

## Legend

| Symbol | Meaning                                                                   |
| ------ | ------------------------------------------------------------------------- |
| ✅     | Correct — real, distinct, visually verified ECharts option                |
| ⚠️     | Visual mismatch or wrong/reused option — needs fixing                     |
| ➕     | Missing — no ECharts data, preset support, or page wiring exists          |
| 🚫     | N/A — no Carbon Charts equivalent; extended-only page                     |
| 🔶     | ECharts limitation documented — no equivalent feature, workaround applied |

---

## Summary

| Status                                                           | Count                  |
| ---------------------------------------------------------------- | ---------------------- |
| ✅ Preset + data + wiring complete (visual verification pending) | 15                     |
| ⚠️ Partial (minor slot or visual issues remaining)               | 2                      |
| 🔶 ECharts limitation — stub or workaround in place              | 3                      |
| 🚫 N/A — extended only                                           | 6                      |
| **Total chart types**                                            | **25 + 1 (wordcloud)** |

> **Note:** "Visual verification pending" means preset logic, data, and page wiring are all complete and correct per code review. Visual screenshot confirmation against Carbon Charts side-by-side still required before marking ✅ fully done per Section 6 DoD.

---

## Section 1 — Visual Verification Workflow

The project does **not** use an automated snapshot regression suite. The workflow is:

1. Run `pnpm dev` so both `http://localhost:5173/<chart>` and `https://charts.carbondesignsystem.com/<chart>` are open.
2. In Chrome DevTools, scroll the `main.site-content` element to each `SideBySide` comparison block.
3. Call `take_screenshot` with both panels visible.
4. Compare: data shape, bar widths, color sequence, legend order, axis labels.
5. Fix in the preset. Re-screenshot.
6. Record the before/after screenshots as PR description attachments.

**When to add a Playwright suite:** After all variants are visually correct, add snapshot tests in `packages/site/` using Playwright + `@playwright/test` to lock in the verified state and catch regressions on future theme changes.

---

## Section 2 — Known ECharts Feature Gaps

These are Carbon Charts features with **no direct ECharts equivalent**. Each must be explicitly handled — either with a documented workaround or a stub/note on the page.

| Carbon Feature                                  | ECharts Situation                                                  | Agreed Approach                                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `tooltip.alwaysShowRulerTooltip`                | No persistent crosshair ruler in ECharts                           | Use `axisPointer: { type: 'line', snap: true }` + `triggerOn: 'mousemove'` as approximation; document the difference |
| Skeleton / loading state (`data.loading: true`) | No built-in skeleton animation                                     | Show a spinner or `graphic` overlay; do not map to Carbon's skeleton UI                                              |
| Empty state (no data, custom message)           | ECharts renders an empty canvas silently                           | Add a `graphic` text overlay "No data available" when series data is empty                                           |
| Threshold lines (`thresholds` array)            | Not a first-class concept                                          | Implemented via `markLine` with `silent: true`; `thresholds` param on `LinePresetOptions` ✅                         |
| Log axis (`ScaleTypes.LOG`)                     | Supported — `yAxis.type: 'log'`                                    | Implemented via `logScale: boolean` on `LinePresetOptions` ✅                                                        |
| Dual Y-axis (`correspondingDatasets`)           | Supported — `yAxis` array with `yAxisIndex` on series              | Implemented via `secondaryGroups` param on Line and Combo presets ✅                                                 |
| Custom locale (Japanese, Turkish, Arabic, etc.) | ECharts supports `echarts.registerLocale()` + `locale` init option | Document the pattern; do not replicate locale-specific test examples                                                 |
| `bars.maxWidth`                                 | ECharts `barMaxWidth` per-series                                   | Implemented via `barWidth` param on `BarPresetOptions` ✅                                                            |
| `color.gradient.enabled` (alluvial links)       | ECharts `lineStyle.color: 'gradient'`                              | Implemented via `gradient: true` on `AlluvialPresetOptions` ✅                                                       |
| Monochrome palette (`alluvial.monochrome`)      | Use a single color for all nodes                                   | Implemented via `monochrome: true` on `AlluvialPresetOptions` ✅                                                     |
| `donut.center.label` / `donut.alignment`        | No native donut center text in ECharts series                      | Implemented via transparent ghost pie series + `centerLabel`/`alignment` params ✅                                   |
| Circlepack                                      | No native packed-circle layout                                     | Stub page with Carbon Charts link; post-MVP: `d3-hierarchy` + custom series                                          |
| Choropleth                                      | D3-geo projections; no ECharts map with same projection            | Stub page with Carbon Charts link only                                                                               |
| Network Diagram (force layout)                  | ECharts `graph` series with `layout: 'force'` is a close match     | Implemented `createNetworkOptions`; layout differences documented ✅                                                 |

---

## Section 3 — Bar (Visual Bugs — All Fixed)

**Files:** [`BarPage.tsx`](../packages/site/src/charts/BarPage.tsx) · [`data/echarts/bar.ts`](../packages/site/src/data/echarts/bar.ts) · [`presets/bar.ts`](../packages/theme/src/presets/bar.ts)

All 6 bugs from the original analysis have been fixed:

| Bug   | Description                                                    | Status   |
| ----- | -------------------------------------------------------------- | -------- |
| Bug 1 | Floating bar tuple format `value: [base, end]`                 | ✅ Fixed |
| Bug 2 | Color bleed — `colorBy: 'series'` + explicit `itemStyle.color` | ✅ Fixed |
| Bug 3 | Horizontal floating time series — correct date-keyed data      | ✅ Fixed |
| Bug 4 | Bar width too narrow — `barWidth: '40%'` default               | ✅ Fixed |
| Bug 5 | Time series `date` field (was `key`)                           | ✅ Fixed |
| Bug 6 | Legend order acceptable — noted as non-blocking                | ✅ Noted |

| Slot   | Carbon variant                      | ECharts option                    | Visual status                                    |
| ------ | ----------------------------------- | --------------------------------- | ------------------------------------------------ |
| [0]    | Vertical simple (discrete)          | `barSimple`                       | ⚠️ visual verification pending                   |
| [1]    | Vertical simple (time series)       | `barTimeSeries`                   | ⚠️ visual verification pending                   |
| [2]    | Horizontal simple (discrete)        | `barHorizontal`                   | ⚠️ visual verification pending                   |
| [3]    | Horizontal simple (time series)     | `barHorizontalTimeSeries`         | ⚠️ visual verification pending                   |
| [4]    | Horizontal floating (time series)   | `barFloatingHorizontalTimeSeries` | ⚠️ visual verification pending                   |
| [5]    | Floating vertical (discrete)        | `barFloating`                     | ⚠️ visual verification pending                   |
| [6]    | Floating horizontal (discrete)      | `barFloatingHorizontal`           | ⚠️ visual verification pending                   |
| [7–13] | Axes/color/legend/locale/truncation | nearest real option reuse         | ⚠️ intentional reuse — ECharts limitations noted |

**Code samples:** ✅ Present on slots [0]–[6].

---

## Section 4 — Per-Chart Status (all other charts)

---

### Alluvial / Sankey

**Files:** [`AlluvialPage.tsx`](../packages/site/src/charts/AlluvialPage.tsx) · [`data/echarts/alluvial.ts`](../packages/site/src/data/echarts/alluvial.ts) · [`presets/alluvial.ts`](../packages/theme/src/presets/alluvial.ts)

| Slot | Carbon variant                              | ECharts option          | Status                         |
| ---- | ------------------------------------------- | ----------------------- | ------------------------------ |
| [0]  | Basic                                       | `alluvialBasic`         | ⚠️ visual verification pending |
| [1]  | Gradient (per-node colors + gradient links) | `alluvialGradient`      | ⚠️ visual verification pending |
| [2]  | Multiple categories                         | `alluvialMultiCategory` | ⚠️ visual verification pending |
| [3]  | Monochrome with custom node padding         | `alluvialMonochrome`    | ⚠️ visual verification pending |
| [4]  | Aligned nodes                               | `alluvialAligned`       | ⚠️ visual verification pending |
| [5]  | Custom colors (A/B/C palette)               | `alluvialCustomColors`  | ⚠️ visual verification pending |

**Preset:** `gradient`, `colors`, `monochrome`, `nodeAlign`, `nodePadding` all implemented. ✅  
**Code samples:** ✅ Present for slots [0] and [1].

---

### Area

**Files:** [`AreaPage.tsx`](../packages/site/src/charts/AreaPage.tsx) · [`data/echarts/area.ts`](../packages/site/src/data/echarts/area.ts) · [`presets/area.ts`](../packages/theme/src/presets/area.ts)

| Slot | Carbon variant       | ECharts option     | Status                                          |
| ---- | -------------------- | ------------------ | ----------------------------------------------- |
| [0]  | Time series area     | `areaTimeSeries`   | ⚠️ visual verification pending                  |
| [1]  | Always ruler tooltip | `areaAlwaysRuler`  | 🔶 ECharts limitation — shown as standard area  |
| [2]  | Sparkline area       | `areaSparkline`    | ⚠️ visual verification pending                  |
| [3]  | Discrete domain area | `areaDiscrete`     | ⚠️ visual verification pending                  |
| [4]  | Natural curve area   | `areaNaturalCurve` | ⚠️ visual verification pending                  |
| [5]  | Bounded highlights   | `areaBounded`      | 🔶 ECharts limitation — approximated as stacked |
| [6]  | Area with zoombar    | `areaZoombar`      | ⚠️ visual verification pending                  |
| [7]  | Skeleton / loading   | `areaSkeleton`     | 🔶 ECharts limitation — shown as live chart     |

**Preset:** `smooth`, `dataZoom`, `stacked` all implemented. ✅  
**Code samples:** None yet.

---

### Boxplot

**Files:** [`BoxplotPage.tsx`](../packages/site/src/charts/BoxplotPage.tsx) · [`data/echarts/boxplot.ts`](../packages/site/src/data/echarts/boxplot.ts) · [`presets/boxplot.ts`](../packages/theme/src/presets/boxplot.ts)

| Slot | Carbon variant       | ECharts option      | Status                         |
| ---- | -------------------- | ------------------- | ------------------------------ |
| [0]  | Boxplot (horizontal) | `boxplotHorizontal` | ⚠️ visual verification pending |
| [1]  | Boxplot (vertical)   | `boxplotVertical`   | ⚠️ visual verification pending |

**Preset:** `horizontal` param implemented. ✅  
**Code samples:** None yet.

---

### Bubble

**Files:** [`BubblePage.tsx`](../packages/site/src/charts/BubblePage.tsx) · [`data/echarts/bubble.ts`](../packages/site/src/data/echarts/bubble.ts) · [`presets/scatter.ts`](../packages/theme/src/presets/scatter.ts)

| Slot | Carbon variant                          | ECharts option       | Status                                       |
| ---- | --------------------------------------- | -------------------- | -------------------------------------------- |
| [0]  | Bubble (linear — sales vs profit)       | `bubbleLinear`       | ⚠️ visual verification pending               |
| [1]  | Bubble (tooltip.alwaysShowRulerTooltip) | `bubbleTimeSeries`   | 🔶 ECharts limitation — shown as time series |
| [2]  | Bubble (time series)                    | `bubbleTimeSeries`   | ⚠️ visual verification pending               |
| [3]  | Bubble (discrete)                       | `bubbleDiscrete`     | ⚠️ visual verification pending               |
| [4]  | Bubble (dual discrete axes)             | `bubbleDualDiscrete` | ⚠️ visual verification pending               |

**Preset:** `timeSeries`, `dualDiscrete`, `sizeField` all implemented. ✅  
**Code samples:** None yet.

---

### Combo

**Files:** [`ComboPage.tsx`](../packages/site/src/charts/ComboPage.tsx) · [`data/echarts/combo.ts`](../packages/site/src/data/echarts/combo.ts) · [`presets/combo.ts`](../packages/theme/src/presets/combo.ts)

| Slot | Carbon variant            | ECharts option            | Status                         |
| ---- | ------------------------- | ------------------------- | ------------------------------ |
| [0]  | Bar + Line (dual Y)       | `comboBarLine`            | ⚠️ visual verification pending |
| [1]  | Tooltip variant           | `comboBarLineRuler`       | ⚠️ visual verification pending |
| [2]  | Stacked bar + Line        | `comboStackedBarLine`     | ⚠️ visual verification pending |
| [3]  | Grouped bar + Line        | `comboGroupedLine`        | ⚠️ visual verification pending |
| [4]  | Floating bar + Line       | `comboFloatingLine`       | ⚠️ visual verification pending |
| [5]  | Grouped horizontal        | `comboGroupedHorizontal`  | ⚠️ visual verification pending |
| [6]  | Horizontal bar + Line     | `comboHorizontalLine`     | ⚠️ visual verification pending |
| [7]  | Area + Line               | `comboAreaLine`           | ⚠️ visual verification pending |
| [8]  | Stacked area + Line       | `comboStackedAreaLine`    | ⚠️ visual verification pending |
| [9]  | Line + Scatter            | `comboScatterLine`        | ⚠️ visual verification pending |
| [10] | Area + Line (time series) | `comboAreaLineTimeSeries` | ⚠️ visual verification pending |

**Preset:** `stacked`, `areaGroups`, `scatterGroups`, `horizontal`, `floatingGroups`, `secondaryGroups`, `timeSeries` all implemented. ✅  
**Code samples:** None yet.

---

### Donut

**Files:** [`DonutPage.tsx`](../packages/site/src/charts/DonutPage.tsx) · [`data/echarts/donut.ts`](../packages/site/src/data/echarts/donut.ts) · [`presets/donut.ts`](../packages/theme/src/presets/donut.ts)

| Slot | Carbon variant              | ECharts option     | Status                         |
| ---- | --------------------------- | ------------------ | ------------------------------ |
| [0]  | Donut (default)             | `donut`            | ⚠️ visual verification pending |
| [1]  | Donut (centered alignment)  | `donutCentered`    | ⚠️ visual verification pending |
| [2]  | Donut (value maps to count) | `donutValueMapsTo` | ⚠️ visual verification pending |

**Preset:** `centerLabel`, `alignment`, `valueMapsTo` all implemented. ✅  
**Code samples:** ✅ Present for all 3 slots.

---

### Gauge

**Files:** [`GaugePage.tsx`](../packages/site/src/charts/GaugePage.tsx) · [`data/echarts/gauge.ts`](../packages/site/src/data/echarts/gauge.ts) · [`presets/gauge.ts`](../packages/theme/src/presets/gauge.ts)

| Slot | Carbon variant                       | ECharts option     | Status                         |
| ---- | ------------------------------------ | ------------------ | ------------------------------ |
| [0]  | Gauge (semicircular — danger status) | `gaugeDanger`      | ⚠️ visual verification pending |
| [1]  | Gauge (circular — warning status)    | `gaugeWarningFull` | ⚠️ visual verification pending |
| [2]  | Gauge (circular, custom color)       | `gaugeCustomColor` | ⚠️ visual verification pending |

**Preset:** `status` (danger/warning/success via `alertColors`), `customColor`, `type: 'semi'|'full'` all implemented. ✅  
**Code samples:** None yet.

---

### Heatmap

**Files:** [`HeatmapPage.tsx`](../packages/site/src/charts/HeatmapPage.tsx) · [`data/echarts/heatmap.ts`](../packages/site/src/data/echarts/heatmap.ts) · [`presets/heatmap.ts`](../packages/theme/src/presets/heatmap.ts)

| Slot | Carbon variant                | ECharts option            | Status                          |
| ---- | ----------------------------- | ------------------------- | ------------------------------- |
| [0]  | Heatmap (basic)               | `heatmap`                 | ⚠️ visual verification pending  |
| [1]  | Heatmap (quantize legend)     | `heatmapCustomColorRange` | ⚠️ visual verification pending  |
| [2]  | Heatmap (divergent)           | `heatmap` reused          | ⚠️ needs divergent palette data |
| [3]  | Heatmap (missing data)        | `heatmap` reused          | ⚠️ acceptable reuse             |
| [4]  | Heatmap (custom color domain) | `heatmapCustomColorRange` | ⚠️ visual verification pending  |
| [5]  | Heatmap (axis order option)   | `heatmap` reused          | ⚠️ acceptable reuse             |

**Preset:** `colorRange`, `legendPosition`, `xAxisLabel`, `yAxisLabel` all implemented. Uses `sequentialTeal` from palettes. ✅  
**Code samples:** None yet.

---

### Histogram

**Files:** [`HistogramPage.tsx`](../packages/site/src/charts/HistogramPage.tsx) · [`data/echarts/histogram.ts`](../packages/site/src/data/echarts/histogram.ts) · [`presets/histogram.ts`](../packages/theme/src/presets/histogram.ts)

| Slot | Carbon variant               | ECharts option            | Status                         |
| ---- | ---------------------------- | ------------------------- | ------------------------------ |
| [0]  | Histogram (default binning)  | `histogram`               | ⚠️ visual verification pending |
| [1]  | Histogram (tooltip)          | `histogramTooltip`        | ⚠️ visual verification pending |
| [2]  | Histogram (custom bin count) | `histogramCustomBin`      | ⚠️ visual verification pending |
| [3]  | Histogram (custom bin width) | `histogramCustomBinWidth` | ⚠️ visual verification pending |

**Preset:** `binWidth` auto-bucketing implemented. `pickColors(1)` now applied to bar series. ✅  
**Code samples:** None yet.

---

### Line

**Files:** [`LinePage.tsx`](../packages/site/src/charts/LinePage.tsx) · [`data/echarts/line.ts`](../packages/site/src/data/echarts/line.ts) · [`presets/line.ts`](../packages/theme/src/presets/line.ts)

| Slot | Carbon variant              | ECharts option          | Status                                      |
| ---- | --------------------------- | ----------------------- | ------------------------------------------- |
| [0]  | Custom domain               | `lineDiscrete`          | ⚠️ visual verification pending              |
| [1]  | Time series (rotated ticks) | `lineRotatedTicks`      | ⚠️ visual verification pending              |
| [2]  | Time series (French locale) | `lineLocale`            | 🔶 ECharts limitation — no per-chart locale |
| [3]  | Log axis                    | `lineLogAxis`           | ⚠️ visual verification pending              |
| [4]  | Custom colors               | `lineCustomColors`      | 🔶 ECharts limitation — palette colors only |
| [5]  | Selected groups             | `lineSelectedGroups`    | ⚠️ acceptable reuse                         |
| [6]  | Legend orientation          | `lineLegendOrientation` | ⚠️ acceptable reuse                         |
| [7]  | Time series with thresholds | `lineThresholds`        | ⚠️ visual verification pending              |
| [8]  | Truncated labels            | `lineLongLabel`         | ⚠️ acceptable reuse                         |
| [9]  | Line (discrete)             | `lineStandard`          | ⚠️ visual verification pending              |
| [10] | Always show ruler tooltip   | `lineAlwaysRuler`       | 🔶 ECharts limitation — no always-on ruler  |
| [11] | Time series                 | `lineTimeSeries`        | ⚠️ visual verification pending              |
| [12] | Time series (dense)         | `lineTimeSeriesDense`   | ⚠️ visual verification pending              |
| [13] | Dual-axis line              | `lineDualAxis`          | ⚠️ visual verification pending              |

**Preset:** `logScale`, `secondaryGroups`, `axisLabelRotate`, `thresholds` all implemented. ✅  
**Code samples:** None yet.

---

### Lollipop

**Files:** [`LollipopPage.tsx`](../packages/site/src/charts/LollipopPage.tsx) · [`data/echarts/lollipop.ts`](../packages/site/src/data/echarts/lollipop.ts) · [`presets/lollipop.ts`](../packages/theme/src/presets/lollipop.ts)

| Slot | Carbon variant        | ECharts option       | Status                         |
| ---- | --------------------- | -------------------- | ------------------------------ |
| [0]  | Lollipop (vertical)   | `lollipopDiscrete`   | ⚠️ visual verification pending |
| [1]  | Lollipop (horizontal) | `lollipopHorizontal` | ⚠️ visual verification pending |

**Preset:** `horizontal` param implemented. ✅  
**Code samples:** None yet.

---

### Meter

**Files:** [`MeterPage.tsx`](../packages/site/src/charts/MeterPage.tsx) · [`data/echarts/gauge.ts`](../packages/site/src/data/echarts/gauge.ts) · [`presets/gauge.ts`](../packages/theme/src/presets/gauge.ts)

| Slot | Carbon variant                       | ECharts option                      | Status                         |
| ---- | ------------------------------------ | ----------------------------------- | ------------------------------ |
| [0]  | Meter (with statuses)                | `getMeterOption`                    | ⚠️ visual verification pending |
| [1]  | Meter (statuses + custom color)      | `getMeterOption` reused             | ⚠️ acceptable reuse            |
| [2]  | Meter (no status)                    | `getMeterOption` reused             | ⚠️ acceptable reuse            |
| [3]  | Proportional Meter                   | `getMeterProportionalOption`        | ⚠️ visual verification pending |
| [4]  | Proportional Meter (peak + statuses) | `getMeterProportionalOption` reused | ⚠️ acceptable reuse            |
| [5]  | Proportional Meter (truncated)       | `getMeterProportionalOption` reused | ⚠️ acceptable reuse            |

**Preset:** `proportional` flag implemented via stacked horizontal bar. ✅  
**Code samples:** None yet.

---

### Pie

**Files:** [`PiePage.tsx`](../packages/site/src/charts/PiePage.tsx) · [`data/echarts/donut.ts`](../packages/site/src/data/echarts/donut.ts) · [`presets/donut.ts`](../packages/theme/src/presets/donut.ts)

| Slot | Carbon variant               | ECharts option      | Status                         |
| ---- | ---------------------------- | ------------------- | ------------------------------ |
| [0]  | Pie (default)                | `pie`               | ⚠️ visual verification pending |
| [1]  | Pie (with percentage labels) | `pieWithPercentage` | ⚠️ visual verification pending |
| [2]  | Pie (value maps to count)    | `pieValueMapsTo`    | ⚠️ visual verification pending |

**Preset:** `showPercentageLabels`, `valueMapsTo` implemented on `PiePresetOptions`. ✅ (slot [2] was previously missing — now fixed)  
**Code samples:** ✅ Present for slots [0] and [1].

---

### Radar

**Files:** [`RadarPage.tsx`](../packages/site/src/charts/RadarPage.tsx) · [`data/echarts/radar.ts`](../packages/site/src/data/echarts/radar.ts) · [`presets/treemap.ts`](../packages/theme/src/presets/treemap.ts) _(radar co-located)_

| Slot | Carbon variant             | ECharts option     | Status                         |
| ---- | -------------------------- | ------------------ | ------------------------------ |
| [0]  | Radar                      | `radar`            | ⚠️ visual verification pending |
| [1]  | Radar (centered)           | `radarMultiSeries` | ⚠️ visual verification pending |
| [2]  | Radar (missing datapoints) | `radar` reused     | ⚠️ acceptable reuse            |
| [3]  | Radar (dense)              | `radar` reused     | ⚠️ acceptable reuse            |
| [4]  | Radar (custom max score)   | `radar` reused     | ⚠️ acceptable reuse            |

**Preset:** indicator-based multi-series radar implemented. ✅  
**Code samples:** None yet.

---

### Scatter

**Files:** [`ScatterPage.tsx`](../packages/site/src/charts/ScatterPage.tsx) · [`data/echarts/scatter.ts`](../packages/site/src/data/echarts/scatter.ts) · [`presets/scatter.ts`](../packages/theme/src/presets/scatter.ts)

| Slot | Carbon variant                        | ECharts option         | Status                                                    |
| ---- | ------------------------------------- | ---------------------- | --------------------------------------------------------- |
| [0]  | Scatter (linear x & y)                | `scatterLinear`        | ⚠️ visual verification pending                            |
| [1]  | Scatter (time series)                 | `scatterTimeSeries`    | ⚠️ visual verification pending                            |
| [2]  | Scatter (discrete)                    | `scatterDiscrete`      | ⚠️ visual verification pending                            |
| [3]  | Scatter (dual axes — orders/products) | `scatterDualAxes`      | ⚠️ two series on shared value axis; secondary Y not wired |
| [4]  | Scatter (always ruler tooltip)        | `scatterLinear` reused | 🔶 ECharts limitation                                     |

**Known delta:** Slot [3] Carbon uses separate Y-axis scales for Orders vs Products. `createScatterOptions` has no `secondaryGroups` param. The data is there; the preset needs a `secondaryGroups?: string[]` option (same pattern as Line). Low-priority until visual pass.  
**Code samples:** None yet.

---

### Tree

**Files:** [`TreePage.tsx`](../packages/site/src/charts/TreePage.tsx) · [`data/echarts/tree.ts`](../packages/site/src/data/echarts/tree.ts) · [`presets/tree.ts`](../packages/theme/src/presets/tree.ts)

| Slot | Carbon variant        | ECharts option   | Status                         |
| ---- | --------------------- | ---------------- | ------------------------------ |
| [0]  | Tree (dendrogram, LR) | `tree`           | ⚠️ visual verification pending |
| [1]  | Tree (top-bottom)     | `treeHorizontal` | ⚠️ visual verification pending |

**Preset:** `orient: 'LR'|'TB'`, `initialDepth` implemented. ✅  
**Code samples:** None yet.

---

### Treemap

**Files:** [`TreemapPage.tsx`](../packages/site/src/charts/TreemapPage.tsx) · [`data/echarts/treemap.ts`](../packages/site/src/data/echarts/treemap.ts) · [`presets/treemap.ts`](../packages/theme/src/presets/treemap.ts)

| Slot | Carbon variant                | ECharts option  | Status                         |
| ---- | ----------------------------- | --------------- | ------------------------------ |
| [0]  | Treemap (default)             | `treemap`       | ⚠️ visual verification pending |
| [1]  | Treemap (nested / drill-down) | `treemapNested` | ⚠️ visual verification pending |

**Preset:** flat + hierarchical formats both implemented. ✅  
**Code samples:** None yet.

---

### Circlepack

**Files:** [`CirclepackPage.tsx`](../packages/site/src/charts/CirclepackPage.tsx) — stub page.

🔶 Stub with "No ECharts equivalent" + Carbon Charts link. Post-MVP: `d3-hierarchy` pack layout as data pre-processor.

---

### Network Diagram

**Files:** [`NetworkDiagramPage.tsx`](../packages/site/src/charts/NetworkDiagramPage.tsx) · [`data/echarts/network.ts`](../packages/site/src/data/echarts/network.ts) · [`presets/network.ts`](../packages/theme/src/presets/network.ts)

No Carbon Charts equivalent — extended page. Force and circular layouts implemented. ✅  
**Code samples:** None yet.

---

### Bullet

**Files:** [`BulletPage.tsx`](../packages/site/src/charts/BulletPage.tsx) — stub page.

🔶 Stub with "No direct ECharts equivalent" + optional workaround note (`bar + markLine + markArea`).

---

### Word Cloud

**Files:** [`WordcloudPage.tsx`](../packages/site/src/charts/WordcloudPage.tsx) · [`data/echarts/wordcloud.ts`](../packages/site/src/data/echarts/wordcloud.ts) · [`presets/wordcloud.ts`](../packages/theme/src/presets/wordcloud.ts)

No Carbon Charts equivalent — extended page. Implemented using `echarts-wordcloud` extension. 3 shape variants: basic, circle, diamond. ✅

---

### Choropleth

**Files:** [`ChoroplethPage.tsx`](../packages/site/src/charts/ChoroplethPage.tsx) — stub page.

🔶 Stub with "No viable ECharts equivalent" + Carbon Charts link. D3-geo projection mismatch makes this non-viable.

---

### Extended Charts (no Carbon equivalent)

| Chart       | File                           | Status                                           |
| ----------- | ------------------------------ | ------------------------------------------------ |
| Candlestick | `extended/CandlestickPage.tsx` | 🚫 extended only — visual audit recommended      |
| Funnel      | `extended/FunnelPage.tsx`      | 🚫 extended only — visual audit recommended      |
| Gantt       | `extended/GanttPage.tsx`       | ✅ implemented — horizontal floating bar pattern |
| Graph       | `extended/GraphPage.tsx`       | 🚫 extended only — visual audit recommended      |
| Parallel    | `extended/ParallelPage.tsx`    | 🚫 extended only — visual audit recommended      |
| Sunburst    | `extended/SunburstPage.tsx`    | 🚫 extended only — visual audit recommended      |
| Theme River | `extended/ThemeRiverPage.tsx`  | 🚫 extended only — visual audit recommended      |

These have no Carbon equivalent so parity does not apply, but a visual audit of the ECharts theme application (colors, typography, grid) is still worthwhile.

---

## Section 5 — Remaining Work

All parallel batches from the original plan have been implemented. The only remaining work is:

### Visual verification pass (all charts)

Every chart page needs a side-by-side screenshot comparison against `https://charts.carbondesignsystem.com/<chart>`. The comparison must confirm: data shape, color sequence, legend order, axis labels. This is the only step that can move a chart from ⚠️ to ✅.

Run the verification workflow from Section 1 for each chart type in this order (highest-risk first):

| Priority | Charts            | Why high priority                                           |
| -------- | ----------------- | ----------------------------------------------------------- |
| 1        | Bar, Floating Bar | Most complex preset; most bugs fixed                        |
| 2        | Combo             | Most complex variant set                                    |
| 3        | Alluvial          | Custom color/gradient logic                                 |
| 4        | Gauge + Meter     | `alertColors` + `proportional` layout                       |
| 5        | Donut + Pie       | Center label ghost series                                   |
| 6        | Line + Area       | Threshold, dual-axis, dataZoom                              |
| 7        | Scatter + Bubble  | Field name mapping                                          |
| 8        | All remaining     | Treemap, Tree, Radar, Boxplot, Lollipop, Heatmap, Histogram |

### Known code delta to fix

| Item                              | File                 | Action                                                                          |
| --------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| Scatter slot [3] secondary Y axis | `presets/scatter.ts` | Add `secondaryGroups?: string[]` param; wire `yAxisIndex: 1` on matching series |
| Code samples bulk pass            | All page files       | Add `echartsCode` prop to every `SideBySide` after visual verification          |

### Playwright regression suite

After visual verification is complete, add snapshot tests in `packages/site/` to lock in the verified state.

---

## Section 6 — Definition of Done per Chart

A chart page is ✅ done when all of the following are true:

- [ ] Every test-tagged Carbon example slot has a distinct, correctly named ECharts option (no reuse of wrong variants)
- [ ] Data in `data/echarts/<chart>.ts` matches the corresponding `data/carboncharts/<chart>.ts` row-for-row (same values, same field names where the preset maps them)
- [ ] Colors are derived from `pickColors()` or named palette exports in `palettes.ts` — no hardcoded hex values in any preset or data file
- [ ] All structural logic is in the preset function, not in the data file or page component
- [ ] Visual screenshot comparison shows both panels aligned: bar widths, color sequences, legend order, axis labels
- [ ] Any ECharts feature gap is documented in Section 2 with an agreed workaround, and the workaround is either implemented or the slot is explicitly marked "ECharts limitation — see Section 2"
- [ ] `echartsCode` prop is populated on every `SideBySide` with a working, copy-pasteable snippet
- [ ] `pnpm test` passes in `packages/theme` (preset unit tests cover the new variant)
