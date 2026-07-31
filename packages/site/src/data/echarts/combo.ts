/**
 * ECharts equivalents for the Combo chart page.
 *
 * Carbon Charts combo data uses a `temp` field for temperature groups instead
 * of the standard `value` field.  We normalise each dataset before passing it
 * to createComboOptions so that groupByGroup() can read all values uniformly.
 */
import type { EChartsOption } from 'echarts'
import { createComboOptions } from '@carbon/echarts-theme/presets'
import type { ChartTabularData } from '@carbon/echarts-theme/presets'

// ── Helper: normalise Carbon combo data ───────────────────────────────────────
// Carbon stores temperature readings in a `temp` field.  The transform reads
// only `d.value`, so we remap `temp` → `value` for those rows.
function norm(data: ChartTabularData): ChartTabularData {
  return data.map((d) => {
    if (d['temp'] !== undefined && d.value === undefined) {
      const { temp, ...rest } = d as typeof d & { temp: number | number[] }
      return { ...rest, value: temp as number | number[] }
    }
    return d
  })
}

// ── [0] Bar + Line (dual Y) ────────────────────────────────────────────────────
// Carbon: comboSimpleData — School A (bar, left Y) + Temperature (line, right Y)
const simpleRaw: ChartTabularData = [
  { group: 'School A', date: 'Monday', value: 10000 },
  { group: 'School A', date: 'Tuesday', value: 65000 },
  { group: 'School A', date: 'Wednesday', value: 30000 },
  { group: 'School A', date: 'Thursday', value: 49213 },
  { group: 'School A', date: 'Friday', value: 49213 },
  { group: 'Temperature', date: 'Monday', value: 70 },
  { group: 'Temperature', date: 'Tuesday', value: 75 },
  { group: 'Temperature', date: 'Wednesday', value: 31 },
  { group: 'Temperature', date: 'Thursday', value: 31 },
  { group: 'Temperature', date: 'Friday', value: 43 },
]

