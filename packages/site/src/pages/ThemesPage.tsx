import React from 'react'
import { white, gray10, gray20, gray30, gray70, gray80, gray90, gray100 } from '@carbon/colors'

export function ThemesPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Themes (dark & light)</h1>
      </div>
      <div className="content-page">
        <p>
          Four Carbon themes are available, matching the four Carbon Design System color themes. Use
          the theme switcher in the top bar to preview all chart examples in each theme.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {[
            {
              name: 'carbon-white',
              bg: white,
              text: gray100,
              muted: gray70,
              border: gray20,
              label: 'White',
            },
            {
              name: 'carbon-g10',
              bg: gray10,
              text: gray100,
              muted: gray70,
              border: gray30,
              label: 'G10',
            },
            {
              name: 'carbon-g90',
              bg: gray90,
              text: gray10,
              muted: gray30,
              border: gray80,
              label: 'G90',
            },
            {
              name: 'carbon-g100',
              bg: gray100,
              text: gray10,
              muted: gray30,
              border: gray90,
              label: 'G100',
            },
          ].map(({ name, bg, text, muted, border, label }) => (
            <div
              key={name}
              style={{
                background: bg,
                color: text,
                border: `1px solid ${border}`,
                borderRadius: '2px',
                padding: '1.5rem',
              }}
            >
              <strong style={{ fontSize: '16px' }}>{label}</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '12px', color: muted }}>{name}</p>
            </div>
          ))}
        </div>

        <h2>Registration</h2>
        <pre>
          <code>{`import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'

// Registers all four themes at once
registerCarbonThemes(echarts)`}</code>
        </pre>

        <h2>Using a specific theme</h2>
        <pre>
          <code>{`// React
<ReactECharts option={option} theme="carbon-g100" />

// Vanilla JS
const chart = echarts.init(el, 'carbon-g100')

// Vue
<v-chart :option="option" theme="carbon-g100" />`}</code>
        </pre>

        <h2>Individual theme objects</h2>
        <pre>
          <code>{`import { carbonWhite, carbonG10, carbonG90, carbonG100 } from '@carbon/echarts-theme'

// Pass directly to adapters that accept a raw theme object
// e.g. for SSR where registerTheme isn't available`}</code>
        </pre>
      </div>
    </div>
  )
}
