import React from 'react'

export function DataPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Chart data</h1>
      </div>
      <div className="content-page">
        <p>
          The chart preset functions accept a flat tabular array of objects matching{' '}
          <code>ChartTabularData</code>. This mirrors Carbon Charts' own data format so migration
          requires only changing the function call, not the data shape.
        </p>

        <h2>ChartTabularData format</h2>
        <pre>
          <code>{`type ChartTabularDatum = {
  group: string     // series name / legend label
  key?: string | number   // x-axis category or time value
  date?: Date       // x-axis for time-series charts
  value: number     // y-axis value
  [extra: string]: unknown  // any additional fields (e.g. size for bubble)
}

type ChartTabularData = ChartTabularDatum[]`}</code>
        </pre>

        <h2>Simple bar example</h2>
        <pre>
          <code>{`import { createBarOptions } from '@carbon/echarts-theme/presets'

const data = [
  { group: 'Dataset 1', value: 65000 },
  { group: 'Dataset 2', value: 29123 },
  { group: 'Dataset 3', value: 35213 },
]

const option = createBarOptions(data)`}</code>
        </pre>

        <h2>Grouped / multi-series example</h2>
        <pre>
          <code>{`const data = [
  { group: 'Series A', key: 'Jan', value: 10000 },
  { group: 'Series A', key: 'Feb', value: 25000 },
  { group: 'Series B', key: 'Jan', value: 8000 },
  { group: 'Series B', key: 'Feb', value: 18000 },
]

// Each unique 'group' becomes a separate series
const option = createGroupedBarOptions(data)`}</code>
        </pre>

        <h2>Time-series example</h2>
        <pre>
          <code>{`const data = [
  { group: 'Dataset 1', date: new Date('2024-01-01'), value: 10000 },
  { group: 'Dataset 1', date: new Date('2024-02-01'), value: 25000 },
]

const option = createTimeSeriesLineOptions(data)`}</code>
        </pre>

        <h2>Dates</h2>
        <p>
          For time-series charts, use the <code>date</code> field with a <code>Date</code> object.
          The preset sets <code>xAxis.type: 'time'</code> automatically. For all other charts, use
          the <code>key</code> field for x-axis categories.
        </p>
      </div>
    </div>
  )
}
