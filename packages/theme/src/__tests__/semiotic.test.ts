import { describe, it, expect } from 'vitest'
import {
  createBarProps,
  createBarTableData,
  createLineProps,
  createLineTableData,
  createStepLineProps,
  createTimeSeriesLineProps,
  createHeatmapProps,
  createHeatmapTableData,
  createSemioticTheme,
  colorSchemeFor,
} from '../semiotic'
import { pickColors } from '../index'
import { tokens } from '../tokens'

const data = [
  { group: 'Qty', value: 65000 },
  { group: 'More', value: 29123 },
  { group: 'Sold', value: null },
  { group: 'Float', value: [1, 2] },
]

const lineData = [
  { group: 'Dataset 1', key: 'Qty', value: 34200 },
  { group: 'Dataset 1', key: 'More', value: 23500 },
  { group: 'Dataset 2', key: 'Qty', value: 12000 },
  { group: 'Dataset 2', key: 'More', value: 45000 },
]

const timeSeriesData = [
  { group: 'Dataset 1', date: '2023-01-01', value: 100 },
  { group: 'Dataset 1', date: '2023-01-02', value: 150 },
]

describe('colorSchemeFor', () => {
  it('maps g90/g100 to dark and white/g10 to light', () => {
    expect(colorSchemeFor('g90')).toBe('dark')
    expect(colorSchemeFor('g100')).toBe('dark')
    expect(colorSchemeFor('white')).toBe('light')
    expect(colorSchemeFor('g10')).toBe('light')
  })
})

describe('createSemioticTheme', () => {
  it('takes colours from Carbon tokens', () => {
    const t = createSemioticTheme('g100')
    expect(t.mode).toBe('dark')
    expect(t.colors.background).toBe(tokens.g100.background)
    expect(t.colors.text).toBe(tokens.g100.textPrimary)
  })

  it('defaults to the white theme', () => {
    expect(createSemioticTheme().mode).toBe('light')
  })
})

describe('createBarProps', () => {
  it('keeps only scalar numeric rows', () => {
    const props = createBarProps(data)
    expect(props.data).toEqual([
      { group: 'Qty', value: 65000 },
      { group: 'More', value: 29123 },
    ])
  })

  it('uses the same N-optimised colours as the ECharts preset', () => {
    const props = createBarProps(data)
    const [c1, c2] = pickColors(2, 'light')
    expect(props.colorScheme).toEqual({ Qty: c1, More: c2 })
  })

  it('uses the dark palette for dark themes', () => {
    const props = createBarProps(data, { themeKey: 'g90' })
    const [c1, c2] = pickColors(2, 'dark')
    expect(props.colorScheme).toEqual({ Qty: c1, More: c2 })
  })

  it('applies per-group colour overrides', () => {
    const props = createBarProps(data, { colors: { Qty: '#123456' } })
    expect(props.colorScheme.Qty).toBe('#123456')
  })

  it('maps options to Semiotic props', () => {
    const props = createBarProps(data, {
      title: 'T',
      xLabel: 'X',
      yLabel: 'Y',
      horizontal: true,
      width: 400,
      height: 300,
    })
    expect(props).toMatchObject({
      title: 'T',
      categoryLabel: 'X',
      valueLabel: 'Y',
      orientation: 'horizontal',
      width: 400,
      height: 300,
      legendInteraction: 'none',
    })
    expect(props.valueFormat(65000)).toBe((65000).toLocaleString())
  })

  it('follows the container width unless a width is given', () => {
    const responsive = createBarProps(data)
    expect(responsive.responsiveWidth).toBe(true)
    expect('width' in responsive).toBe(false)
    expect('height' in responsive).toBe(false)

    const fixed = createBarProps(data, { width: 400 })
    expect(fixed.width).toBe(400)
    expect('responsiveWidth' in fixed).toBe(false)
  })
})

describe('createBarTableData', () => {
  it('produces Group | x-value | y-value like the ECharts simple bar', () => {
    const table = createBarTableData(createBarProps(data).data)
    expect(table.headers.map((h) => h.header)).toEqual(['Group', 'x-value', 'y-value'])
    expect(table.rows).toEqual([
      { id: '0', group: 'Qty', 'x-value': 'Qty', 'y-value': 65000 },
      { id: '1', group: 'More', 'x-value': 'More', 'y-value': 29123 },
    ])
  })
})

