import React from 'react'
import { CodeTabs } from './CodeTabs'

type TabId = 'overview' | 'examples' | 'code'

interface ChartPageProps {
  title: string
  description?: string
  /** MDX overview content */
  overview: React.ReactNode
  /** One or more <SideBySide> instances */
  examples?: React.ReactNode
  /** v2 badge — shows "Examples coming in v2" banner instead of examples */
  v2Only?: boolean
  /** ECharts code snippet for Code tab */
  echartsCode?: string
  /** Carbon Charts code snippet for Code tab */
  carbonCode?: string
  /** Options JSON for Code tab */
  optionsJson?: string
}

export function ChartPage({
  title,
  description,
  overview,
  examples,
  v2Only = false,
  echartsCode,
  carbonCode,
  optionsJson,
}: ChartPageProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>('overview')

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'examples', label: 'Examples' },
    { id: 'code', label: 'Code' },
  ]

  return (
    <div className="chart-page">
      <div className="chart-page__hero">
        <h1 className="chart-page__title">{title}</h1>
        {description && <p className="chart-page__description">{description}</p>}
      </div>

      <div className="chart-page__tabs">
        <div role="tablist" aria-label={`${title} tabs`} className="chart-page__tablist">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={`chart-page__tab${activeTab === id ? ' chart-page__tab--active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="chart-page__panel">
          {activeTab === 'overview' && (
            <div className="chart-page__overview">{overview}</div>
          )}

          {activeTab === 'examples' && (
            <div className="chart-page__examples">
              {v2Only ? (
                <div className="chart-page__v2-banner">
                  <strong>Examples coming in v2.</strong> This chart type is on the roadmap.
                  Check back in the next release for live side-by-side examples.
                </div>
              ) : (
                examples
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="chart-page__code">
              {echartsCode ? (
                <CodeTabs
                  echartsCode={echartsCode}
                  carbonCode={carbonCode}
                  optionsJson={optionsJson}
                />
              ) : (
                <p className="chart-page__no-code">No code examples available yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
