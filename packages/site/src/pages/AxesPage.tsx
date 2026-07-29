import React from 'react'

export function AxesPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Axes</h1>
      </div>
      <div className="content-page">
        <p>
          Axes provide the scale and reference frame for chart data. Carbon design guidance for axes
          applies regardless of the charting framework — including ECharts with this theme.
        </p>

        <h2>Single axis</h2>
        <p>
          Most charts use one value (Y) axis and one category or time (X) axis. The Carbon theme
          sets axis line color, tick color, label font size, and grid line color automatically from
          Carbon v11 tokens.
        </p>
        <pre>
          <code>{`// Categorical x-axis (default for bar charts)
xAxis: { type: 'category', data: categories }
yAxis: { type: 'value' }`}</code>
        </pre>

        <h2>Dual Y-axis</h2>
        <p>
          Use a second Y-axis when two series have different value scales (e.g., revenue in
          thousands and conversion rate as a percentage).
        </p>
        <pre>
          <code>{`yAxis: [
  { type: 'value', name: 'Revenue' },
  { type: 'value', name: 'Conversion rate', min: 0, max: 1 },
]

// Associate a series with the secondary axis
series: [
  { name: 'Revenue', type: 'bar', yAxisIndex: 0, data: [...] },
  { name: 'Conversion', type: 'line', yAxisIndex: 1, data: [...] },
]`}</code>
        </pre>

        <h2>Logarithmic scale</h2>
        <p>
          Use a log scale when data spans multiple orders of magnitude. Avoid log scales for
          audiences unfamiliar with logarithmic representation.
        </p>
        <pre>
          <code>{`yAxis: { type: 'log', logBase: 10 }`}</code>
        </pre>

        <h2>Time axis</h2>
        <pre>
          <code>{`xAxis: { type: 'time' }
// Data points use ISO date strings or timestamps as x values`}</code>
        </pre>
      </div>
    </div>
  )
}
