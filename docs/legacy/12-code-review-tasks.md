# Code Review — Implementation Tasks

> **Source:** `docs/11-code-review.md` — 14 findings → 13 tasks
> **Recommended PR sequence:** PR 1 → PR 2 → PR 3 → PR 4 (T12 any time, T13 last)

---

## Sequencing rationale

- **WS1 first** — T1/T2/T6 clean up `extract/index.ts` before T11 moves `buildTableData` out of it. The function should be in its final state before being relocated.
- **T8 before T10** — extract the shared floating-bar helper first, so that when `createBarOptions` is split in T10 the floating branch is already a one-line delegate, not 70 lines of inline code.
- **Tests last (T13)** — if written now, import paths would shift after T11 moves `buildTableData` to `extract/build.ts`. Writing tests after the structure settles means writing them once.
- **T12 (skeleton tests) is fully independent** — slots into any PR at any time.

---

## Work stream 1 — Quickfixes

> All XS. Independent of each other. Can be done as a single PR with no functional changes.

### T1 — Assign `activeSeries` once

**Audit finding:** #12 · **Effort:** XS

**File:** `packages/toolbar/src/core/extract/index.ts`

Replace the 5+ occurrences of the inline fallback:

```ts
visibleSeries.length ? visibleSeries : series
```

with a single assignment directly after `visibleSeries` is defined:

```ts
const activeSeries = visibleSeries.length ? visibleSeries : series
```

Use `activeSeries` everywhere below that point.

---

### T2 — Extract `toArray` helper

**Audit finding:** #1 · **Effort:** XS

**File:** `packages/toolbar/src/core/extract/index.ts`

The coerce-to-array pattern appears twice identically (heatmap branch and category-axis block):

```ts
Array.isArray(opt) ? opt : opt ? [opt] : []
```

Add a module-level helper and replace both occurrences:

```ts
const toArray = <T>(v: T | T[] | undefined | null): T[] => (Array.isArray(v) ? v : v ? [v] : [])
```

---

### T3 — Document public API scope of the `extract.ts` shim

**Audit finding:** #5 · **Effort:** XS

**File:** `packages/toolbar/src/core/extract.ts`

Add a comment making the intentional scoping explicit:

```ts
// Re-exports only the public API surface of the extract module.
// Individual per-chart extractors (extractBarData, extractRadar, etc.)
// are intentionally not re-exported — they are internal implementation
// details. Consumers should use buildTableData only.
export { buildTableData } from './extract/index'
export type { TableData } from './extract/types'
```

---

### T4 — Move `GRID` constant to `_constants.ts`

**Audit finding:** #6 · **Effort:** XS

**Files:** new `packages/theme/src/presets/_constants.ts`, all preset files that declare it locally

Create `_constants.ts`:

```ts
/** Shared grid layout matching Carbon Charts' default chart spacing. */
export const GRID = {
  top: 48,
  bottom: 56,
  left: 48,
  right: 24,
  containLabel: true,
} as const
```

Replace the identical local `const GRID = ...` declaration in every preset file (`bar.ts`, `line.ts`, `area.ts`, `combo.ts`, `scatter.ts`, `donut.ts`, `gauge.ts`, `heatmap.ts`, `histogram.ts`, `boxplot.ts`, `lollipop.ts`, `alluvial.ts`, `treemap.ts`) with:

```ts
import { GRID } from './_constants'
```

`line.ts`'s `LEGEND_SIDE_WIDTH` constant stays local — it's not shared.

---

### T5 — Re-export `groupSparse` from presets barrel

**Audit finding:** #8 · **Effort:** XS

**File:** `packages/theme/src/presets/index.ts`

`groupByGroup` is already exported. Add `groupSparse` alongside it in the shared transform re-export block:

```ts
export { groupByGroup, groupSparse, pickColors, sunburstPalette } from './_transform'
```

If there's a deliberate reason to keep it internal (it isn't — it's directly useful for custom time-series presets), add a comment to `_transform.ts` instead.

---

### T6 — Extract `isLollipopSeries` to `lollipop.ts`

**Audit finding:** #9 · **Effort:** XS

**Files:** `packages/toolbar/src/core/extract/index.ts`, `packages/toolbar/src/core/extract/lollipop.ts`

Move the ~20-line inline lollipop detection predicate out of `buildTableData` into a named export in `lollipop.ts`:

```ts
// lollipop.ts
export function isLollipopSeries(series: any[]): boolean {
  return (
    series.length >= 2 &&
    (series[0]?.type ?? '').toLowerCase() === 'scatter' &&
    series.every((s: any, i: number) =>
      i % 2 === 0
        ? (s.type ?? '').toLowerCase() === 'scatter'
        : (s.type ?? '').toLowerCase() === 'bar' && s.silent === true,
    )
  )
}
```

Import and call it in `index.ts`:

```ts
import { extractLollipop, isLollipopSeries } from './lollipop'
// ...
if (isLollipopSeries(series)) {
  // ...
}
```

The dispatch stays a uniform list of simple guards. The detection logic becomes independently testable.

---

