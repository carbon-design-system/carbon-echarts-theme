/**
 * ECharts equivalents for the Tree chart page.
 */
import type { EChartsOption } from 'echarts'
import { createTreeOptions } from '@carbon/echarts-theme/presets'
import type { TreeNode } from '@carbon/echarts-theme/presets'

// Matches carboncharts/tree.ts structure
const treeData: TreeNode = {
  name: 'IBM Analytics',
  children: [
    {
      name: 'Data Science',
      children: [
        { name: 'Watson Studio' },
        { name: 'Watson Machine Learning' },
      ],
    },
    {
      name: 'Data Management',
      children: [
        { name: 'Db2' },
        { name: 'Cloudant' },
        { name: 'Informix' },
      ],
    },
    {
      name: 'Business Intelligence',
      children: [
        { name: 'Cognos Analytics' },
      ],
    },
  ],
}

export const tree: EChartsOption = createTreeOptions(treeData)
export const treeTB: EChartsOption = createTreeOptions(treeData, { orient: 'TB' })
