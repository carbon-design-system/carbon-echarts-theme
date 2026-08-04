import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { UnorderedList, ListItem, Toggle } from '@carbon/react'
import { CompareContext } from './CompareContext'

interface ChartPageProps {
  title: string
  description?: string
  /** MDX overview content — rendered as an intro paragraph above examples */
  overview: React.ReactNode
  /** One or more <Compare> instances */
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
  const [expandAll, setExpandAll] = React.useState(false)

  return (
    <div className="chart-page">
      <div className="chart-page__hero">
        <h1 className="chart-page__title">{title}</h1>
        {description && <p className="chart-page__description">{description}</p>}
      </div>

      <div className="chart-page__body">
        <div className="chart-page__overview">
          <MDXProvider components={{ ul: UnorderedList, li: ListItem }}>{overview}</MDXProvider>
        </div>

        <div className="chart-page__examples">
          {v2Only ? (
            <div className="chart-page__v2-banner">
              <strong>Examples coming in v2.</strong> This chart type is on the roadmap. Check back
              in the next release for live side-by-side examples.
            </div>
          ) : (
            <>
              {examples && (
                <div className="chart-page__examples-toolbar">
                  <Toggle
                    id={`expand-all-${title.replace(/\s+/g, '-').toLowerCase()}`}
                    labelText="Expand all comparisons"
                    hideLabel
                    labelA="Expand all comparisons"
                    labelB="Expand all comparisons"
                    toggled={expandAll}
                    onToggle={(checked: boolean) => setExpandAll(checked)}
                    size="sm"
                  />
                </div>
              )}
              <CompareContext.Provider value={{ expandAll }}>{examples}</CompareContext.Provider>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
