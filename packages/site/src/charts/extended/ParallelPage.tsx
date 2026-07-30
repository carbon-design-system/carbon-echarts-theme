import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { SideBySide } from '../../components/SideBySide'
import ParallelMdx from '../../content/extended/parallel.mdx'

const parallelOption = {
  parallelAxis: [
    { dim: 0, name: 'Speed' },
    { dim: 1, name: 'Power' },
    { dim: 2, name: 'Efficiency' },
    { dim: 3, name: 'Weight' },
  ],
  series: [
    {
      type: 'parallel' as const,
      data: [
        [80, 320, 0.9, 1200],
        [60, 280, 0.85, 900],
        [95, 400, 0.75, 1500],
        [70, 310, 0.88, 1100],
        [55, 260, 0.92, 800],
      ],
    },
  ],
}

export function ParallelPage() {
  return (
    <ChartPage
      title="Parallel coordinates"
      description="Explore multivariate data across multiple vertical axes."
      overview={<ParallelMdx />}
      examples={
        <SideBySide
          title="Parallel coordinates"
          echartsOption={parallelOption}
          extended
          echartsCode={`<ReactECharts option={parallelOption} theme="carbon-white" />`}
        />
      }
    />
  )
}
