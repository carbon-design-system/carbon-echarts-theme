/**
 * ECharts equivalents for the Gauge and Meter chart pages.
 *
 * Meter Carbon test order (6 examples):
 *  [0] Meter with statuses — value 56, zones [0-50 green, 50-60 yellow, 60-100 red], peak 80
 *  [1] Meter statuses + custom color — value 56, zones [0-40,40-60,60-100], peak 70, bar '#925699'
 *  [2] Meter no status — value 56, peak 70
 *  [3] Proportional meter — emails/photos/text/other, total 2000
 *  [4] Proportional meter peak+statuses — same data, peak 1800, zones [0-800,800-1800,1800-2000]
 *  [5] Proportional meter truncated — same data, total 2000, unit 'MB'
 */
import type { EChartsOption } from 'echarts'
import { createGaugeOptions, createMeterOptions } from '@carbon/echarts-theme/presets'
import { IBM_PLEX_FONT_FAMILY } from '@carbon/echarts-theme'

// ── Gauge exports ──────────────────────────────────────────────────────────────

export function gaugeDanger(textColor: string): EChartsOption {
  return createGaugeOptions([{ group: 'value', value: 42 }], {
    unit: '%',
    type: 'semi',
    status: 'danger',
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: textColor,
  })
}

export function gaugeWarningFull(textColor: string): EChartsOption {
  return createGaugeOptions([{ group: 'value', value: 42 }], {
    unit: '%',
    type: 'full',
    status: 'warning',
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: textColor,
  })
}

export function gaugeCustomColor(textColor: string): EChartsOption {
  return createGaugeOptions([{ group: 'value', value: 67 }], {
    unit: '%',
    type: 'full',
    customColor: '#FFE5B4',
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: textColor,
  })
}

// ── Meter exports ──────────────────────────────────────────────────────────────

/** [0] Meter with status zones and peak marker. Carbon value = 56. */
export function getMeterWithStatusOption(textColor: string): EChartsOption {
  return createMeterOptions([{ group: 'Dataset 1', value: 56 }], {
    total: 100,
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: textColor,
    statusRanges: [
      { range: [0, 50], status: 'success' },
      { range: [50, 60], status: 'warning' },
      { range: [60, 100], status: 'danger' },
    ],
    peak: 80,
  })
}

/** [1] Meter statuses + custom bar color '#925699'. Carbon value = 56. */
export function getMeterStatusCustomColorOption(textColor: string): EChartsOption {
  return createMeterOptions([{ group: 'Dataset 1', value: 56 }], {
    total: 100,
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: textColor,
    statusRanges: [
      { range: [0, 40], status: 'success' },
      { range: [40, 60], status: 'warning' },
      { range: [60, 100], status: 'danger' },
    ],
    peak: 70,
    barColor: '#925699',
  })
}

/** [2] Meter with peak marker only (no status zones). Carbon value = 56. */
export function getMeterNoStatusOption(textColor: string): EChartsOption {
  return createMeterOptions([{ group: 'Dataset 1', value: 56 }], {
    total: 100,
    fontFamily: IBM_PLEX_FONT_FAMILY,
    color: textColor,
    peak: 70,
  })
}

/** [3] Proportional meter — emails/photos/text/other, total 2000. */
export function getMeterProportionalOption(textColor: string): EChartsOption {
  return createMeterOptions(
    [
      { group: 'emails', value: 202 },
      { group: 'photos', value: 654 },
      { group: 'text messages', value: 723 },
      { group: 'other', value: 120 },
    ],
    { proportional: true, fontFamily: IBM_PLEX_FONT_FAMILY, color: textColor },
  )
}

/** [4] Proportional meter with peak 1800 and status zones. */
export function getMeterProportionalStatusOption(textColor: string): EChartsOption {
  return createMeterOptions(
    [
      { group: 'emails', value: 202 },
      { group: 'photos', value: 654 },
      { group: 'text messages', value: 723 },
      { group: 'other', value: 120 },
    ],
    {
      proportional: true,
      fontFamily: IBM_PLEX_FONT_FAMILY,
      color: textColor,
      peak: 1800,
      statusRanges: [
        { range: [0, 800], status: 'success' },
        { range: [800, 1800], status: 'warning' },
        { range: [1800, 2000], status: 'danger' },
      ],
    },
  )
}

/** [5] Proportional meter (truncated / unit) — same data as [3]. */
export function getMeterProportionalTruncatedOption(textColor: string): EChartsOption {
  return getMeterProportionalOption(textColor)
}

// Legacy export kept for GaugePage compatibility
export const getMeterOption = getMeterWithStatusOption
export const getMeterPeakOption = getMeterNoStatusOption
