# Visual Audit Report — Carbon ECharts Theme

> **Date:** Generated after first-pass implementation.  
> **Method:** Static source-code analysis of all page components, ECharts data/preset files, and Carbon Charts reference data files, cross-referenced across all 23 chart pages.  
> **Code block rule:** The dark `ECharts` panel beneath a chart pair only renders when `echartsCode` prop is passed to `<SideBySide>`. Pages that do not supply this prop show no code block for any slot.

---

## Legend

| Symbol | Meaning                                                                 |
| ------ | ----------------------------------------------------------------------- |
| ✅     | Clean match — data, colors, and structure correct                       |
| ⚠️     | Minor mismatch or documented ECharts limitation                         |
| ❌     | Significant mismatch — wrong data, missing feature, or broken rendering |

---

## Summary: Code Block Coverage

| Page       | Slots        | Slots with code | Slots missing code |
| ---------- | ------------ | --------------- | ------------------ |
| Alluvial   | 6            | 0, 1            | **2, 3, 4, 5**     |
| Area       | 8            | _(none)_        | **0–7 (all)**      |
| Bar        | 14           | 0–6             | **7–13**           |
| Boxplot    | 2            | _(none)_        | **0–1**            |
| Bubble     | 5            | _(none)_        | **0–4**            |
| Bullet     | stub         | —               | —                  |
| Choropleth | stub         | —               | —                  |
| Circlepack | stub         | —               | —                  |
| Combo      | 11           | _(none)_        | **0–10**           |
| Donut      | 3            | 0, 1, 2 ✅      | —                  |
| Gauge      | 3            | _(none)_        | **0–2**            |
| Heatmap    | 6            | _(none)_        | **0–5**            |
| Histogram  | 4            | _(none)_        | **0–3**            |
| Line       | 14           | _(none)_        | **0–13**           |
| Lollipop   | 2            | _(none)_        | **0–1**            |
| Meter      | 6            | _(none)_        | **0–5**            |
| Network    | 2 (extended) | _(none)_        | **0–1**            |
| Pie        | 3            | 0, 1            | **2**              |
| Radar      | 5            | _(none)_        | **0–4**            |
| Scatter    | 5            | _(none)_        | **0–4**            |
| Tree       | 2            | _(none)_        | **0–1**            |
| Treemap    | 2            | _(none)_        | **0–1**            |
| Wordcloud  | 3 (extended) | _(none)_        | **0–2**            |

**Total slots with code: 10 of 108** (Donut 3, Bar 7, Alluvial 2, Pie 2 — but Pie slot 1 is misconfigured — see below).

---

## Detailed Findings by Chart

---

### Alluvial / Sankey

| Slot | Title                | Code   | Visual | Findings                                                                                                                                                    |
| ---- | -------------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Basic                | ✅ YES | ⚠️     | Node colours assigned by insertion order, not by Carbon's `category` grouping (Pattern vs Group nodes). Minor — functional but palette bucketing differs.   |
| 1    | Gradient             | ✅ YES | ✅     | All 10 per-node hex colours match `optionsGradient.color.scale` exactly.                                                                                    |
| 2    | Multiple categories  | ❌ NO  | ⚠️     | Titanic data correct (14 rows). Category-based node colour grouping (Class/Sex/Age/Survived) absent — ECharts Sankey has no native category colour concept. |
| 3    | Monochrome + padding | ❌ NO  | ✅     | Data and `monochrome: true`, `nodePadding: 33` correctly passed.                                                                                            |
| 4    | Aligned nodes        | ❌ NO  | ✅     | Data and `nodeAlign: 'left'` correctly passed.                                                                                                              |
| 5    | Custom colors        | ❌ NO  | ✅     | A/B/C colours match `optionsCustomColors.color.scale`; X/Y/Z targets inherit palette (matches Carbon behaviour).                                            |

---

### Area

