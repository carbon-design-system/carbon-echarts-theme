import type { EChartsType } from 'echarts'
import ReactECharts from 'echarts-for-react'
import type { CarbonThemeName } from '@carbon/echarts-theme'
import { findVariant, DEFAULT_SLUG } from './variants'

// Stable reference — prevents echarts-for-react from dispose+reiniting on every render
// when opts is defined inline as an object literal.
const ECHARTS_OPTS = { renderer: 'canvas' as const }

interface LineChartProps {
  /** Variant slug, e.g. 'rainfall', 'discrete'. Defaults to first variant. */
  slug?: string
  /** Registered Carbon theme name */
  theme: CarbonThemeName
  /** Called with the ECharts instance once the chart is ready (used for toolbar wiring). */
  onChartReady?: (inst: EChartsType) => void
}

export function LineChart({ slug = DEFAULT_SLUG, theme, onChartReady }: LineChartProps) {
  const { option, height = 400 } = findVariant(slug)
  return (
    <ReactECharts
      option={option}
      theme={theme}
      style={{ height, width: '100%' }}
      opts={ECHARTS_OPTS}
      onChartReady={onChartReady}
    />
  )
}
