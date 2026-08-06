# Plan: `@carbon/echarts-toolbar`

## Top-Level Overview

Create a new monorepo package `packages/toolbar` named `@carbon/echarts-toolbar`.

The package has two layers:

- **Core** (`src/core/`) — zero-dependency TypeScript that works with any ECharts instance. Handles data extraction from an ECharts option object, CSV generation, image export, and fullscreen DOM management. No React, no Carbon imports.
- **React adapter** (`src/react/`) — thin React wrapper that imports only from `src/core/` and renders the toolbar UI using `@carbon/react` components and `@carbon/icons-react` icons. Exported from a separate entry point so consumers who don't use React never pull it in.

The site's `ChartToolbar.tsx` and `SideBySide.tsx` are updated to consume the new package instead of duplicating the logic.

### Non-goals

- Angular / Vue / Svelte adapters (can be added later)
- A standalone web component adapter
- Theming configuration beyond what Carbon tokens already provide via SCSS

---

## Sub-Tasks

---

### Sub-task 1 — Scaffold `packages/toolbar`

**Status:** `[ ] pending`

**Intent:**
Create the package directory, `package.json`, `tsconfig.json`, `tsup.config.ts`, and `vitest.config.ts` following the same conventions as `packages/theme`. No source code yet — just the skeleton that lets `pnpm build` and `pnpm test` succeed on an empty entry point.

**Expected Outcomes:**

- `pnpm -F @carbon/echarts-toolbar build` succeeds and emits `dist/index.js`, `dist/index.cjs`, `dist/react/index.js`, `dist/react/index.cjs`, and corresponding `.d.ts` files
- `pnpm -F @carbon/echarts-toolbar test` runs (zero tests, zero failures)
- Root `pnpm build` still succeeds

**Todo List:**

1. Create `packages/toolbar/` directory
2. Create `packages/toolbar/package.json`:
   - Name: `@carbon/echarts-toolbar`
   - Version: `0.1.0`
   - `"type": "module"`
   - Two exports: `.` (core) and `./react` (React adapter)
   - Each export has `types`, `import` (ESM), `require` (CJS) fields
   - Peer deps: `echarts >=5.0.0`, `react >=17.0.0` (optional — only needed for the React entry)
   - Dev deps: `tsup`, `typescript`, `vitest`, `@vitest/coverage-v8`, `react`, `react-dom`, `@types/react`, `@carbon/react`, `@carbon/icons-react`, `echarts`
   - Scripts: `build`, `dev`, `test`, `test:watch`, `test:coverage`, `typecheck`
3. Create `packages/toolbar/tsconfig.json` extending root `tsconfig.json`, `include: ["src"]`
4. Create `packages/toolbar/tsup.config.ts`:
   - Two entries: `src/index.ts` (core) and `src/react/index.ts` (React adapter)
   - Formats: `['esm', 'cjs']`
   - `dts: true`, `sourcemap: true`, `splitting: false`
   - Mark `react`, `react-dom`, `@carbon/react`, `@carbon/icons-react`, `echarts` as external (never bundled)
5. Create `packages/toolbar/vitest.config.ts` (node environment, same pattern as `packages/theme`)
6. Create placeholder entry points:
   - `packages/toolbar/src/index.ts` — empty `export {}`
   - `packages/toolbar/src/react/index.ts` — empty `export {}`
   - `packages/toolbar/src/__tests__/.gitkeep`
7. Run `pnpm install` from repo root to link workspace deps

**Relevant Context:**

- `packages/theme/package.json` — copy the exports/scripts/files pattern exactly
- `packages/theme/tsup.config.ts` — extend with a second entry point
- `packages/theme/vitest.config.ts` — copy verbatim, adjust paths
- `pnpm-workspace.yaml` already covers `packages/*` so no change needed there

---

### Sub-task 2 — Implement `src/core/`

**Status:** `[ ] pending`

**Intent:**
Extract and clean up the framework-agnostic logic that currently lives in `packages/site/src/components/ChartToolbar.tsx`. Move it into `src/core/` as pure TypeScript modules. No DOM rendering here — only data wrangling and side-effectful browser APIs (download, fullscreen).

**Expected Outcomes:**

- `src/core/extract.ts` — `buildTableData(instance)` returns `{ headers, rows }` or `null`. Handles category-axis, flat-dimension, and object/array data item shapes.
- `src/core/export.ts` — `downloadCSV(instance, filename)`, `exportImage(instance, filename, format)` exported as named functions
- `src/core/fullscreen.ts` — `enterFullscreen(el)`, `exitFullscreen()`, `isFullscreen()`, `onFullscreenChange(cb)` using the native Fullscreen API (`el.requestFullscreen()` / `document.exitFullscreen()`) with webkit prefix fallback for Safari < 16.4
- `src/index.ts` re-exports all core modules — the `.` entry point
- Unit tests in `src/__tests__/extract.test.ts` cover the key data shapes (number, `{value}` object, `[x,y]` array, null, multi-series)
- `pnpm -F @carbon/echarts-toolbar test` passes