| Slot | Title                | Code  | Visual | Findings                                                                                                                                                                                                                                                                                            |
| ---- | -------------------- | ----- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Time series          | ❌ NO | ✅     | 15-row `timeSeriesData` exactly matches Carbon `data`.                                                                                                                                                                                                                                              |
| 1    | Always ruler tooltip | ❌ NO | ⚠️     | Documented ECharts limitation. Renders as standard hover-only tooltip.                                                                                                                                                                                                                              |
| 2    | Sparkline            | ❌ NO | ❌     | **Wrong data:** ECharts has 10 rows with plain `'19:21'` string keys; Carbon has 30 rows with proper ISO timestamps. Point count differs and x-axis will not parse as a time scale.                                                                                                                 |
| 3    | Discrete domain      | ❌ NO | ✅     | 15-row `discreteData` matches `dataDiscrete` exactly.                                                                                                                                                                                                                                               |
| 4    | Natural curve        | ❌ NO | ✅     | 10-row `curvedData` matches `dataCurved` exactly including negatives.                                                                                                                                                                                                                               |
| 5    | Bounded highlights   | ❌ NO | ❌     | **Major mismatch:** Carbon renders a band envelope (shaded min/max region around the line) plus two highlighted time-axis regions. ECharts uses `createStackedAreaOptions` over `boundedData` which strips the `min`/`max` fields and renders a plain stacked area — no band, no highlight regions. |
| 6    | Zoombar              | ❌ NO | ⚠️     | `dataZoom` slider correctly implemented. However, ECharts uses `timeSeriesData` (3-group, 5pt) while Carbon uses `dataBounded` (1-group, 5pt with highlights). Wrong source dataset.                                                                                                                |
| 7    | Skeleton             | ❌ NO | ⚠️     | Documented ECharts limitation. Renders live chart.                                                                                                                                                                                                                                                  |

---

### Bar

| Slot | Title                           | Code   | Visual | Findings                                                                                                                                                                                                                         |
| ---- | ------------------------------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Vertical simple discrete        | ✅ YES | ✅     | Clean match — 5 groups, correct palette colors.                                                                                                                                                                                  |
| 1    | Vertical simple time series     | ✅ YES | ✅     | 5 ISO-date rows, correct multi-series coloring.                                                                                                                                                                                  |
| 2    | Horizontal simple discrete      | ✅ YES | ✅     | Horizontal bars, correct order and colors.                                                                                                                                                                                       |
| 3    | Horizontal simple time series   | ✅ YES | ✅     | Horizontal, date-keyed, colors match.                                                                                                                                                                                            |
| 4    | Floating horizontal time series | ✅ YES | ⚠️     | Carbon uses mixed scalar (`value: 65000`) + tuple (`value: [base, end]`) per row; ECharts normalises all rows to tuples. "More" and "Sold" base offsets become 0 instead of their Carbon values. Structurally renders correctly. |
| 5    | Floating vertical discrete      | ✅ YES | ✅     | Tuple data and colors match exactly.                                                                                                                                                                                             |
| 6    | Floating horizontal discrete    | ✅ YES | ✅     | Tuple data and colors match exactly.                                                                                                                                                                                             |
| 7    | Custom domain                   | ❌ NO  | ❌     | Carbon restricts Y-axis to `[-100000, 100000]`. ECharts reuses `barSimple` with no domain override — auto-scales to ~0–65k. Defining feature absent.                                                                             |
| 8    | Custom colors                   | ❌ NO  | ❌     | Carbon sets `Qty: '#925699'`, `Misc: '#525669'` via `color.pairing.option: 2`. ECharts reuses `barSimple` with default palette — custom colors absent.                                                                           |
| 9    | Centered legend                 | ❌ NO  | ⚠️     | Data correct. Carbon centers the legend; ECharts legend position uses theme default (bottom-left).                                                                                                                               |
| 10   | Custom legend order             | ❌ NO  | ⚠️     | Data correct. Carbon reorders legend to `['Restocking','Misc','Sold','Qty','More']`. ECharts renders in insertion order.                                                                                                         |
| 11   | Additional legend items         | ❌ NO  | ❌     | Carbon adds 7 extra legend items (Line, Poor area, Satisfactory area, Median, Quartile, Size, Radius). ECharts slot shows none of these additional items.                                                                        |
| 12   | Japanese locale                 | ❌ NO  | ❌     | Carbon sets `locale: 'ja-JP'` — date axis shows `1月`, `2月` etc. ECharts slot reuses `barTimeSeries` with no locale — English labels.                                                                                           |
| 13   | Truncated labels                | ❌ NO  | ❌     | **Wrong data.** Carbon uses `simpleHorizontalBarLongLabelData` with 4 long hex-hash group names. ECharts reuses `barHorizontal` (short standard names) — truncation demo is invisible.                                           |