describe('createLineProps', () => {
  it('shapes tabular data into indexed Semiotic line data rows for discrete categories', () => {
    const props = createLineProps(lineData)
    expect(props.data).toEqual([
      { group: 'Dataset 1', x: 0, category: 'Qty', value: 34200 },
      { group: 'Dataset 1', x: 1, category: 'More', value: 23500 },
      { group: 'Dataset 2', x: 0, category: 'Qty', value: 12000 },
      { group: 'Dataset 2', x: 1, category: 'More', value: 45000 },
    ])
    expect(props.xFormat?.(0)).toBe('Qty')
    expect(props.xFormat?.(1)).toBe('More')
    expect(props.xExtent).toEqual([0, 1])
  })

  it('sets lineBy, colorBy, and colorScheme from Carbon palette', () => {
    const props = createLineProps(lineData)
    const [c1, c2] = pickColors(2, 'light')
    expect(props.lineBy).toBe('group')
    expect(props.colorBy).toBe('group')
    expect(props.colorScheme).toEqual({ 'Dataset 1': c1, 'Dataset 2': c2 })
  })

  it('sets dark palette when dark theme is requested', () => {
    const props = createLineProps(lineData, { themeKey: 'g100' })
    const [c1, c2] = pickColors(2, 'dark')
    expect(props.colorScheme).toEqual({ 'Dataset 1': c1, 'Dataset 2': c2 })
  })

  it('detects time-series scale automatically', () => {
    const props = createLineProps(timeSeriesData)
    expect(props.xScaleType).toBe('time')
  })

  it('supports step line helper', () => {
    const props = createStepLineProps(lineData)
    expect(props.curve).toBe('stepAfter')
  })

  it('supports time-series helper', () => {
    const props = createTimeSeriesLineProps(timeSeriesData)
    expect(props.xScaleType).toBe('time')
  })

  it('supports threshold reference lines, yDomain, logScale, and valueFormatter', () => {
    const props = createLineProps(lineData, {
      thresholds: [{ value: 30000, label: 'Target' }],
      yDomain: [0, 60000],
      logScale: true,
      valueFormatter: (v) => `$${v}`,
      description: 'Line chart description',
      summary: 'Line chart summary',
    })
    expect(props.annotations).toEqual([{ type: 'y-threshold', value: 30000, label: 'Target' }])
    expect(props.yExtent).toEqual([0, 60000])
    expect(props.yScaleType).toBe('log')
    expect(props.valueFormat?.(100)).toBe('$100')
    expect(props.description).toBe('Line chart description')
    expect(props.summary).toBe('Line chart summary')
  })

  it('supports legendInteraction and retains all groups in data', () => {
    const props = createLineProps(lineData, {
      legendInteraction: 'isolate',
    })
    expect(props.data).toHaveLength(4)
    expect(props.legendInteraction).toBe('isolate')
    expect(Object.keys(props.colorScheme)).toEqual(['Dataset 1', 'Dataset 2'])
  })

  it('supports axisLabelRotate by enabling autoRotate on bottom axis', () => {
    const props = createLineProps(timeSeriesData, {
      axisLabelRotate: -45,
    })
    expect(props.frameProps?.axes).toBeDefined()
    expect(props.frameProps?.axes?.[0]).toMatchObject({
      orient: 'bottom',
      autoRotate: true,
    })
  })
})

describe('createBarProps — extended options', () => {
  it('supports thresholds, yDomain, custom valueFormatter, and a11y fields', () => {
    const props = createBarProps(data, {
      thresholds: [{ value: 50000, label: 'Quota' }],
      yDomain: [0, 80000],
      valueFormatter: (v) => `${v} units`,
      description: 'Bar chart description',
      summary: 'Bar chart summary',
    })
    expect(props.annotations).toEqual([{ type: 'y-threshold', value: 50000, label: 'Quota' }])
    expect(props.valueExtent).toEqual([0, 80000])
    expect(props.valueFormat(100)).toBe('100 units')
    expect(props.description).toBe('Bar chart description')
    expect(props.summary).toBe('Bar chart summary')
  })

  it('supports bar legend interaction', () => {
    const props = createBarProps(data, {
      legendInteraction: 'highlight',
    })
    expect(props.data).toHaveLength(2)
    expect(props.legendInteraction).toBe('highlight')
    expect(Object.keys(props.colorScheme)).toEqual(['Qty', 'More'])
  })
})

