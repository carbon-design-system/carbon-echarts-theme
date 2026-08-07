import { type BarChartOptions, type ChartTabularData, ScaleTypes, Alignments } from '@carbon/charts'
import type { ChartTypes, Example } from './types'

const vanilla = 'SimpleBarChart'

export const chartTypes: ChartTypes = {
  vanilla,
  svelte: 'BarChartSimple',
  react: vanilla,
  angular: ['SimpleBarChartComponent', 'ibm-simple-bar-chart'],
  vue: `Ccv${vanilla}`,
}

const simpleBarOptions: BarChartOptions = {
  title: 'Vertical simple bar (discrete)',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
  },
  height: '400px',
  accessibility: {
    svgAriaLabel: 'Simple bar chart',
  },
}

const simpleBarColorOverrideOptions: BarChartOptions = {
  title: 'Custom colors (simple bar)',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      scaleType: ScaleTypes.LABELS,
      mapsTo: 'group',
    },
  },
  color: {
    pairing: {
      option: 2,
    },
    scale: {
      Qty: '#925699',
      Misc: '#525669',
    },
  },
  height: '400px',
}

const simpleBarCustomLegendOrderOptions: BarChartOptions = {
  title: 'Custom legend order (simple bar)',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
  },
  legend: {
    order: ['Restocking', 'Misc', 'Sold', 'Qty', 'More'],
  },
  height: '400px',
}

const simpleBarAdditionalLegendItemsOptions: BarChartOptions = {
  title: 'Additional legend items (simple bar)',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
  },
  legend: {
    additionalItems: [
      {
        type: 'line',
        name: 'Line',
      },
      {
        type: 'area',
        name: 'Poor area',
      },
      {
        type: 'area',
        name: 'Satisfactory area',
      },
      {
        type: 'area',
        name: 'Great area',
      },
      {
        type: 'quartile',
        name: 'Quartiles',
      },
      {
        type: 'size',
        name: 'Size',
      },
      {
        type: 'radius',
        name: 'Radius',
      },
    ],
  },
  height: '400px',
}

const simpleBarOptionsCustomTicks: BarChartOptions = {
  title: 'Custom ticks (simple bar)',
  axes: {
    left: {
      mapsTo: 'value',
      ticks: {
        values: [0, 1.2, 1.3, 2],
      },
    },
    bottom: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
  },
  height: '400px',
}

const simpleBarCenteredLegendOptions: BarChartOptions = {
  title: 'Centered legend (simple bar)',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
  },
  legend: {
    alignment: Alignments.CENTER,
  },
  height: '400px',
}

const simpleBarFixedDomainOptions: BarChartOptions = {
  title: 'Custom domain (simple bar)',
  axes: {
    left: {
      mapsTo: 'value',
      domain: [-100000, 100000],
    },
    bottom: {
      scaleType: ScaleTypes.LABELS,
      mapsTo: 'group',
    },
  },
  height: '400px',
}

const simpleHorizontalBarOptions: BarChartOptions = {
  title: 'Horizontal simple bar (discrete)',
  axes: {
    left: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
    bottom: {
      mapsTo: 'value',
    },
  },
  height: '400px',
}

// const simpleHorizontalBarCenteredLegendOptions: BarChartOptions = {
// 	title: 'Horizontal simple bar (centered legend)',
// 	axes: {
// 		left: {
// 			mapsTo: 'group',
// 			scaleType: ScaleTypes.LABELS
// 		},
// 		bottom: {
// 			mapsTo: 'value'
// 		}
// 	},
// 	legend: {
// 		alignment: Alignments.CENTER
// 	}
// }

const simpleHorizontalBarLongLabelOptions: BarChartOptions = {
  title: 'Truncated labels (simple bar)',
  axes: {
    left: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
      truncation: {
        type: 'mid_line',
        threshold: 10,
        numCharacter: 14,
      },
    },
    bottom: {
      mapsTo: 'value',
    },
  },
  legend: {
    truncation: {
      type: 'mid_line',
      threshold: 15,
      numCharacter: 12,
    },
  },
  height: '400px',
}

const simpleBarTimeSeriesOptions: BarChartOptions = {
  title: 'Vertical simple bar (time series)',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  height: '400px',
}

