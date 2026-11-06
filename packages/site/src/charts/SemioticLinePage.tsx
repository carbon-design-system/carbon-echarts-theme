import React from 'react'
import { magenta70, cyan70, purple60, gray30 } from '@carbon/colors'
import { CarbonLineChart } from '../semiotic/CarbonLineChart'
import { Compare } from '../components/Compare'
import { useTheme } from '../components/ThemeContext'
import {
  lineData,
  lineStandard,
  lineStep,
  lineDiscrete,
  lineRotatedTicks,
  lineLocale,
  lineLogAxis,
  lineCustomColors,
  lineSelectedGroups,
  lineLegendOrientation,
  lineThresholds,
  lineLongLabel,
  lineTimeSeries,
  lineTimeSeriesDense,
  lineSelectedGroupsData,
  lineLongLabelData,
  timeSeriesData as lineTimeSeriesData,
  timeSeriesDenseData,
  logAxisData,
  rotatedTicksData,
  frenchLocaleData,
} from '../data/echarts/line'

interface SemioticCompareItem {
  title: string
  subtitle?: string
  semioticProps: React.ComponentProps<typeof CarbonLineChart>
  echartsOption: any
}

/**
 * Exploration: the same Carbon line datasets rendered side-by-side with Semiotic and
 * with ECharts, both themed from @carbon/echarts-theme and using the shared Carbon toolbar.
 */
export function SemioticLinePage() {
  const { theme } = useTheme()

  const examples: SemioticCompareItem[] = [
    {
      title: 'Line (discrete / standard)',
      subtitle: 'Standard multi-series discrete category line chart',
      semioticProps: {
        data: lineData,
        theme,
        title: 'Line chart (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineStandard,
    },
    {
      title: 'Line (step variant)',
      subtitle: 'Step curve interpolation for discrete state changes',
      semioticProps: {
        data: lineData,
        theme,
        step: true,
        title: 'Step line (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineStep,
    },
    {
      title: 'Line (time series)',
      subtitle: 'Continuous Date/time X-axis with multiple series',
      semioticProps: {
        data: lineTimeSeriesData,
        theme,
        timeSeries: true,
        title: 'Time series line (Semiotic)',
        xLabel: 'Date',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineTimeSeries,
    },
    {
      title: 'Line (time series, dense)',
      subtitle: 'Sub-daily ISO timestamps rendered at high density',
      semioticProps: {
        data: timeSeriesDenseData,
        theme,
        timeSeries: true,
        title: 'Dense time series (Semiotic)',
        xLabel: 'Timestamp',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineTimeSeriesDense,
    },
    {
      title: 'Line (time series with thresholds)',
      subtitle: 'Reference lines indicating warning/critical target values',
      semioticProps: {
        data: lineTimeSeriesData,
        theme,
        timeSeries: true,
        thresholds: [{ value: 55000, label: 'Custom label' }, { value: 10000 }],
        title: 'Time series with thresholds (Semiotic)',
        xLabel: 'Date',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineThresholds,
    },
    {
      title: 'Line (custom domain)',
      subtitle: 'Constrained Y-axis domain [10,000, 50,000]',
      semioticProps: {
        data: lineData,
        theme,
        yDomain: [10000, 50000],
        title: 'Custom domain (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineDiscrete,
    },
    {
      title: 'Line (custom colors)',
      subtitle: 'Per-series color overrides mapping to Carbon palette tokens',
      semioticProps: {
        data: lineData,
        theme,
        colors: {
          'Dataset 1': magenta70,
          'Dataset 2': cyan70,
          'Dataset 3': purple60,
          'Dataset 4': gray30,
        },
        title: 'Custom colors (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineCustomColors,
    },
    {
      title: 'Line (log axis)',
      subtitle: 'Logarithmic scale for exponential or large-span datasets',
      semioticProps: {
        data: logAxisData,
        theme,
        timeSeries: true,
        logScale: true,
        title: 'Log axis (Semiotic)',
        xLabel: 'Date',
        yLabel: 'Value (Log)',
        height: 320,
      },
      echartsOption: lineLogAxis,
    },
    {
      title: 'Line (selected groups / legend isolation)',
      subtitle:
        'ECharts sets initial visibility via legend.selected; Semiotic supports interactive legend isolation (click swatches to isolate/toggle series)',
      semioticProps: {
        data: lineSelectedGroupsData,
        theme,
        legendInteraction: 'isolate',
        title: 'Selected groups & legend isolation (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineSelectedGroups,
    },
    {
      title: 'Line (rotated ticks)',
      subtitle: 'Time series with rotated tick labels (autoRotate)',
      semioticProps: {
        data: rotatedTicksData,
        theme,
        timeSeries: true,
        axisLabelRotate: -45,
        title: 'Rotated ticks (Semiotic)',
        xLabel: 'Date',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineRotatedTicks,
    },
    {
      title: 'Line (truncated labels)',
      subtitle: 'Handling long key identifiers and long group names',
      semioticProps: {
        data: lineLongLabelData,
        theme,
        title: 'Long labels (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineLongLabel,
    },
    {
      title: 'Line (legend orientation)',
      subtitle: 'Legend positioning configuration',
      semioticProps: {
        data: lineData,
        theme,
        legendPosition: 'left',
        title: 'Legend left (Semiotic)',
        xLabel: 'Key',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineLegendOrientation,
    },
    {
      title: 'Line (locale / internationalization)',
      subtitle: 'Time series formatted for French locale',
      semioticProps: {
        data: frenchLocaleData,
        theme,
        timeSeries: true,
        title: 'French locale (Semiotic)',
        xLabel: 'Date',
        yLabel: 'Value',
        height: 320,
      },
      echartsOption: lineLocale,
    },
  ]

  return (
    <div className="chart-page">
      <div className="chart-page__hero">
        <h1 className="chart-page__title">Semiotic: line chart (exploration)</h1>
        <p className="chart-page__description">
          The same Carbon multi-series line datasets rendered side-by-side with Semiotic (SVG/D3)
          and ECharts (Canvas/SVG), using shared @carbon/echarts-theme tokens, palettes, and the
          Carbon toolbar.
        </p>
      </div>
      <div className="chart-page__body">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            className="chart-page__examples"
            style={{ marginTop: idx === 0 ? 0 : '2.5rem' }}
          >
            <div className="compare">
              <div className="compare__header">
                <h3 className="compare__title">{ex.title} (Semiotic)</h3>
                {ex.subtitle && <p className="compare__subtitle">{ex.subtitle}</p>}
              </div>
              <div className="compare__panel compare__panel--echarts">
                <CarbonLineChart {...ex.semioticProps} />
              </div>
            </div>
            <Compare title={`${ex.title} (ECharts)`} echartsOption={ex.echartsOption} />
          </div>
        ))}
      </div>
    </div>
  )
}
