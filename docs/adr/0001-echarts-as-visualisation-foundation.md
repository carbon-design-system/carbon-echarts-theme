# ADR 0001 — Apache ECharts as the IBM / Carbon visualisation foundation

**Status:** Accepted  
**Date:** 2025

---

## Context

IBM Software spans React, Angular, Vue, and vanilla JS codebases. A standard charting library needs to work across all of them without a framework-specific fork. The chosen solution must also satisfy IBM open-source governance requirements and perform well on real enterprise data volumes.

## Decision

Adopt Apache ECharts as the charting engine underpinning the Carbon design system's data visualisation standard. `@carbon/echarts-theme` provides a Carbon-aligned theme layer on top of it.

## Rationale

| Factor                      | Detail                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Framework agnosticism**   | Works with React, Angular, Vue, Svelte, and vanilla JS via thin adapters — one package serves the entire IBM Software portfolio |
| **Apache governance**       | Top-level Apache project with a formal release process and long-term support expectations; aligns with IBM open-source posture  |
| **Performance**             | Canvas renderer handles 100k+ point datasets; SVG fallback available                                                            |
| **Chart coverage**          | 20+ built-in chart types covering all Carbon Charts parity targets plus extended types                                          |
| **TypeScript**              | Full type definitions shipped                                                                                                   |
| **Carbon Charts alignment** | `@carbon/charts` internally migrated to ECharts; this project builds on that foundation rather than diverging from it           |

Framework agnosticism is the decisive factor: a design-system-level standard must serve every IBM product team regardless of their JS framework.

## Consequences

- ECharts is a **peer dependency** — never bundled into `@carbon/echarts-theme`.
- Framework adapters (`echarts-for-react`, `ngx-echarts`, `vue-echarts`) are the responsibility of consuming applications.
- The theme output is a plain JS object, usable with any ECharts adapter or directly via `echarts.init()`.
- The package tracks ECharts 5.x as the minimum supported version.
