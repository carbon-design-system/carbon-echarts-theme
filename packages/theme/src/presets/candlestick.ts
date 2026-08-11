import type { EChartsOption } from 'echarts'
import { alertColors } from '../palettes'
import { pickColors } from './_transform'

// ── Candlestick preset ────────────────────────────────────────────────────────

/**
 * A single OHLC candlestick data point.
 * ECharts native format: [open, close, low, high]
 */
export type OhlcTuple = [number, number, number, number]

/** Volume bar datum aligned to OHLC dates. */
export interface VolumeDatum {
  /** Same date/label as the matching OhlcTuple entry */
  date: string
  volume: number
}

export interface CandlestickPresetOptions {
  /** Chart title text */
  title?: string
  /** Color scheme for MA line palette ('light' | 'dark'). Default: 'light' */
  colorScheme?: 'light' | 'dark'
  /**
   * Moving-average periods to overlay as line series.
   * Each value N produces an "MA N" line on the chart.
   * Default: [] (no MA lines)
   */
  maPeriods?: number[]
  /**
   * When true, attaches a volume bar chart in a sub-grid below the OHLC grid.
   * Requires `volumeData` to also be supplied.
   */
  showVolume?: boolean
  /** Volume data aligned to `dates`. Required when `showVolume: true`. */
  volumeData?: number[]
  /**
   * When true, adds a dataZoom slider + inside zoom below the chart.
   * Default: false
   */
  showDataZoom?: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Compute a simple moving average over an array of closing prices.
 * Returns `null` for positions where not enough data precedes the point.
 */
function sma(closes: number[], period: number): (number | null)[] {
  return closes.map((_, i) => {
    if (i < period - 1) return null
    const slice = closes.slice(i - period + 1, i + 1)
    return Math.round((slice.reduce((a, b) => a + b, 0) / period) * 100) / 100
  })
}

// ── Main preset ───────────────────────────────────────────────────────────────

/**
 * Build an ECharts option object for a candlestick (OHLC) chart.
 *
 * Supports optional MA line overlays, volume sub-chart, and dataZoom.
 * All colors come from Carbon tokens and palettes — no hex strings hardcoded.
 *
 * @example
 * const dates = ['2024-01', '2024-02', '2024-03']
 * const ohlc: OhlcTuple[] = [
 *   [34, 38, 31, 42],
 *   [38, 35, 32, 40],
 *   [35, 42, 33, 45],
 * ]
 * const option = createCandlestickOptions(dates, ohlc, {
 *   title: 'AAPL 2024',
 *   maPeriods: [5, 20],
 *   showDataZoom: true,
 * })
 * // <ReactECharts option={option} theme="carbon-white" />
 */
export function createCandlestickOptions(
  dates: string[],
  ohlc: OhlcTuple[],
  opts: CandlestickPresetOptions = {},
): EChartsOption {
  const {
    title,
    colorScheme = 'light',
    maPeriods = [],
    showVolume = false,
    volumeData = [],
    showDataZoom = false,
  } = opts

  const closes = ohlc.map((d) => d[1])

  // MA line colors from the N-color palette (skip 0 which is used for the
  // first categorical series — MA lines start at index 0 of their own slice)
  const maColors = pickColors(Math.max(maPeriods.length, 1), colorScheme)

  // ── Grid layout ──────────────────────────────────────────────────────────────
  // When volume is shown: two grids stacked vertically (70% / 30%).
  // dataZoom bottom adds extra room when active.
  const dataZoomBottom = showDataZoom ? 60 : 16

  const grids = showVolume
    ? [
        { left: 56, right: 24, top: title ? 48 : 24, bottom: showVolume ? '36%' : dataZoomBottom },
        { left: 56, right: 24, top: '68%', bottom: dataZoomBottom },
      ]
    : [{ left: 56, right: 24, top: title ? 48 : 24, bottom: dataZoomBottom, containLabel: false }]

  // ── X-axes ───────────────────────────────────────────────────────────────────
  const xAxes: EChartsOption['xAxis'] = showVolume
    ? [
        {
          type: 'category',
          data: dates,
          gridIndex: 0,
          boundaryGap: true,
          axisLabel: { show: false },
        },
        { type: 'category', data: dates, gridIndex: 1, boundaryGap: true },
      ]
    : [{ type: 'category', data: dates, boundaryGap: true }]

  // ── Y-axes ───────────────────────────────────────────────────────────────────
  const yAxes: EChartsOption['yAxis'] = showVolume
    ? [
        { type: 'value', gridIndex: 0, scale: true, splitNumber: 4 },
        {
          type: 'value',
          gridIndex: 1,
          scale: true,
          splitNumber: 2,
          axisLabel: {
            formatter: (v: number) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}K`
                  : String(v),
          },
        },
      ]
    : [{ type: 'value', scale: true, splitNumber: 4 }]

  // ── Candle colors ─────────────────────────────────────────────────────────────
  // Rising: Carbon Green60 (#198038) full border, 20% opacity fill body.
  // Falling: Carbon Red60 (#da1e28) full border, 20% opacity fill body.
  // The hollow-body style is Carbon's convention (cf. bar itemStyle opacity) and
  // makes the theme visually distinct from ECharts' default solid candles.
  const risingColor = alertColors[3] // green60 #198038
  const fallingColor = alertColors[0] // red60   #da1e28
  const risingFill = risingColor + '33' // 20% opacity body fill
  const fallingFill = fallingColor + '33'

  // ── Series ───────────────────────────────────────────────────────────────────
  const series: EChartsOption['series'] = [
    {
      type: 'candlestick',
      name: 'Price',
      data: ohlc,
      ...(showVolume ? { xAxisIndex: 0, yAxisIndex: 0 } : {}),
      itemStyle: {
        color: risingFill, // green60 @ 20% — hollow rising body
        color0: fallingFill, // red60   @ 20% — hollow falling body
        borderColor: risingColor,
        borderColor0: fallingColor,
        borderWidth: 1.5,
      },
    },
    // MA line overlays
    ...maPeriods.map((period, i) => ({
      type: 'line' as const,
      name: `MA${period}`,
      data: sma(closes, period),
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color: maColors[i % maColors.length] },
      itemStyle: { color: maColors[i % maColors.length] },
      ...(showVolume ? { xAxisIndex: 0, yAxisIndex: 0 } : {}),
    })),
    // Volume bars (second grid)
    ...(showVolume && volumeData.length > 0
      ? [
          {
            type: 'bar' as const,
            name: 'Volume',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumeData.map((v, i) => ({
              value: v,
              // Rising candle → green tint; falling → red tint (via item color)
              itemStyle: {
                color:
                  ohlc[i] && ohlc[i][1] >= ohlc[i][0]
                    ? alertColors[3] + '99'
                    : alertColors[0] + '99',
              },
            })),
            barMaxWidth: 20,
          },
        ]
      : []),
  ]

  // ── DataZoom ─────────────────────────────────────────────────────────────────
  const dataZoom: EChartsOption['dataZoom'] = showDataZoom
    ? [
        {
          type: 'inside',
          xAxisIndex: showVolume ? [0, 1] : [0],
          start: 60,
          end: 100,
        },
        {
          type: 'slider',
          xAxisIndex: showVolume ? [0, 1] : [0],
          start: 60,
          end: 100,
          height: 20,
          bottom: 8,
        },
      ]
    : undefined

  // ── Legend ───────────────────────────────────────────────────────────────────
  const legendData = ['Price', ...maPeriods.map((p) => `MA${p}`), ...(showVolume ? ['Volume'] : [])]

  return {
    ...(title ? { title: { text: title, left: 'center', top: 8 } } : {}),

    // Color list drives MA lines (candlestick colors are set via itemStyle above)
    color: maColors,

    legend: {
      data: legendData,
      top: title ? 28 : 4,
    },

    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'cross' as const },
    },

    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    ...(dataZoom ? { dataZoom } : {}),
  }
}
