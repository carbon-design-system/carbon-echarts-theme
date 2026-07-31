import React from 'react'
import { ChartPage } from '../components/ChartPage'
import ChoroplethMdx from '../content/choropleth.mdx'

const stub = (
  <div className="chart-page__v2-banner">
    <strong>No viable ECharts equivalent.</strong> ECharts map does not match Carbon Charts&apos;
    D3-geo projection. Use{' '}
    <a href="https://charts.carbondesignsystem.com/choropleth" target="_blank" rel="noreferrer">
      Carbon Charts ChoroplethChart
    </a>{' '}
    for this visualization.
  </div>
)

export function ChoroplethPage() {
  return (
    <ChartPage
      title="Choropleth"
      description="Encode a quantitative variable as color fill across geographic regions."
      overview={<ChoroplethMdx />}
      examples={stub}
    />
  )
}