describe('createLineTableData', () => {
  it('produces Group | Key | Value headers and rows', () => {
    const table = createLineTableData(createLineProps(lineData).data)
    expect(table.headers.map((h) => h.header)).toEqual(['Group', 'Key', 'Value'])
    expect(table.rows).toHaveLength(4)
    expect(table.rows[0]).toEqual({ id: '0', group: 'Dataset 1', x: 'Qty', value: 34200 })
  })
})

describe('neutral root exports', () => {
  it('exposes pickColors from the root entry', () => {
    expect(pickColors(1)).toHaveLength(1)
  })
})

describe('createSemioticTheme — full slot coverage', () => {
  it('fills the status colours from Carbon support tokens', () => {
    const t = createSemioticTheme('g100')
    expect(t.colors.success).toBe(tokens.g100.supportSuccess)
    expect(t.colors.danger).toBe(tokens.g100.supportError)
    expect(t.colors.warning).toBe(tokens.g100.supportWarning)
    expect(t.colors.info).toBe(tokens.g100.supportInfo)
  })

  it('uses the first two categorical colours as primary-adjacent palette', () => {
    const t = createSemioticTheme('white')
    expect(t.colors.secondary).toBe(t.colors.categorical[1])
  })

  it('matches the ECharts theme for tooltip shadow and legend/title sizes', () => {
    const t = createSemioticTheme()
    expect(t.tooltip.shadow).toBe('0 2px 6px rgba(0,0,0,.20)')
    expect(t.typography.legendSize).toBe(12)
    expect(t.typography.titleFontSize).toBe(14)
  })
})

const heatmapData = [
  { group: 'January', key: 'A', value: 41 },
  { group: 'January', key: 'B', value: 7 },
  { group: 'February', key: 'A', value: 16 },
  { group: 'February', key: 'B', value: 5 },
]

describe('createHeatmapProps', () => {
  it('shapes tabular matrix data into 2D indexed coordinates', () => {
    const props = createHeatmapProps(heatmapData, {
      title: 'Heatmap Matrix',
      xLabel: 'Letters',
      yLabel: 'Months',
    })
    expect(props.data).toEqual([
      { group: 'January', key: 'A', x: 0, y: 0, value: 41 },
      { group: 'January', key: 'B', x: 1, y: 0, value: 7 },
      { group: 'February', key: 'A', x: 0, y: 1, value: 16 },
      { group: 'February', key: 'B', x: 1, y: 1, value: 5 },
    ])
    expect(props.xFormat?.(0)).toBe('A')
    expect(props.xFormat?.(1)).toBe('B')
    expect(props.yFormat?.(0)).toBe('January')
    expect(props.yFormat?.(1)).toBe('February')
    expect(props.frameProps?.axes).toEqual([
      { orient: 'bottom', ticks: 2, tickValues: [0, 1] },
      { orient: 'left', ticks: 2, tickValues: [0, 1] },
    ])
  })

  it('supports custom colorScheme, valueFormatter, and a11y properties', () => {
    const props = createHeatmapProps(heatmapData, {
      colorScheme: 'purples',
      valueFormatter: (v) => `${v}%`,
      description: 'Monthly performance heatmap',
      summary: 'Summary of 2023 matrix',
    })
    expect(props.colorScheme).toBe('purples')
    expect(props.valueFormat?.(41)).toBe('41%')
    expect(props.description).toBe('Monthly performance heatmap')
    expect(props.summary).toBe('Summary of 2023 matrix')
  })
})

describe('createHeatmapTableData', () => {
  it('generates table data matching heatmap cells for toolbar table/CSV export', () => {
    const props = createHeatmapProps(heatmapData)
    const table = createHeatmapTableData(props.data)
    expect(table.headers).toEqual([
      { key: 'group', header: 'Group / Y' },
      { key: 'key', header: 'Key / X' },
      { key: 'value', header: 'Value' },
    ])
    expect(table.rows).toEqual([
      { id: '0', group: 'January', key: 'A', value: 41 },
      { id: '1', group: 'January', key: 'B', value: 7 },
      { id: '2', group: 'February', key: 'A', value: 16 },
      { id: '3', group: 'February', key: 'B', value: 5 },
    ])
  })
})