export const comboBarLine: EChartsOption = createComboOptions(simpleRaw, {
  xField: 'date',
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [1] Bar + Line — tooltip variant (same data as [0]) ───────────────────────
export const comboBarLineRuler: EChartsOption = createComboOptions(simpleRaw, {
  xField: 'date',
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [2] Stacked bar + Line (dual Y) ───────────────────────────────────────────
// Carbon: comboStackedData — Florida/California/Tokyo (stacked bar) + Temperature (line, right Y)
const stackedRaw: ChartTabularData = [
  { group: 'Florida', key: 'Monday', value: 65000 },
  { group: 'Florida', key: 'Tuesday', value: 29123 },
  { group: 'Florida', key: 'Wednesday', value: 35213 },
  { group: 'Florida', key: 'Thursday', value: 51213 },
  { group: 'Florida', key: 'Friday', value: 16932 },
  { group: 'California', key: 'Monday', value: 32432 },
  { group: 'California', key: 'Tuesday', value: 21312 },
  { group: 'California', key: 'Wednesday', value: 56456 },
  { group: 'California', key: 'Thursday', value: 21312 },
  { group: 'California', key: 'Friday', value: 34234 },
  { group: 'Tokyo', key: 'Monday', value: 12312 },
  { group: 'Tokyo', key: 'Tuesday', value: 23232 },
  { group: 'Tokyo', key: 'Wednesday', value: 34232 },
  { group: 'Tokyo', key: 'Thursday', value: 12312 },
  { group: 'Tokyo', key: 'Friday', value: 34234 },
  { group: 'Temperature', key: 'Monday', value: 23 },
  { group: 'Temperature', key: 'Tuesday', value: 21 },
  { group: 'Temperature', key: 'Wednesday', value: 32 },
  { group: 'Temperature', key: 'Thursday', value: 34 },
  { group: 'Temperature', key: 'Friday', value: 23 },
]

export const comboStackedBarLine: EChartsOption = createComboOptions(stackedRaw, {
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
  stacked: true,
})

// ── [3] Grouped bar + Line (dual Y) ───────────────────────────────────────────
// Carbon: comboGroupedData — Location 1/2/3 (grouped bar) + Temperature (line, right Y)
const groupedRaw: ChartTabularData = [
  { group: 'Location 1', key: 'Monday', value: 65000 },
  { group: 'Location 1', key: 'Tuesday', value: -39123 },
  { group: 'Location 1', key: 'Wednesday', value: -35213 },
  { group: 'Location 1', key: 'Thursday', value: 51213 },
  { group: 'Location 1', key: 'Friday', value: 16932 },
  { group: 'Location 2', key: 'Monday', value: 32432 },
  { group: 'Location 2', key: 'Tuesday', value: -21312 },
  { group: 'Location 2', key: 'Wednesday', value: -56456 },
  { group: 'Location 2', key: 'Thursday', value: -21312 },
  { group: 'Location 2', key: 'Friday', value: 34234 },
  { group: 'Location 3', key: 'Monday', value: -12312 },
  { group: 'Location 3', key: 'Tuesday', value: 23232 },
  { group: 'Location 3', key: 'Wednesday', value: 34232 },
  { group: 'Location 3', key: 'Thursday', value: -12312 },
  { group: 'Location 3', key: 'Friday', value: -34234 },
  { group: 'Temperature', key: 'Monday', value: 20 },
  { group: 'Temperature', key: 'Tuesday', value: 23 },
  { group: 'Temperature', key: 'Wednesday', value: 33 },
  { group: 'Temperature', key: 'Thursday', value: 34 },
  { group: 'Temperature', key: 'Friday', value: 34 },
]

export const comboGroupedLine: EChartsOption = createComboOptions(groupedRaw, {
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [4] Floating bar + Line ────────────────────────────────────────────────────
// Carbon: comboSimpleFloatingData — School A (line, left Y) + Temperature (floating bar, right Y)
// NOTE: in Carbon, Temperature is the floating bar and School A is the line.
// temp field = [base, end] tuples for Temperature (floating).
const floatingRaw: ChartTabularData = [
  { group: 'School A', date: 'Monday', value: 50000 },
  { group: 'School A', date: 'Tuesday', value: 45000 },
  { group: 'School A', date: 'Wednesday', value: 58000 },
  { group: 'School A', date: 'Thursday', value: 31000 },
  { group: 'School A', date: 'Friday', value: 33000 },
  { group: 'Temperature', date: 'Monday', value: [65, 70] },
  { group: 'Temperature', date: 'Tuesday', value: [67, 71] },
  { group: 'Temperature', date: 'Wednesday', value: [75, 83] },
  { group: 'Temperature', date: 'Thursday', value: [31, 42] },
  { group: 'Temperature', date: 'Friday', value: [43, 55] },
]

export const comboFloatingLine: EChartsOption = createComboOptions(floatingRaw, {
  xField: 'date',
  lineGroups: ['School A'],
  floatingGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [5] Grouped horizontal bar + Line ─────────────────────────────────────────
// Carbon: comboGroupedHorizontalData — Location 1/2/3 (grouped horiz bar) + Temperature (line)
const groupedHorizontalRaw: ChartTabularData = [
  { group: 'Location 1', key: 'Monday', value: 65000 },
  { group: 'Location 1', key: 'Tuesday', value: -39123 },
  { group: 'Location 1', key: 'Wednesday', value: -35213 },
  { group: 'Location 2', key: 'Monday', value: 32432 },
  { group: 'Location 2', key: 'Tuesday', value: -21312 },
  { group: 'Location 2', key: 'Wednesday', value: -56456 },
  { group: 'Location 3', key: 'Monday', value: -12312 },
  { group: 'Location 3', key: 'Tuesday', value: 23232 },
  { group: 'Location 3', key: 'Wednesday', value: 34232 },
  { group: 'Temperature', key: 'Monday', value: 20 },
  { group: 'Temperature', key: 'Tuesday', value: 23 },
  { group: 'Temperature', key: 'Wednesday', value: 33 },
]

export const comboGroupedHorizontal: EChartsOption = createComboOptions(groupedHorizontalRaw, {
  horizontal: true,
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [6] Horizontal bar + Line ──────────────────────────────────────────────────
// Carbon: comboHorizontalData = comboSimpleData — School A (bar) + Temperature (line)
export const comboHorizontalLine: EChartsOption = createComboOptions(simpleRaw, {
  xField: 'date',
  horizontal: true,
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [7] Area + Line (dual Y) ───────────────────────────────────────────────────
// Carbon: comboAreaLineData — Health (area) + Temperature (line, right Y)
const areaLineRaw: ChartTabularData = norm([
  { group: 'Health', key: 'January', value: 312 },
  { group: 'Health', key: 'February', value: 232 },
  { group: 'Health', key: 'March', value: 432 },
  { group: 'Health', key: 'April', value: 712 },
  { group: 'Health', key: 'May', value: 834 },
  { group: 'Health', key: 'June', value: 800 },
  { group: 'Health', key: 'July', value: 612 },
  { group: 'Health', key: 'August', value: 442 },
  { group: 'Temperature', key: 'January', value: -20 },
  { group: 'Temperature', key: 'February', value: -12 },
  { group: 'Temperature', key: 'March', value: 3 },
  { group: 'Temperature', key: 'April', value: 18 },
  { group: 'Temperature', key: 'May', value: 24 },
  { group: 'Temperature', key: 'June', value: 34 },
  { group: 'Temperature', key: 'July', value: 37 },
  { group: 'Temperature', key: 'August', value: 30 },
])

export const comboAreaLine: EChartsOption = createComboOptions(areaLineRaw, {
  areaGroups: ['Health'],
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [8] Stacked area + Line (time series, dual Y) ────────────────────────────
// Carbon: comboStackedAreaLine — Dataset 1/2/3 (stacked area, date field) + Temperature (line, right Y)
const stackedAreaLineRaw: ChartTabularData = [
  { group: 'Dataset 1 with a very long name', date: '2023-01-01', value: 10000 },
  { group: 'Dataset 1 with a very long name', date: '2023-01-05', value: 65000 },
  { group: 'Dataset 1 with a very long name', date: '2023-01-08', value: 10000 },
  { group: 'Dataset 1 with a very long name', date: '2023-01-13', value: 49213 },
  { group: 'Dataset 1 with a very long name', date: '2023-01-17', value: 51213 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-01', value: 20000 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-05', value: 25000 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-08', value: 60000 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-13', value: 30213 },
  { group: 'Dataset 2 with a very long name', date: '2023-01-17', value: 55213 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-01', value: 30000 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-05', value: 20000 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-08', value: 40000 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-13', value: 60213 },
  { group: 'Dataset 3 with a very long name', date: '2023-01-17', value: 25213 },
  { group: 'Temperature', date: '2023-01-01', value: 77 },
  { group: 'Temperature', date: '2023-01-05', value: 65 },
  { group: 'Temperature', date: '2023-01-08', value: 80 },
  { group: 'Temperature', date: '2023-01-13', value: 43 },
  { group: 'Temperature', date: '2023-01-17', value: 53 },
]

export const comboStackedAreaLine: EChartsOption = createComboOptions(stackedAreaLineRaw, {
  timeSeries: true,
  areaGroups: [
    'Dataset 1 with a very long name',
    'Dataset 2 with a very long name',
    'Dataset 3 with a very long name',
  ],
  stacked: true,
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})

// ── [9] Bar + Scatter + Line (dual Y) ─────────────────────────────────────────
// Carbon: comboLineScatterData — Attendance (bar) + Paris/Marseille (scatter, right Y) + Avg Temperature (line, right Y)
const scatterLineRaw: ChartTabularData = norm([
  { group: 'Paris', key: 'Monday', value: 25 },
  { group: 'Paris', key: 'Tuesday', value: 33 },
  { group: 'Paris', key: 'Wednesday', value: 27 },
  { group: 'Paris', key: 'Thursday', value: 25 },
  { group: 'Paris', key: 'Friday', value: 32 },
  { group: 'Marseille', key: 'Monday', value: 16 },
  { group: 'Marseille', key: 'Tuesday', value: 22 },
  { group: 'Marseille', key: 'Wednesday', value: 20 },
  { group: 'Marseille', key: 'Thursday', value: 22 },
  { group: 'Marseille', key: 'Friday', value: 25 },
  { group: 'Avg Temperature', key: 'Monday', value: 20.5 },
  { group: 'Avg Temperature', key: 'Tuesday', value: 27.5 },
  { group: 'Avg Temperature', key: 'Wednesday', value: 23.5 },
  { group: 'Avg Temperature', key: 'Thursday', value: 23.5 },
  { group: 'Avg Temperature', key: 'Friday', value: 28.5 },
  { group: 'Attendance', key: 'Monday', value: 2650 },
  { group: 'Attendance', key: 'Tuesday', value: 2553 },
  { group: 'Attendance', key: 'Wednesday', value: 3433 },
  { group: 'Attendance', key: 'Thursday', value: 3754 },
  { group: 'Attendance', key: 'Friday', value: 3744 },
])

export const comboScatterLine: EChartsOption = createComboOptions(scatterLineRaw, {
  lineGroups: ['Avg Temperature'],
  scatterGroups: ['Paris', 'Marseille'],
  secondaryGroups: ['Avg Temperature', 'Paris', 'Marseille'],
})

// ── [10] Area + Line (time series, dual Y) ────────────────────────────────────
// Carbon: comboAreaLineTimeSeriesData — Health (area, key=date) + Temperature (line, right Y)
const areaLineTimeSeriesRaw: ChartTabularData = [
  { group: 'Health', key: '2022-12-30', value: 312 },
  { group: 'Health', key: '2023-01-06', value: 232 },
  { group: 'Health', key: '2023-01-08', value: 432 },
  { group: 'Health', key: '2023-01-15', value: 712 },
  { group: 'Health', key: '2023-01-19', value: 834 },
  { group: 'Health', key: '2023-02-01', value: 800 },
  { group: 'Health', key: '2023-02-05', value: 612 },
  { group: 'Health', key: '2023-02-13', value: 442 },
  { group: 'Temperature', key: '2023-01-01', value: -20 },
  { group: 'Temperature', key: '2023-01-05', value: -12 },
  { group: 'Temperature', key: '2023-01-08', value: 3 },
  { group: 'Temperature', key: '2023-01-13', value: 18 },
  { group: 'Temperature', key: '2023-01-19', value: 24 },
  { group: 'Temperature', key: '2023-02-02', value: 34 },
  { group: 'Temperature', key: '2023-02-07', value: 37 },
  { group: 'Temperature', key: '2023-02-09', value: 30 },
]

export const comboAreaLineTimeSeries: EChartsOption = createComboOptions(areaLineTimeSeriesRaw, {
  xField: 'key',
  timeSeries: true,
  areaGroups: ['Health'],
  lineGroups: ['Temperature'],
  secondaryGroups: ['Temperature'],
})