// More complete in that it reformats everything to Turkish - both axes and tooltip
const simpleBarTurkishLocaleOptions: BarChartOptions = {
  title: 'Turkish locale',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  locale: {
    code: 'tr-TR',
  },
}

// using locale interface to reformat everything to Arabic
const simpleBarArabicLocaleOptions: BarChartOptions = {
  title: 'Arabic locale',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  locale: {
    code: 'ar-SA',
  },
}

// using locale interface to reformat everything to Iranian
const simpleBarIranianLocaleOptions: BarChartOptions = {
  title: 'Iranian locale',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  locale: {
    code: 'fa-IR',
  },
}

// using locale interface to reformat everything to Japanese
const simpleBarJapaneseLocaleOptions: BarChartOptions = {
  title: 'Japanese locale',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  locale: {
    code: 'ja-JP',
  },
  height: '400px',
}

// using locale interface to reformat everything to Hindi
const simpleBarHindiLocaleOptions: BarChartOptions = {
  title: 'Hindi locale',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  locale: {
    code: 'hi-IN',
  },
}

// using locale interface to reformat everything to Bangla
const simpleBarBanglaLocaleOptions: BarChartOptions = {
  title: 'Bangla locale',
  axes: {
    left: {
      mapsTo: 'value',
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
  },
  locale: {
    code: 'bn-BD',
  },
}

// Horizontal simple time series
const simpleHorizontalBarTimeSeriesOptions: BarChartOptions = {
  title: 'Horizontal simple bar (time series)',
  axes: {
    left: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
    bottom: {
      mapsTo: 'value',
    },
  },
  height: '400px',
}

// Vertical simple time series with dense data
const simpleBarTimeSeriesDenseOptions: BarChartOptions = {
  title: 'Vertical simple bar (time series - dense data, Turkish)',
  axes: {
    left: {
      mapsTo: 'value',
      ticks: {
        formatter: (tick: number | Date) => {
          if (typeof tick === 'number') {
            return tick?.toLocaleString?.('tr-TR')
          }
          return tick.toString() // Fallback for Date type
        },
      },
    },
    bottom: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
      ticks: {
        formatter: (tick: number | Date) => {
          if (tick instanceof Date) {
            return tick.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
          }
          return tick.toString() // Fallback for number type
        },
      },
    },
  },
  tooltip: {
    valueFormatter: (value: number | Date, category: string) => {
      if (category == 'x-value' && value instanceof Date)
        return value.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })
      if (category == 'y-value' && typeof value === 'number')
        return value?.toLocaleString?.('tr-TR')
      return value.toString()
    },
  },
  bars: { maxWidth: 200 },
  height: '400px',
}

const floatingHorizontalBarTimeSeriesOptions: BarChartOptions = {
  title: 'Horizontal floating bar (time series)',
  axes: {
    left: {
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
    bottom: {
      mapsTo: 'value',
    },
  },
  height: '400px',
}

const simpleBarEmptyStateOptions: BarChartOptions = {
  title: 'Vertical simple bar (empty state)',
  axes: {
    left: {},
    bottom: {
      scaleType: ScaleTypes.LABELS,
    },
  },
  height: '400px',
}

const simpleBarSkeletonOptions: BarChartOptions = {
  title: 'Vertical simple bar (skeleton)',
  axes: {
    left: {},
    bottom: {
      scaleType: ScaleTypes.LABELS,
    },
  },
  data: {
    loading: true,
  },
  height: '400px',
}

const simpleHorizontalBarEmptyStateOptions: BarChartOptions = {
  title: 'Horizontal simple bar (empty state)',
  axes: {
    left: {
      scaleType: ScaleTypes.LABELS,
    },
    bottom: {},
  },
}

const simpleHorizontalBarSkeletonOptions: BarChartOptions = {
  title: 'Horizontal simple bar (skeleton)',
  axes: {
    left: {
      scaleType: ScaleTypes.LABELS,
    },
    bottom: {},
  },
  data: {
    loading: true,
  },
  height: '400px',
}

const floatingBarOptions: BarChartOptions = {
  title: 'Floating vertical bar (discrete)',
  axes: {
    left: {
      mapsTo: 'value',
      includeZero: false,
    },
    bottom: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
  },
  height: '400px',
}

const floatingHorizontalBarOptions: BarChartOptions = {
  title: 'Floating horizontal bar (discrete)',
  axes: {
    left: {
      mapsTo: 'group',
      scaleType: ScaleTypes.LABELS,
    },
    bottom: {
      mapsTo: 'value',
      includeZero: false,
    },
  },
  height: '400px',
}

// Simple bar
const simpleBarData = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: 35213 },
  { group: 'Restocking', value: 51213 },
  { group: 'Misc', value: 16932 },
]

