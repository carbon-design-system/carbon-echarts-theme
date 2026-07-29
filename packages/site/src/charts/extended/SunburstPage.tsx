import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { SideBySide } from '../../components/SideBySide'
import SunburstMdx from '../../content/extended/sunburst.mdx'

const sunburstOption = {
  tooltip: { trigger: 'item' as const },
  series: [
    {
      type: 'sunburst' as const,
      data: [
        {
          name: 'Category A',
          value: 10,
          children: [
            { name: 'A1', value: 4 },
            { name: 'A2', value: 6 },
          ],
        },
        {
          name: 'Category B',
          value: 20,
          children: [
            { name: 'B1', value: 12 },
            { name: 'B2', value: 8 },
          ],
        },
        {
          name: 'Category C',
          value: 15,
          children: [
            { name: 'C1', value: 7 },
            { name: 'C2', value: 8 },
          ],
        },
      ],
      radius: ['0%', '70%'],
    },
  ],
}

export function SunburstPage() {
  return (
    <ChartPage
      title="Sunburst"
      description="Display hierarchical data as concentric rings."
      overview={<SunburstMdx />}
      echartsCode={`<ReactECharts option={sunburstOption} theme="carbon-white" />`}
      examples={<SideBySide title="Sunburst" echartsOption={sunburstOption} extended />}
    />
  )
}
