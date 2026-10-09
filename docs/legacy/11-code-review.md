# Code Review — carbon-echarts-theme

**Scope:** `packages/theme` · `packages/toolbar` · post `extract.ts` refactor
**Date:** June 2025

---

## Overall Assessment

The codebase is in genuinely good shape. The `extract.ts` refactor landed cleanly, and the wider codebase already reflects deliberate design decisions — typed boundaries, clear separation of concerns, and good JSDoc coverage. The findings below are all incremental improvements; none signal a structural problem.

---

## Code Smells

### 1. Duplicated axis-normalisation block

**File:** `packages/toolbar/src/core/extract/index.ts` (lines 86–115)

The `xAxisArr` / `yAxisArr` coerce-to-array pattern appears twice in `buildTableData` — once for the heatmap branch and once for the general category-axis block. The logic is identical:

```ts
Array.isArray(opt) ? opt : opt ? [opt] : []
```

This should be a small helper (e.g. `toArray`) called at the top of the function and shared by both branches. As-is it's easy to fix one copy and forget the other.

---

### 2. Repeated raw-value unwrapping pattern across multiple extractors

**Files:** `extract/category-axis.ts`, `histogram.ts`, `heatmap.ts`, `links.ts`

Four files independently replicate the same defensive data-normalisation idiom:

> _"if raw is a non-array object, read `.value`; if Array, read `[1] ?? [0]`; if still an object, `JSON.stringify`"_

The logic is not quite identical in each copy — `category-axis.ts` handles floating bar tuples slightly differently from `histogram.ts`. Extracting a shared `resolveValue(raw: unknown): unknown` helper into `types.ts` (or a new `utils.ts`) would eliminate the drift risk and reduce each call site to one line.

---

### 3. Floating-bar construction duplicated between bar.ts and combo.ts

**Files:** `packages/theme/src/presets/bar.ts` (~lines 157–228), `combo.ts` (~lines 131–173)

The floating-bar series pair logic — invisible base + visible offset, `__base_` name prefix, `stack: float_` key, transparent `itemStyle` — is copy-pasted between the bar and combo presets with only minor differences (the combo version threads in `secondaryAxisValue`). Any bug fix must be applied in two places. A shared helper, e.g.:

```ts
buildFloatingSeries(groupName, cats, rowMap, color, extraProps?)
```

extracted to `_transform.ts` or a new `_series.ts` would halve this surface.

---

## Structure

### 4. `extract/index.ts` doubles as orchestrator and barrel

**File:** `packages/toolbar/src/core/extract/index.ts`

`index.ts` currently does three things:

1. Re-exports all sub-extractors
2. Defines `buildTableData` (the 200+ line main dispatch function)
3. Re-exports types

Moving `buildTableData` to a sibling `build.ts` and having `index.ts` only re-export would mirror the pattern the rest of the codebase follows — every other module has a single clear responsibility. It also makes the barrel less noisy to scan.

---

### 5. Public API scope of the `extract.ts` compat shim is undocumented

**File:** `packages/toolbar/src/core/extract.ts`

The backwards-compatibility shim only re-exports `buildTableData` and `TableData`, not the individual extractors. The top-level `packages/toolbar/src/index.ts` re-exports from the shim (`export * from './core/extract'`), which means consumers only get `buildTableData` and `TableData` from the package root — the individual extractor functions are not publicly reachable without a deep import. If that's intentional (public API is just `buildTableData`), a comment to that effect would make the deliberate scoping clear.

---

### 6. `GRID` constant redeclared in every preset file

**Files:** `packages/theme/src/presets/bar.ts`, `line.ts`, `combo.ts`, `scatter.ts`, …

```ts
const GRID = { top: 48, bottom: 56, left: 48, right: 24, containLabel: true }
```

This constant is copy-declared in every preset file that builds a chart. Moving it to `_transform.ts` — or a small `_constants.ts` — and importing it would be a one-line change per file and remove the risk of an accidental inconsistency. Note that `line.ts` also adds a `LEGEND_SIDE_WIDTH` constant on top of `GRID`; that would remain local.

---

### 7. `tokens.ts` has heavy repetition across all four theme objects

**File:** `packages/theme/src/tokens.ts` (lines 23–76)

The token map is built by manually listing the same 11 properties for each of the four Carbon theme objects. Adding a new token requires touching four separate blocks. A `pick(themeObj, keys)` utility or a mapped type helper would make `tokens.ts` a single declaration of which keys to extract, applied uniformly across all four themes — easier to audit for completeness and extend.

```ts
// Example direction:
const TOKEN_KEYS = ['background', 'layer01', ...] as const
export const tokens = Object.fromEntries(
  (['white', 'g10', 'g90', 'g100'] as const).map(k => [k, pick(themeMap[k], TOKEN_KEYS)])
) as Record<ThemeKey, CarbonChartTokens>
```

---

## Readability

### 8. `groupSparse` is missing from the presets barrel

**Files:** `packages/theme/src/presets/_transform.ts`, `presets/index.ts`

`groupByGroup` is re-exported from the presets barrel for external consumers. `groupSparse` is not, even though it solves a distinctly different problem (time-series sparse grouping vs. padded category grouping). Either export it alongside `groupByGroup`, or add a comment in `_transform.ts` explaining why it's intentionally internal-only.