---

### Boxplot

| Slot | Title               | Code  | Visual | Findings                                                                              |
| ---- | ------------------- | ----- | ------ | ------------------------------------------------------------------------------------- |
| 0    | Horizontal box plot | ❌ NO | ✅     | Q1–Q4 groups, horizontal whiskers, correct palette color. No outlier point rendering. |
| 1    | Vertical box plot   | ❌ NO | ✅     | Same as above, vertical. No outlier points.                                           |

---

### Bubble

| Slot | Title                         | Code  | Visual | Findings                                                                                                                                                                                                             |
| ---- | ----------------------------- | ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Bubble (linear)               | ❌ NO | ⚠️     | Data values identical. `key` field is numeric but passed as string to a value axis — x-axis may render as categorical string instead of continuous numeric. Axis titles ("No. of employees", "Annual sales") absent. |
| 1    | Bubble (always ruler tooltip) | ❌ NO | ⚠️     | Uses `bubbleTimeSeries` (time-series data). Documented limitation: no always-on ruler tooltip. Visually same as slot 2.                                                                                              |
| 2    | Bubble (time series)          | ❌ NO | ✅     | 20-row time-series data with 4 groups and `surplus` sizes correct.                                                                                                                                                   |
| 3    | Bubble (discrete)             | ❌ NO | ✅     | 20-row discrete data, 4 groups, `surplus` sizes correct.                                                                                                                                                             |
| 4    | Bubble (dual discrete axes)   | ❌ NO | ✅     | 18-row data with `problem`/`product` discrete axes. `dualDiscrete` configuration correct.                                                                                                                            |

---

### Combo

| Slot | Title                     | Code  | Visual | Findings                                                                 |
| ---- | ------------------------- | ----- | ------ | ------------------------------------------------------------------------ |
| 0    | Bar + Line (dual Y)       | ❌ NO | ✅     | School A (bar) + Temperature (line), dual Y-axis, correct data.          |
| 1    | Tooltip variant           | ❌ NO | ✅     | Same visual as slot 0 (tooltip limitation documented).                   |
| 2    | Stacked bar + Line        | ❌ NO | ✅     | Florida/California/Tokyo stacked + Temperature line, correct.            |
| 3    | Grouped bar + Line        | ❌ NO | ✅     | Location 1/2/3 grouped (including negatives) + Temperature, correct.     |
| 4    | Floating bar + Line       | ❌ NO | ✅     | School A (line) + Temperature floating `[min, max]` bar, correct.        |
| 5    | Grouped horizontal        | ❌ NO | ✅     | Location 1/2/3 horizontal grouped + Temperature, correct.                |
| 6    | Horizontal bar + Line     | ❌ NO | ✅     | School A horizontal + Temperature, correct.                              |
| 7    | Area + Line               | ❌ NO | ✅     | Health (area) + Temperature (line), 8 months, correct.                   |
| 8    | Stacked area + Line       | ❌ NO | ✅     | 3 long-name datasets stacked area + Temperature time series, correct.    |
| 9    | Line + Scatter            | ❌ NO | ✅     | Attendance (bar) + Paris/Marseille (scatter) + Avg Temp (line), correct. |
| 10   | Area + Line (time series) | ❌ NO | ✅     | Health area + Temperature line, date x-axis, correct.                    |

---

### Donut

| Slot | Title               | Code   | Visual | Findings                                                        |
| ---- | ------------------- | ------ | ------ | --------------------------------------------------------------- |
| 0    | Donut               | ✅ YES | ✅     | 6 groups, `centerLabel: 'Browsers'`, left-aligned.              |
| 1    | Donut (centered)    | ✅ YES | ✅     | Same data, `alignment: 'center'`.                               |
| 2    | Value maps to count | ✅ YES | ✅     | `dataMapsTo` with `valueMapsTo: 'count'`, correct count values. |