// Simple bar with custom tick values
const simpleBarDataCustomTicks = [
  { group: 'Group 1', value: 0.5 },
  { group: 'Group 2', value: 2 },
]

const noData: ChartTabularData = []

const simpleBarCenteredLegendData: ChartTabularData = simpleBarData

const simpleHorizontalBarData: ChartTabularData = simpleBarData

const simpleHorizontalBarLongLabelData: ChartTabularData = [
  {
    group: '6591DA8668C339B1B39297C61091E320C35391AB7AFC15B469F96B8A2DD0C231',
    value: 65000,
  },
  {
    group: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 29123,
  },
  {
    group: '232D788298773BB389DBB8FCE44D3FB4E878879BE7AFB0B303BCE0D56EBB92E2',
    value: 35213,
  },
  {
    group: '58B01AADFA87E5547A218B3C6CE3AF07B8DF7BAB9E12BF60FD2BBB739C46B86E',
    value: 51213,
  },
  { group: 'Qty', value: 16932 },
]

// const simpleHorizontalBarCenteredLegendData: ChartTabularData = simpleBarData

const simpleBarTimeSeriesData = [
  { group: 'Qty', date: '2023-01-01', value: 10000 },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: 49213 },
  { group: 'Misc', date: '2023-01-07', value: 51213 },
]

const simpleBarTimeSeriesDenseData: ChartTabularData = [
  { group: 'data', date: '2023-02-01T10:10:00.000Z', value: 10000 },
  { group: 'data', date: '2023-02-01T10:12:04.000Z', value: 20001 },
  { group: 'data', date: '2023-02-01T10:14:08.000Z', value: 10002 },
  { group: 'data', date: '2023-02-01T10:15:08.000Z', value: 10062 },
  { group: 'data', date: '2023-02-01T10:17:12.000Z', value: 30003 },
  { group: 'data', date: '2023-02-01T10:18:16.000Z', value: 20004 },
  { group: 'data', date: '2023-02-01T10:19:20.000Z', value: 10005 },
  { group: 'data', date: '2023-02-01T10:22:24.000Z', value: 50006 },
  { group: 'data', date: '2023-02-01T10:24:24.000Z', value: 20006 },
  { group: 'data', date: '2023-02-01T10:26:28.000Z', value: 40007 },
  { group: 'data', date: '2023-02-01T10:27:32.000Z', value: 30008 },
  { group: 'data', date: '2023-02-01T10:30:36.000Z', value: 10000 },
  { group: 'data', date: '2023-02-01T10:32:36.000Z', value: 10000 },
  { group: 'data', date: '2023-02-01T10:35:40.000Z', value: 20000 },
  { group: 'data', date: '2023-02-01T10:36:44.000Z', value: 10000 },
  { group: 'data', date: '2023-02-01T10:37:48.000Z', value: 30000 },
  { group: 'data', date: '2023-02-01T10:40:52.000Z', value: 10000 },
]

const simpleBarLocaleData: ChartTabularData = simpleBarTimeSeriesData

const simpleHorizontalBarTimeSeriesData: ChartTabularData = simpleBarTimeSeriesData

// Horizontal floating time series
const floatingHorizontalBarTimeSeriesData: ChartTabularData = [
  { group: 'Qty', date: '2023-01-01', value: [10000, 41000] },
  { group: 'More', date: '2023-01-02', value: 65000 },
  { group: 'Sold', date: '2023-01-03', value: 30000 },
  { group: 'Restocking', date: '2023-01-06', value: [22000, 69213] },
  { group: 'Misc', date: '2023-01-07', value: [3500, 71213] },
]

// floating bars
const floatingBarData: ChartTabularData = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 16932] },
]

