import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { Compare } from '../../components/Compare'
import ThemeRiverMdx from '../../content/extended/theme-river.mdx'
import { createThemeRiverOptions } from '@carbon/echarts-theme/presets'
import type { ThemeRiverDatum } from '@carbon/echarts-theme/presets'

// ── Data ──────────────────────────────────────────────────────────────────────
//
// Weekly music streaming popularity for six genres across 2023.
// Inspired by the official ECharts ThemeRiver example:
// https://echarts.apache.org/examples/en/index.html#chart-type-themeRiver
//
// Format: [date, value, streamName]
// Colors are applied automatically via createThemeRiverOptions using Carbon's
// N-color palette (pickColors) — no hex strings are hardcoded anywhere.

const themeRiverData: ThemeRiverDatum[] = [
  // Pop
  ['2023-01-01', 320, 'Pop'],
  ['2023-02-01', 302, 'Pop'],
  ['2023-03-01', 341, 'Pop'],
  ['2023-04-01', 374, 'Pop'],
  ['2023-05-01', 390, 'Pop'],
  ['2023-06-01', 450, 'Pop'],
  ['2023-07-01', 420, 'Pop'],
  ['2023-08-01', 460, 'Pop'],
  ['2023-09-01', 410, 'Pop'],
  ['2023-10-01', 380, 'Pop'],
  ['2023-11-01', 430, 'Pop'],
  ['2023-12-01', 510, 'Pop'],
  // Hip-Hop
  ['2023-01-01', 220, 'Hip-Hop'],
  ['2023-02-01', 182, 'Hip-Hop'],
  ['2023-03-01', 191, 'Hip-Hop'],
  ['2023-04-01', 234, 'Hip-Hop'],
  ['2023-05-01', 290, 'Hip-Hop'],
  ['2023-06-01', 330, 'Hip-Hop'],
  ['2023-07-01', 310, 'Hip-Hop'],
  ['2023-08-01', 350, 'Hip-Hop'],
  ['2023-09-01', 290, 'Hip-Hop'],
  ['2023-10-01', 270, 'Hip-Hop'],
  ['2023-11-01', 310, 'Hip-Hop'],
  ['2023-12-01', 360, 'Hip-Hop'],
  // Electronic
  ['2023-01-01', 150, 'Electronic'],
  ['2023-02-01', 232, 'Electronic'],
  ['2023-03-01', 201, 'Electronic'],
  ['2023-04-01', 154, 'Electronic'],
  ['2023-05-01', 190, 'Electronic'],
  ['2023-06-01', 330, 'Electronic'],
  ['2023-07-01', 410, 'Electronic'],
  ['2023-08-01', 390, 'Electronic'],
  ['2023-09-01', 270, 'Electronic'],
  ['2023-10-01', 180, 'Electronic'],
  ['2023-11-01', 200, 'Electronic'],
  ['2023-12-01', 220, 'Electronic'],
  // R&B
  ['2023-01-01', 98, 'R&B'],
  ['2023-02-01', 77, 'R&B'],
  ['2023-03-01', 101, 'R&B'],
  ['2023-04-01', 99, 'R&B'],
  ['2023-05-01', 120, 'R&B'],
  ['2023-06-01', 115, 'R&B'],
  ['2023-07-01', 130, 'R&B'],
  ['2023-08-01', 140, 'R&B'],
  ['2023-09-01', 125, 'R&B'],
  ['2023-10-01', 111, 'R&B'],
  ['2023-11-01', 118, 'R&B'],
  ['2023-12-01', 135, 'R&B'],
  // Rock
  ['2023-01-01', 188, 'Rock'],
  ['2023-02-01', 194, 'Rock'],
  ['2023-03-01', 200, 'Rock'],
  ['2023-04-01', 196, 'Rock'],
  ['2023-05-01', 201, 'Rock'],
  ['2023-06-01', 213, 'Rock'],
  ['2023-07-01', 224, 'Rock'],
  ['2023-08-01', 218, 'Rock'],
  ['2023-09-01', 209, 'Rock'],
  ['2023-10-01', 195, 'Rock'],
  ['2023-11-01', 200, 'Rock'],
  ['2023-12-01', 215, 'Rock'],
  // Jazz
  ['2023-01-01', 60, 'Jazz'],
  ['2023-02-01', 72, 'Jazz'],
  ['2023-03-01', 68, 'Jazz'],
  ['2023-04-01', 74, 'Jazz'],
  ['2023-05-01', 81, 'Jazz'],
  ['2023-06-01', 79, 'Jazz'],
  ['2023-07-01', 90, 'Jazz'],
  ['2023-08-01', 85, 'Jazz'],
  ['2023-09-01', 77, 'Jazz'],
  ['2023-10-01', 70, 'Jazz'],
  ['2023-11-01', 75, 'Jazz'],
  ['2023-12-01', 88, 'Jazz'],
]

const themeRiverOption = createThemeRiverOptions(themeRiverData, {
  title: 'Music Genre Streaming Trends 2023',
})

export function ThemeRiverPage() {
  return (
    <ChartPage
      title="Theme River"
      description="Show evolution of multiple categories over time as flowing stacked bands."
      overview={<ThemeRiverMdx />}
      examples={
        <Compare
          title="Music Genre Streaming Trends"
          echartsOption={themeRiverOption}
          extended
          height="420px"
          optionCode={`import { createThemeRiverOptions } from '@carbon/echarts-theme/presets'
import type { ThemeRiverDatum } from '@carbon/echarts-theme/presets'

const data: ThemeRiverDatum[] = [
  ['2023-01-01', 320, 'Pop'],
  ['2023-01-01', 220, 'Hip-Hop'],
  // ...
]

const option = createThemeRiverOptions(data, {
  title: 'My Stream Chart',
})

<ReactECharts option={option} theme="carbon-white" />`}
        />
      }
    />
  )
}
