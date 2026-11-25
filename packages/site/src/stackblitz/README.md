# StackBlitz examples

Each chart example opens as a runnable StackBlitz project. The project is built in the browser
by the generators in this folder from a **variant file**.

## Variants

One folder per chart type under `src/data/echarts/`, one file per variant, each exporting a
single `option: EChartsOption`:

```
src/data/echarts/line/discrete.ts
src/data/echarts/line/time-series.ts
...
```

The same file does two jobs:

1. **Rendered on the docs site.** `ExampleEmbed` imports the variant and passes its `option`
   to the chart.
2. **Shipped to StackBlitz.** The launcher bar under each chart builds a project for React,
   Vanilla JS, Vue, Svelte or Angular. The variant's source is written verbatim as
   `src/option.ts`; only the thin framework wrapper differs.

There are no inline code tabs for these pages — the StackBlitz project is the code.

### Rules for a variant file

It is copied on its own into a generated project, so it must be self-contained:

- Export a single `option`.
- Import only from `echarts`, `@carbon/echarts-theme`, `@carbon/echarts-theme/presets` and
  `@carbon/colors`.
- No relative imports (enforced by ESLint — `no-restricted-imports`). Inline the data.

Not every variant calls a `create*Options` preset. Some are hand-written options because the
presets don't cover them (area gradients, `markArea`, step lines, `dataZoom`).

### Adding an example

1. Add `src/data/echarts/<chart>/<slug>.ts` exporting `option`.
2. Render it from a page with `<ExampleEmbed title="…" example="<chart>" variant="<slug>" />`.

## Generators

One builder per framework (`react.ts`, `vanilla.ts`, `vue.ts`, `svelte.ts`, `angular.ts`),
registered in `index.ts`. Each returns a StackBlitz `Project` (files + `package.json`). All
five use plain `echarts.init` — no framework adapters — and create the Carbon toolbar with
`createChartToolbar`. `open.ts` opens a project with `@stackblitz/sdk`.

Dependency versions live in `versions.ts`. `echarts` and the Carbon packages use `latest`, so a
project picks up the newest published theme; unreleased changes on `main` are not reflected
until published.

See [ADR 0009](../../../../docs/adr/0009-generated-stackblitz-examples.md).
