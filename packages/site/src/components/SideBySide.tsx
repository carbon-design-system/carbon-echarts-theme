import React from 'react'
import type { EChartsOption, EChartsType } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useTheme } from './ThemeContext'
import { ChartToolbar } from './ChartToolbar'
import { CarbonChart } from './CarbonChart'
import type { CarbonChartExample } from './CarbonChart'

export interface SideBySideProps {
  title: string
  /** Vanilla class name string from chartTypes.vanilla, e.g. 'SimpleBarChart' */
  chartClass?: string
  /** Inline Carbon Charts example (rendered via vanilla @carbon/charts) */
  carbonExample?: CarbonChartExample
  /** ECharts option object */
  echartsOption: EChartsOption
  /** Whether this is an extended chart (no Carbon Charts equivalent) */
  extended?: boolean
  /** ECharts code snippet shown in the code block beneath this example */
  echartsCode?: string
}

export function SideBySide({
  title,
  chartClass,
  carbonExample,
  echartsOption,
  extended = false,
  echartsCode,
}: SideBySideProps) {
  const { echartsTheme } = useTheme()
  const echartsRef = React.useRef<any>(null)
  const [chartInstance, setChartInstance] = React.useState<EChartsType | null>(null)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [codeCopied, setCodeCopied] = React.useState(false)

  // A chart variant with no Carbon Charts equivalent but still within a parity page
  const noCarbonEquivalent = !extended && carbonExample === undefined

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

  function handleCopyCode() {
    if (!echartsCode) return
    void navigator.clipboard.writeText(echartsCode).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
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
        {!extended && !noCarbonEquivalent && carbonExample && chartClass && (
          <div className="side-by-side__panel side-by-side__panel--carbon">
            <div className="side-by-side__panel-label">Carbon Charts</div>
            <div className="carbon-chart-holder">
              <CarbonChart chartClass={chartClass} example={carbonExample} />
            </div>
          </div>
        )}
        {echartsPanel}
      </div>

      {echartsCode && (
        <div className="side-by-side__code">
          <div className="side-by-side__code-bar">
            <span className="side-by-side__code-label">ECharts</span>
            <button
              type="button"
              className="side-by-side__code-copy"
              onClick={handleCopyCode}
              aria-label="Copy code to clipboard"
            >
              {codeCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="side-by-side__code-content">
            <code>{echartsCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
