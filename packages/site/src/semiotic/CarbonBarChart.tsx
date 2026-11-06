import { useEffect, useMemo, useRef } from 'react'
import { BarChart, type BarChartProps } from 'semiotic/ordinal'
import type { SemioticTheme } from 'semiotic'
import { ThemeProvider } from 'semiotic/themes/react'
import type { ThemeKey, ChartTabularData } from '@carbon/echarts-theme'
import {
  createBarProps,
  createBarTableData,
  createSemioticTheme,
  type BarPresetOptions,
  type BarRow,
  type CarbonSemioticTheme,
  type SemioticBarProps,
} from '@carbon/echarts-theme/semiotic'
import { createSvgChartSource } from '@carbon/echarts-toolbar'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'

// Type-drift guards: the theme package declares structural types so it needs no
// `semiotic` dependency. These fail to compile if Semiotic's types diverge.
type _ThemeMatchesSemiotic = CarbonSemioticTheme extends SemioticTheme ? true : never
type _PropsMatchSemiotic = SemioticBarProps extends BarChartProps<BarRow> ? true : never
const _typeChecks: [_ThemeMatchesSemiotic, _PropsMatchSemiotic] = [true, true]
void _typeChecks

export interface CarbonBarChartProps extends Omit<BarPresetOptions, 'themeKey'> {
  data: ChartTabularData
  /** Carbon theme. Default `'white'`. */
  theme?: ThemeKey
  /** Show the Carbon toolbar (table, fullscreen, export). Default `true`. */
  toolbar?: boolean
}

/**
 * Convenience wrapper: Carbon-themed Semiotic `BarChart` + Carbon toolbar.
 * Adopters who want full control can instead compose `ThemeProvider`,
 * `createSemioticTheme`, `createBarProps` and `createChartToolbar` themselves.
 */
export function CarbonBarChart({
  data,
  theme = 'white',
  toolbar = true,
  title,
  xLabel,
  yLabel,
  horizontal,
  yDomain,
  thresholds,
  valueFormatter,
  description,
  summary,
  colors,
  width,
  height,
  legendPosition,
  legendInteraction,
}: CarbonBarChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const semioticTheme = useMemo(() => createSemioticTheme(theme), [theme])
  const props = useMemo(
    () =>
      createBarProps(data, {
        title,
        xLabel,
        yLabel,
        horizontal,
        yDomain,
        thresholds,
        valueFormatter,
        description,
        summary,
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
      horizontal,
      yDomain,
      thresholds,
      valueFormatter,
      description,
      summary,
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
      getTableData: () => createBarTableData(props.data),
      getRoot: () => wrap,
    })
    const handle = createChartToolbar(wrap, source, { title: title ?? 'Bar chart' })
    return () => handle.destroy()
  }, [props.data, title, toolbar])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <ThemeProvider theme={semioticTheme}>
        <BarChart {...props} />
      </ThemeProvider>
    </div>
  )
}
