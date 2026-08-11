import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { Compare } from '../../components/Compare'
import CandlestickMdx from '../../content/extended/candlestick.mdx'
import { createCandlestickOptions } from '@carbon/echarts-theme/presets'
import type { OhlcTuple } from '@carbon/echarts-theme/presets'
import { useTheme } from '../../components/ThemeContext'

// ── Shared data generation helpers ───────────────────────────────────────────
//
// All OHLC data is generated deterministically via a seeded random-walk so
// the charts look like real market data without any external fetch.
// No hardcoded hex colors appear anywhere — all colors come from the preset.

/** Mulberry32 seeded PRNG — deterministic, no external dependency. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generate N days of realistic OHLC data starting from `startPrice`.
 * Returns { dates, ohlc, volume }.
 */
function generateOhlc(
  n: number,
  startDate: Date,
  startPrice: number,
  seed: number,
): { dates: string[]; ohlc: OhlcTuple[]; volume: number[] } {
  const rand = mulberry32(seed)
  const dates: string[] = []
  const ohlc: OhlcTuple[] = []
  const volume: number[] = []

  let prev = startPrice
  const d = new Date(startDate)

  for (let i = 0; i < n; i++) {
    // Skip weekends
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1)
    }

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dates.push(`${yyyy}-${mm}-${dd}`)

    // Daily volatility ~1.5%
    const change = (rand() - 0.48) * prev * 0.03
    const open = prev
    const close = Math.max(1, prev + change)
    const highExtra = rand() * prev * 0.012
    const lowExtra = rand() * prev * 0.012
    const high = Math.max(open, close) + highExtra
    const low = Math.min(open, close) - lowExtra

    ohlc.push([
      Math.round(open * 100) / 100,
      Math.round(close * 100) / 100,
      Math.round(low * 100) / 100,
      Math.round(high * 100) / 100,
    ])

    volume.push(Math.round(1_000_000 + rand() * 9_000_000))

    prev = close
    d.setDate(d.getDate() + 1)
  }

  return { dates, ohlc, volume }
}

// ── Example 1 — Stock with MA + Volume (inspired by ECharts "Candlestick Brush") ──
//
// Based on: https://echarts.apache.org/examples/en/editor.html?c=candlestick-brush
// Features: OHLC candles · MA5 / MA20 / MA60 overlays · volume sub-chart ·
//           dataZoom slider · cross-hair tooltip

const stockData = generateOhlc(240, new Date('2023-01-03'), 148.5, 42)

function makeStockOption(colorScheme: 'light' | 'dark') {
  return createCandlestickOptions(stockData.dates, stockData.ohlc, {
    title: 'AAPL — Daily OHLC with Moving Averages',
    colorScheme,
    maPeriods: [5, 20, 60],
    showVolume: true,
    volumeData: stockData.volume,
    showDataZoom: true,
  })
}

// ── Example 2 — Large-scale candles with DataZoom only (500 trading days) ─────
//
// Based on: https://echarts.apache.org/examples/en/editor.html?c=candlestick-large
// Features: dense 500-bar dataset · inside + slider zoom · MA5 / MA20

const largeData = generateOhlc(500, new Date('2022-01-03'), 3200, 99)

function makeLargeOption(colorScheme: 'light' | 'dark') {
  return createCandlestickOptions(largeData.dates, largeData.ohlc, {
    title: 'Large-Scale Candlestick — 500 Trading Days',
    colorScheme,
    maPeriods: [5, 20],
    showDataZoom: true,
  })
}

// ── Example 3 — Shanghai Index style: OHLC + Volume + 3 MA lines ──────────────
//
// Based on: https://echarts.apache.org/examples/en/editor.html?c=candlestick-sh
// Features: 6-month daily candles · MA5 / MA10 / MA20 / MA30 · volume bars ·
//           zoom focused on last 60 days

const shData = generateOhlc(180, new Date('2023-07-03'), 3150, 7)

function makeShOption(colorScheme: 'light' | 'dark') {
  return createCandlestickOptions(shData.dates, shData.ohlc, {
    title: 'Shanghai Composite Style — OHLC, MA & Volume',
    colorScheme,
    maPeriods: [5, 10, 20, 30],
    showVolume: true,
    volumeData: shData.volume,
    showDataZoom: true,
  })
}

// ── Page component ────────────────────────────────────────────────────────────

export function CandlestickPage() {
  const { theme } = useTheme()
  const colorScheme: 'light' | 'dark' = theme === 'g90' || theme === 'g100' ? 'dark' : 'light'

  const stockOption = makeStockOption(colorScheme)
  const largeOption = makeLargeOption(colorScheme)
  const shOption = makeShOption(colorScheme)

  return (
    <ChartPage
      title="Candlestick (OHLC)"
      description="Display open, high, low, and close values of a financial instrument over time."
      overview={<CandlestickMdx />}
      examples={
        <>
          {/* Example 1 — Full stock chart with volume and MA overlays */}
          <Compare
            title="AAPL — Daily OHLC with Moving Averages & Volume"
            echartsOption={stockOption}
            extended
            height="520px"
            optionCode={`import { createCandlestickOptions } from '@carbon/echarts-theme/presets'
import type { OhlcTuple } from '@carbon/echarts-theme/presets'

// dates: string[]           e.g. ['2023-01-03', '2023-01-04', ...]
// ohlc:  OhlcTuple[]        e.g. [[148.5, 150.2, 147.1, 151.3], ...]
// volume: number[]          e.g. [4500000, 3800000, ...]

const option = createCandlestickOptions(dates, ohlc, {
  title: 'AAPL — Daily OHLC with Moving Averages',
  maPeriods: [5, 20, 60],
  showVolume: true,
  volumeData: volume,
  showDataZoom: true,
})

<ReactECharts option={option} theme="carbon-white" style={{ height: '520px' }} />`}
          />

          {/* Example 2 — Large dataset with dataZoom */}
          <Compare
            title="Large-Scale Candlestick — 500 Trading Days"
            echartsOption={largeOption}
            extended
            height="380px"
            optionCode={`import { createCandlestickOptions } from '@carbon/echarts-theme/presets'
import type { OhlcTuple } from '@carbon/echarts-theme/presets'

// 500-bar dataset — dataZoom starts at 80% to show most recent ~100 bars
const option = createCandlestickOptions(dates, ohlc, {
  title: 'Large-Scale Candlestick — 500 Trading Days',
  maPeriods: [5, 20],
  showDataZoom: true,
})

<ReactECharts option={option} theme="carbon-white" style={{ height: '380px' }} />`}
          />

          {/* Example 3 — Shanghai-style 4-MA + volume */}
          <Compare
            title="Shanghai Composite Style — OHLC, MA & Volume"
            echartsOption={shOption}
            extended
            height="520px"
            optionCode={`import { createCandlestickOptions } from '@carbon/echarts-theme/presets'
import type { OhlcTuple } from '@carbon/echarts-theme/presets'

// Four MA periods — colors assigned automatically from Carbon's N-color palette
const option = createCandlestickOptions(dates, ohlc, {
  title: 'Shanghai Composite Style — OHLC, MA & Volume',
  maPeriods: [5, 10, 20, 30],
  showVolume: true,
  volumeData: volume,
  showDataZoom: true,
})

<ReactECharts option={option} theme="carbon-white" style={{ height: '520px' }} />`}
          />
        </>
      }
    />
  )
}
