/**
 * ECharts word cloud examples.
 * Requires `import 'echarts-wordcloud'` as a side effect before rendering.
 */
import type { EChartsOption } from 'echarts'
import { createWordCloudOptions } from '@carbon/echarts-theme/presets'

export const wordData = [
  { name: 'JavaScript', value: 1000 },
  { name: 'TypeScript', value: 850 },
  { name: 'Python', value: 800 },
  { name: 'React', value: 750 },
  { name: 'Node.js', value: 700 },
  { name: 'CSS', value: 650 },
  { name: 'HTML', value: 620 },
  { name: 'Docker', value: 580 },
  { name: 'Kubernetes', value: 540 },
  { name: 'GraphQL', value: 500 },
  { name: 'REST', value: 480 },
  { name: 'SQL', value: 460 },
  { name: 'Git', value: 440 },
  { name: 'Linux', value: 420 },
  { name: 'AWS', value: 400 },
  { name: 'Rust', value: 360 },
  { name: 'Go', value: 340 },
  { name: 'Java', value: 320 },
  { name: 'CI/CD', value: 300 },
  { name: 'WebAssembly', value: 280 },
  { name: 'Next.js', value: 260 },
  { name: 'Vite', value: 240 },
  { name: 'Tailwind', value: 220 },
  { name: 'Testing', value: 200 },
  { name: 'Redis', value: 180 },
]

export const wordcloudBasic: EChartsOption = createWordCloudOptions(wordData)

export const wordcloudCircular: EChartsOption = createWordCloudOptions(wordData, {
  shape: 'circle',
})

export const wordcloudDiamond: EChartsOption = createWordCloudOptions(wordData, {
  shape: 'diamond',
  minFontSize: 14,
  maxFontSize: 72,
})