## Work stream 2 — New shared helpers

> Must land before work stream 3.

### T7 — Extract `resolveValue` to `extract/utils.ts`

**Audit finding:** #2 · **Effort:** S

**Files:** new `packages/toolbar/src/core/extract/utils.ts`, `category-axis.ts`, `histogram.ts`, `heatmap.ts`, `links.ts`

Audit the four copies of the raw-value unwrapping idiom. The common logic is:

1. If raw is a non-array object with a `.value` property, read `.value`
2. If the result is an array, take `[1] ?? [0]`
3. If the result is still an object, `JSON.stringify` it

The copies are not identical — `category-axis.ts` handles the floating-bar `[base, end]` tuple differently. Identify the superset, then:

```ts
// extract/utils.ts
/**
 * Normalises a raw ECharts data item to a primitive value suitable for
 * tabular display. Handles the three data-item shapes ECharts uses:
 *   - Plain scalar
 *   - { value: N } wrapper
 *   - [base, end] tuple (floating bar) — returns end value
 */
export function resolveValue(raw: unknown): unknown {
  if (raw === null || raw === undefined) return null
  if (Array.isArray(raw)) return raw[1] ?? raw[0]
  if (typeof raw === 'object') {
    const v = (raw as any).value
    if (Array.isArray(v)) return v[1] ?? v[0]
    if (v !== null && typeof v === 'object') return JSON.stringify(v)
    return v ?? null
  }
  return raw
}
```

Replace the inline pattern at each call site. Add unit tests in T13.

---

### T8 — Extract `buildFloatingSeries` to `presets/_series.ts`

**Audit finding:** #3 · **Effort:** S

**Files:** new `packages/theme/src/presets/_series.ts`, `bar.ts`, `combo.ts`

The floating-bar invisible-base + visible-offset pair logic is copy-pasted between `bar.ts` (~lines 157–228) and `combo.ts` (~lines 131–173). The only structural difference is `combo.ts` spreads an extra `secondaryAxisValue` object.

Create `_series.ts`:

```ts
import type { SeriesOption } from 'echarts'

export interface FloatItem {
  base: number
  top: number
}

/**
 * Builds the [invisible-base, visible-offset] bar series pair used by
 * floating bar charts. Pass extraProps to add axis-index overrides (combo).
 */
export function buildFloatingSeries(
  groupName: string,
  cats: string[],
  rowMap: Map<string, FloatItem>,
  color: string,
  extraProps: Record<string, unknown> = {},
): [SeriesOption, SeriesOption] {
  return [
    {
      type: 'bar',
      name: `__base_${groupName}`,
      stack: `float_${groupName}`,
      data: cats.map((c) => ({ value: rowMap.get(c)?.base ?? 0, name: c })),
      itemStyle: { color: 'transparent' },
      legendHoverLink: false,
      silent: true,
      emphasis: { disabled: true },
      ...extraProps,
    } as SeriesOption,
    {
      type: 'bar',
      name: groupName,
      stack: `float_${groupName}`,
      colorBy: 'series',
      data: cats.map((c) => ({ value: rowMap.get(c)?.top ?? 0, name: c })),
      itemStyle: { color },
      ...extraProps,
    } as SeriesOption,
  ]
}
```

Replace the inline logic in both `bar.ts` and `combo.ts` with calls to `buildFloatingSeries`.

---

### T9 — Refactor `tokens.ts` to use a `pick` helper

**Audit finding:** #7 · **Effort:** S

**File:** `packages/theme/src/tokens.ts`

Replace the four manually-typed objects (each listing the same 11 properties) with a single `TOKEN_KEYS` declaration and a typed `pick`:

```ts
import { white, g10, g90, g100 } from '@carbon/themes'

export type ThemeKey = 'white' | 'g10' | 'g90' | 'g100'

// The 11 Carbon token properties the theme package exposes.
// Add a new token here and all four themes get it automatically.
const TOKEN_KEYS = [
  'background',
  'layer01',
  'layer02',
  'layerAccent01',
  'textPrimary',
  'textSecondary',
  'textDisabled',
  'borderSubtle00',
  'borderSubtle01',
  'borderStrong01',
  'interactive',
] as const satisfies (keyof typeof white)[]

const themeMap = { white, g10, g90, g100 } as const

function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as Pick<T, K>
}

export interface CarbonChartTokens extends Pick<typeof white, (typeof TOKEN_KEYS)[number]> {}

export const tokens = Object.fromEntries(
  (Object.keys(themeMap) as ThemeKey[]).map((k) => [k, pick(themeMap[k], TOKEN_KEYS)]),
) as Record<ThemeKey, CarbonChartTokens>
```

Run `pnpm test` to confirm token values are unchanged (the existing token tests provide full coverage).

---

## Work stream 3 — Structural refactors

> T10 depends on T8 landing. T11 depends on T1/T2/T6 (WS1) landing.

### T10 — Split `createBarOptions` into private branch helpers

**Audit finding:** #10, #11 · **Effort:** M

**File:** `packages/theme/src/presets/bar.ts`

