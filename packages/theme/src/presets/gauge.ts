import type { EChartsOption } from 'echarts'
import { gray70 } from '@carbon/colors'
import type { ChartTabularData } from './_transform'
import { pickColors } from './_transform'
import { alertColors } from '../palettes'

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
  /** 'semi' (180° arc, default) or 'full' (360° full circle) */
  type?: 'semi' | 'full'
  /** Font family for the center value label (defaults to theme textStyle) */
  fontFamily?: string
  /** Color for the center value label (defaults to theme textStyle color) */
  color?: string
  /**
   * Status for the delta indicator: 'danger' (red), 'warning' (orange), or 'success' (green).
   * In Carbon Charts the arc color is always the first categorical color; status only
   * affects the delta indicator color/icon — matching Carbon Charts GaugeChart behavior.
   */
  status?: 'danger' | 'warning' | 'success'
  /** Custom color override for the progress arc */
  customColor?: string
  /**
   * Delta value (e.g. -13.37) shown beneath the main value label — matches the
   * Carbon Charts gauge `delta` data row (`{ group: 'delta', value: … }`).
   * When provided a small colored triangle icon precedes the number.
   */
  delta?: number
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

  const value = (data[0]?.value as number) ?? 0
  const label = data[0]?.group ?? ''

  // Arc color: customColor > first categorical color.
  // Carbon Charts always uses the first categorical color for the arc; `status`
  // only affects the delta indicator (color + triangle icon), NOT the arc fill.
  const arcColor = opts.customColor ?? pickColors(1)[0]

  // Delta indicator color: maps status → alert color
  // (danger=red60, warning=orange40, success=green60)
  const deltaColor =
    opts.status === 'danger'
      ? alertColors[0]
      : opts.status === 'warning'
        ? alertColors[1]
        : opts.status === 'success'
          ? alertColors[3]
          : (opts.color ?? 'inherit')

  // Semi: 180° arc (Carbon Charts default), Full: 360° full circle
  const startAngle = type === 'full' ? 90 : 180
  const endAngle = type === 'full' ? -270 : 0

  // Delta sub-label rendered below the main value using a rich-text formatter.
  // Triangle icons: ▼ (down / danger) or ▲ (up / success).
  const hasDelta = opts.delta !== undefined
  const deltaValue = opts.delta ?? 0
  const deltaTriangle = deltaValue < 0 ? '▼' : '▲'
  const deltaText = hasDelta
    ? `{triangle|${deltaTriangle}}{delta| ${Math.abs(deltaValue).toFixed(2)}${unit}}`
    : '{value}'

  // The main value label sits in the gauge `detail`; the delta uses a graphic
  // element rendered via a second zero-value series to keep positioning simple.
  const mainOffsetY = type === 'full' ? '-10%' : '-20%'
  const deltaOffsetY = type === 'full' ? '20%' : '10%'

  const fontFamily = opts.fontFamily ? { fontFamily: opts.fontFamily } : {}
  const textColor = opts.color ? { color: opts.color } : {}

  return {
    ...(title ? { title: { text: title } } : {}),
    series: [
      {
        type: 'gauge',
        startAngle,
        endAngle,
        center: ['50%', type === 'full' ? '50%' : '65%'],
        // radius as % of the smaller canvas dimension — scales at any size.
        radius: type === 'full' ? '75%' : '85%',
        min,
        max,
        name: label,
        // Progress arc fills to the current value.
        // Width is in px — kept at 12 to match Carbon Charts' thin arc stroke.
        progress: { show: true, width: 12, roundCap: false, itemStyle: { color: arcColor } },
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
          ...fontFamily,
          ...textColor,
          // When there's a delta, shift the main value up slightly so both
          // labels are vertically centred within the arc opening.
          offsetCenter: [0, hasDelta ? mainOffsetY : type === 'full' ? '0%' : '-15%'],
          valueAnimation: true,
        },
        data: [{ value, name: label }],
        title: { show: false },
      },
      // Delta indicator series — a phantom 0-value gauge used only for its
      // `detail` rich-text label so we can position the delta below the value.
      ...(hasDelta
        ? [
            {
              type: 'gauge' as const,
              startAngle,
              endAngle,
              center: ['50%', type === 'full' ? '50%' : '65%'],
              radius: type === 'full' ? '75%' : '85%',
              min,
              max,
              // Make the phantom series completely invisible.
              progress: { show: false },
              axisLine: { show: false },
              pointer: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              anchor: { show: false },
              detail: {
                offsetCenter: [0, deltaOffsetY],
                formatter: deltaText,
                fontSize: 14,
                fontWeight: 400,
                ...fontFamily,
                rich: {
                  triangle: {
                    color: deltaColor,
                    fontSize: 12,
                    ...fontFamily,
                  },
                  delta: {
                    color: deltaColor,
                    fontSize: 14,
                    fontWeight: 400,
                    ...fontFamily,
                  },
                },
              },
              data: [{ value: 0 }],
              title: { show: false },
              zlevel: 1,
            },
          ]
        : []),
    ],
  }
}

