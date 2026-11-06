import React from 'react'
import { CarbonHeatmap } from '../semiotic/CarbonHeatmap'
import { Compare } from '../components/Compare'
import { useTheme } from '../components/ThemeContext'
import {
  data as heatmapData,
  positiveNegativeData,
  missingData,
  heatmap as echartsHeatmap,
  heatmapCustomColorRange,
  heatmapDivergent,
  heatmapMissingData,
  heatmapCustomColorDomain,
} from '../data/echarts/heatmap'

interface SemioticCompareItem {
  title: string
  subtitle?: string
  semioticProps: React.ComponentProps<typeof CarbonHeatmap>
  echartsOption: any
}

/**
 * Exploration: the same Carbon heatmap datasets rendered side-by-side with Semiotic and
 * with ECharts, both themed from @carbon/echarts-theme and using the shared Carbon toolbar.
 */
export function SemioticHeatmapPage() {
  const { theme } = useTheme()

  const examples: SemioticCompareItem[] = [
    {
      title: 'Heatmap (basic letter × month)',
      subtitle: 'Standard 2D matrix heatmap with sequential blue color scale',
      semioticProps: {
        data: heatmapData,
        theme,
        title: 'Heatmap (Semiotic)',
        xLabel: 'Letters',
        yLabel: 'Months',
        height: 380,
      },
      echartsOption: echartsHeatmap,
    },
    {
      title: 'Heatmap (custom teal color range)',
      subtitle: 'Sequential color scale using custom palette',
      semioticProps: {
        data: heatmapData,
        theme,
        colorScheme: 'greens',
        title: 'Custom color range (Semiotic)',
        xLabel: 'Letters',
        yLabel: 'Months',
        height: 380,
      },
      echartsOption: heatmapCustomColorRange,
    },
    {
      title: 'Heatmap (divergent positive / negative)',
      subtitle: 'Divergent color scheme spanning negative to positive values',
      semioticProps: {
        data: positiveNegativeData,
        theme,
        colorScheme: 'turbo',
        title: 'Divergent heatmap (Semiotic)',
        xLabel: 'Letters',
        yLabel: 'Months',
        height: 380,
      },
      echartsOption: heatmapDivergent,
    },
    {
      title: 'Heatmap (missing / sparse data)',
      subtitle: 'Matrix with absent cells rendered gracefully',
      semioticProps: {
        data: missingData,
        theme,
        title: 'Missing data heatmap (Semiotic)',
        xLabel: 'Letters',
        yLabel: 'Months',
        height: 380,
      },
      echartsOption: heatmapMissingData,
    },
    {
      title: 'Heatmap (custom color domain)',
      subtitle: 'Extended visual scale domain',
      semioticProps: {
        data: heatmapData,
        theme,
        colorScheme: 'purples',
        title: 'Custom color domain (Semiotic)',
        xLabel: 'Letters',
        yLabel: 'Months',
        height: 380,
      },
      echartsOption: heatmapCustomColorDomain,
    },
  ]

  return (
    <div className="chart-page">
      <div className="chart-page__hero">
        <h1 className="chart-page__title">Semiotic: heatmap (exploration)</h1>
        <p className="chart-page__description">
          The same Carbon 2D matrix heatmap datasets rendered side-by-side with Semiotic (SVG/D3)
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
                <CarbonHeatmap {...ex.semioticProps} />
              </div>
            </div>
            <Compare title={`${ex.title} (ECharts)`} echartsOption={ex.echartsOption} />
          </div>
        ))}
      </div>
    </div>
  )
}
