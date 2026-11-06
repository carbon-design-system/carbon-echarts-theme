import React from 'react'
import { CarbonBarChart } from '../semiotic/CarbonBarChart'
import { Compare } from '../components/Compare'
import { useTheme } from '../components/ThemeContext'
import { barSimple, simpleBarData } from '../data/echarts/bar'

/**
 * Exploration: the same Carbon simple-bar data rendered with Semiotic and with
 * ECharts, both themed from @carbon/echarts-theme and both using the shared
 * Carbon toolbar.
 */
export function SemioticBarPage() {
  const { theme } = useTheme()

  return (
    <div className="chart-page">
      <div className="chart-page__hero">
        <h1 className="chart-page__title">Semiotic: simple bar (exploration)</h1>
        <p className="chart-page__description">
          The same Carbon data rendered with Semiotic and with ECharts, using the shared
          @carbon/echarts-theme tokens and palettes and the shared Carbon toolbar.
        </p>
      </div>
      <div className="chart-page__body">
        <div className="chart-page__examples">
          <div className="compare">
            <div className="compare__header">
              <h3 className="compare__title">Semiotic + Carbon theme</h3>
            </div>
            <div className="compare__panel compare__panel--echarts">
              <CarbonBarChart
                data={simpleBarData}
                theme={theme}
                title="Simple bar (Semiotic)"
                xLabel="Item"
                yLabel="Quantity"
                height={320}
              />
            </div>
          </div>
          <Compare title="Simple bar (ECharts)" echartsOption={barSimple} />
        </div>
      </div>
    </div>
  )
}
