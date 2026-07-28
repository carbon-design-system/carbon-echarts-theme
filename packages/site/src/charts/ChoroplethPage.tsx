import React from 'react'
import { ChartPage } from '../components/ChartPage'
import ChoroplethMdx from '../content/choropleth.mdx'

export function ChoroplethPage() {
  return (
    <ChartPage
      title="Choropleth"
      description="Encode a quantitative variable as color fill across geographic regions."
      overview={<ChoroplethMdx />}
      v2Only
    />
  )
}
