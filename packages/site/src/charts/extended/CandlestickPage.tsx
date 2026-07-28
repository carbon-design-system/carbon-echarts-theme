import React from 'react'
import { ChartPage } from '../../components/ChartPage'
import { SideBySide } from '../../components/SideBySide'
import CandlestickMdx from '../../content/extended/candlestick.mdx'

// OHLC data: [open, close, low, high]
const candlestickOption = {
  tooltip: { trigger: 'axis' as const },
  xAxis: { data: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'] },
  yAxis: { type: 'value' as const },
  series: [
    {
      type: 'candlestick' as const,
      // [open, close, low, high]
      data: [
        [34, 38, 31, 42],
        [38, 35, 32, 40],
        [35, 42, 33, 45],
        [42, 39, 37, 44],
        [39, 45, 36, 47],
        [45, 41, 38, 48],
      ],
    },
  ],
}

export function CandlestickPage() {
  return (
    <ChartPage
      title="Candlestick (OHLC)"
      description="Display open, high, low, and close values of a financial instrument over time."
      overview={<CandlestickMdx />}
      echartsCode={`<ReactECharts option={candlestickOption} theme="carbon-white" />`}
      examples={
        <SideBySide title="Candlestick (OHLC)" echartsOption={candlestickOption} extended />
      }
    />
  )
}
