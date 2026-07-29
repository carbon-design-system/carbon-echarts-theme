import React from 'react'
import { ChartPage } from '../components/ChartPage'
import { SideBySide } from '../components/SideBySide'
import BoxplotMdx from '../content/boxplot.mdx'
import { createBoxplotOptions } from '@carbon/echarts-theme/presets'
import { boxplotCategories, boxplotData } from '../fixtures/boxplot'
import { BoxplotChart } from '@carbon/charts-react'

// createBoxplotOptions expects ChartTabularData with multiple values per group
// Convert pre-computed stats to mock raw observations for the preset
const boxplotTabular = boxplotCategories.flatMap((cat, ci) => {
  const [min, q1, med, q3, max] = boxplotData[ci]!
  // Emit representative observations spanning the stats
  return [min, q1, q1, med, med, med, q3, q3, max].map((v) => ({
    group: cat,
    key: cat,
    value: v,
  }))
})

const boxplotOption = createBoxplotOptions(boxplotTabular)

const echartsCode = `import { createBoxplotOptions } from '@carbon/echarts-theme/presets'
import ReactECharts from 'echarts-for-react'

// data: multiple rows per group, each with a numeric value
const option = createBoxplotOptions(data)

<ReactECharts option={option} theme="carbon-white" />`

// Carbon Charts BoxplotChart expects raw observations per group
const carbonBoxplotData = boxplotCategories.flatMap((cat, ci) => {
  const [min, q1, med, q3, max] = boxplotData[ci]!
  return [min, q1, q1, med, med, med, q3, q3, max].map((v) => ({ group: cat, key: cat, value: v }))
})
const boxplotAxes = {
  axes: { bottom: { mapsTo: 'key', scaleType: 'labels' }, left: { mapsTo: 'value' } },
}

export function BoxplotPage() {
  return (
    <ChartPage
      title="Boxplot"
      description="Display the statistical distribution of datasets across categories."
      overview={<BoxplotMdx />}
      echartsCode={echartsCode}
      optionsJson={JSON.stringify(boxplotOption, null, 2)}
      examples={
        <SideBySide
          title="Boxplot"
          echartsOption={boxplotOption}
          carbonChart={
            <BoxplotChart data={carbonBoxplotData as any} options={boxplotAxes as any} />
          }
        />
      }
    />
  )
}
