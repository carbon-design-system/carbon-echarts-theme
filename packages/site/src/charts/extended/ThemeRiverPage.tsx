import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { Compare } from '../../components/Compare'
import ThemeRiverMdx from '../../content/extended/theme-river.mdx'

const themeRiverData: [string, number, string][] = [
  ['2015-11-08', 10, 'DQ'],
  ['2015-11-09', 15, 'DQ'],
  ['2015-11-10', 35, 'DQ'],
  ['2015-11-08', 35, 'TY'],
  ['2015-11-09', 25, 'TY'],
  ['2015-11-10', 20, 'TY'],
  ['2015-11-08', 21, 'SS'],
  ['2015-11-09', 30, 'SS'],
  ['2015-11-10', 18, 'SS'],
]

const themeRiverOption = {
  tooltip: { trigger: 'axis' as const },
  singleAxis: { top: 50, bottom: 50, type: 'time' as const },
  series: [
    {
      type: 'themeRiver' as const,
      data: themeRiverData,
    },
  ],
}

export function ThemeRiverPage() {
  return (
    <ChartPage
      title="Theme River"
      description="Show evolution of multiple categories over time as flowing stacked bands."
      overview={<ThemeRiverMdx />}
      examples={
        <Compare
          title="Theme River"
          echartsOption={themeRiverOption}
          extended
          echartsCode={`<ReactECharts option={themeRiverOption} theme="carbon-white" />`}
        />
      }
    />
  )
}
