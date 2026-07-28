import React from 'react'

export function LegendsPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Legends</h1>
      </div>
      <div className="content-page">
        <p>
          Legends identify each data series by color and label. Carbon design guidance for legends
          applies regardless of the charting library.
        </p>

        <h2>Placement</h2>
        <p>
          Position legends consistently across all charts in a dashboard. Carbon recommends
          legends at the <strong>bottom</strong> of the chart for horizontal space efficiency.
          Right-side legends are acceptable for charts with few series.
        </p>
        <pre><code>{`legend: {
  type: 'scroll',   // enables scrolling for many series
  bottom: 0,        // Carbon default: bottom
  // or:
  right: 0,
  top: 'center',
  orient: 'vertical',
}`}</code></pre>

        <h2>Interactivity</h2>
        <p>
          ECharts legends are interactive by default — clicking a legend item toggles that series
          visibility. This is enabled for all Carbon theme presets.
        </p>

        <h2>Hiding the legend</h2>
        <pre><code>{`legend: { show: false }
// or omit legend entirely`}</code></pre>

        <h2>Custom legend labels</h2>
        <pre><code>{`legend: {
  formatter: (name) => name.replace(/_/g, ' '),
}`}</code></pre>
      </div>
    </div>
  )
}
