import React from 'react'

export function ZoombarPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Zoombar / dataZoom</h1>
      </div>
      <div className="content-page">
        <p>
          ECharts provides a <code>dataZoom</code> component for panning and zooming along an axis.
          Two types are available: <strong>slider</strong> (a scrubber below the chart) and{' '}
          <strong>inside</strong> (scroll wheel / pinch to zoom).
        </p>

        <h2>Slider zoom bar</h2>
        <pre>
          <code>{`const option = {
  dataZoom: [
    {
      type: 'slider',   // visible scrubber below the chart
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
    {
      type: 'inside',   // mouse wheel / touch zoom
      xAxisIndex: 0,
    },
  ],
  // ...rest of option
}`}</code>
        </pre>

        <h2>Zoom on Y axis</h2>
        <pre>
          <code>{`dataZoom: [
  { type: 'slider', yAxisIndex: 0 },
]`}</code>
        </pre>

        <p>
          The Carbon theme styles the slider handle, rail, and selected range using{' '}
          <code>$layer-01</code> and <code>$border-subtle-01</code> tokens, matching the overall
          chart visual language.
        </p>
      </div>
    </div>
  )
}