**Todo List:**

1. Create `src/core/extract.ts` — move `buildTableData` from `ChartToolbar.tsx` here. Export the `TableData` type (`{ headers: {key, header}[], rows: Record<string,unknown>[] }`).
2. Create `src/core/export.ts` — move `buildCSV`, `downloadCSV`, `exportImage` here. Keep the canvas `getDataURL` path and the SVG serialisation fallback.
3. Create `src/core/fullscreen.ts` — new module. Use `el.requestFullscreen()` (with webkit/moz prefixes as fallback). Export `enterFullscreen(el: HTMLElement)`, `exitFullscreen()`, `onFullscreenChange(cb)`, `isFullscreen()`.
4. Update `src/index.ts` to re-export everything from the three core modules.
5. Write `src/__tests__/extract.test.ts`:
   - Test `buildTableData` with a mock ECharts instance that returns a known option
   - Cover: number values, `{value: N}` objects, `[x, y]` arrays, null, multi-series, no category axis

**Relevant Context:**

- `packages/site/src/components/ChartToolbar.tsx` lines 32–120 — the logic to migrate
- `EChartsType` from `echarts` is the type for the instance parameter
- `instance.getOption()` is the read-only getter already used
- Fullscreen API MDN: `requestFullscreen` is the standard, browser prefixes for Safari

---

### Sub-task 3 — Implement `src/react/`

**Status:** `[ ] pending`

**Intent:**
Build the React adapter that wires the core utilities into rendered components using `@carbon/react` and `@carbon/icons-react`. This is exactly what `ChartToolbar.tsx` does today — but now it imports from `@carbon/echarts-toolbar` core instead of duplicating logic.

**Expected Outcomes:**

- `src/react/ChartToolbar.tsx` — the toolbar component. Props: `chartInstance`, `containerRef`, `title`. Fullscreen state is managed internally via `onFullscreenChange` from the core — no fullscreen props on the parent. Renders three icon buttons (ListNumbered, Maximize/Minimize, OverflowMenuVertical) using `@carbon/icons-react`.
- `src/react/TableModal.tsx` — the table modal. Uses `ReactDOM.createPortal` to `document.body`. Uses Carbon `DataTable` + `Table`/`TableHead`/`TableBody`/`TableCell` for the data, a custom header with `Close` icon, and a footer with "Close" (ghost) + "Download as CSV" (primary) buttons.
- `src/react/index.ts` — re-exports `ChartToolbar` and `TableModal`
- The `./react` entry point builds cleanly with `pnpm build`
- Types are exported so consumers get full TypeScript autocomplete

**Todo List:**

1. Create `src/react/TableModal.tsx` — move table modal rendering here. Import `buildTableData` and `downloadCSV` from `@carbon/echarts-toolbar` core (i.e. `../core/extract` and `../core/export`). Use `ReactDOM.createPortal`. Match the screenshot target: header with title + Close icon, scrollable DataTable body, footer with two buttons.
2. Create `src/react/ChartToolbar.tsx` — move toolbar rendering here. Import `exportImage`, `downloadCSV` from core. Import `enterFullscreen`, `exitFullscreen` from core fullscreen module. Icons: `ListNumbered`, `Maximize`, `Minimize`, `OverflowMenuVertical` from `@carbon/icons-react`.
3. Create `src/react/index.ts` — export `ChartToolbar`, `TableModal`, and their prop types.
4. Ensure no core logic is duplicated — all data extraction and export calls go through `src/core/`.

**Relevant Context:**

- `packages/site/src/components/ChartToolbar.tsx` — the component to migrate wholesale
- Target table layout from user screenshot: long-format rows (Group / x-value / y-value), not a wide pivot
- `@carbon/icons-react` exports: `ListNumbered`, `Maximize`, `Minimize`, `OverflowMenuVertical`, `Close`
- `@carbon/react` exports used: `DataTable`, `Table`, `TableHead`, `TableRow`, `TableHeader`, `TableBody`, `TableCell`, `TableContainer`, `Button`
- The compiled CSS (`dist/styles.css`) is the primary styles entry — see Sub-task 4

---

### Sub-task 4 — Add SCSS entry point

**Status:** `[ ] pending`

**Intent:**
Extract the toolbar and modal styles into `src/styles/toolbar.scss`, compile them to `dist/styles.css` at build time (resolving all Carbon SCSS tokens to their actual values), and export the result as `@carbon/echarts-toolbar/styles`. Consumers do a plain JS import — no SCSS toolchain required.

**Expected Outcomes:**

