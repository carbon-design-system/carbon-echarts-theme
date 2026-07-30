import React from 'react'
import { ChartPage } from '../components/ChartPage'

export function NetworkDiagramPage() {
  return (
    <ChartPage
      title="Network Diagrams"
      description="Visualize relationships between nodes using force-directed or hierarchical layouts."
      v2Only
    />
  )
}
