import {
  type LineChartOptions,
  type ChartTabularData,
  ScaleTypes,
  LegendPositions,
  LegendOrientations,
  TickRotations,
} from '@carbon/charts'
import type { ChartTypes, Example } from './types'
import { magenta70, cyan70, purple60, gray30, cyan40 } from '@carbon/colors'

const vanilla = 'LineChart'

export const chartTypes: ChartTypes = {
  vanilla,
  svelte: vanilla,
  react: vanilla,
  angular: ['LineChartComponent', 'ibm-line-chart'],
  vue: `Ccv${vanilla}`,
}

const lineOptions: LineChartOptions = {
  title: 'Line (discrete)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'key',
      scaleType: ScaleTypes.LABELS,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  height: '400px',
}

const lineLongLabelOptions: LineChartOptions = {
  title: 'Truncated labels (line)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'key',
      scaleType: ScaleTypes.LABELS,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  height: '400px',
}

const lineSelectedGroupsOptions: LineChartOptions = {
  title: 'Pre-selected groups (line)',
  data: {
    selectedGroups: ['Dataset 1', 'Dataset 3'],
  },
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'key',
      scaleType: ScaleTypes.LABELS,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  height: '400px',
}

const lineCustomColorOptions: LineChartOptions = {
  title: 'Custom colors (line)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'key',
      scaleType: ScaleTypes.LABELS,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  color: {
    scale: {
      'Dataset 1': magenta70,
      'Dataset 2': cyan70,
      'Dataset 3': purple60,
      'Dataset 4': gray30,
    },
  },
  height: '400px',
}

const lineTimeSeriesOptions: LineChartOptions = {
  title: 'Line (time series)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  curve: 'curveMonotoneX',
  height: '400px',
}

const lineTimeSeriesWithThresholdsOptions: LineChartOptions = {
  title: 'Thresholds (line)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
      thresholds: [
        {
          value: new Date(2023, 0, 11),
          label: 'Custom formatter',
          valueFormatter: (d: Date) =>
            new Intl.DateTimeFormat('en-CA', { month: 'short', day: '2-digit' }).format(d),
        },
      ],
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
      thresholds: [
        { value: 55000, label: 'Custom label', fillColor: 'orange' },
        { value: 10000, fillColor: cyan40 },
      ],
    },
  },
  curve: 'curveMonotoneX',
  height: '400px',
}

const lineTimeSeriesDenseOptions: LineChartOptions = {
  title: 'Line (dense time series)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'date',
      scaleType: ScaleTypes.TIME,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  curve: 'curveMonotoneX',
  height: '400px',
}

const lineTimeSeriesRotatedTicksOptions: LineChartOptions = {
  title: 'Rotated ticks (line)',
  axes: {
    bottom: {
      scaleType: ScaleTypes.TIME,
      mapsTo: 'date',
      ticks: {
        rotation: TickRotations.ALWAYS,
      },
    },
    left: {
      mapsTo: 'value',
    },
  },
  legend: {
    clickable: false,
  },
  height: '400px',
}

const lineLogAxisOptions: LineChartOptions = {
  title: 'Log Axis',
  axes: {
    bottom: {
      scaleType: ScaleTypes.TIME,
      mapsTo: 'date',
    },
    left: {
      mapsTo: 'value',
      scaleType: ScaleTypes.LOG,
      includeZero: false,
    },
  },
  height: '400px',
}

const dualLine: LineChartOptions = {
  title: 'Line + Line (dual axes)',
  axes: {
    left: {
      title: 'Temperature (°C)',
      mapsTo: 'temp',
    },
    bottom: {
      scaleType: ScaleTypes.TIME,
      mapsTo: 'date',
      title: 'Date',
    },
    right: {
      title: 'Rainfall (mm)',
      mapsTo: 'rainfall',
      correspondingDatasets: ['Rainfall'],
    },
  },
  curve: 'curveMonotoneX',
  height: '400px',
}

const lineOptionsLegendOrientation: LineChartOptions = {
  title: 'Left aligned vertical legend (line)',
  axes: {
    bottom: {
      title: '2023 Annual Sales Figures',
      mapsTo: 'key',
      scaleType: ScaleTypes.LABELS,
    },
    left: {
      mapsTo: 'value',
      title: 'Conversion rate',
      scaleType: ScaleTypes.LINEAR,
    },
  },
  legend: {
    position: LegendPositions.LEFT,
    orientation: LegendOrientations.VERTICAL,
  },
  height: '400px',
}

