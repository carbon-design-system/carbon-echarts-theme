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

  return (
    <div className="side-by-side">
      <div className="side-by-side__header">
        <h3 className="side-by-side__title">{title}</h3>
      </div>

      {extended ? (
        <div className="side-by-side__extended-banner">
          This chart type has no Carbon Charts equivalent. Styled with{' '}
          <code>@carbon/echarts-theme</code>.
        </div>
      ) : null}

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
    </div>
  )
}
