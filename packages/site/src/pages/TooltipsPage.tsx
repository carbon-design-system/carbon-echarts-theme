import React from 'react'

export function TooltipsPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Tooltips</h1>
      </div>
      <div className="content-page">
        <p>
          Tooltips show exact values on hover or keyboard focus. The Carbon theme styles tooltip
          background, border, text, and font from Carbon v11 tokens.
        </p>

        <h2>Trigger types</h2>
        <pre><code>{`// 'axis' — shows all series values at the hovered x position (default for line/bar)
tooltip: { trigger: 'axis' }

// 'item' — shows the value for the specific hovered data point (default for pie/scatter)
tooltip: { trigger: 'item' }`}</code></pre>

        <h2>Custom formatter</h2>
        <pre><code>{`tooltip: {
  trigger: 'axis',
  formatter: (params) => {
    return params.map(p => \`\${p.seriesName}: \${p.value.toLocaleString()}\`).join('<br/>')
  },
}`}</code></pre>

        <h2>Grouping behaviour</h2>
        <p>
          For multi-series charts, always use <code>trigger: 'axis'</code> so all series values
          at the same x position appear in a single tooltip. This reduces cognitive load compared
          to separate tooltips per series.
        </p>

        <h2>Accessibility</h2>
        <p>
          Tooltips are not accessible to keyboard-only or screen-reader users by default. Ensure
          all data shown in tooltips is also available in an accessible data table or the chart
          has an <code>aria-label</code> describing the key insight.
        </p>
      </div>
    </div>
  )
}