---

### 9. Lollipop detection is the only complex inline predicate in `buildTableData`

**File:** `packages/toolbar/src/core/extract/index.ts` (lines 139–158)

All other chart-type guards in the dispatch are simple string equality checks (`type0 === 'radar'`, etc.). The lollipop detection predicate is ~20 lines of structural analysis inline. Extracting it to:

```ts
// in lollipop.ts
export function isLollipopSeries(series: any[]): boolean { ... }
```

would mirror how `extractLollipop` is already isolated, keep the dispatch readable, and make the detection logic independently testable.

---

### 10. `createBarOptions` has three top-level structural branches

**File:** `packages/theme/src/presets/bar.ts`

`createBarOptions` handles floating, simple-discrete, and multi-series bars through three top-level `if` branches inside a single 300-line function. Each branch already returns early, so they could be cleanly extracted as private helpers:

- `buildFloatingBarOption(data, opts, groups, cats)` → returns `EChartsOption`
- `buildSimpleDiscreteBarOption(data, opts, groups, cats)` → returns `EChartsOption`

This would leave the main function as a ~50-line coordinator — much easier to trace through for a new contributor.

---

### 11. Axis label spread nesting in `bar.ts` is deeply nested and duplicated

**File:** `packages/theme/src/presets/bar.ts` (lines 280–325)

The `axisLabel` conditional spread construction is written out twice (once for horizontal, once for vertical) and is hard to parse:

```ts
...(opts.truncateLabels || localeFormatter
  ? {
      axisLabel: {
        ...(opts.truncateLabels && !localeFormatter
          ? { formatter: makeTruncateFormatter(opts.truncateLabels) }
          : {}),
        ...(localeFormatter ? { formatter: localeFormatter } : {}),
      },
    }
  : {})
```

A small helper like `buildAxisLabelOpt(truncateLabels, formatter)` would reduce both call sites to one line and make the formatter precedence logic explicit and testable.

---

### 12. `visibleSeries.length ? visibleSeries : series` repeated 5+ times

**File:** `packages/toolbar/src/core/extract/index.ts`

The `visibleSeries.length ? visibleSeries : series` fallback appears five or more times across `buildTableData`. Assigning it once, directly after `visibleSeries` is defined, and using it throughout would remove the repetition entirely:

```ts
const activeSeries = visibleSeries.length ? visibleSeries : series
```

---

## Test Coverage Gaps

### 13. `packages/toolbar/src/__tests__/` is empty

**File:** `packages/toolbar/src/__tests__/.gitkeep`

The toolbar package has a tests directory with only a `.gitkeep`. The extract refactor is exactly the kind of change that benefits from unit tests to confirm each extractor returns the expected `TableData` shape. Given the complexity of the dispatch logic in `buildTableData` (14+ chart-type branches), even a lightweight test per branch would be high-value and catch regressions from future refactors.

Suggested structure:

```
src/__tests__/
  extract/
    build.test.ts          # buildTableData dispatch (integration)
    category-axis.test.ts
    time-series.test.ts
    histogram.test.ts
    lollipop.test.ts
    scatter.test.ts
    heatmap.test.ts
    boxplot.test.ts
    radar.test.ts
    gauge.test.ts
    hierarchy.test.ts
    links.test.ts
    parallel.test.ts
```

---

### 14. `skeleton.ts` has no test coverage

**File:** `packages/theme/src/skeleton.ts` (no matching test file)

`skeleton.ts` exports three public API functions (`showSkeleton`, `getSkeletonTokens`, `createSkeletonCSS`) and a pre-built `skeletonCSS` map. The CSS-generation functions are pure and easy to test without a DOM. `getSkeletonTokens` in particular is trivial to cover and would guard against accidental token name drift between `tokens.ts` and the skeleton's destructuring.

---

## Quick Reference

| #   | Category    | File(s)                                                              | Effort |
| --- | ----------- | -------------------------------------------------------------------- | ------ |
| 1   | Smell       | `extract/index.ts`                                                   | XS     |
| 2   | Smell       | `extract/category-axis.ts`, `histogram.ts`, `heatmap.ts`, `links.ts` | S      |
| 3   | Smell       | `presets/bar.ts`, `presets/combo.ts`                                 | M      |
| 4   | Structure   | `extract/index.ts`                                                   | S      |
| 5   | Structure   | `toolbar/src/core/extract.ts`                                        | XS     |
| 6   | Structure   | `presets/*.ts`                                                       | XS     |
| 7   | Structure   | `theme/src/tokens.ts`                                                | S      |
| 8   | Readability | `presets/index.ts`                                                   | XS     |
| 9   | Readability | `extract/index.ts` + `lollipop.ts`                                   | XS     |
| 10  | Readability | `presets/bar.ts`                                                     | M      |
| 11  | Readability | `presets/bar.ts`                                                     | S      |
| 12  | Readability | `extract/index.ts`                                                   | XS     |
| 13  | Tests       | `toolbar/src/__tests__/`                                             | L      |
| 14  | Tests       | `theme/src/__tests__/`                                               | S      |
