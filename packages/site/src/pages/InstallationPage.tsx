import React from 'react'

export function InstallationPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Installation & setup</h1>
      </div>
      <div className="content-page">
        <h2>Install</h2>
        <pre>
          <code>{`npm install @carbon/echarts-theme echarts`}</code>
        </pre>
        <p>
          <code>echarts</code> is a peer dependency — you manage its version, and the theme works
          with ECharts 5.x and above.
        </p>

        <h2>Register themes</h2>
        <p>
          Call <code>registerCarbonThemes</code> once at app startup, before any charts render. Pass
          your own <code>echarts</code> instance to avoid SSR issues.
        </p>
        <pre>
          <code>{`import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'

registerCarbonThemes(echarts)`}</code>
        </pre>

        <h2>Framework usage</h2>

        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem' }}>
          React — echarts-for-react
        </h3>
        <pre>
          <code>{`import ReactECharts from 'echarts-for-react'

<ReactECharts option={option} theme="carbon-white" />`}</code>
        </pre>

        <h3
          style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1.5rem' }}
        >
          Vue — vue-echarts
        </h3>
        <pre>
          <code>{`<v-chart :option="option" theme="carbon-white" />`}</code>
        </pre>

        <h3
          style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1.5rem' }}
        >
          Angular — ngx-echarts
        </h3>
        <pre>
          <code>{`<div echarts [options]="option" theme="carbon-white"></div>`}</code>
        </pre>

        <h3
          style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1.5rem' }}
        >
          Vanilla JS
        </h3>
        <pre>
          <code>{`const chart = echarts.init(document.getElementById('chart'), 'carbon-white')
chart.setOption(option)`}</code>
        </pre>

        <h2>SSR / server-side rendering</h2>
        <p>
          Raw theme objects are also exported so SSR consumers can pass them directly without
          calling <code>registerTheme</code>:
        </p>
        <pre>
          <code>{`import { carbonWhite } from '@carbon/echarts-theme'
// Pass directly to your adapter's theme prop`}</code>
        </pre>
      </div>
    </div>
  )
}