---

### Gauge

| Slot | Title                          | Code  | Visual | Findings                                             |
| ---- | ------------------------------ | ----- | ------ | ---------------------------------------------------- |
| 0    | Gauge (semicircular)           | ❌ NO | ✅     | `value: 42`, semi arc, `status: 'danger'` (red).     |
| 1    | Gauge (circular)               | ❌ NO | ✅     | `value: 42`, full arc, `status: 'warning'` (yellow). |
| 2    | Gauge (circular, custom color) | ❌ NO | ✅     | `value: 67`, full arc, `customColor: '#FFE5B4'`.     |

---

### Heatmap

| Slot | Title               | Code  | Visual | Findings                                                                                                                                                                                                                         |
| ---- | ------------------- | ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Heatmap (basic)     | ❌ NO | ⚠️     | Data (10-letter × 12-month grid) correct. ECharts legend is vertical right-side; Carbon is horizontal bottom. No legend title label.                                                                                             |
| 1    | Custom color range  | ❌ NO | ⚠️     | `sequentialTeal` ramp applied. Carbon slot 1 is a "Quantize legend" (stepped) not a continuous teal gradient — legend type mismatch.                                                                                             |
| 2    | Divergent           | ❌ NO | ❌     | **Wrong data.** ECharts reuses `heatmap` (all-positive data). Carbon uses `heatmapPositiveNegativeData` (positive and negative values) with a diverging red↔cyan color scale. Diverging scale and diverging dataset both absent. |
| 3    | Missing data        | ❌ NO | ❌     | **Wrong data.** ECharts reuses `heatmap` (full grid). Carbon uses `heatmapMissingData` — dataset with explicit `null` cells to show gaps. Missing-data behavior invisible.                                                       |
| 4    | Custom color domain | ❌ NO | ⚠️     | Data correct. Carbon sets `colorDomain: { min: 0, max: 150 }` which extends the visual scale so mid-values appear lighter. ECharts `visualMap.min/max` is derived from data range — the domain extension is not applied.         |
| 5    | Axis order          | ❌ NO | ⚠️     | Data correct. ECharts Y-axis order derived from insertion order (Jan first), which coincidentally matches — but no explicit domain ordering is enforced, making it fragile.                                                      |

---

### Histogram

| Slot | Title                | Code  | Visual | Findings                                                                                                                                                                                                                                                                            |
| ---- | -------------------- | ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Histogram (linear)   | ❌ NO | ⚠️     | Age data values match. **Multi-group stacking absent**: Carbon stacks Dataset 1/2/3 as 3 colored segments per bin; ECharts collapses all groups into a single-series count. Also `binWidth: 10` (equal-width) vs Carbon `bins: 10` (equal-count) produces different bin boundaries. |
| 1    | Always ruler tooltip | ❌ NO | ⚠️     | Same as slot 0. Documented limitation: no always-ruler tooltip.                                                                                                                                                                                                                     |
| 2    | Custom bin count     | ❌ NO | ⚠️     | USD data single-group, values match. 67 bins at width 10 renders correctly. Axis title "US $ (million)" absent.                                                                                                                                                                     |
| 3    | Custom bin width     | ❌ NO | ❌     | Carbon defines explicit unequal bin edges `[20, 40, 50, 60, 90]`. ECharts uses `binWidth: 20` → uniform 20-unit bins at different boundaries. **Bin edges and widths do not match.** Multi-group stacking also absent.                                                              |

---

### Line