const floatingHorizontalBarData: ChartTabularData = [
  { group: 'Qty', value: [30000, 65000] },
  { group: 'More', value: [15000, 29123] },
  { group: 'Sold', value: [22000, 35213] },
  { group: 'Restocking', value: [28000, 51213] },
  { group: 'Misc', value: [3000, 36932] },
]

export const examples: Example[] = [
  {
    options: simpleBarOptions,
    data: simpleBarData,
    tags: ['test'],
  },
  {
    options: simpleBarTimeSeriesOptions,
    data: simpleBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: simpleBarTimeSeriesDenseOptions,
    data: simpleBarTimeSeriesDenseData,
  },
  {
    options: simpleBarSkeletonOptions,
    data: noData,
    tags: ['skeleton'],
  },
  {
    options: simpleBarEmptyStateOptions,
    data: noData,
    tags: ['empty'],
  },
  {
    options: simpleHorizontalBarOptions,
    data: simpleHorizontalBarData,
    tags: ['test'],
  },
  {
    options: simpleHorizontalBarTimeSeriesOptions,
    data: simpleHorizontalBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: simpleHorizontalBarEmptyStateOptions,
    data: noData,
    tags: ['empty'],
  },
  {
    options: simpleHorizontalBarSkeletonOptions,
    data: noData,
    tags: ['skeleton'],
  },
  {
    options: floatingHorizontalBarTimeSeriesOptions,
    data: floatingHorizontalBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: floatingBarOptions,
    data: floatingBarData,
    tags: ['test'],
  },
  {
    options: floatingHorizontalBarOptions,
    data: floatingHorizontalBarData,
    tags: ['test'],
  },
  {
    data: simpleBarDataCustomTicks,
    options: simpleBarOptionsCustomTicks,
    tags: ['axes'],
  },
  {
    data: simpleBarData,
    options: simpleBarFixedDomainOptions,
    tags: ['test', 'axes'],
  },
  {
    data: simpleBarData,
    options: simpleBarColorOverrideOptions,
    tags: ['test', 'colors'],
  },
  {
    data: simpleBarCenteredLegendData,
    options: simpleBarCenteredLegendOptions,
    tags: ['test', 'legend'],
  },
  {
    data: simpleBarData,
    options: simpleBarCustomLegendOrderOptions,
    tags: ['test', 'legend'],
  },
  {
    options: simpleBarAdditionalLegendItemsOptions,
    data: simpleBarData,
    tags: ['test', 'legend'],
  },
  {
    options: simpleBarTurkishLocaleOptions,
    data: simpleBarLocaleData,
    tags: ['locale'],
  },
  {
    options: simpleBarArabicLocaleOptions,
    data: simpleBarLocaleData,
    tags: ['locale'],
  },
  {
    options: simpleBarIranianLocaleOptions,
    data: simpleBarLocaleData,
    tags: ['locale'],
  },
  {
    options: simpleBarJapaneseLocaleOptions,
    data: simpleBarLocaleData,
    tags: ['test', 'locale'],
  },
  {
    options: simpleBarHindiLocaleOptions,
    data: simpleBarLocaleData,
    tags: ['locale'],
  },
  {
    options: simpleBarBanglaLocaleOptions,
    data: simpleBarLocaleData,
    tags: ['locale'],
  },
  {
    options: simpleHorizontalBarLongLabelOptions,
    data: simpleHorizontalBarLongLabelData,
    tags: ['test', 'truncation'],
  },
  {
    options: simpleHorizontalBarEmptyStateOptions,
    data: noData,
    tags: ['empty'],
  },
  {
    options: simpleHorizontalBarSkeletonOptions,
    data: noData,
    tags: ['skeleton'],
  },
]

// ── Grouped bar ───────────────────────────────────────────────────────────────

export const chartTypesGrouped: ChartTypes = {
  vanilla: 'GroupedBarChart',
  svelte: 'BarChartGrouped',
  react: 'GroupedBarChart',
  angular: ['GroupedBarChartComponent', 'ibm-grouped-bar-chart'],
  vue: 'CcvGroupedBarChart',
}

