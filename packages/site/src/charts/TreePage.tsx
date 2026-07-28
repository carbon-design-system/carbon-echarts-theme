import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import TreeMdx from '../content/tree.mdx'
import { createTreeOptions } from '@carbon/echarts-theme/presets'
import { treeData } from '../fixtures/tree'
import { TreeChart } from '@carbon/charts-react'

const treeOptionLR = createTreeOptions(treeData, { orient: 'LR' })
const treeOptionTB = createTreeOptions(treeData, { orient: 'TB' })

const echartsCode = `import { createTreeOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

const option = createTreeOptions(treeData, { orient: 'LR' })

<ReactECharts option={option} theme="carbon-white" />`

export function TreePage() {
  return (
    <ChartPage
      title="Tree"
      description="Display hierarchical parent-child relationships as a node-link diagram."
      overview={<TreeMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(treeOptionLR, null, 2)}
      examples={
        <>
          <SideBySide
            title="Tree (left-to-right)"
            echartsOption={treeOptionLR}
            carbonChart={<TreeChart data={treeData as any} options={{} as any} />}
          />
          <SideBySide title="Tree (top-to-bottom)" echartsOption={treeOptionTB} />
        </>
      }
    />
  )
}