| Slot | Title              | Code  | Visual | Findings                                                                                                                                                                                                                                                 |
| ---- | ------------------ | ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Custom domain      | ❌ NO | ❌     | Carbon restricts x-axis to 3 of 5 categories and y-axis to `[10000, 50000]`. ECharts `lineDiscrete` shows all 5 categories and full value range — domain constraint absent.                                                                              |
| 1    | Rotated ticks      | ❌ NO | ✅     | Data correct, `axisLabelRotate: -45` applied.                                                                                                                                                                                                            |
| 2    | French locale      | ❌ NO | ⚠️     | Documented limitation. Renders with browser locale.                                                                                                                                                                                                      |
| 3    | Log axis           | ❌ NO | ✅     | `logScale: true` applied, data matches.                                                                                                                                                                                                                  |
| 4    | Custom colors      | ❌ NO | ❌     | Carbon uses explicit hex overrides (`#925699`, `#525669`, `#725699`, `#ccc`). ECharts uses standard `pickColors(4)` — custom colors absent.                                                                                                              |
| 5    | Selected groups    | ❌ NO | ❌     | **Wrong data** (`lineData` vs `lineSelectedGroupsData` where `More=56000`). Pre-selected group visibility (Dataset 1, 3 active; 2, 4 greyed) not implemented.                                                                                            |
| 6    | Legend orientation | ❌ NO | ❌     | Carbon sets `legend: { position: LEFT, orientation: VERTICAL }`. ECharts legend renders horizontally at bottom — orientation/position not applied.                                                                                                       |
| 7    | Thresholds         | ❌ NO | ⚠️     | Y-axis `markLine` at 55000 and 10000 implemented. Missing: vertical X-axis threshold at `2023-01-11`; threshold fill colors (`orange`, `#03a9f4`) not applied to markLine style.                                                                         |
| 8    | Truncated labels   | ❌ NO | ❌     | **Wrong data.** Carbon uses `lineLongLabelData` with a 64-char hex key and `'LongLabelShouldBeTruncated'` group. ECharts uses `lineData` (short labels) — truncation demo invisible.                                                                     |
| 9    | Line (discrete)    | ❌ NO | ✅     | Data matches, 4 groups over 5 categories.                                                                                                                                                                                                                |
| 10   | Always ruler       | ❌ NO | ⚠️     | Documented limitation.                                                                                                                                                                                                                                   |
| 11   | Time series        | ❌ NO | ✅     | 20-row time-series data with nulls, 4 groups correct.                                                                                                                                                                                                    |
| 12   | Dense              | ❌ NO | ✅     | 40-row sub-daily timestamps, 2 groups correct.                                                                                                                                                                                                           |
| 13   | Dual axis          | ❌ NO | ❌     | **Data is broken.** Carbon stores Temperature in `temp` field and Rainfall in `rainfall` field. ECharts data uses `value` field for both groups, but `groupByGroup` reads only `.value` — both series render as empty/null since the fields don't match. |

---

### Lollipop

| Slot | Title                 | Code  | Visual | Findings                                                       |
| ---- | --------------------- | ----- | ------ | -------------------------------------------------------------- |
| 0    | Lollipop (discrete)   | ❌ NO | ✅     | 4-group data, scatter+bar stem approach, palette colors match. |
| 1    | Lollipop (horizontal) | ❌ NO | ✅     | Same data, horizontal orientation.                             |

---

### Meter

| Slot | Title                                | Code  | Visual | Findings                                                                                                                                                                                                                       |
| ---- | ------------------------------------ | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0    | Meter (with statuses)                | ❌ NO | ❌     | **Critical.** Carbon shows colored status zones (green 0–50, yellow 50–60, red 60–100) + peak marker at 80. ECharts renders a plain single-color bar with no zones or peak. Carbon data `value: 56`; ECharts uses `value: 60`. |
| 1    | Meter (statuses + custom color)      | ❌ NO | ❌     | Same gap as [0]. Carbon also sets custom color `#925699` for the bar. ECharts shows default color, no zones, no peak. Carbon `value: 56`; ECharts `value: 60`.                                                                 |
| 2    | Meter (no status)                    | ❌ NO | ⚠️     | Closest match. Carbon plain bar with peak marker at 70. ECharts renders correctly as plain bar but **peak marker absent**. Carbon `value: 56`; ECharts `value: 60`.                                                            |
| 3    | Proportional meter                   | ❌ NO | ⚠️     | Data (emails/photos/messages/other) identical. Carbon uses `color.pairing.option: 2` (2-color sequential palette). ECharts uses `pickColors(4)` (categorical) — color mismatch.                                                |
| 4    | Proportional meter (peak + statuses) | ❌ NO | ❌     | Data correct but status zones (green/yellow/red) and peak marker at 1800 absent.                                                                                                                                               |
| 5    | Proportional meter (truncated)       | ❌ NO | ⚠️     | Data correct. Carbon shows truncated label with tooltip and `unit: 'MB'`. ECharts renders standard labels with no unit.                                                                                                        |

