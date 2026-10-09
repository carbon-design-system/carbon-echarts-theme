# Remaining Work Plan — Carbon ECharts Theme

> **Last updated:** after extract.ts refactor session (June 2025).

---

## Current state snapshot

| Area                         | State                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| `pnpm test` (packages/theme) | ✅ 192 tests pass                                                  |
| `pnpm tsc --noEmit`          | ✅ Clean                                                           |
| extract.ts refactor          | ✅ Done — split into 14 per-chart-type files under `core/extract/` |
| Site pages                   | ✅ All 30 chart pages exist and are routed                         |
| Visual parity                | ⚠️ Many known deltas — see docs/08 and docs/09                     |
| Toolbar tests                | ❌ `__tests__/` is empty                                           |
| Codemods                     | ❌ Not started                                                     |
| Migration guides             | ❌ Not started                                                     |

---

## Architecture rules (never deviate)

1. **All structural logic belongs in `packages/theme/src/presets/`** — never in data files or page components.
2. **All palette colors must come from `pickColors()` or named exports from `palettes.ts`** — never hardcode hex in presets or data files (exception: user-supplied `colors` map params passed through as-is).
3. **Data files (`packages/site/src/data/echarts/*.ts`)** only call preset functions with data — no logic.
4. **Page files** only import from data files and wire props — no option construction.
5. Every fix must be a general preset option, not a one-off bespoke hack.

---

## Work queue

### High priority

| ID  | Area    | Task                                                                                                                                                                  |
| --- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W1  | Toolbar | Write tests in `packages/toolbar/src/__tests__/` — at minimum one test per extractor in `extract/`. See `docs/11-code-review.md` finding #13 for suggested structure. |
| W2  | Theme   | Write tests for `skeleton.ts` — `createSkeletonCSS` and `getSkeletonTokens` are pure and easy to cover. See `docs/11-code-review.md` finding #14.                     |
| W3  | Visual  | Work through the critical (🔴) issues in `docs/09-visual-audit-report.md` — C1–C11 are broken or empty renders.                                                       |

### Medium priority

| ID  | Area         | Task                                                                                                                                                                                   |
| --- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W4  | Visual       | Fix significant (🟠) issues in `docs/09-visual-audit-report.md` — S1–S15 are wrong data or missing features.                                                                           |
| W5  | Code quality | Address findings from `docs/11-code-review.md`: `toArray` helper (#1), shared `resolveValue` helper (#2), floating-bar dedup (#3), `GRID` constant (#6), `tokens.ts` pick helper (#7). |
| W6  | Site         | Add missing `.github/` community health files: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`.                                                                   |

### Low priority / future

| ID  | Area     | Task                                                                                                          |
| --- | -------- | ------------------------------------------------------------------------------------------------------------- |
| W7  | Codemods | Implement `packages/codemods/` — see `docs/06-phase-6-migration-codemods.md` for spec.                        |
| W8  | Docs     | Write migration guides (`docs/migration-carbon-charts-to-echarts.md`, `docs/migration-echarts-to-carbon.md`). |
| W9  | CI       | Wire up Mend scan (blocked on IBM PSIRT registration — see `.github/ISSUE_TEMPLATE/mend-scan-setup.md`).      |
| W10 | CI       | Consider adding AVT (IBM Equal Access) job to `ci.yml`.                                                       |

---

## Known ECharts limitations (do not attempt to fix)

| Carbon Feature                        | Status                                                                |
| ------------------------------------- | --------------------------------------------------------------------- |
| `tooltip.alwaysShowRulerTooltip`      | 🔶 No ECharts equivalent — document                                   |
| Skeleton / loading state              | 🔶 `showSkeleton()` from `@carbon/echarts-theme/skeleton` covers this |
| Bounded highlights (min/max bands)    | 🔶 Approximated as stacked area                                       |
| Custom locale per chart               | 🔶 ECharts uses `echarts.registerLocale()` globally — document        |
| Additional legend items (Bar slot 11) | 🔶 No ECharts equivalent                                              |
| Custom bin edges (Histogram slot 3)   | 🔶 ECharts bin width only, not arbitrary edges                        |
| Circlepack                            | 🔶 No native packed-circle layout — stub page                         |
| Choropleth                            | 🔶 Requires consumer-provided GeoJSON + `echarts.registerMap()`       |
| Bullet chart                          | 🔶 Requires layered bar approximation — not yet implemented           |
