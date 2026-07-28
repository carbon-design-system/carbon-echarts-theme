import type { EChartsOption } from 'echarts'
import type { ChartTabularData } from './_transform'

// ── Gauge preset ──────────────────────────────────────────────────────────────

export interface GaugePresetOptions {
  /** Chart title text */
  title?: string
  /** Minimum value (default: 0) */
  min?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Unit/suffix shown on the label (e.g. '%') */
  unit?: string
}

/**
 * Build an ECharts option object for gauge charts.
 *
 * Carbon Charts `GaugeChart` equivalent.
 * Reads the first datum's `value` field; subsequent rows are ignored.
 */
export function createGaugeOptions(
  data: ChartTabularData,
  opts: GaugePresetOptions = {},
): EChartsOption {
  const { title, min = 0, max = 100, unit = '' } = opts

  const value = data[0]?.value ?? 0
  const label = data[0]?.group ?? ''

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { formatter: '{a} <br/>{b}: {c}' + unit },
    series: [
      {
        type: 'gauge',
        min,
        max,
        name: label,
        data: [{ value, name: label }],
        axisLine: {
          lineStyle: {
            width: 12,
          },
        },
        pointer: { width: 5 },
        axisTick: { length: 6, lineStyle: { width: 1 } },
        splitLine: { length: 10, lineStyle: { width: 2 } },
        detail: {
          formatter: `{value}${unit}`,
          fontSize: 24,
          fontWeight: 600,
          offsetCenter: [0, '60%'],
        },
      },
    ],
  }
}

// ── Meter preset ──────────────────────────────────────────────────────────────

export interface MeterPresetOptions {
  /** Chart title text */
  title?: string
  /** Total / max value (default: sum of all data values) */
  total?: number
  /** Whether to show proportional sub-bars for each group (default: false) */
  proportional?: boolean
}

/**
 * Build an ECharts option object for meter charts.
 *
 * Carbon Charts `MeterChart` equivalent.
 * For simple meters renders a single filled gauge arc.
 * For proportional meters renders a stacked horizontal bar.
 */
export function createMeterOptions(
  data: ChartTabularData,
  opts: MeterPresetOptions = {},
): EChartsOption {
  const { title, proportional = false } = opts

  const totalVal = opts.total ?? data.reduce((s, d) => s + d.value, 0)

  if (proportional) {
    // Proportional meter → stacked horizontal bar
    const series = data.map((d) => ({
      type: 'bar' as const,
      name: d.group,
      stack: 'meter',
      data: [d.value],
      barMaxWidth: 20,
    }))

    return {
      ...(title ? { title: { text: title } } : {}),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { type: 'scroll', bottom: 0 },
      grid: { top: 40, bottom: 40, left: 16, right: 16, containLabel: true },
      xAxis: { type: 'value', max: totalVal },
      yAxis: { type: 'category', data: [''] },
      series,
    }
  }

  // Simple meter → gauge arc
  const value = data[0]?.value ?? 0
  const label = data[0]?.group ?? ''
  const pct = totalVal > 0 ? Math.round((value / totalVal) * 100) : 0

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { formatter: '{b}: {c}%' },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        name: label,
        data: [{ value: pct, name: label }],
        axisLine: { lineStyle: { width: 12 } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          formatter: `${pct}%`,
          fontSize: 24,
          fontWeight: 600,
          offsetCenter: [0, '0%'],
        },
      },
    ],
  }
}