---

### Pie

| Slot | Title               | Code   | Visual | Findings                                                                                                                                                                                                                                 |
| ---- | ------------------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Pie                 | ✅ YES | ✅     | 6 groups, correct palette.                                                                                                                                                                                                               |
| 1    | Pie (centered)      | ✅ YES | ❌     | **Wrong option.** Carbon slot 1 is `pieCenteredOptions` (centers legend + chart with `Alignments.CENTER`). ECharts `echartsOptions[1]` is `pieWithPercentage` (percentage labels) — completely wrong: shows `%` labels but no centering. |
| 2    | Value maps to count | ❌ NO  | ✅     | `dataMapsTo` + `valueMapsTo: 'count'` correct. `codeSamples[2]` is `undefined` → no code block.                                                                                                                                          |

---

### Radar

| Slot | Title                      | Code  | Visual | Findings                                                                                                                                                                           |
| ---- | -------------------------- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Radar                      | ❌ NO | ✅     | Product 1 / Product 2, 5 features, values match `radarData`.                                                                                                                       |
| 1    | Radar (centered)           | ❌ NO | ⚠️     | Carbon uses `alignment: CENTER`. ECharts renders identical option to slot [0] — centering absent.                                                                                  |
| 2    | Radar (missing datapoints) | ❌ NO | ❌     | **Wrong data.** Carbon uses `radarWithMissingDataData` (Sugar/Oil/Water × London/Milan/Paris/New York/Sydney with Water missing Sydney). ECharts renders Product 1/Product 2 data. |
| 3    | Radar (dense)              | ❌ NO | ❌     | **Wrong data.** Carbon uses `radarDenseData` (5 months × 8 activities). ECharts renders Product 1/Product 2.                                                                       |
| 4    | Radar (custom max)         | ❌ NO | ❌     | **Wrong data.** Carbon uses `radarWithCustomMaxScore` (single product, values ≤60, `maxValue: 100`). ECharts renders both products with original scores.                           |

---

### Scatter

| Slot | Title                  | Code  | Visual | Findings                                                                                                                                                                                       |
| ---- | ---------------------- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Scatter (linear)       | ❌ NO | ⚠️     | Data values identical. Axis titles ("No. of employees", "Annual sales") absent.                                                                                                                |
| 1    | Scatter (time series)  | ❌ NO | ✅     | 20-row time-series data with nulls matches Carbon reference.                                                                                                                                   |
| 2    | Scatter (discrete)     | ❌ NO | ✅     | 20-row discrete data, 4 groups, 5 categories correct.                                                                                                                                          |
| 3    | Scatter (dual axes)    | ❌ NO | ❌     | **Dual-axis not implemented.** Carbon maps `orderCount`→left Y, `productCount`→right Y. ECharts renders both on a single shared Y-axis. `createScatterOptions` has no `secondaryGroups` param. |
| 4    | Scatter (always ruler) | ❌ NO | ⚠️     | Same data as slot 0 (correct per Carbon). Documented limitation: no always-ruler tooltip.                                                                                                      |

---

### Tree

| Slot | Title             | Code  | Visual | Findings                                                                                                                                                                            |
| ---- | ----------------- | ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Tree (dendrogram) | ❌ NO | ⚠️     | Same "flare" hierarchy, `initialDepth: 2`. Carbon renders a **radial dendrogram** layout; ECharts renders a rectangular LR tree. Layout style inherently differs between libraries. |
| 1    | Tree (top-bottom) | ❌ NO | ⚠️     | ECharts uses `orient: 'TB'`. Carbon `treeOptions` is also LR (not TB) — both slots are LR in Carbon. ECharts slot 1 differs from the Carbon reference by design.                    |

