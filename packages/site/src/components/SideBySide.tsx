import React from 'react'
import type { EChartsOption, EChartsType } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useTheme } from './ThemeContext'
import { ChartToolbar } from './ChartToolbar'

export interface SideBySideProps {
  title: string
  /** Live @carbon/charts-react component */
  carbonChart?: React.ReactNode
  /** ECharts option object */
  echartsOption: EChartsOption
  /** Whether this is an extended chart (no Carbon Charts equivalent) */
  extended?: boolean
}

export function SideBySide({
  title,
  carbonChart,
  echartsOption,
  extended = false,
}: SideBySideProps) {
  const { theme, echartsTheme } = useTheme()
  const echartsRef = React.useRef<any>(null)
  const [chartInstance, setChartInstance] = React.useState<EChartsType | null>(null)
  const [fullscreen, setFullscreen] = React.useState(false)

  // A chart variant with no Carbon Charts equivalent but still within a parity page
  const noCarbonEquivalent = !extended && carbonChart === undefined

  // Close fullscreen on Escape
  React.useEffect(() => {
    if (!fullscreen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [fullscreen])

  const handleChartReady = (instance: EChartsType) => {
    setChartInstance(instance)
  }

  const echartsPanel = (
    <div
      className={`side-by-side__panel side-by-side__panel--echarts${fullscreen ? ' side-by-side__panel--fullscreen' : ''}`}
    >
      {/* Panel label header (only when showing side-by-side) */}
      {!extended && !noCarbonEquivalent && (
        <div className="side-by-side__panel-label">ECharts + carbon theme</div>
      )}

      {/* Chart area — toolbar overlays in the upper-right corner */}
      <div className="side-by-side__chart-wrap">
        <ReactECharts
          ref={echartsRef}
          option={echartsOption}
          theme={echartsTheme}
          style={{ height: fullscreen ? 'calc(100vh - 32px)' : '320px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          onChartReady={handleChartReady}
        />
        <ChartToolbar
          chartInstance={chartInstance}
          title={title}
          isFullscreen={fullscreen}
          onFullscreen={() => setFullscreen((f) => !f)}
        />
      </div>
    </div>
  )

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

      <div
        className={`side-by-side__panels${extended || noCarbonEquivalent ? ' side-by-side__panels--single' : ''}`}
      >
        {!extended && !noCarbonEquivalent && (
          <div className="side-by-side__panel side-by-side__panel--carbon">
            <div className="side-by-side__panel-label">Carbon Charts</div>
            <div className="side-by-side__chart">
              {carbonChart && React.isValidElement(carbonChart)
                ? React.cloneElement(
                    carbonChart as React.ReactElement<{ options?: Record<string, unknown> }>,
                    { options: { ...(carbonChart.props as any).options, theme } },
                  )
                : carbonChart}
            </div>
          </div>
        )}
        {echartsPanel}
      </div>
    </div>
  )
}
