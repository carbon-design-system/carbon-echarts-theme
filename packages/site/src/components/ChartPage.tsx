import React from 'react'

interface ChartPageProps {
  title: string
  description?: string
  /** MDX overview content — rendered as an intro paragraph above examples */
  overview: React.ReactNode
  /** One or more <SideBySide> instances */
  examples?: React.ReactNode
  /** v2 badge — shows "Examples coming in v2" banner instead of examples */
  v2Only?: boolean
}

export function ChartPage({
  title,
  description,
  overview,
  examples,
  v2Only = false,
}: ChartPageProps) {
  return (
    <div className="chart-page">
      <div className="chart-page__hero">
        <h1 className="chart-page__title">{title}</h1>
        {description && <p className="chart-page__description">{description}</p>}
      </div>

      <div className="chart-page__body">
        <div className="chart-page__overview">{overview}</div>

        <div className="chart-page__examples">
          {v2Only ? (
            <div className="chart-page__v2-banner">
              <strong>Examples coming in v2.</strong> This chart type is on the roadmap. Check back
              in the next release for live side-by-side examples.
            </div>
          ) : (
            examples
          )}
        </div>
      </div>
    </div>
  )
}
