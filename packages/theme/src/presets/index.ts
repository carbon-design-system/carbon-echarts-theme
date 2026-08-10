/**
 * @carbon/echarts-theme/presets
 *
 * Pure `(data, options?) → EChartsOption` helpers for every Carbon Charts type.
 * Import from this subpath to get tree-shakeable access to individual presets.
 *
 * @example
 * import { createBarOptions } from '@carbon/echarts-theme/presets'
 */

// ── Track A — Carbon Charts parity helpers ────────────────────────────────────

// Bar
export {
  createBarOptions,
  createGroupedBarOptions,
  createStackedBarOptions,
  createHorizontalBarOptions,
  createFloatingBarOptions,
} from './bar'
export type { BarPresetOptions } from './bar'

// Line
export { createLineOptions, createStepLineOptions, createTimeSeriesLineOptions } from './line'
export type { LinePresetOptions, LineStep, ThresholdDef } from './line'

// Area
export { createAreaOptions, createStackedAreaOptions, createBoundedAreaOptions } from './area'
export type { AreaPresetOptions, BoundedAreaPresetOptions, HighlightRegion } from './area'

// Donut + Pie
export { createDonutOptions, createPieOptions } from './donut'
export type { DonutPresetOptions, PiePresetOptions } from './donut'

// Scatter + Bubble
export { createScatterOptions, createBubbleOptions } from './scatter'
export type { ScatterPresetOptions, BubblePresetOptions } from './scatter'

// Heatmap
export { createHeatmapOptions } from './heatmap'
export type { HeatmapPresetOptions } from './heatmap'

// Choropleth
export { createChoroplethOptions } from './choropleth'
export type {
  ChoroplethPresetOptions,
  ChoroplethPairingOption,
  ChoroplethDivergingOption,
} from './choropleth'

// Gauge + Meter
export { createGaugeOptions, createMeterOptions } from './gauge'
export type { GaugePresetOptions, MeterPresetOptions, MeterStatusRange } from './gauge'

// Histogram
export { createHistogramOptions } from './histogram'
export type { HistogramPresetOptions } from './histogram'

// Treemap + Radar
export {
  createTreemapOptions,
  createTreemapOptionsFromHierarchy,
  createRadarOptions,
} from './treemap'
export type { TreemapPresetOptions, TreemapHierarchyNode, RadarPresetOptions } from './treemap'

// Sunburst
export { createSunburstOptions } from './sunburst'
export type { SunburstPresetOptions, SunburstNode } from './sunburst'

// Boxplot
export { createBoxplotOptions } from './boxplot'
export type { BoxplotPresetOptions } from './boxplot'

// Combo
export { createComboOptions } from './combo'
export type { ComboPresetOptions } from './combo'

// Lollipop + Sparkline
export { createLollipopOptions, createSparklineOptions } from './lollipop'
export type { LollipopPresetOptions, SparklinePresetOptions } from './lollipop'

// Alluvial (Sankey flow)
export { createAlluvialOptions, createAlluvialOptionsFromTabular } from './alluvial'
export type { AlluvialPresetOptions, AlluvialDatum } from './alluvial'

// Tree (org chart / dendrogram)
export { createTreeOptions, createTreeOptionsFromTabular } from './tree'
export type { TreePresetOptions, TreeNode } from './tree'

// Network Diagram
export { createNetworkOptions } from './network'
export type { NetworkPresetOptions, NetworkNode, NetworkLink } from './network'

// Word Cloud
export { createWordCloudOptions } from './wordcloud'
export type { WordCloudPresetOptions, WordCloudDatum } from './wordcloud'

// ── Shared data transform (re-exported for consumers building custom presets) ──
export { groupByGroup, pickColors, sunburstPalette } from './_transform'
export type {
  ChartTabularData,
  ChartTabularDatum,
  GroupedSeries,
  GroupedSeriesDatum,
  TransformResult,
} from './_transform'