---

### Treemap

| Slot | Title            | Code  | Visual | Findings                                                                                                                                                                                                                                                   |
| ---- | ---------------- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Treemap          | ❌ NO | ❌     | **Color philosophy mismatch.** Carbon assigns one color per parent group (6 continent colors). ECharts assigns one color per leaf node (43 leaf nodes → 43 cycling palette colors). Legend also differs: 6 items vs 43+.                                   |
| 1    | Treemap (nested) | ❌ NO | ❌     | Carbon slot 1 is **"Treemap (Custom colors)"** using a teal monochromatic ramp (`#3ddbd9`→`#004144`). ECharts uses `createTreemapOptionsFromHierarchy` with no color override — shows standard categorical palette. Title and color concept both mismatch. |

---

## Consolidated Issue Registry

### 🔴 Critical — Broken or Empty Rendering

| ID  | Chart   | Slot | Issue                                                                                               |
| --- | ------- | ---- | --------------------------------------------------------------------------------------------------- |
| C1  | Line    | 13   | Dual-axis data uses `temp`/`rainfall` fields; ECharts reads `.value` → **both series render empty** |
| C2  | Heatmap | 2    | Wrong dataset — must use `heatmapPositiveNegativeData` + diverging scale                            |
| C3  | Heatmap | 3    | Wrong dataset — must use `heatmapMissingData` with null cells                                       |
| C4  | Meter   | 0, 1 | Status zones and peak marker missing; wrong value (60 vs 56)                                        |
| C5  | Meter   | 4    | Status zones and peak marker missing on proportional                                                |
| C6  | Radar   | 2    | Wrong dataset — must use `radarWithMissingDataData` (Sugar/Oil/Water × cities)                      |
| C7  | Radar   | 3    | Wrong dataset — must use `radarDenseData` (months × activities)                                     |
| C8  | Radar   | 4    | Wrong dataset — must use `radarWithCustomMaxScore` (single product, maxValue: 100)                  |
| C9  | Treemap | 0    | Color per-leaf (43) vs per-parent (6) — completely different visual                                 |
| C10 | Treemap | 1    | Custom teal ramp required; ECharts shows categorical palette                                        |
| C11 | Pie     | 1    | Wrong option (`pieWithPercentage` instead of centered layout)                                       |

### 🟠 Significant — Wrong Data or Missing Feature

| ID  | Chart     | Slot | Issue                                                                                      |
| --- | --------- | ---- | ------------------------------------------------------------------------------------------ |
| S1  | Area      | 2    | Wrong sparkline data — 10 plain-string rows vs 30 ISO-timestamp rows                       |
| S2  | Area      | 5    | Bounded highlights stripped — `min`/`max` fields lost, stacked area is wrong approximation |
| S3  | Area      | 6    | Zoombar uses 3-group `timeSeriesData` instead of `dataBounded`                             |
| S4  | Bar       | 7    | Y-axis domain `[-100000, 100000]` not applied                                              |
| S5  | Bar       | 8    | Custom per-bar colors (`#925699`, `#525669`) not applied                                   |
| S6  | Bar       | 11   | Additional legend items (Line, area bands, quartile, size, radius) absent                  |
| S7  | Bar       | 12   | Japanese locale not applied — axis renders in English                                      |
| S8  | Bar       | 13   | Wrong data — uses short standard labels instead of long hex-hash names                     |
| S9  | Line      | 0    | Custom axis domain not applied — full range shown                                          |
| S10 | Line      | 4    | Custom series colors not applied                                                           |
| S11 | Line      | 5    | Wrong dataset + pre-selected group visibility not implemented                              |
| S12 | Line      | 6    | Legend orientation/position (left vertical) not applied                                    |
| S13 | Line      | 8    | Wrong dataset — short labels instead of long-label truncation data                         |
| S14 | Scatter   | 3    | Dual Y-axis not implemented — `createScatterOptions` has no `secondaryGroups`              |
| S15 | Histogram | 3    | Bin edges `[20,40,50,60,90]` not replicated — `binWidth: 20` produces wrong boundaries     |

