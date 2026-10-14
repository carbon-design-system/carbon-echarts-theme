import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { ExampleEmbed } from '../components/ExampleEmbed'
import LineMdx from '../content/line.mdx'
import {
  chartTypes,
  lineDiscreteExample,
  lineRotatedTicksExample,
  lineLocaleExample,
  lineLogAxisExample,
  lineCustomColorsExample,
  lineSelectedGroupsExample,
  lineLegendOrientationExample,
  lineThresholdsExample,
  lineLongLabelExample,
  lineTimeSeriesExample,
  lineTimeSeriesDenseExample,
  lineDualAxisExample,
} from '../data/carboncharts/line'

export function LinePage() {
  return (
    <ChartPage
      title="Line"
      description="Display trends or changes over time."
      overview={<LineMdx />}
      examples={
        <>
          {/* ── Showcase ───────────────────────────────────────────────────── */}
          <ExampleEmbed
            title="Rainfall vs Evaporation — area fill + markArea annotation"
            example="line"
            variant="rainfall"
            extended
          />
          <ExampleEmbed
            title="Weekly Stock Price Trends — 5-series smooth + dataZoom slider"
            example="line"
            variant="stock"
            extended
          />
          <ExampleEmbed
            title="Channel Traffic — stacked smooth area with gradient fills"
            example="line"
            variant="stacked-area"
            extended
          />
          <ExampleEmbed
            title="Server Alert States — step line with area fill"
            example="line"
            variant="step"
            extended
          />
          <ExampleEmbed
            title="Spark lines — KPI summary card"
            example="line"
            variant="spark"
            extended
          />
          <ExampleEmbed
            title="Daily KPI Trends — interactive zoom + toolbox"
            example="line"
            variant="zoom"
            extended
          />

          {/* ── Carbon Charts parity ────────────────────────────────────────── */}
          <ExampleEmbed
            title="Line (discrete)"
            example="line"
            variant="discrete"
            carbonExample={lineDiscreteExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (time series, rotated ticks)"
            example="line"
            variant="rotated-ticks"
            carbonExample={lineRotatedTicksExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (time series, French locale) — ECharts uses browser locale"
            example="line"
            variant="locale"
            carbonExample={lineLocaleExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (log axis)"
            example="line"
            variant="log-axis"
            carbonExample={lineLogAxisExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (custom colors)"
            example="line"
            variant="custom-colors"
            carbonExample={lineCustomColorsExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (selected groups)"
            example="line"
            variant="selected-groups"
            carbonExample={lineSelectedGroupsExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (legend orientation)"
            example="line"
            variant="legend-orientation"
            carbonExample={lineLegendOrientationExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (time series, thresholds)"
            example="line"
            variant="thresholds"
            carbonExample={lineThresholdsExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (truncated labels)"
            example="line"
            variant="long-label"
            carbonExample={lineLongLabelExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (time series)"
            example="line"
            variant="time-series"
            carbonExample={lineTimeSeriesExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (time series, dense)"
            example="line"
            variant="time-series-dense"
            carbonExample={lineTimeSeriesDenseExample}
            chartClass={chartTypes.vanilla}
          />
          <ExampleEmbed
            title="Line (dual axis)"
            example="line"
            variant="dual-axis"
            carbonExample={lineDualAxisExample}
            chartClass={chartTypes.vanilla}
          />
        </>
      }
    />
  )
}