const lineTimeSeriesFrenchLocale: LineChartOptions = {
  title: 'Line (time series) - Time interval monthly with French locale',
  axes: {
    left: {
      ticks: {},
      mapsTo: 'value',
    },
    bottom: {
      scaleType: ScaleTypes.TIME,
      ticks: {},
      mapsTo: 'date',
    },
  },
  tooltip: {},
  legend: {
    clickable: false,
  },
  height: '400px',
  locale: {
    code: 'fr-FR',
  },
}

const lineData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: 'Restocking', value: 21400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'Dataset 4', key: 'Qty', value: 22000 },
  { group: 'Dataset 4', key: 'More', value: 1200 },
  { group: 'Dataset 4', key: 'Sold', value: 9000 },
  { group: 'Dataset 4', key: 'Restocking', value: 24000, audienceSize: 10 },
  { group: 'Dataset 4', key: 'Misc', value: 3000, audienceSize: 10 },
]

const lineLongLabelData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  {
    group: 'Dataset 1',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 42300,
  },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 53200 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  {
    group: 'Dataset 2',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 21400,
  },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  {
    group: 'Dataset 3',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 1400,
  },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'LongLabelShouldBeTruncated', key: 'Qty', value: 22000 },
  { group: 'LongLabelShouldBeTruncated', key: 'More', value: 1200 },
  { group: 'LongLabelShouldBeTruncated', key: 'Sold', value: 9000 },
  {
    group: 'LongLabelShouldBeTruncated',
    key: '347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9',
    value: 24000,
    audienceSize: 10,
  },
  {
    group: 'LongLabelShouldBeTruncated',
    key: 'Misc',
    value: 3000,
    audienceSize: 10,
  },
]

const lineSelectedGroupsData: ChartTabularData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 1', key: 'Sold', value: 53100 },
  { group: 'Dataset 1', key: 'Restocking', value: 42300 },
  { group: 'Dataset 1', key: 'Misc', value: 12300 },
  { group: 'Dataset 2', key: 'Qty', value: 34200 },
  { group: 'Dataset 2', key: 'More', value: 56000 },
  { group: 'Dataset 2', key: 'Sold', value: 42300 },
  { group: 'Dataset 2', key: 'Restocking', value: 21400 },
  { group: 'Dataset 2', key: 'Misc', value: 0 },
  { group: 'Dataset 3', key: 'Qty', value: 41200 },
  { group: 'Dataset 3', key: 'More', value: 18400 },
  { group: 'Dataset 3', key: 'Sold', value: 34210 },
  { group: 'Dataset 3', key: 'Restocking', value: 1400 },
  { group: 'Dataset 3', key: 'Misc', value: 42100 },
  { group: 'Dataset 4', key: 'Qty', value: 22000 },
  { group: 'Dataset 4', key: 'More', value: 1200 },
  { group: 'Dataset 4', key: 'Sold', value: 9000 },
  { group: 'Dataset 4', key: 'Restocking', value: 24000, audienceSize: 10 },
  { group: 'Dataset 4', key: 'Misc', value: 3000, audienceSize: 10 },
]

export const lineTimeSeriesData: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-08', value: null },
  { group: 'Dataset 1', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2', date: '2023-01-02', value: 0 },
  { group: 'Dataset 2', date: '2023-01-06', value: 57312 },
  { group: 'Dataset 2', date: '2023-01-08', value: 27432 },
  { group: 'Dataset 2', date: '2023-01-15', value: 70323 },
  { group: 'Dataset 2', date: '2023-01-19', value: 21300 },
  { group: 'Dataset 3', date: '2023-01-01', value: 40000 },
  { group: 'Dataset 3', date: '2023-01-05', value: null },
  { group: 'Dataset 3', date: '2023-01-08', value: 18000 },
  { group: 'Dataset 3', date: '2023-01-13', value: 39213 },
  { group: 'Dataset 3', date: '2023-01-17', value: 61213 },
  { group: 'Dataset 4', date: '2023-01-02', value: 20000 },
  { group: 'Dataset 4', date: '2023-01-06', value: 37312 },
  { group: 'Dataset 4', date: '2023-01-08', value: 51432 },
  { group: 'Dataset 4', date: '2023-01-15', value: 25332 },
  { group: 'Dataset 4', date: '2023-01-19', value: null },
]