// Grouped bar with pre-selected groups
const groupedBarSelectedGroupsOptions: BarChartOptions = {
  title: 'Pre-selected groups (grouped bar)',
  data: {
    selectedGroups: ['Dataset 1', 'Dataset 3'],
  },
  axes: {
    left: { mapsTo: 'value' },
    bottom: { scaleType: ScaleTypes.LABELS, mapsTo: 'key' },
  },
  height: '400px',
}

// Vertical grouped discrete
const groupedBarOptions: BarChartOptions = {
  title: 'Vertical grouped bar (discrete)',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { scaleType: ScaleTypes.LABELS, mapsTo: 'key' },
  },
  height: '400px',
}

// Grouped bar – preserveSpaceForMissingBars=false (compact)
const groupedBarCompactOptions: BarChartOptions = {
  title: 'Grouped bar (preserveSpaceForMissingBars=false)',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { scaleType: ScaleTypes.LABELS, mapsTo: 'key' },
  },
  bars: { preserveSpaceForMissingBars: false },
  height: '400px',
}

// Vertical grouped time series
const groupedBarTimeSeriesOptions: BarChartOptions = {
  title: 'Vertical grouped bar (time series)',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { mapsTo: 'date', scaleType: ScaleTypes.TIME },
  },
  height: '400px',
}

// Horizontal grouped time series
const groupedBarHorizontalTimeSeriesOptions: BarChartOptions = {
  title: 'Horizontal grouped bar (time series)',
  axes: {
    left: { mapsTo: 'date', scaleType: ScaleTypes.TIME },
    bottom: { mapsTo: 'value' },
  },
  height: '400px',
}

// Vertical grouped time series (dense data)
const groupedBarTimeSeriesDenseOptions: BarChartOptions = {
  title: 'Vertical grouped bar (time series – dense data)',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { mapsTo: 'date', scaleType: ScaleTypes.TIME },
  },
  height: '400px',
}

// Grouped bar – empty state
const groupedBarEmptyStateOptions: BarChartOptions = {
  title: 'Vertical grouped bar (empty state)',
  axes: {
    left: {},
    bottom: { scaleType: ScaleTypes.LABELS },
  },
  height: '400px',
}

// Grouped bar – skeleton
const groupedBarSkeletonOptions: BarChartOptions = {
  title: 'Vertical grouped bar (skeleton)',
  axes: {
    left: {},
    bottom: { scaleType: ScaleTypes.LABELS },
  },
  data: { loading: true },
  height: '400px',
}

// Horizontal grouped – empty state
const groupedHorizontalBarEmptyStateOptions: BarChartOptions = {
  title: 'Horizontal grouped bar (empty state)',
  axes: {
    left: { scaleType: ScaleTypes.LABELS },
    bottom: {},
  },
  height: '400px',
}

// Horizontal grouped – skeleton
const groupedHorizontalBarSkeletonOptions: BarChartOptions = {
  title: 'Horizontal grouped bar (skeleton)',
  axes: {
    left: { scaleType: ScaleTypes.LABELS },
    bottom: {},
  },
  data: { loading: true },
  height: '400px',
}

// Horizontal grouped discrete
const groupedHorizontalBarOptions: BarChartOptions = {
  title: 'Horizontal grouped bar (discrete)',
  axes: {
    left: { scaleType: ScaleTypes.LABELS, mapsTo: 'key' },
    bottom: { mapsTo: 'value' },
  },
  height: '400px',
}

// ── Grouped bar data ──────────────────────────────────────────────────────────

const groupedBarData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: -29123 },
  { group: 'Dataset 1', key: 'Sold', value: -35213 },
  { group: 'Dataset 1', key: 'Restocking', value: 51213 },
  { group: 'Dataset 1', key: 'Misc', value: 16932 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  { group: 'Dataset 2', key: 'More', value: -21312 },
  { group: 'Dataset 2', key: 'Sold', value: -56456 },
  { group: 'Dataset 2', key: 'Restocking', value: -21312 },
  { group: 'Dataset 2', key: 'Misc', value: 34234 },
  { group: 'Dataset 3', key: 'Qty', value: -12312 },
  { group: 'Dataset 3', key: 'More', value: 23232 },
  { group: 'Dataset 3', key: 'Sold', value: 34232 },
  { group: 'Dataset 3', key: 'Restocking', value: -12312 },
  { group: 'Dataset 3', key: 'Misc', value: -34234 },
  { group: 'Dataset 4', key: 'Qty', value: -32423 },
  { group: 'Dataset 4', key: 'More', value: 21313 },
  { group: 'Dataset 4', key: 'Sold', value: 64353 },
  { group: 'Dataset 4', key: 'Restocking', value: 24134 },
  { group: 'Dataset 4', key: 'Misc', value: 24134 },
]

