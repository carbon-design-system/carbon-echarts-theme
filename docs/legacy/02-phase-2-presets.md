# Phase 2 — Chart Presets (`packages/theme/src/presets/`)

> **Status: ✅ Complete**

**Output:** `@carbon/echarts-theme/presets` subpath export.

---

## What was built

All Track A (Carbon Charts parity) and Track B (ECharts-extended types) presets are implemented and shipping. The `v2` items originally deferred (wordcloud, choropleth, network, sunburst) have since been completed.

## Preset inventory

| Preset file     | Exports                                                                                                                            | Notes                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `bar.ts`        | `createBarOptions`, `createGroupedBarOptions`, `createStackedBarOptions`, `createHorizontalBarOptions`, `createFloatingBarOptions` | Floating, locale, truncation, yDomain, colors overrides       |
| `line.ts`       | `createLineOptions`, `createStepLineOptions`, `createTimeSeriesLineOptions`                                                        | Time series, log scale, dual-axis, thresholds, selectedGroups |
| `area.ts`       | `createAreaOptions`, `createStackedAreaOptions`, `createBoundedAreaOptions`                                                        | Highlight regions                                             |
| `donut.ts`      | `createDonutOptions`, `createPieOptions`                                                                                           |                                                               |
| `scatter.ts`    | `createScatterOptions`, `createBubbleOptions`                                                                                      |                                                               |
| `heatmap.ts`    | `createHeatmapOptions`                                                                                                             | Sequential palettes, diverging                                |
| `choropleth.ts` | `createChoroplethOptions`                                                                                                          | Requires `echarts.registerMap()` by consumer                  |
| `gauge.ts`      | `createGaugeOptions`, `createMeterOptions`                                                                                         | Status ranges, peak marker                                    |
| `histogram.ts`  | `createHistogramOptions`                                                                                                           |                                                               |
| `treemap.ts`    | `createTreemapOptions`, `createTreemapOptionsFromHierarchy`, `createRadarOptions`                                                  |                                                               |
| `sunburst.ts`   | `createSunburstOptions`                                                                                                            | 45-color `sunburstPalette`                                    |
| `boxplot.ts`    | `createBoxplotOptions`                                                                                                             |                                                               |
| `combo.ts`      | `createComboOptions`                                                                                                               | All variant combinations                                      |
| `lollipop.ts`   | `createLollipopOptions`, `createSparklineOptions`                                                                                  |                                                               |
| `alluvial.ts`   | `createAlluvialOptions`, `createAlluvialOptionsFromTabular`                                                                        |                                                               |
| `tree.ts`       | `createTreeOptions`, `createTreeOptionsFromTabular`                                                                                |                                                               |
| `network.ts`    | `createNetworkOptions`                                                                                                             |                                                               |
| `wordcloud.ts`  | `createWordCloudOptions`                                                                                                           | Requires `echarts-wordcloud` peer                             |
| `_transform.ts` | `groupByGroup`, `groupSparse`, `pickColors`, `sunburstPalette`                                                                     | Shared transform utilities                                    |

## Tests

192 tests pass across 5 test files in `packages/theme/src/__tests__/`.
