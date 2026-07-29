import type { TreeNode } from '@carbon/echarts-theme/presets'

export const treeData: TreeNode = {
  name: 'Root',
  children: [
    {
      name: 'Branch A',
      children: [{ name: 'Leaf A1' }, { name: 'Leaf A2' }],
    },
    {
      name: 'Branch B',
      children: [
        { name: 'Leaf B1' },
        {
          name: 'Branch B2',
          children: [{ name: 'Leaf B2a' }, { name: 'Leaf B2b' }],
        },
      ],
    },
    {
      name: 'Branch C',
      children: [{ name: 'Leaf C1' }],
    },
  ],
}
