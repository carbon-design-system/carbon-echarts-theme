import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { SideBySide } from '../../components/SideBySide'
import GraphMdx from '../../content/extended/graph.mdx'

const graphOption = {
  tooltip: {},
  series: [
    {
      type: 'graph' as const,
      layout: 'force' as const,
      data: [
        { name: 'Node A', symbolSize: 50 },
        { name: 'Node B', symbolSize: 30 },
        { name: 'Node C', symbolSize: 30 },
        { name: 'Node D', symbolSize: 20 },
        { name: 'Node E', symbolSize: 20 },
      ],
      links: [
        { source: 'Node A', target: 'Node B' },
        { source: 'Node A', target: 'Node C' },
        { source: 'Node B', target: 'Node D' },
        { source: 'Node C', target: 'Node E' },
        { source: 'Node D', target: 'Node E' },
      ],
      roam: true,
      label: { show: true },
      lineStyle: { curveness: 0.2 },
    },
  ],
}

export function GraphPage() {
  return (
    <ChartPage
      title="Graph (Network)"
      description="Visualize relationships between entities as nodes and edges."
      overview={<GraphMdx />}
      echartsCode={`<ReactECharts option={graphOption} theme="carbon-white" />`}
      examples={<SideBySide title="Force-directed graph" echartsOption={graphOption} extended />}
    />
  )
}
