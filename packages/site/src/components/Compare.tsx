import React from 'react'
import type { EChartsOption, EChartsType } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { Toggle } from '@carbon/react'
import { useTheme } from './ThemeContext'
import { ChartToolbar } from './ChartToolbar'
import { CarbonChart } from './CarbonChart'
import type { CarbonChartExample } from './CarbonChart'

export interface CompareProps {
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

export function Compare({
  title,
  chartClass,
  carbonExample,
  echartsOption,
  extended = false,
  echartsCode,
}: CompareProps) {
  const { echartsTheme } = useTheme()
  const echartsRef = React.useRef<any>(null)
  const [chartInstance, setChartInstance] = React.useState<EChartsType | null>(null)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [codeCopied, setCodeCopied] = React.useState(false)
  const [showCarbon, setShowCarbon] = React.useState(false)

  // Mirror the Carbon Charts height when provided, so sparklines and other
  // size-constrained charts render at the same height as their Carbon equivalent.
  const carbonHeight =
    carbonExample?.options && 'height' in carbonExample.options
      ? (carbonExample.options as { height?: string }).height
      : undefined
  const chartHeight = fullscreen ? 'calc(100vh - 32px)' : (carbonHeight ?? '320px')

  const canCompare = !extended && !!carbonExample && !!chartClass

  // Close fullscreen on Escape
  React.useEffect(() => {
    if (!fullscreen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [fullscreen])

  function handleCopyCode() {
    if (!echartsCode) return
    void navigator.clipboard.writeText(echartsCode).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  return (
    <div className="compare">
      <div className="compare__header">
        <h3 className="compare__title">{title}</h3>
      </div>

      {extended && (
        <div className="compare__extended-banner">
          This chart type has no Carbon Charts equivalent. Styled with{' '}
          <code>@carbon/echarts-theme</code>.
        </div>
      )}

      {/* ECharts panel — always shown */}
      <div
        className={`compare__panel compare__panel--echarts${fullscreen ? ' compare__panel--fullscreen' : ''}`}
      >
        {canCompare && <div className="compare__panel-label">ECharts + carbon theme</div>}
        <div className="compare__chart-wrap">
          <ReactECharts
            ref={echartsRef}
            option={echartsOption}
            theme={echartsTheme}
            style={{ height: chartHeight, width: '100%' }}
            opts={{ renderer: 'canvas' }}
            onChartReady={(instance: EChartsType) => setChartInstance(instance)}
          />
          <ChartToolbar
            chartInstance={chartInstance}
            title={title}
            isFullscreen={fullscreen}
            onFullscreen={() => setFullscreen((f) => !f)}
          />
        </div>
      </div>

      {/* Compare toggle — only when a Carbon Charts equivalent exists */}
      {canCompare && (
        <div className="compare__toggle">
          <Toggle
            id={`compare-toggle-${title.replace(/\s+/g, '-').toLowerCase()}`}
            labelText="Compare with Carbon Charts"
            hideLabel
            labelA="Compare with Carbon Charts"
            labelB="Compare with Carbon Charts"
            toggled={showCarbon}
            onToggle={(checked: boolean) => setShowCarbon(checked)}
            size="sm"
          />
        </div>
      )}

      {/* Carbon Charts panel — revealed below when toggle is on */}
      {canCompare && showCarbon && carbonExample && chartClass && (
        <div className="compare__panel compare__panel--carbon">
          <div className="compare__panel-label">Carbon Charts</div>
          <div className="carbon-chart-holder">
            <CarbonChart chartClass={chartClass} example={carbonExample} />
          </div>
        </div>
      )}

      {echartsCode && (
        <div className="compare__code">
          <div className="compare__code-bar">
            <span className="compare__code-label">ECharts</span>
            <button
              type="button"
              className="compare__code-copy"
              onClick={handleCopyCode}
              aria-label="Copy code to clipboard"
            >
              {codeCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="compare__code-content">
            <code>{echartsCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
