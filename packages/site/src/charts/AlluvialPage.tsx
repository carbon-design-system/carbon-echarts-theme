import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import AlluvialMdx from '../content/alluvial.mdx'
import { createAlluvialOptions } from '@carbon/echarts-theme/presets'
import type { AlluvialDatum } from '@carbon/echarts-theme/presets'
import { chartTypes, examples } from '../data/carboncharts/alluvial'
import { alluvialBasic, alluvialMultiCategory } from '../data/echarts/alluvial'

// Filter to test-tagged examples only
const testExamples = examples.filter((ex) => ex.tags?.includes('test'))

// ECharts equivalents paired by test example index
const echartsOptions = [
  alluvialBasic, // [0] Basic
  alluvialBasic, // [1] Gradient (same structure, different styling)
  alluvialMultiCategory, // [2] Multiple Categories
  alluvialBasic, // [3] Monochrome with Custom Node Padding
  alluvialBasic, // [4] Aligned Nodes
  alluvialMultiCategory, // [5] Custom Colors
]

const titles = [
  'Basic',
  'Gradient',
  'Multiple categories',
  'Monochrome with custom node padding',
  'Aligned nodes',
  'Custom colors',
]

export function AlluvialPage() {
  return (
    <ChartPage
      title="Alluvial / Sankey"
      description="Visualize flows and redistribution between nodes."
      overview={<AlluvialMdx />}
      examples={testExamples.map((ex, i) => (
        <SideBySide
          key={i}
          title={titles[i] ?? `Example ${i + 1}`}
          echartsOption={
            echartsOptions[i] ??
            createAlluvialOptions(ex.data as AlluvialDatum[])
          }
          carbonExample={ex}
          chartClass={chartTypes.vanilla}
        />
      ))}
    />
  )
}