// ── Meter preset ──────────────────────────────────────────────────────────────

export interface MeterStatusRange {
  /** `[min, max]` range (inclusive/exclusive Carbon Charts semantics) */
  range: [number, number]
  /** Carbon Charts status name → ECharts alert color */
  status: 'success' | 'warning' | 'danger'
}

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
  /**
   * Status color zones drawn behind the bar track.
   * Each zone is a colored band `[range[0], range[1]]` on the value axis.
   * Maps to Carbon Charts `meter.status.ranges`.
   */
  statusRanges?: MeterStatusRange[]
  /**
   * Peak value — rendered as a thin vertical marker line on the bar.
   * Maps to Carbon Charts `meter.peak`.
   */
  peak?: number
  /**
   * Custom color for the progress bar fill.
   * Maps to Carbon Charts `color.scale['Dataset 1']`.
   * Takes precedence over any status range color.
   */
  barColor?: string
}

// Status → alert color mapping matching Carbon Charts semantics
const STATUS_COLORS: Record<string, string> = {
  success: alertColors[3], // green60
  warning: alertColors[1], // orange40
  danger: alertColors[0], // red60
}

/**
 * Build an ECharts option object for meter charts.
 *
 * Carbon Charts `MeterChart` equivalent.
 * For simple meters renders a horizontal progress bar with an above-bar label.
 * Supports status zones (color bands behind the track), a peak marker line,
 * and a custom bar color.
 * For proportional meters renders a stacked horizontal bar.
 */
export function createMeterOptions(
  data: ChartTabularData,
  opts: MeterPresetOptions = {},
): EChartsOption {
  const { title, proportional = false, statusRanges, peak, barColor } = opts

  const totalVal = opts.total ?? data.reduce((s, d) => s + (d.value as number), 0)

  if (proportional) {
    // Proportional meter → stacked horizontal bar
    const series = data.map((d) => ({
      type: 'bar' as const,
      name: d.group,
      stack: 'meter',
      data: [d.value as number],
      barMaxWidth: 20,
    }))

    // Build peak markLine on first series (if peak is provided)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstSeries: any = series[0]
    if (peak !== undefined && firstSeries) {
      firstSeries.markLine = {
        silent: true,
        symbol: 'none',
        lineStyle: { color: gray70, width: 2, type: 'solid' },
        label: { show: false },
        data: [{ xAxis: peak }],
      }
    }

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
  const value = (data[0]?.value as number) ?? 0
  const group = data[0]?.group ?? ''
  const pct = totalVal > 0 ? Math.round((value / totalVal) * 100) : 0

  const labelTextStyle = {
    fontSize: 14,
    ...(opts.fontFamily ? { fontFamily: opts.fontFamily } : {}),
    ...(opts.color ? { color: opts.color } : {}),
  }

  // Determine bar fill color: barColor > status range for the current value > default
  let fillColor: string | undefined = barColor
  if (!fillColor && statusRanges) {
    const matchedRange = statusRanges.find((r) => value >= r.range[0] && value < r.range[1])
    fillColor = matchedRange ? STATUS_COLORS[matchedRange.status] : undefined
  }

  // markAreas for status zones
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markArea: any = statusRanges
    ? {
        silent: true,
        itemStyle: { opacity: 0.15 },
        data: statusRanges.map((r) => [
          { xAxis: r.range[0], itemStyle: { color: STATUS_COLORS[r.status] } },
          { xAxis: r.range[1] },
        ]),
      }
    : undefined

  // markLine for peak marker
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markLine: any =
    peak !== undefined
      ? {
          silent: true,
          symbol: 'none',
          lineStyle: { color: gray70, width: 2, type: 'solid' },
          label: { show: false },
          data: [{ xAxis: peak }],
        }
      : undefined

  return {
    ...(title ? { title: { text: title } } : {}),
    tooltip: { formatter: `${group}: ${value} / ${totalVal}` },
    grid: { top: '45%', bottom: '45%', left: 16, right: 16, containLabel: false },
    xAxis: { type: 'value', min: 0, max: totalVal, show: false },
    yAxis: { type: 'category', data: [group], show: false },
    series: [
      {
        type: 'bar',
        name: group,
        data: [value],
        barMaxWidth: 8,
        ...(fillColor ? { itemStyle: { color: fillColor } } : {}),
        ...(markArea ? { markArea } : {}),
        ...(markLine ? { markLine } : {}),
        label: {
          show: true,
          position: 'insideTopLeft' as const,
          offset: [0, -(labelTextStyle.fontSize * 2)],
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