const groupedBarCompactData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Q1', value: 65000 },
  { group: 'Dataset 1', key: 'Q2', value: 29123 },
  { group: 'Dataset 1', key: 'Q4', value: 51213 },
  { group: 'Dataset 2', key: 'Q1', value: 32432 },
  { group: 'Dataset 2', key: 'Q3', value: 21312 },
  { group: 'Dataset 3', key: 'Q2', value: 23232 },
  { group: 'Dataset 3', key: 'Q3', value: 34232 },
  { group: 'Dataset 3', key: 'Q4', value: 12312 },
  { group: 'Dataset 4', key: 'Q1', value: 32423 },
  { group: 'Dataset 4', key: 'Q4', value: 24134 },
  { group: 'Dataset 5', key: 'Q2', value: 18500 },
  { group: 'Dataset 5', key: 'Q3', value: 42100 },
  { group: 'Dataset 6', key: 'Q1', value: 55600 },
]

const groupedBarTimeSeriesData: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-02', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-03', value: 30000 },
  { group: 'Dataset 1', date: '2023-01-06', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-07', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-01', value: 8000 },
  { group: 'Dataset 2', date: '2023-01-02', value: 67000 },
  { group: 'Dataset 2', date: '2023-01-03', value: 15000 },
  { group: 'Dataset 2', date: '2023-01-06', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-07', value: 45213 },
]

const groupedBarTimeSeriesDenseData: ChartTabularData = (() => {
  const rows: ChartTabularData = []
  for (let d = 1; d <= 31; d++) {
    const date = `2023-01-${String(d).padStart(2, '0')}`
    rows.push({ group: 'Dataset 1', date, value: 51213 })
    rows.push({ group: 'Dataset 2', date, value: 51213 })
  }
  // Override first few to match Carbon Charts reference values
  rows[0].value = 10000
  rows[2].value = 65000
  rows[4].value = 30000
  rows[10].value = 49213
  rows[12].value = 51213
  rows[1].value = 8000
  rows[3].value = 67000
  rows[5].value = 15000
  return rows
})()

const groupedHorizontalBarData: ChartTabularData = groupedBarData

const groupedBarSelectedGroupsData: ChartTabularData = groupedBarData

export const examplesGrouped: Example[] = [
  {
    options: groupedBarSelectedGroupsOptions,
    data: groupedBarSelectedGroupsData,
    tags: ['test', 'legend'],
  },
  {
    options: groupedBarOptions,
    data: groupedBarData,
    tags: ['test'],
  },
  {
    options: groupedBarCompactOptions,
    data: groupedBarCompactData,
    tags: ['test', 'compact'],
  },
  {
    options: groupedBarTimeSeriesOptions,
    data: groupedBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: groupedBarTimeSeriesDenseOptions,
    data: groupedBarTimeSeriesDenseData,
  },
  {
    options: groupedBarEmptyStateOptions,
    data: noData,
    tags: ['empty'],
  },
  {
    options: groupedBarSkeletonOptions,
    data: noData,
    tags: ['skeleton'],
  },
  {
    options: groupedHorizontalBarOptions,
    data: groupedHorizontalBarData,
    tags: ['test'],
  },
  {
    options: groupedBarHorizontalTimeSeriesOptions,
    data: groupedBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: groupedHorizontalBarEmptyStateOptions,
    data: noData,
    tags: ['empty'],
  },
  {
    options: groupedHorizontalBarSkeletonOptions,
    data: noData,
    tags: ['skeleton'],
  },
]

// ── Stacked bar ───────────────────────────────────────────────────────────────

export const chartTypesStacked: ChartTypes = {
  vanilla: 'StackedBarChart',
  svelte: 'BarChartStacked',
  react: 'StackedBarChart',
  angular: ['StackedBarChartComponent', 'ibm-stacked-bar-chart'],
  vue: 'CcvStackedBarChart',
}

