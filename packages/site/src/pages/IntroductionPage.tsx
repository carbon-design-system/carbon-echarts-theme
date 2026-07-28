import React from 'react'

export function IntroductionPage() {
  const taxonomy = [
    { label: 'Comparisons', charts: ['Bar', 'Grouped Bar', 'Horizontal Bar'] },
    { label: 'Trends', charts: ['Line', 'Area', 'Stacked Area', 'Step Line'] },
    { label: 'Part-to-whole', charts: ['Donut', 'Pie', 'Treemap', 'Histogram'] },
    { label: 'Correlations', charts: ['Scatter', 'Bubble', 'Heatmap'] },
    { label: 'Connections', charts: ['Alluvial', 'Tree', 'Graph'] },
    { label: 'Geospatial', charts: ['Choropleth'] },
  ]

  return (
    <div>
      <div className="content-page__hero">
        <div style={{ padding: '0 0 1rem' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 300, margin: '0 0 1rem', color: '#f4f4f4' }}>
            Carbon ECharts Theme
          </h1>
          <p style={{ fontSize: '18px', color: '#c6c6c6', margin: 0, maxWidth: '600px' }}>
            Apache ECharts charts styled with the Carbon Design System v11 visual language — IBM
            Design Language data-vis color palettes, spacing tokens, and type tokens.
          </p>
        </div>
      </div>

      <div className="content-page" style={{ maxWidth: '960px' }}>
        <div
          style={{
            border: '1px solid #0f62fe',
            background: '#edf5ff',
            padding: '1rem 1.5rem',
            borderRadius: '2px',
            marginBottom: '2rem',
            fontSize: '14px',
          }}
        >
          <strong>Coming from Carbon Charts?</strong> See the{' '}
          <a href="/docs/migration-carbon-charts-to-echarts.md">migration guide</a> for a
          step-by-step guide to switching from <code>@carbon/charts-react</code> to{' '}
          <code>@carbon/echarts-theme</code>.
        </div>

        <h2>Chart taxonomy</h2>
        <p>
          Use the chart taxonomy to find the right chart type for your data and communication goal.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          {taxonomy.map(({ label, charts }) => (
            <div
              key={label}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '2px',
                padding: '1rem',
              }}
            >
              <strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.32px', color: '#525252' }}>
                {label}
              </strong>
              <ul style={{ margin: '0.5rem 0 0', padding: '0 0 0 1rem', listStyle: 'disc' }}>
                {charts.map((c) => (
                  <li key={c} style={{ fontSize: '14px', color: '#525252' }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2>Installation</h2>
        <pre><code>{`npm install @carbon/echarts-theme echarts`}</code></pre>

        <h2>Quick start</h2>
        <pre><code>{`import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'

// Register once at app startup
registerCarbonThemes(echarts)

// Then pass theme="carbon-white" to your adapter
// React: <ReactECharts option={option} theme="carbon-white" />
// Vue:   <v-chart :option="option" theme="carbon-white" />
// Angular: [theme]="'carbon-white'"`}</code></pre>

        <h2>Four themes</h2>
        <p>
          All four Carbon themes are included: <code>carbon-white</code>, <code>carbon-g10</code>,{' '}
          <code>carbon-g90</code>, and <code>carbon-g100</code>. Use the theme switcher in the top
          bar to preview each theme across all chart examples.
        </p>
      </div>
    </div>
  )
}
