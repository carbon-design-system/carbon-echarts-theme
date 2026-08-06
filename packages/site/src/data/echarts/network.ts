/**
 * ECharts sample data for the Network Diagram page.
 *
 * No Carbon Charts equivalent exists — these are representative datasets that
 * demonstrate the ECharts `graph` series with force and circular layouts.
 */
import type { EChartsOption } from 'echarts'
import { createNetworkOptions } from '@carbon/echarts-theme/presets'
import type { NetworkNode, NetworkLink } from '@carbon/echarts-theme/presets'

// ── Shared node/link dataset (~15 nodes, ~20 links) ──────────────────────────

export const nodes: NetworkNode[] = [
  // Type 1 — core services
  { id: '1', name: 'Auth Service', value: 80, category: 'Type 1' },
  { id: '2', name: 'API Gateway', value: 100, category: 'Type 1' },
  { id: '3', name: 'Load Balancer', value: 60, category: 'Type 1' },

  // Type 2 — data services
  { id: '4', name: 'User DB', value: 50, category: 'Type 2' },
  { id: '5', name: 'Cache Layer', value: 40, category: 'Type 2' },
  { id: '6', name: 'Message Queue', value: 45, category: 'Type 2' },
  { id: '7', name: 'Analytics DB', value: 55, category: 'Type 2' },

  // Type 3 — client apps
  { id: '8', name: 'Web App', value: 35, category: 'Type 3' },
  { id: '9', name: 'Mobile App', value: 30, category: 'Type 3' },
  { id: '10', name: 'Admin Portal', value: 25, category: 'Type 3' },

  // Type 4 — external
  { id: '11', name: 'CDN', value: 20, category: 'Type 4' },
  { id: '12', name: 'Email Service', value: 18, category: 'Type 4' },
  { id: '13', name: 'Payment Gateway', value: 22, category: 'Type 4' },
  { id: '14', name: 'Analytics SDK', value: 15, category: 'Type 4' },
  { id: '15', name: 'Monitoring', value: 28, category: 'Type 4' },
]

export const links: NetworkLink[] = [
  // Clients → Gateway
  { source: '8', target: '2', value: 1 },
  { source: '9', target: '2', value: 1 },
  { source: '10', target: '2', value: 1 },

  // Gateway → services
  { source: '2', target: '1', value: 1 },
  { source: '2', target: '3', value: 1 },
  { source: '2', target: '5', value: 1 },
  { source: '2', target: '6', value: 1 },

  // Load balancer → databases
  { source: '3', target: '4', value: 1 },
  { source: '3', target: '7', value: 1 },

  // Auth → user DB + cache
  { source: '1', target: '4', value: 1 },
  { source: '1', target: '5', value: 1 },

  // MQ → analytics
  { source: '6', target: '7', value: 1 },

  // External connections
  { source: '8', target: '11', value: 1 },
  { source: '9', target: '11', value: 1 },
  { source: '2', target: '13', value: 1 },
  { source: '2', target: '12', value: 1 },
  { source: '8', target: '14', value: 1 },
  { source: '9', target: '14', value: 1 },
  { source: '3', target: '15', value: 1 },
  { source: '7', target: '15', value: 1 },
]

// ── Exports ────────────────────────────────────────────────────────────────────

/** Force-directed layout — nodes repel/attract into a stable equilibrium */
export const networkBasic: EChartsOption = createNetworkOptions(nodes, links, {
  title: 'Network Diagram — Force Layout',
  layout: 'force',
})

/** Circular layout — nodes evenly distributed around a ring */
export const networkCircular: EChartsOption = createNetworkOptions(nodes, links, {
  title: 'Network Diagram — Circular Layout',
  layout: 'circular',
  draggable: false,
})