const stackedBarOptions: BarChartOptions = {
  title: 'Vertical stacked bar (discrete)',
  axes: {
    left: { mapsTo: 'value', stacked: true },
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
  },
  height: '400px',
}

const stackedBarAlwaysRulerTooltipOptions: BarChartOptions = {
  title: 'Stacked bar (tooltip.alwaysShowRulerTooltip=true)',
  axes: {
    left: { mapsTo: 'value', stacked: true },
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
  },
  tooltip: { alwaysShowRulerTooltip: true },
  height: '400px',
}

const stackedBarNegativeOptions: BarChartOptions = {
  title: 'Vertical stacked bar (divergent)',
  axes: {
    left: { mapsTo: 'value', stacked: true },
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
  },
  height: '400px',
}

const stackedHorizontalBarOptions: BarChartOptions = {
  title: 'Horizontal stacked bar (discrete)',
  axes: {
    left: { scaleType: ScaleTypes.LABELS },
    bottom: { stacked: true },
  },
  height: '400px',
}

const stackedBarTimeSeriesOptions: BarChartOptions = {
  title: 'Vertical stacked bar (time series)',
  axes: {
    left: { mapsTo: 'value', stacked: true },
    bottom: { mapsTo: 'date', scaleType: ScaleTypes.TIME },
  },
  height: '400px',
}

const stackedBarShortIntervalTimeSeriesOptions: BarChartOptions = {
  title: 'Vertical stacked bar (short interval time series)',
  axes: {
    left: { mapsTo: 'value', stacked: true },
    bottom: { mapsTo: 'date', scaleType: ScaleTypes.TIME },
  },
  height: '400px',
}

const stackedHorizontalBarTimeSeriesOptions: BarChartOptions = {
  title: 'Horizontal stacked bar (time series)',
  axes: {
    left: { scaleType: ScaleTypes.TIME },
    bottom: { stacked: true },
  },
  height: '400px',
}

const stackedBarEmptyStateOptions: BarChartOptions = {
  title: 'Vertical stacked bar (empty state)',
  axes: {
    left: {},
    bottom: { scaleType: ScaleTypes.LABELS },
  },
  height: '400px',
}

const stackedBarSkeletonOptions: BarChartOptions = {
  title: 'Vertical stacked bar (skeleton)',
  axes: {
    left: {},
    bottom: { scaleType: ScaleTypes.LABELS },
  },
  data: { loading: true },
  height: '400px',
}

const stackedHorizontalBarEmptyStateOptions: BarChartOptions = {
  title: 'Horizontal stacked bar (empty state)',
  axes: {
    left: { scaleType: ScaleTypes.LABELS },
    bottom: {},
  },
  height: '400px',
}

const stackedHorizontalBarSkeletonOptions: BarChartOptions = {
  title: 'Horizontal stacked bar (skeleton)',
  axes: {
    left: { scaleType: ScaleTypes.LABELS },
    bottom: {},
  },
  data: { loading: true },
  height: '400px',
}

// ── Stacked bar data ──────────────────────────────────────────────────────────

const stackedBarData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: 29123 },
  { group: 'Dataset 1', key: 'Sold', value: 35213 },
  { group: 'Dataset 1', key: 'Restocking', value: 51213 },
  { group: 'Dataset 1', key: 'Misc', value: 16932 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  { group: 'Dataset 2', key: 'More', value: 21312 },
  { group: 'Dataset 2', key: 'Sold', value: 56456 },
  { group: 'Dataset 2', key: 'Restocking', value: 21312 },
  { group: 'Dataset 2', key: 'Misc', value: 34234 },
  { group: 'Dataset 3', key: 'Qty', value: 12312 },
  { group: 'Dataset 3', key: 'More', value: 23232 },
  { group: 'Dataset 3', key: 'Sold', value: 34232 },
  { group: 'Dataset 3', key: 'Restocking', value: 12312 },
  { group: 'Dataset 3', key: 'Misc', value: 34234 },
  { group: 'Dataset 4', key: 'Qty', value: 32423 },
  { group: 'Dataset 4', key: 'More', value: 21313 },
  { group: 'Dataset 4', key: 'Sold', value: 64353 },
  { group: 'Dataset 4', key: 'Restocking', value: 24134 },
  { group: 'Dataset 4', key: 'Misc', value: 32423 },
]