Requires T8 (floating series helper already extracted).

The three top-level branches each return early and can be private functions:

1. Extract `buildAxisLabelOpt(truncateLabels?: number, formatter?: (v: string) => string)` — returns the `axisLabel` partial option or `{}`. Replaces the duplicated conditional-spread construction that appears identically for both horizontal and vertical axis in the simple-discrete and multi-series paths.

2. Extract `buildSimpleDiscreteBarOption(groups, categories, opts, localeFormatter?, horizontal?)` — contains the current `if (resolvedXField === 'group')` branch body. Returns `EChartsOption`.

After these extractions, `createBarOptions` becomes a coordinator:

```ts
export function createBarOptions(data, opts = {}): EChartsOption {
  // resolve xField, localeFormatter, dateAxisFormatter
  // call groupByGroup
  if (floating) return buildFloatingSeries(...)   // T8
  if (resolvedXField === 'group') return buildSimpleDiscreteBarOption(...)
  // multi-series path (remaining ~60 lines)
}
```

All private helpers stay in the same file (not exported). Run the full preset test suite after each extraction to verify no output change.

---

### T11 — Move `buildTableData` to `extract/build.ts`

**Audit finding:** #4 · **Effort:** M

**Files:** new `packages/toolbar/src/core/extract/build.ts`, `packages/toolbar/src/core/extract/index.ts`

Requires T1, T2, T6 (WS1 quickfixes done first so the function is already clean).

1. Create `extract/build.ts` containing only `buildTableData` and its imports from the sub-extractor files.
2. Update `extract/index.ts` to be a pure barrel:

```ts
// All sub-extractors
export { extractTimeSeries } from './time-series'
export { extractHistogram } from './histogram'
// ... all others ...

// Types
export type { TableData } from './types'

// Main dispatch — lives in build.ts
export { buildTableData } from './build'
```

3. The backwards-compat shim at `core/extract.ts` requires no change — it still points to `./extract/index`.
4. Run `pnpm build` and confirm the public API is unchanged.

---

## Work stream 4 — Tests

> T12 is independent. T13 should be written last, after T11 settles the final file structure.

### T12 — Add `skeleton.ts` unit tests

**Audit finding:** #14 · **Effort:** S

**File:** `packages/theme/src/__tests__/skeleton.test.ts` (new)

Three test groups, no DOM required:

```ts
describe('getSkeletonTokens', () => {
  it('returns correct token values for each theme', () => {
    // assert background + layerAccent01 hex values match tokens[theme]
  })
})

describe('createSkeletonCSS', () => {
  it('includes the theme-scoped keyframe name', () => {
    // assert output contains `@keyframes _cc-sk-shimmer-g90`
  })
  it('includes the background-color token', () => {
    // assert output contains the g90 background hex
  })
  it('uses the provided selector', () => {
    // createSkeletonCSS('white', '.my-skeleton')
    // assert output contains `.my-skeleton {`
  })
})

describe('skeletonCSS', () => {
  it('has entries for all four theme keys', () => {
    expect(Object.keys(skeletonCSS)).toEqual(['white', 'g10', 'g90', 'g100'])
  })
})
```

---

### T13 — Write toolbar extract tests

**Audit finding:** #13 · **Effort:** L

**Files:** `packages/toolbar/src/__tests__/extract/` (14 new test files)

Set up Vitest in the toolbar package. Each test file takes a minimal mock ECharts instance — a plain object with `getOption()` returning a crafted option — and asserts the returned `TableData` shape.

Testing approach per file:

| File                    | What to assert                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `utils.test.ts`         | `resolveValue` edge cases: null, scalar, `{value:N}`, `[base,end]`, `{value:[...]}`, object → JSON      |
| `build.test.ts`         | `buildTableData` dispatch routing — one test per chart-type branch, confirms correct headers/rows shape |
| `time-series.test.ts`   | Group column, date column formatted correctly, null rows skipped                                        |
| `category-axis.test.ts` | Wide pivot headers, long-format headers, combo long-format                                              |
| `histogram.test.ts`     | Range labels (`"20 – 25"`), bin count = categoryData.length - 1                                         |
| `lollipop.test.ts`      | `isLollipopSeries` detection, horizontal vs vertical, correct row count                                 |
| `scatter.test.ts`       | 2-col scatter, 3-col bubble with Size header                                                            |
| `heatmap.test.ts`       | Index → label resolution, flat fallback                                                                 |
| `boxplot.test.ts`       | IQR computed, outliers joined as string, `–` when none                                                  |
| `radar.test.ts`         | One column per indicator, one row per data entry                                                        |
| `gauge.test.ts`         | Phantom series skipped, fallback to first series with data                                              |
| `hierarchy.test.ts`     | Leaf-only rows, `>` path separator                                                                      |
| `links.test.ts`         | Numeric node IDs resolved to names, object values JSON-stringified                                      |
| `parallel.test.ts`      | `parallelAxis` names used as headers, `dim0` fallback                                                   |

Mock pattern:

```ts
function makeInstance(option: object) {
  return { getOption: () => option } as any
}
```
