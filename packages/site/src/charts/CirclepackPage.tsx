import React from 'react'
import { ChartPage } from '../components/ChartPage'
import CirclepackMdx from '../content/circlepack.mdx'

const stub = (
  <div className="chart-page__v2-banner">
    <strong>No ECharts equivalent.</strong> ECharts has no native packed-circle layout. Use{' '}
    <a href="https://charts.carbondesignsystem.com/circlepack" target="_blank" rel="noreferrer">
      Carbon Charts CirclepackChart
    </a>{' '}
    for this visualization.
    <br />
    <br />
    <em>Post-MVP option:</em> evaluate <code>d3-hierarchy</code> pack layout pre-processor feeding
    an ECharts custom series.
  </div>
)

export function CirclepackPage() {
  return (
    <ChartPage
      title="Circlepack"
      description="Display hierarchical data as nested circles sized by value."
      overview={<CirclepackMdx />}
      examples={stub}
    />
  )
}
