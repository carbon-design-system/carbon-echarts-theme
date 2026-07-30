/**
 * ECharts equivalents for the Gauge and Meter chart pages.
 */
import type { EChartsOption } from 'echarts'
import { createGaugeOptions, createMeterOptions } from '@carbon/echarts-theme/presets'
import { IBM_PLEX_FONT_FAMILY } from '@carbon/echarts-theme'

export function getGaugeOption(textColor: string): EChartsOption {
  return createGaugeOptions(
    [{ group: 'value', value: 72.5 }],
    { unit: '%', type: 'semi', fontFamily: IBM_PLEX_FONT_FAMILY, color: textColor },
  )
}

export function getGaugeFullOption(textColor: string): EChartsOption {
  return createGaugeOptions(
    [{ group: 'value', value: 33 }],
    { unit: '%', type: 'full', fontFamily: IBM_PLEX_FONT_FAMILY, color: textColor },
  )
}

export function getMeterOption(textColor: string): EChartsOption {
  return createMeterOptions(
    [{ group: 'Storage used', value: 60 }],
    { total: 100, fontFamily: IBM_PLEX_FONT_FAMILY, color: textColor },
  )
}

export function getMeterPeakOption(textColor: string): EChartsOption {
  return createMeterOptions(
    [{ group: 'Storage used', value: 75 }],
    { total: 100, fontFamily: IBM_PLEX_FONT_FAMILY, color: textColor },
  )
}
