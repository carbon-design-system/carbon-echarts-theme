# Roadmap & Work Queue

Outstanding work in priority order. See [`current-state.md`](./current-state.md) for a full snapshot of what is already complete.

---

## High priority

| ID  | Area    | Task                                                                                                                                                                                               |
| --- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W1  | Toolbar | Write tests in `packages/toolbar/src/__tests__/` — minimum one test per extractor in `core/extract/`. See `docs/legacy/12-code-review-tasks.md` T13 for suggested file structure and mock pattern. |
| W2  | Theme   | Write tests for `skeleton.ts` — `createSkeletonCSS` and `getSkeletonTokens` are pure and require no DOM. See T12 in the same doc.                                                                  |
| W3  | Visual  | Work through critical (🔴) issues C1–C11 in `docs/legacy/09-visual-audit-report.md` — broken or empty renders.                                                                                     |

---

## Medium priority

| ID  | Area         | Task                                                                                                                                                                                                            |
| --- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W4  | Visual       | Fix significant (🟠) issues S1–S15 in `docs/legacy/09-visual-audit-report.md` — wrong data or missing features.                                                                                                 |
| W5  | Code quality | Address code review findings from `docs/legacy/12-code-review-tasks.md`: `toArray` helper (T2), shared `resolveValue` helper (T7), floating-bar dedup (T8), `GRID` constant (T4), `tokens.ts` pick helper (T9). |
| W6  | Site         | Add missing GitHub community health files: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`.                                                                                                |

---

## Low priority / future

| ID  | Area     | Task                                                                                                                               |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| W7  | Codemods | Implement `packages/codemods/` — see `docs/legacy/06-phase-6-migration-codemods.md` for the component→preset mapping and CLI spec. |
| W8  | Docs     | Write migration guides: `docs/migration-carbon-charts-to-echarts.md` and `docs/migration-echarts-to-carbon.md`.                    |
| W9  | CI       | Wire up Mend scan — blocked on IBM PSIRT product registration (see `.github/ISSUE_TEMPLATE/mend-scan-setup.md`).                   |
| W10 | CI       | Add AVT (IBM Equal Access) job to `ci.yml`.                                                                                        |

---

## Code quality work streams

These are incremental improvements with no functional changes. Recommended PR sequence:

**WS1 (quickfixes, single PR):** T1 activeSeries assignment → T2 toArray → T3 extract.ts comment → T4 GRID constant → T5 groupSparse export → T6 isLollipopSeries extraction

**WS2 (new helpers, before WS3):** T7 resolveValue → T8 buildFloatingSeries → T9 tokens pick helper

**WS3 (structural, after WS2):** T10 createBarOptions split → T11 buildTableData → build.ts

**WS4 (tests, last):** T12 skeleton tests → T13 toolbar extract tests

Full task specs with exact file locations and code sketches are in `docs/legacy/12-code-review-tasks.md`.

---

## Known ECharts limitations — do not attempt to fix

| Carbon Feature                         | Decision                                                          |
| -------------------------------------- | ----------------------------------------------------------------- |
| `tooltip.alwaysShowRulerTooltip`       | No ECharts equivalent — document in Overview tab                  |
| Skeleton / loading state               | Covered by `showSkeleton()` from `@carbon/echarts-theme/skeleton` |
| Bounded highlights (min/max bands)     | Approximated as stacked area — document the delta                 |
| Custom locale per chart                | ECharts uses `echarts.registerLocale()` globally — document       |
| Additional legend items (Bar slot 11+) | No ECharts equivalent                                             |
| Custom bin edges (Histogram)           | ECharts bin width only — document                                 |
| Circle pack                            | No native packed-circle layout — stub page                        |
| Choropleth                             | Requires consumer-provided GeoJSON + `echarts.registerMap()`      |
| Bullet chart                           | Layered bar approximation — not yet implemented                   |
