import React from 'react'
import ReactDOM from 'react-dom/client'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import '@carbon/styles/css/styles.min.css'
import '@carbon/echarts-toolbar/styles'
import { App } from './App'

// Register the carbon-white, carbon-g10, carbon-g90 and carbon-g100 themes once at startup.
registerCarbonThemes(echarts)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
