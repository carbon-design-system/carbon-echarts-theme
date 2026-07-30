import React from 'react'
import { ChartPage } from '../components/ChartPage'
import CirclepackMdx from '../content/circlepack.mdx'

export function CirclepackPage() {
  return (
    <ChartPage
      title="Circle pack"
      description="Display hierarchical data as nested circles sized by value."
      overview={<CirclepackMdx />}
      v2Only
    />
  )
}
