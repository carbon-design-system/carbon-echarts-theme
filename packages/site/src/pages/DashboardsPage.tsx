import React from 'react'

export function DashboardsPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Dashboards</h1>
      </div>
      <div className="content-page">
        <p>
          Dashboard layout guidance is framework-agnostic — it applies to any combination of charts,
          including ECharts with the Carbon theme.
        </p>

        <h2>Grid layout</h2>
        <p>
          Use CSS Grid or Carbon's 16-column grid to lay out chart panels. Each chart occupies a
          grid cell; charts resize when the grid column width changes.
        </p>
        <pre>
          <code>{`.dashboard {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}`}</code>
        </pre>

        <h2>Consistent sizes</h2>
        <p>Keep charts within the same dashboard at consistent heights. Standard heights:</p>
        <ul>
          <li>
            <strong>Small</strong> — 200px (sparklines, gauges)
          </li>
          <li>
            <strong>Medium</strong> — 320px (bar, line, donut)
          </li>
          <li>
            <strong>Large</strong> — 480px (heatmap, treemap, sankey)
          </li>
        </ul>

        <h2>Responsive charts</h2>
        <p>
          ECharts charts resize automatically when the container resizes if you call{' '}
          <code>chart.resize()</code> on container size change:
        </p>
        <pre>
          <code>{`// Vanilla JS — observe container resize
const observer = new ResizeObserver(() => chart.resize())
observer.observe(container)

// React — echarts-for-react handles this automatically`}</code>
        </pre>
      </div>
    </div>
  )
}
