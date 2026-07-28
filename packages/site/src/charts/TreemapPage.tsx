import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import TreemapMdx from '../content/treemap.mdx'
import { createTreemapOptions } from '@carbon/echarts-theme/presets'
import { treemapData } from '../fixtures/treemap'
import { TreemapChart } from '@carbon/charts-react'

// createTreemapOptions expects ChartTabularData (flat rows, group = parent, key = leaf name)
const treemapTabular = treemapData.flatMap((parent) =>
  parent.children.map((child) => ({
    group: parent.name,
    key: child.name,
    value: child.value,
  })),
)

const treemapOption = createTreemapOptions(treemapTabular)

const echartsCode = `import { createTreemapOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// data: { name, value, children? }[]
const option = createTreemapOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

// Carbon Charts TreemapChart uses flat { group (parent), name (leaf), value }
const carbonTreemapData = treemapData.flatMap(parent =>
  parent.children.map(child => ({ group: parent.name, name: child.name, value: child.value }))
)

export function TreemapPage() {
  return (
    <ChartPage
      title="Treemap"
      description="Display hierarchical data as nested rectangles."
      overview={<TreemapMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(treemapOption, null, 2)}
      examples={
        <SideBySide
          title="Treemap"
          echartsOption={treemapOption}
          carbonChart={<TreemapChart data={carbonTreemapData as any} options={{} as any} />}
        />
      }
    />
  )
}