### 🟡 Minor — Missing Feature / Documented Limitation

| ID  | Chart     | Slot(s) | Issue                                                                                        |
| --- | --------- | ------- | -------------------------------------------------------------------------------------------- |
| M1  | Bar       | 4       | Carbon mixed scalar+tuple normalised to all-tuples — base offsets for "More"/"Sold" become 0 |
| M2  | Bar       | 9       | Legend centering not applied                                                                 |
| M3  | Bar       | 10      | Legend order not replicated                                                                  |
| M4  | Meter     | 2       | Peak marker absent; value mismatch (60 vs 56)                                                |
| M5  | Meter     | 3, 5    | Pairing-2 color palette vs categorical; unit/truncation labels absent                        |
| M6  | Heatmap   | 0       | Legend orientation (vertical right vs horizontal bottom); no legend title                    |
| M7  | Heatmap   | 1       | Continuous vs quantized legend type mismatch                                                 |
| M8  | Heatmap   | 4       | `colorDomain` range extension (0–150) not applied to `visualMap`                             |
| M9  | Heatmap   | 5       | Y-axis month order not explicitly enforced                                                   |
| M10 | Histogram | 0, 1, 2 | Multi-group stacking absent (3 datasets collapse to single-series count)                     |
| M11 | Line      | 7       | Vertical X-axis threshold at `2023-01-11` missing; fill colors absent                        |
| M12 | Radar     | 1       | Centered alignment not applied                                                               |
| M13 | Tree      | 0       | Layout style: radial dendrogram vs rectangular LR tree (inherent library difference)         |
| M14 | Tree      | 1       | ECharts TB orientation vs Carbon LR — orientation mismatch                                   |
| M15 | Scatter   | 0       | Axis titles ("No. of employees", "Annual sales") absent                                      |
| M16 | Bubble    | 0       | Axis titles absent; x-axis may render as categorical string                                  |
| M17 | Area      | 1, 7    | Documented: no alwaysShowRulerTooltip / no skeleton state                                    |
| M18 | Alluvial  | 0, 2    | Node colour-by-category not replicated (ECharts Sankey has no category concept)              |

---

## Code Blocks — Full Gap List

Pages where **zero** slots have a code block:

- Area (8 slots)
- Boxplot (2 slots)
- Bubble (5 slots)
- Combo (11 slots)
- Gauge (3 slots)
- Heatmap (6 slots)
- Histogram (4 slots)
- Line (14 slots)
- Lollipop (2 slots)
- Meter (6 slots)
- Network (2 slots)
- Radar (5 slots)
- Scatter (5 slots)
- Tree (2 slots)
- Treemap (2 slots)
- Wordcloud (3 slots)

Pages with **partial** code block coverage:

- Alluvial: slots 0–1 ✅, slots 2–5 ❌
- Bar: slots 0–6 ✅, slots 7–13 ❌
- Pie: slots 0–1 ✅, slot 2 ❌

Pages with **full** code block coverage:

- Donut: all 3 slots ✅

**Total: 12 of ~108 comparable slots have code blocks (11%).**

---

## Recommended Fix Priority

### Priority 1 — Data Bugs (broken rendering)

Fix C1 (Line-13 dual-axis data), C2–C3 (Heatmap wrong datasets), C6–C8 (Radar wrong datasets). These produce empty or completely wrong charts.

### Priority 2 — Wrong Options Wired (slot misconfiguration)

Fix C4–C5 (Meter status zones + peak marker), C9–C10 (Treemap color-per-parent), C11 (Pie slot 1 wrong option), S1–S3 (Area sparkline/bounded/zoombar), S8 (Bar-13 wrong data), S13 (Line-8 wrong data).

### Priority 3 — Missing Features (legitimate preset gaps)

S4–S7 (Bar domain/colors/legend/locale), S9–S14 (Line domain/colors/legend), S14 (Scatter dual-axis), S15 (Histogram bin edges).

### Priority 4 — Code Blocks (bulk authoring pass)

All 96 slots currently missing code blocks. Recommend a single pass after Priority 1–3 are resolved so code samples reflect the corrected implementations.
