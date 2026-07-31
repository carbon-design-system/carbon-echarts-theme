import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import NetworkMdx from '../content/network.mdx'
import { networkBasic, networkCircular } from '../data/echarts/network'

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

export function NetworkDiagramPage() {
  return (
    <ChartPage
      title="Network Diagrams"
      description="Visualize relationships between nodes using force-directed or hierarchical layouts."
      overview={<NetworkMdx />}
      examples={
        <>
          <SideBySide
            title="Force layout"
            echartsOption={networkBasic}
            extended
            echartsCode={networkForceCode}
          />
          <SideBySide
            title="Circular layout"
            echartsOption={networkCircular}
            extended
            echartsCode={networkCircularCode}
          />
        </>
      }
    />
  )
}