- `src/styles/toolbar.scss` contains all `.chart-toolbar*` and `.chart-toolbar__modal*` blocks using Carbon SCSS token variables
- `dist/styles.css` is emitted by tsup's sass support during `pnpm build`
- `package.json` exports `"./styles": "./dist/styles.css"`
- `packages/site/src/styles.scss` has the extracted blocks removed
- `packages/site/src/main.tsx` gains `import '@carbon/echarts-toolbar/styles'`
- The site's visual output is unchanged

**Todo List:**

1. Add `sass` as a dev dependency in `packages/toolbar/package.json`
2. Add a second config object to `tsup.config.ts` for the CSS entry: `entry: { styles: 'src/styles/toolbar.scss' }`
3. Create `src/styles/toolbar.scss` — move all `.chart-toolbar*` and `.chart-toolbar__modal*` blocks from `packages/site/src/styles.scss`. Keep all Carbon SCSS token variables (`$layer-01`, `$interactive`, etc.) unchanged.
4. Add `"./styles": "./dist/styles.css"` to `packages/toolbar/package.json` exports
5. Remove the extracted blocks from `packages/site/src/styles.scss`
6. Add `import '@carbon/echarts-toolbar/styles'` to `packages/site/src/main.tsx`
7. Run `pnpm -F @carbon/echarts-toolbar build` — verify `dist/styles.css` is emitted
8. Run `pnpm -F @carbon/echarts-theme-site dev` — verify styles still apply correctly

**Relevant Context:**

- `packages/site/src/styles.scss` lines 490–665 — the blocks to extract
- tsup has built-in sass support when `sass` is installed as a dev dependency — no additional plugin config needed
- The `[data-carbon-theme='g90/g100']` attribute selectors in the SCSS will bake four theme variants into the single compiled CSS output

---

### Sub-task 5 — Update the site to consume the package

**Status:** `[ ] pending`

**Intent:**
Replace the in-tree `ChartToolbar.tsx` in the site with an import from `@carbon/echarts-toolbar/react`. This validates the package API against a real consumer and removes the duplication.

**Expected Outcomes:**

- `packages/site/src/components/ChartToolbar.tsx` is deleted
- `packages/site/src/components/SideBySide.tsx` imports `ChartToolbar` from `@carbon/echarts-toolbar/react`
- `packages/site/package.json` lists `@carbon/echarts-toolbar: workspace:*` as a dependency
- The site builds and functions identically to before
- The toolbar SCSS is imported from the package (Sub-task 4 prerequisite)

**Todo List:**

1. Add `"@carbon/echarts-toolbar": "workspace:*"` to `packages/site/package.json` dependencies
2. Run `pnpm install` from repo root
3. Update `packages/site/src/components/SideBySide.tsx`:
   - Change `import { ChartToolbar } from './ChartToolbar'` to `import { ChartToolbar } from '@carbon/echarts-toolbar/react'`
   - Remove `isFullscreen` state, the Escape key `useEffect`, and `onFullscreenChange` — fullscreen is now managed inside `<ChartToolbar>`
   - Pass `containerRef` (a ref to the panel element) instead of `isFullscreen` / `onFullscreen`
4. Delete `packages/site/src/components/ChartToolbar.tsx`
5. Run `pnpm -F @carbon/echarts-theme-site typecheck` and `pnpm -F @carbon/echarts-theme-site build` — confirm both pass

**Relevant Context:**

- `packages/site/src/components/SideBySide.tsx` — the only consumer of `ChartToolbar`
- `packages/theme/package.json` exports pattern — the `./react` entry must be declared identically
- Sub-task 3 must be complete before this sub-task begins
- Sub-task 4 must be complete before the SCSS import switch in step 3

---

### Sub-task 6 — Documentation and README

**Status:** `[ ] pending`

**Intent:**
Write a `README.md` for `@carbon/echarts-toolbar` that clearly explains the two-layer architecture, installation, usage for both the core API and the React adapter, and SCSS setup.

**Expected Outcomes:**

- `packages/toolbar/README.md` exists and covers: what the package is, installation, core API (function signatures), React adapter (component props), SCSS import, peer dependency requirements
- The README matches the style of `packages/theme/README.md`

**Todo List:**

1. Read `packages/theme/README.md` for style reference
2. Write `packages/toolbar/README.md` with sections:
   - Overview
   - Installation (`pnpm add @carbon/echarts-toolbar`)
   - Core API: `buildTableData`, `downloadCSV`, `exportImage`, `enterFullscreen`, `exitFullscreen`
   - React adapter: `<ChartToolbar>` props table, `<TableModal>` props table
   - Styles: `@use '@carbon/echarts-toolbar/styles'` instructions
   - Peer dependencies and version requirements

**Relevant Context:**

- `packages/theme/README.md` — style reference
