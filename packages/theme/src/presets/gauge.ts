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
  /** 'semi' (180° arc, default) or 'full' (270° arc) */
  type?: 'semi' | 'full'
  /** Font family for the center value label (defaults to theme textStyle) */
  fontFamily?: string
  /** Color for the center value label (defaults to theme textStyle color) */
  color?: string
}

/**
 * Build an ECharts option object for gauge charts.
 *
 * Carbon Charts `GaugeChart` equivalent.
 * Renders a clean progress-arc gauge — no ticks, no labels, no pointer —
 * matching Carbon Charts' semi-circular or full-circular gauge appearance.
 * Reads the first datum's `value` field; subsequent rows are ignored.
 */
export function createGaugeOptions(
  data: ChartTabularData,
  opts: GaugePresetOptions = {},
): EChartsOption {
  const { title, min = 0, max = 100, unit = '', type = 'semi' } = opts

  const value = data[0]?.value ?? 0
  const label = data[0]?.group ?? ''

  // Semi: 180° arc (Carbon Charts default), Full: 270° arc
  const startAngle = type === 'full' ? 225 : 180
  const endAngle = type === 'full' ? -45 : 0

  return {
    ...(title ? { title: { text: title } } : {}),
    series: [
      {
        type: 'gauge',
        startAngle,
        endAngle,
        // Push the geometric centre toward the lower half of the canvas so
        // the arc fills the space and the flat opening faces down.
        center: ['50%', type === 'full' ? '55%' : '65%'],
        // radius as % of the smaller canvas dimension — scales at any size.
        radius: type === 'full' ? '75%' : '85%',
        min,
        max,
        name: label,
        // Progress arc fills to the current value.
        // Width is in px — kept at 12 to match Carbon Charts' thin arc stroke.
        progress: { show: true, width: 12, roundCap: false },
        // Track (background arc) must match progress width.
        axisLine: { roundCap: false, lineStyle: { width: 12 } },
        // Hide all speedometer decorations.
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        detail: {
          formatter: `{value}${unit}`,
          fontSize: 42,
          fontWeight: 300,
          ...(opts.fontFamily ? { fontFamily: opts.fontFamily } : {}),
          ...(opts.color ? { color: opts.color } : {}),
          // offsetCenter is a fraction of the radius — scales at any chart size.
          // The semi gauge runs 180°→0°: its two open ends both sit on the
          // horizontal line through the centre point (offsetCenter Y = 0%).
          // '-15%' places the label just above that line so the text baseline
          // is flush with the inner edge of the arc stroke at any chart size.
          offsetCenter: [0, type === 'full' ? '40%' : '-15%'],
          valueAnimation: true,
        },
        data: [{ value, name: label }],
        title: { show: false },
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
  /** Font family for bar labels (defaults to theme textStyle) */
  fontFamily?: string
  /** Primary text color for bar labels (defaults to theme textStyle color) */
  color?: string
}

/**
 * Build an ECharts option object for meter charts.
 *
 * Carbon Charts `MeterChart` equivalent.
 * For simple meters renders a horizontal progress bar with an above-bar label.
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

  // Simple meter → horizontal progress bar matching Carbon Charts MeterChart
  const value = data[0]?.value ?? 0
  const group = data[0]?.group ?? ''
  const pct = totalVal > 0 ? Math.round((value / totalVal) * 100) : 0

  const labelTextStyle = {
    fontSize: 14,
    ...(opts.fontFamily ? { fontFamily: opts.fontFamily } : {}),
    ...(opts.color ? { color: opts.color } : {}),
  }

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { formatter: `${group}: ${value} / ${totalVal}` },
    // Compress the plot area to a thin band near the top of the canvas.
    // grid.left:16 gives padding so the bar doesn't touch the panel edge.
    // containLabel:false — yAxis is hidden, no label space to reserve.
    // top: leave room for the label (2× label font-size + gap) as a percentage
    // of the chart height so it scales at any container size.
    // bottom: compress to a thin band; label sits in the top margin.
    grid: { top: '45%', bottom: '45%', left: 16, right: 16, containLabel: false },
    xAxis: { type: 'value', min: 0, max: totalVal, show: false },
    yAxis: { type: 'category', data: [group], show: false },
    series: [
      {
        type: 'bar',
        name: group,
        data: [value],
        // barMaxWidth in px controls the bar thickness, matching Carbon Charts'
        // thin progress-bar appearance. 8 px is the Carbon meter bar height.
        barMaxWidth: 8,
        label: {
          show: true,
          // 'insideTopLeft' anchors the label to the left edge of the bar's
          // bounding box. Since xAxis.min:0 the bar always starts at the grid's
          // left edge, so the label is flush-left with the bar start.
          // offset:[0, -labelOffset] lifts the text above the bar track.
          // labelOffset is relative to the label's own line-height so it scales.
          position: 'insideTopLeft' as const,
          offset: [0, -(labelTextStyle.fontSize * 2)],
          // Rich text: "Storage used" bold, " 60%" normal weight
          formatter: `{bold|${group}}{normal|  ${pct}%}`,
          rich: {
            bold: {
              fontWeight: 600 as const,
              fontSize: labelTextStyle.fontSize,
              ...(opts.fontFamily ? { fontFamily: opts.fontFamily } : {}),
              ...(opts.color ? { color: opts.color } : {}),
            },
            normal: {
              fontWeight: 400 as const,
              fontSize: labelTextStyle.fontSize,
              ...(opts.fontFamily ? { fontFamily: opts.fontFamily } : {}),
              ...(opts.color ? { color: opts.color } : {}),
            },
          },
        },
        backgroundStyle: {},
        showBackground: true,
      },
    ],
  }
}
