# Token & Palette Mapping

All visual values in `@carbon/echarts-theme` trace back to two source files: [`tokens.ts`](../../packages/theme/src/tokens.ts) and [`palettes.ts`](../../packages/theme/src/palettes.ts). Neither file may contain hardcoded hex values that are not derived from `@carbon/themes`.

---

## Token mapping (`tokens.ts`)

Carbon design tokens are imported from `@carbon/themes` at build time and mapped to ECharts theme keys.

| ECharts theme key           | Carbon token          | White                                    | G100      |
| --------------------------- | --------------------- | ---------------------------------------- | --------- |
| `backgroundColor`           | `$background`         | `#ffffff`                                | `#161616` |
| `textStyle.color`           | `$text-primary`       | `#161616`                                | `#f4f4f4` |
| `textStyle.fontFamily`      | IBM Plex Sans         | `"IBM Plex Sans", system-ui, sans-serif` | ← same    |
| `textStyle.fontSize` (axis) | `$label-01` → 12px    | `12px / 400 / 0.32px`                    | ← same    |
| `title.textStyle`           | `$heading-compact-01` | `14px / 600`                             | ← same    |
| `axisLine.lineStyle.color`  | `$border-subtle-01`   | `#e0e0e0`                                | `#393939` |
| `splitLine.lineStyle.color` | `$border-subtle-00`   | `#e0e0e0`                                | `#393939` |
| `axisTick.lineStyle.color`  | `$border-strong-01`   | `#8d8d8d`                                | `#6f6f6f` |
| `tooltip.backgroundColor`   | `$layer-01`           | `#f4f4f4`                                | `#262626` |
| `tooltip.borderColor`       | `$border-subtle-01`   | `#e0e0e0`                                | `#393939` |
| `tooltip.textStyle.color`   | `$text-primary`       | `#161616`                                | `#f4f4f4` |
| `legend.textStyle.color`    | `$text-secondary`     | `#525252`                                | `#c6c6c6` |

G10 and G90 follow the same pattern — see `packages/theme/src/themes/g10.ts` and `g90.ts` for their resolved values.

---

## Data-vis palettes (`palettes.ts`)

IBM's data visualisation color system defines four palette types. These are encoded in `palettes.ts` with both light and dark variants.

| Type                  | When to use                        | Notes                                                       |
| --------------------- | ---------------------------------- | ----------------------------------------------------------- |
| **Categorical**       | Discrete, unordered categories     | 14 colors; first 4: Purple 70, Cyan 50, Teal 70, Magenta 70 |
| **Sequential (mono)** | Single-hue ordered data, heat maps | Single IBM color ramp 10–100                                |
| **Diverging**         | Data with a neutral midpoint       | Two options: Red–Cyan (palette 1), Purple–Teal (palette 2)  |
| **Alert**             | Status / severity                  | Red 60, Orange 40, Yellow 30, Green 60                      |

### Usage in presets

Preset helpers never reference palette colors directly. They call `pickColors(n, theme)` from `presets/_transform.ts`, which selects the correct N-optimised subset of the categorical palette for the active theme. Overrides are passed through a typed `colors` option parameter — they are never hardcoded.

```ts
// Correct — uses pickColors
const colors = pickColors(groups.length, themeKey)

// Wrong — never do this
const colors = ['#6929c4', '#1192e8']
```

---

## Animation defaults

| Key                 | Value        | Source                        |
| ------------------- | ------------ | ----------------------------- |
| `animationDuration` | `300`        | Matches Carbon Charts default |
| `animationEasing`   | `'cubicOut'` | Matches Carbon Charts default |

---

## Known ECharts limitations

These Carbon Charts features have no direct ECharts equivalent and are documented rather than approximated:

| Feature                                | Status                                                       |
| -------------------------------------- | ------------------------------------------------------------ |
| `tooltip.alwaysShowRulerTooltip`       | No ECharts equivalent — document in chart Overview tab       |
| Custom locale per chart                | ECharts uses `echarts.registerLocale()` globally             |
| Additional legend items (Bar slot 11+) | No ECharts equivalent                                        |
| Custom bin edges (Histogram)           | ECharts supports bin width only, not arbitrary edges         |
| Circle pack                            | No packed-circle layout in ECharts — stub page               |
| Choropleth                             | Requires consumer-provided GeoJSON + `echarts.registerMap()` |
| Bullet chart                           | Requires layered bar approximation — not yet implemented     |
| Bounded highlights (min/max bands)     | Approximated as stacked area                                 |
