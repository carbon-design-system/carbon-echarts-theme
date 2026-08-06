import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import NetworkMdx from '../content/network.mdx'
import { networkBasic, networkCircular, nodes, links } from '../data/echarts/network'

const networkForceCode = `import { createNetworkOptions } from '@carbon/echarts-theme/presets'

const nodes = [
  { id: 'node1', name: 'Node 1', value: 10 },
  { id: 'node2', name: 'Node 2', value: 20 },
]

const links = [
  { source: 'node1', target: 'node2' },
]

const option = createNetworkOptions(nodes, links, { layout: 'force' })`

const networkCircularCode = `import { createNetworkOptions } from '@carbon/echarts-theme/presets'

const nodes = [/* ... */]
const links = [/* ... */]

const option = createNetworkOptions(nodes, links, { layout: 'circular' })`

const networkData = [...nodes, ...links]

export function NetworkDiagramPage() {
  return (
    <ChartPage
      title="Network Diagrams"
      description="Visualize relationships between nodes using force-directed or hierarchical layouts."
      overview={<NetworkMdx />}
      examples={
        <>
          <Compare
            title="Force layout"
            echartsOption={networkBasic}
            extended
            optionCode={networkForceCode}
            chartData={networkData}
          />
          <Compare
            title="Circular layout"
            echartsOption={networkCircular}
            extended
            optionCode={networkCircularCode}
            chartData={networkData}
          />
        </>
      }
    />
  )
}
