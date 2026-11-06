import { useEffect, useMemo, useRef } from 'react'
import { LineChart, type LineChartProps } from 'semiotic/line'
import type { SemioticTheme } from 'semiotic'
import { ThemeProvider } from 'semiotic/themes/react'
import type { ThemeKey, ChartTabularData } from '@carbon/echarts-theme'
import {
  createLineProps,
  createLineTableData,
  createSemioticTheme,
  type LinePresetOptions,
  type LineRow,
  type CarbonSemioticTheme,
  type SemioticLineProps,
} from '@carbon/echarts-theme/semiotic'
import { createSvgChartSource } from '@carbon/echarts-toolbar'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'

// Type-drift guards: structural types declared in theme package are validated against Semiotic
type _ThemeMatchesSemiotic = CarbonSemioticTheme extends SemioticTheme ? true : never
type _PropsMatchSemiotic = SemioticLineProps extends LineChartProps<LineRow> ? true : never
const _typeChecks: [_ThemeMatchesSemiotic, _PropsMatchSemiotic] = [true, true]
void _typeChecks

export interface CarbonLineChartProps extends Omit<LinePresetOptions, 'themeKey'> {
  data: ChartTabularData
  /** Carbon theme. Default `'white'`. */
  theme?: ThemeKey
  /** Show the Carbon toolbar (table, fullscreen, export). Default `true`. */
  toolbar?: boolean
}

/**
 * Convenience wrapper: Carbon-themed Semiotic `LineChart` + Carbon toolbar.
 */
export function CarbonLineChart({
  data,
  theme = 'white',
  toolbar = true,
  title,
  xLabel,
  yLabel,
  axisLabelRotate,
  curve,
  step,
  timeSeries,
  logScale,
  yDomain,
  thresholds,
  valueFormatter,
  description,
  summary,
  showPoints,
  colors,
  width,
  height,
  legendPosition,
  legendInteraction,
}: CarbonLineChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const semioticTheme = useMemo(() => createSemioticTheme(theme), [theme])
  const props = useMemo(
    () =>
      createLineProps(data, {
        title,
        xLabel,
        yLabel,
        axisLabelRotate,
        curve,
        step,
        timeSeries,
        logScale,
        yDomain,
        thresholds,
        valueFormatter,
        description,
        summary,
        showPoints,
        colors,
        width,
        height,
        legendPosition,
        legendInteraction,
        themeKey: theme,
      }),
    [
      data,
      title,
      xLabel,
      yLabel,
      axisLabelRotate,
      curve,
      step,
      timeSeries,
      logScale,
      yDomain,
      thresholds,
      valueFormatter,
      description,
      summary,
      showPoints,
      colors,
      width,
      height,
      legendPosition,
      legendInteraction,
      theme,
    ],
  )

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !toolbar) return
    const source = createSvgChartSource({
      getTableData: () => createLineTableData(props.data),
      getRoot: () => wrap,
    })
    const handle = createChartToolbar(wrap, source, { title: title ?? 'Line chart' })
    return () => handle.destroy()
  }, [props.data, title, toolbar])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <ThemeProvider theme={semioticTheme}>
        <LineChart {...props} />
      </ThemeProvider>
    </div>
  )
}
