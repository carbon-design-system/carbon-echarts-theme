import React from 'react'
import { ChartPage } from '../components/ChartPage'
import BulletMdx from '../content/bullet.mdx'

const stub = (
  <div className="chart-page__v2-banner">
    <strong>No direct ECharts equivalent.</strong> Use{' '}
    <a href="https://charts.carbondesignsystem.com/bullet" target="_blank" rel="noreferrer">
      Carbon Charts BulletChart
    </a>{' '}
    for this visualization.
    <br />
    <br />
    <em>Optional workaround:</em> implement via <code>bar</code> + <code>markLine</code> (target
    marker) + <code>markArea</code> (range bands).
  </div>
)

export function BulletPage() {
  return (
    <ChartPage
      title="Bullet"
      description="A compact alternative to gauges for showing a measure against a target and qualitative ranges."
      overview={<BulletMdx />}
      examples={stub}
    />
  )
}