const lineTimeSeriesDenseData: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-01-01T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-01T05:00:00.000Z', value: -12000 },
  { group: 'Dataset 1', date: '2023-01-01T10:00:00.000Z', value: -14000 },
  { group: 'Dataset 1', date: '2023-01-02T00:00:00.000Z', value: -25000 },
  { group: 'Dataset 1', date: '2023-01-02T02:00:00.000Z', value: -26000 },
  { group: 'Dataset 1', date: '2023-01-03T00:00:00.000Z', value: -10000 },
  { group: 'Dataset 1', date: '2023-01-03T05:00:00.000Z', value: 10000 },
  { group: 'Dataset 1', date: '2023-01-03T10:00:00.000Z', value: 12000 },
  { group: 'Dataset 1', date: '2023-01-05T00:00:00.000Z', value: 45000 },
  { group: 'Dataset 1', date: '2023-01-07T00:00:00.000Z', value: 49000 },
  { group: 'Dataset 1', date: '2023-01-07T15:00:00.000Z', value: 45000 },
  { group: 'Dataset 1', date: '2023-01-09T00:00:00.000Z', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-09T05:00:00.000Z', value: 52000 },
  { group: 'Dataset 1', date: '2023-01-09T15:00:00.000Z', value: 55000 },
  { group: 'Dataset 1', date: '2023-01-10T00:00:00.000Z', value: 50000 },
  { group: 'Dataset 1', date: '2023-01-12T00:00:00.000Z', value: 65000 },
  { group: 'Dataset 1', date: '2023-01-13T00:00:00.000Z', value: 80000 },
  { group: 'Dataset 1', date: '2023-01-14T10:00:00.000Z', value: 85000 },
  { group: 'Dataset 1', date: '2023-01-15T07:00:00.000Z', value: 90000 },
  { group: 'Dataset 1', date: '2023-01-15T18:00:00.000Z', value: 70000 },
  { group: 'Dataset 2', date: '2023-01-01T00:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-01T03:00:00.000Z', value: 22000 },
  { group: 'Dataset 2', date: '2023-01-01T16:00:00.000Z', value: 24000 },
  { group: 'Dataset 2', date: '2023-01-02T00:00:00.000Z', value: 35000 },
  { group: 'Dataset 2', date: '2023-01-02T07:00:00.000Z', value: 36000 },
  { group: 'Dataset 2', date: '2023-01-03T00:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-03T06:00:00.000Z', value: 20000 },
  { group: 'Dataset 2', date: '2023-01-03T18:00:00.000Z', value: 22000 },
  { group: 'Dataset 2', date: '2023-01-05T00:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-06T00:00:00.000Z', value: 52000 },
  { group: 'Dataset 2', date: '2023-01-07T00:00:00.000Z', value: 52000 },
  { group: 'Dataset 2', date: '2023-01-07T15:00:00.000Z', value: 52000 },
  { group: 'Dataset 2', date: '2023-01-09T00:00:00.000Z', value: 60000 },
  { group: 'Dataset 2', date: '2023-01-09T05:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-09T10:00:00.000Z', value: 62000 },
  { group: 'Dataset 2', date: '2023-01-12T00:00:00.000Z', value: 65000 },
  { group: 'Dataset 2', date: '2023-01-14T00:00:00.000Z', value: 40000 },
  { group: 'Dataset 2', date: '2023-01-15T05:00:00.000Z', value: 45000 },
  { group: 'Dataset 2', date: '2023-01-15T10:00:00.000Z', value: 35000 },
  { group: 'Dataset 2', date: '2023-01-15T18:00:00.000Z', value: 30000 },
]

const lineTimeSeriesFrenchLocaleData: ChartTabularData = [
  {
    group: 'Dataset 1',
    date: '2023-10-01',
    value: 10,
  },
  {
    group: 'Dataset 1',
    date: '2023-11-01',
    value: 10,
  },
  {
    group: 'Dataset 1',
    date: '2023-12-01',
    value: 10,
  },
  {
    group: 'Dataset 1',
    date: '2024-01-01',
    value: 10,
  },
  {
    group: 'Dataset 1',
    date: '2024-02-01',
    value: 10,
  },
  {
    group: 'Dataset 1',
    date: '2024-03-01',
    value: 10,
  },
  {
    group: 'Dataset 1',
    date: '2019-04-01',
    value: 10,
  },
]

