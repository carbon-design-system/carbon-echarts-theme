# Engine-neutral packages — proposal

**Status:** Proposed
**Last updated:** November 2026

This document covers the proposal itself: what is being asked, the benefits, the costs and the risks. How it is built, what is done and the ordered work list are in [`engine-neutral-implementation.md`](./engine-neutral-implementation.md).

---

## 1. Proposal

Make `@carbon/echarts-theme` and `@carbon/echarts-toolbar` engine-neutral, so an adopter picks their charting engine (Apache ECharts or Semiotic) and still gets the Carbon theme and toolbar.

**Short answer: this is feasible.** The design data and the toolbar are shared across engines. Presets are **per engine by design**: a preset turns a Carbon chart object (`{ data, options }` in Carbon Charts' flat tabular format) into a ready-to-use config for one engine. Presets are not made generic, and each engine gets its own set.

### Background

`@carbon/charts` (d3) is not being extended. Under the replacement model, adopters render charts themselves and Carbon ships helper packages (theme, toolbar). This proposal asks what those helpers must look like if more than one engine is supported. Whether Semiotic should replace ECharts altogether is a separate question, covered in [`semiotic-single-engine-study.md`](./semiotic-single-engine-study.md). This proposal assumes the two-engine option (B) from that study.

### Current coupling, in short

Most of the packages are already engine-neutral: tokens, palettes, colour picking, data shaping, the skeleton loader, and the toolbar UI, CSS and export. Two parts are tied to ECharts: the ECharts theme with its 20 presets (about 4,900 lines), and the toolbar's table extraction (about 1,080 lines), which reads an ECharts `option`. Runtime ECharts imports are minimal. See the implementation doc §1 for the full table.

### Approach

| Piece                                                           | Shared or per engine |
| --------------------------------------------------------------- | -------------------- |
| Tokens, palettes, colour picking, data transform, skeleton      | Shared               |
| Toolbar UI, CSS, fullscreen, CSV and image export, chart source | Shared               |
| Theme mapping (Carbon tokens to the engine's theme format)      | Per engine           |
| Presets (Carbon chart object to ready-to-use engine config)     | Per engine           |
| Toolbar adapter (engine chart to chart source)                  | Per engine           |

- The theme package gets a neutral root plus one entry per engine (`./echarts`, `./semiotic`). The toolbar stays neutral apart from its ECharts-specific code (table extractors and the instance adapter), which moves to a single `./echarts` entry; it needs no `./semiotic` entry.
- The adopter installs only the engine they use, and sets no colours, fonts or axis options themselves.
- No `semiotic` dependency is added to the theme package. Existing ECharts usage keeps working.
- Colours come from the shared colour picking, so a chart gets the same colours in either engine.

Proof of concept: the simple bar and the line chart variations work with Semiotic, themed from the same tokens and using the same toolbar, side by side with ECharts in the site. Checked by unit tests, typechecks, builds and server-side renders, and verified on the local dev server. See the implementation doc §2.

---

## 2. Benefits

- **Adopter choice.** Teams pick ECharts or Semiotic and still get the Carbon look and the same toolbar.
- **One source of design truth.** Both engines are themed from the same tokens and the same colour picking, so charts match across engines.
- **No lock-in to a single engine decision.** The shared parts do not depend on how many Semiotic presets are eventually written. If Semiotic is later dropped, the neutral layout still stands; if ECharts is later dropped, the same is true.
- **Incremental.** Semiotic presets can be added chart type by chart type, with no forced parity with the ECharts set.
- **Non-breaking to start.** Phase 1 changes are additive; existing ECharts imports keep working.
- **Lighter installs.** `echarts` becomes an optional peer dependency, so a Semiotic-only adopter does not install it.
- **Smaller Semiotic presets, probably.** Semiotic's components already cover axes, legends and tooltips, so a Semiotic preset may be much shorter than its ECharts counterpart.
- **Keeps the adopter in control of rendering.** Presets return props or options that the adopter spreads into the engine's own component.

---

## 3. Costs

### Effort

- **Presets.** Each Semiotic preset is written once per chart type, and only for the types we choose to support. The ECharts set is 20 preset files and about 4,900 lines. Each Semiotic preset also needs a toolbar table builder, unit tests and a visual-parity check against Carbon Charts.
- **Theme work.** Semiotic's theme is small, so presets carry per-chart settings that the ECharts theme holds centrally (bar width, legend icon, axis and grid styling, per-series defaults).
- **Maintenance.** Two engine paths to keep in step with Carbon Design System token changes, and two sets of presets to test.
- **Remaining Phase 1 items.** Optional peer dependencies, a toolbar `./echarts` entry, an automated no-`echarts`-import test, and an ADR (implementation doc §6).

### Rename (Phase 2, only if Semiotic is offered)

- About 96 files reference `@carbon/echarts-theme` and 23 reference `@carbon/echarts-toolbar`.
- About 12 files carry repo and PR-title strings (release configuration, workflows, issue templates).
- npm publish under new names and deprecation of the old ones; telemetry `projectId` handling.
- Timing favours doing it early. The packages are published but not meant to be used yet and the API is not final, so 0.x minor bumps allow breaking changes cheaply. The cost rises once teams adopt.

### Package names

The current names put the engine in the name, which misleads once Semiotic code ships in them.

**Proposed:** rename to `@carbon/charts-theme` and `@carbon/charts-toolbar`, with engine-specific code on subpaths.

| Package                  | Neutral (root, `/vanilla`, `/styles`)                                                    | Engine subpaths                                       |
| ------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `@carbon/charts-theme`   | tokens, palettes, colour picking, data, skeleton                                         | `/echarts`, `/semiotic`                               |
| `@carbon/charts-toolbar` | chart source, fullscreen, CSV and image export, toolbar UI (`/vanilla`), CSS (`/styles`) | `/echarts` only: ECharts adapter and table extractors |

```ts
import { registerCarbonThemes, createBarOptions } from '@carbon/charts-theme/echarts'
import { createSemioticTheme, createBarProps } from '@carbon/charts-theme/semiotic'
```

Options considered:

| Option                                               | npm availability  | Notes                                                                                                                                       |
| ---------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep** `@carbon/echarts-theme` / `-toolbar`        | already published | No rename cost. The name says ECharts but ships Semiotic code under `./semiotic`.                                                           |
| `@carbon/chart-theme`, `@carbon/chart-toolbar`       | free              | Engine-neutral. Differs from `@carbon/charts` by one letter, which is easy to confuse.                                                      |
| **`@carbon/charts-theme`, `@carbon/charts-toolbar`** | free              | **Proposed.** Engine-neutral and reads as the Carbon charting family. Shares the `@carbon/charts-*` prefix with the d3 library (see below). |
| `@carbon/dataviz-theme`, `@carbon/dataviz-toolbar`   | free              | Neutral and unambiguous. Names a new family.                                                                                                |

Availability was checked with `npm view` when this doc was first written and has not been re-run since. IBM naming guidelines, and whether `@carbon/*` names need approval from the Carbon org, have not been checked.

**Accepted trade-off.** The `@carbon/charts-*` prefix is shared with the d3 library being retired, so adopters may read the new packages as part of it. This is accepted in exchange for a name that matches the Carbon charting family and stays engine-neutral. Mitigate it in the READMEs and on the npm pages: state that these packages are the helpers for the replacement model, not extensions of the d3 `@carbon/charts`.

**Condition.** Rename only if both engines are going to be supported. If Semiotic is not adopted, keep the current names and skip the rename.

---

## 4. Risks

| Risk                                                                                                                                                                                                       | Effect                                                                                | Mitigation / status                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **React only.** Semiotic serves React alone; the ECharts path serves every framework.                                                                                                                      | Limits who can use the Semiotic presets (Angular, Vue and Svelte teams are excluded). | Document it as a limit of that engine path (Q5).                                                                     |
| **No exact visual parity.** Semiotic differs from ECharts and Carbon Charts in bar width (fixed pixel gap, no max width), legend behaviour (isolate rather than hide), tick rotation and label truncation. | Charts will not be pixel-identical across engines.                                    | Per-preset parity checks; accept and document known differences. Detail in implementation doc §5.                    |
| **Feature gaps.** The Semiotic bar preset drops floating `[base, end]` values and nulls today; ECharts presets do not carry over automatically; dual-axis needs a different component.                     | Some Carbon chart features unavailable or different on the Semiotic path.             | Grow coverage chart by chart. Coverage by chart type is in the study's coverage table.                               |
| **Sequential palettes.** Semiotic's theme takes a d3 scheme name, not a colour array.                                                                                                                      | Carbon's sequential ramps cannot go through the Semiotic theme.                       | Handle in presets rather than the theme.                                                                             |
| **Limited browser coverage.** Verified on the local dev server only; no cross-browser, accessibility or large-dataset checks yet.                                                                          | Browser-specific, accessibility or performance problems may be undiscovered.          | Cross-browser check before any commitment (implementation doc §8). The study lists a11y and large-dataset tests too. |
| **Canvas rendering untested.** The toolbar's image export should support canvas-rendered Semiotic charts in principle.                                                                                     | Image export might fail for some charts.                                              | Test if canvas charts are needed (Q6).                                                                               |
| **Naming confusion.** `@carbon/charts-*` shares a prefix with the retiring d3 `@carbon/charts` family.                                                                                                     | Adopters may think the new packages extend the d3 library, or pick the wrong package. | Clear README and npm descriptions; deprecation notices on the old names point to the new ones.                       |

                                                                                   |

| **Semiotic dependency health.** GitHub health data for Semiotic was rate-limited when the study was written. | Long-term viability of the second engine is not fully assessed. | Fetch the data (study §10 step 1) before committing. |
|

---

## 5. Recommendation

1. Proceed with Phase 1 now. It is non-breaking, and the neutral structure has value even if Semiotic is later dropped.
2. Offer Semiotic presets for the chart types adopters ask for first (bar, then line and donut), and grow from there.
3. Rename to `@carbon/charts-theme` and `@carbon/charts-toolbar`, with `/echarts` and `/semiotic` subpaths, once Q1 confirms both engines are supported. Otherwise keep the current names.
4. Record the decision as an ADR and correct ADR 0001 (it says `@carbon/charts` migrated to ECharts; it is a d3 library).

## 7. Related

- [`engine-neutral-implementation.md`](./engine-neutral-implementation.md): coupling detail, target layout, preset learnings, ordered work list, rename mechanics and remaining verification.
- [`semiotic-single-engine-study.md`](./semiotic-single-engine-study.md): ECharts vs Semiotic as a single engine, including chart coverage.