const stackedBarNegativeData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 65000 },
  { group: 'Dataset 1', key: 'More', value: 29123 },
  { group: 'Dataset 1', key: 'Sold', value: 35213 },
  { group: 'Dataset 1', key: 'Restocking', value: 51213 },
  { group: 'Dataset 1', key: 'Misc', value: 16932 },
  { group: 'Dataset 2', key: 'Qty', value: 32432 },
  { group: 'Dataset 2', key: 'More', value: 21312 },
  { group: 'Dataset 2', key: 'Sold', value: 56456 },
  { group: 'Dataset 2', key: 'Restocking', value: 21312 },
  { group: 'Dataset 2', key: 'Misc', value: 34234 },
  { group: 'Dataset 3', key: 'Qty', value: 12312 },
  { group: 'Dataset 3', key: 'More', value: 23232 },
  { group: 'Dataset 3', key: 'Sold', value: 34232 },
  { group: 'Dataset 3', key: 'Restocking', value: 12312 },
  { group: 'Dataset 3', key: 'Misc', value: 34234 },
  { group: 'Dataset 4', key: 'Qty', value: -32423 },
  { group: 'Dataset 4', key: 'More', value: -21313 },
  { group: 'Dataset 4', key: 'Sold', value: -64353 },
  { group: 'Dataset 4', key: 'Restocking', value: -24134 },
  { group: 'Dataset 4', key: 'Misc', value: -32423 },
]

const stackedHorizontalBarData: ChartTabularData = stackedBarData

const stackedBarTimeSeriesData: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-08', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-03', value: 75000 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-08', value: 21432 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 3', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 3', date: '2023-01-05', value: 15000 },
  { group: 'Dataset 3', date: '2023-01-08', value: 20000 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213 },
  { group: 'Dataset 4', date: '2023-01-02', value: 10 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-15', value: 40323 },
  { group: 'Dataset 4', date: '2023-01-19', value: 31300 },
]

const stackedBarShortIntervalTimeSeriesData: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.222Z', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.333Z', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.444Z', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-01T08:05:06.555Z', value: 0 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.222Z', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.333Z', value: 21432 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.444Z', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-01T08:05:06.555Z', value: 0 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.222Z', value: 15000 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.333Z', value: 20000 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.444Z', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-01T08:05:06.555Z', value: 0 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.111Z', value: 0 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.222Z', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.333Z', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.444Z', value: 40323 },
  { group: 'Dataset 4', date: '2023-01-01T08:05:06.555Z', value: 0 },
]

const stackedHorizontalBarTimeSeriesData: ChartTabularData = stackedBarTimeSeriesData

export const examplesStacked: Example[] = [
  {
    options: stackedBarOptions,
    data: stackedBarData,
    tags: ['test'],
  },
  {
    options: stackedBarAlwaysRulerTooltipOptions,
    data: stackedBarData,
    tags: ['test'],
  },
  {
    options: stackedBarNegativeOptions,
    data: stackedBarNegativeData,
    tags: ['test'],
  },
  {
    options: stackedBarTimeSeriesOptions,
    data: stackedBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: stackedBarShortIntervalTimeSeriesOptions,
    data: stackedBarShortIntervalTimeSeriesData,
    tags: ['test'],
  },
  {
    options: stackedBarEmptyStateOptions,
    data: [],
    tags: ['empty'],
  },
  {
    options: stackedBarSkeletonOptions,
    data: [],
    tags: ['skeleton'],
  },
  {
    options: stackedHorizontalBarOptions,
    data: stackedHorizontalBarData,
    tags: ['test'],
  },
  {
    options: stackedHorizontalBarTimeSeriesOptions,
    data: stackedHorizontalBarTimeSeriesData,
    tags: ['test'],
  },
  {
    options: stackedHorizontalBarEmptyStateOptions,
    data: [],
    tags: ['empty'],
  },
  {
    options: stackedHorizontalBarSkeletonOptions,
    data: [],
    tags: ['skeleton'],
  },
]