const lineTimeSeriesDataRotatedTicks: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-12-30', value: 32100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 23500 },
  { group: 'Dataset 1', date: '2024-01-01', value: 53100 },
  { group: 'Dataset 1', date: '2024-01-02', value: 42300 },
  { group: 'Dataset 1', date: '2024-01-03', value: 12300 },
]

const lineLogAxisData: ChartTabularData = [
  { group: 'Dataset 1', date: '2023-12-30', value: 300100 },
  { group: 'Dataset 1', date: '2023-12-31', value: 235000 },
  { group: 'Dataset 1', date: '2024-01-01', value: 153100 },
  { group: 'Dataset 1', date: '2024-01-02', value: 142300 },
  { group: 'Dataset 1', date: '2024-01-03', value: 82300 },
]

const lineTimeSeriesDualAxesData: ChartTabularData = [
  { group: 'Temperature', date: '2023-01-01', temp: 23 },
  { group: 'Temperature', date: '2023-02-01', temp: 15 },
  { group: 'Temperature', date: '2023-03-01', temp: 24 },
  { group: 'Temperature', date: '2023-04-01', temp: 33 },
  { group: 'Temperature', date: '2023-05-01', temp: 23 },
  { group: 'Temperature', date: '2023-06-01', temp: 32 },
  { group: 'Temperature', date: '2023-07-01', temp: 23 },
  { group: 'Rainfall', date: '2023-01-01', rainfall: 50 },
  { group: 'Rainfall', date: '2023-02-01', rainfall: 65 },
  { group: 'Rainfall', date: '2023-03-01', rainfall: 35 },
  { group: 'Rainfall', date: '2023-04-01', rainfall: 43 },
  { group: 'Rainfall', date: '2023-05-01', rainfall: 53 },
  { group: 'Rainfall', date: '2023-06-01', rainfall: 19 },
  { group: 'Rainfall', date: '2023-07-01', rainfall: 13 },
]

// ── Named parity exports used by LinePage ─────────────────────────────────────
// Each constant is a ready-to-use CarbonChartExample (options + data) for the
// corresponding ECharts variant slug on the Line page.

export const lineDiscreteExample: Example = { options: lineOptions, data: lineData, tags: ['test'] }
export const lineRotatedTicksExample: Example = {
  options: lineTimeSeriesRotatedTicksOptions,
  data: lineTimeSeriesDataRotatedTicks,
  tags: ['test', 'axes', 'time'],
}
export const lineLocaleExample: Example = {
  options: lineTimeSeriesFrenchLocale,
  data: lineTimeSeriesFrenchLocaleData,
  tags: ['test', 'axes', 'time', 'locale'],
}
export const lineLogAxisExample: Example = {
  options: lineLogAxisOptions,
  data: lineLogAxisData,
  tags: ['test', 'axes'],
}
export const lineCustomColorsExample: Example = {
  options: lineCustomColorOptions,
  data: lineData,
  tags: ['test', 'colors'],
}
export const lineSelectedGroupsExample: Example = {
  options: lineSelectedGroupsOptions,
  data: lineSelectedGroupsData,
  tags: ['test', 'legend'],
}
export const lineLegendOrientationExample: Example = {
  options: lineOptionsLegendOrientation,
  data: lineData,
  tags: ['test', 'legend'],
}
export const lineThresholdsExample: Example = {
  options: lineTimeSeriesWithThresholdsOptions,
  data: lineTimeSeriesData,
  tags: ['test', 'axes', 'time', 'thresholds'],
}
export const lineLongLabelExample: Example = {
  options: lineLongLabelOptions,
  data: lineLongLabelData,
  tags: ['test', 'truncation'],
}
export const lineTimeSeriesExample: Example = {
  options: lineTimeSeriesOptions,
  data: lineTimeSeriesData,
  tags: ['test', 'axes', 'time'],
}
export const lineTimeSeriesDenseExample: Example = {
  options: lineTimeSeriesDenseOptions,
  data: lineTimeSeriesDenseData,
  tags: ['test', 'axes', 'time'],
}
export const lineDualAxisExample: Example = {
  options: dualLine,
  data: lineTimeSeriesDualAxesData,
  tags: ['test', 'axes', 'time', 'dual'],
}
