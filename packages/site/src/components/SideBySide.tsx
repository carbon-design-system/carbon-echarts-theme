import React from 'react'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useTheme } from './ThemeContext'

export interface SideBySideProps {
  title: string
  /** Live @carbon/charts-react component */
  carbonChart?: React.ReactNode
  /** ECharts option object */
  echartsOption: EChartsOption
  /** Whether this is an extended chart (no Carbon Charts equivalent) */
  extended?: boolean
}

export function SideBySide({ title, carbonChart, echartsOption, extended = false }: SideBySideProps) {
  const { echartsTheme } = useTheme()
  const [diffMode, setDiffMode] = React.useState(false)

  return (
    <div className="side-by-side">
      <div className="side-by-side__header">
        <h3 className="side-by-side__title">{title}</h3>
        {!extended && carbonChart && (
          <button
            type="button"
            className={`side-by-side__diff-btn${diffMode ? ' side-by-side__diff-btn--active' : ''}`}
            onClick={() => setDiffMode((d) => !d)}
            aria-pressed={diffMode}
          >
            {diffMode ? 'Hide overlay' : 'Overlay diff'}
          </button>
        )}
      </div>

      {extended ? (
        <div className="side-by-side__extended-banner">
          This chart type has no Carbon Charts equivalent. Styled with{' '}
          <code>@carbon/echarts-theme</code>.
        </div>
      ) : null}

      {/* Diff mode: stack both charts on top of each other */}
      {diffMode && !extended ? (
        <div className="side-by-side__diff-stack">
          <div className="side-by-side__diff-base">{carbonChart}</div>
          <div className="side-by-side__diff-overlay">
            <ReactECharts
              option={echartsOption}
              theme={echartsTheme}
              style={{ height: '320px', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
          <div className="side-by-side__diff-legend">
            <span className="side-by-side__diff-legend-item side-by-side__diff-legend-item--carbon">Carbon Charts</span>
            <span className="side-by-side__diff-legend-item side-by-side__diff-legend-item--echarts">ECharts + carbon theme</span>
          </div>
        </div>
      ) : (
        <div className={`side-by-side__panels${extended ? ' side-by-side__panels--single' : ''}`}>
          {!extended && (
            <div className="side-by-side__panel side-by-side__panel--carbon">
              <div className="side-by-side__panel-label">Carbon Charts</div>
              <div className="side-by-side__chart">{carbonChart}</div>
            </div>
          )}
          <div className="side-by-side__panel side-by-side__panel--echarts">
            {!extended && <div className="side-by-side__panel-label">ECharts + carbon theme</div>}
            <div className="side-by-side__chart">
              <ReactECharts
                option={echartsOption}
                theme={echartsTheme}
                style={{ height: '320px', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
