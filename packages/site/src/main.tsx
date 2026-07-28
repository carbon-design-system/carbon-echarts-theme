import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { ThemeProvider } from './components/ThemeContext'
import { App } from './App'
import './styles.css'

// Register all four Carbon themes once at app startup
registerCarbonThemes(echarts)

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
