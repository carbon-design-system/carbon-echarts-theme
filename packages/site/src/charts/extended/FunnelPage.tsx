import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { SideBySide } from '../../components/SideBySide'
import FunnelMdx from '../../content/extended/funnel.mdx'

const funnelOption = {
  tooltip: { trigger: 'item' as const },
  series: [
    {
      type: 'funnel' as const,
      sort: 'descending' as const,
      gap: 2,
      data: [
        { name: 'Visitors', value: 100 },
        { name: 'Prospects', value: 80 },
        { name: 'Leads', value: 60 },
        { name: 'Opportunities', value: 40 },
        { name: 'Closed', value: 20 },
      ],
    },
  ],
}

export function FunnelPage() {
  return (
    <ChartPage
      title="Funnel"
      description="Show conversion rates through a sequential multi-step process."
      overview={<FunnelMdx />}
      echartsCode={`<ReactECharts option={funnelOption} theme="carbon-white" />`}
      examples={
        <SideBySide title="Funnel" echartsOption={funnelOption} extended />
      }
    />
  )
}
