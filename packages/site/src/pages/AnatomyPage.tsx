import React from 'react'

export function AnatomyPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Chart anatomy</h1>
      </div>
      <div className="content-page">
        <p>
          The Carbon Design System maintains a comprehensive chart anatomy guide that applies across
          all chart types and frameworks — including ECharts with this theme.
        </p>
        <p>
          <a
            href="https://carbondesignsystem.com/data-visualization/chart-anatomy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View chart anatomy on the Carbon Design System →
          </a>
        </p>
        <p>
          Key anatomy elements common to all charts:
        </p>
        <ul>
          <li><strong>Title</strong> — describes the chart content; mapped to <code>title.text</code></li>
          <li><strong>Axes</strong> — x and y axes with labels and tick marks</li>
          <li><strong>Grid lines</strong> — horizontal and vertical reference lines</li>
          <li><strong>Series</strong> — the data itself (bars, lines, points)</li>
          <li><strong>Legend</strong> — identifies each data series by color and label</li>
          <li><strong>Tooltip</strong> — shows exact values on hover/focus</li>
        </ul>
        <p>
          The <code>@carbon/echarts-theme</code> sets all visual properties — colors, fonts,
          spacing, border styles — from Carbon v11 tokens. You do not need to set any styling
          properties yourself.
        </p>
      </div>
    </div>
  )
}
