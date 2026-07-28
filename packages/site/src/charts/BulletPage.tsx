import React from 'react'
import { ChartPage } from '../components/ChartPage'
import BulletMdx from '../content/bullet.mdx'

export function BulletPage() {
  return (
    <ChartPage
      title="Bullet"
      description="A compact alternative to gauges for showing a measure against a target and qualitative ranges."
      overview={<BulletMdx />}
      v2Only
    />
  )
}
