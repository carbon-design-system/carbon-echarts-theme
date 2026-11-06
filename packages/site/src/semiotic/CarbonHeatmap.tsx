import { useEffect, useMemo, useRef } from 'react'
import { Heatmap, type HeatmapProps } from 'semiotic/xy'
import type { SemioticTheme } from 'semiotic'
import { ThemeProvider } from 'semiotic/themes/react'
import type { ThemeKey, ChartTabularData } from '@carbon/echarts-theme'
import {
  createHeatmapProps,
  createHeatmapTableData,
  createSemioticTheme,
  type HeatmapPresetOptions,
  type HeatmapRow,
  type CarbonSemioticTheme,
  type SemioticHeatmapProps,
} from '@carbon/echarts-theme/semiotic'
import { createSvgChartSource } from '@carbon/echarts-toolbar'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'

// Type-drift guards
type _ThemeMatchesSemiotic = CarbonSemioticTheme extends SemioticTheme ? true : never
type _PropsMatchSemiotic = SemioticHeatmapProps extends HeatmapProps<HeatmapRow> ? true : never
const _typeChecks: [_ThemeMatchesSemiotic, _PropsMatchSemiotic] = [true, true]
void _typeChecks

export interface CarbonHeatmapProps extends Omit<HeatmapPresetOptions, 'themeKey'> {
  data: ChartTabularData
  /** Carbon theme. Default `'white'`. */
  theme?: ThemeKey
  /** Show the Carbon toolbar (table, fullscreen, export). Default `true`. */
  toolbar?: boolean
}

/**
 * Convenience wrapper: Carbon-themed Semiotic `Heatmap` + Carbon toolbar.
 */
export function CarbonHeatmap({
  data,
  theme = 'white',
  toolbar = true,
  title,
  xLabel,
  yLabel,
  colorScheme,
  customColorScale,
  showValues,
  valueFormatter,
  showLegend,
  legendPosition,
  description,
  summary,
  cellBorderColor,
  cellBorderWidth,
  width,
  height,
}: CarbonHeatmapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const semioticTheme = useMemo(() => createSemioticTheme(theme), [theme])
  const props = useMemo(
    () =>
      createHeatmapProps(data, {
        title,
        xLabel,
        yLabel,
        colorScheme,
        customColorScale,
        showValues,
        valueFormatter,
        showLegend,
        legendPosition,
        description,
        summary,
        cellBorderColor,
        cellBorderWidth,
        width,
        height,
        themeKey: theme,
      }),
    [
      data,
      title,
      xLabel,
      yLabel,
      colorScheme,
      customColorScale,
      showValues,
      valueFormatter,
      showLegend,
      legendPosition,
      description,
      summary,
      cellBorderColor,
      cellBorderWidth,
      width,
      height,
      theme,
    ],
  )

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !toolbar) return
    const source = createSvgChartSource({
      getTableData: () => createHeatmapTableData(props.data),
      getRoot: () => wrap,
    })
    const handle = createChartToolbar(wrap, source, { title: title ?? 'Heatmap' })
    return () => handle.destroy()
  }, [props.data, title, toolbar])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <ThemeProvider theme={semioticTheme}>
        <Heatmap {...props} />
      </ThemeProvider>
    </div>
  )
}
