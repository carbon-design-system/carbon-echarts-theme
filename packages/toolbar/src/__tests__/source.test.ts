import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  toChartSource,
  fromECharts,
  createSvgChartSource,
  mergeSvgLayers,
  downloadCSV,
  exportImage,
  type ChartSource,
} from '../index'

const table = {
  headers: [
    { key: 'id', header: 'id' },
    { key: 'group', header: 'Group' },
    { key: 'y-value', header: 'y-value' },
  ],
  rows: [
    { id: '0', group: 'A', 'y-value': 1 },
    { id: '1', group: 'B', 'y-value': 2 },
  ],
}

/** Minimal ECharts-like instance: a single category bar series. */
const fakeEChartsInstance = (dataUrl = 'data:image/png;base64,AAA') =>
  ({
    getOption: () => ({
      xAxis: [{ type: 'category', data: ['A', 'B'] }],
      yAxis: [{ type: 'value' }],
      series: [{ type: 'bar', name: 'Sales', data: [1, 2] }],
    }),
    getDataURL: vi.fn(() => dataUrl),
    getDom: () => null,
  }) as any

afterEach(() => vi.unstubAllGlobals())

describe('toChartSource', () => {
  it('passes a ChartSource through unchanged', () => {
    const source: ChartSource = { getTableData: () => table }
    expect(toChartSource(source)).toBe(source)
  })

  it('adapts an ECharts instance (table from getOption)', () => {
    const data = toChartSource(fakeEChartsInstance()).getTableData()
    expect(data?.headers.map((h) => h.header)).toEqual(['Category', 'Sales'])
    expect(data?.rows).toHaveLength(2)
  })
})

describe('fromECharts', () => {
  it('uses native getDataURL with the previous export options', () => {
    const instance = fakeEChartsInstance()
    expect(fromECharts(instance).getDataURL?.('jpeg')).toBe('data:image/png;base64,AAA')
    expect(instance.getDataURL).toHaveBeenCalledWith({
      type: 'jpeg',
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
  })
})

describe('createSvgChartSource', () => {
  it('exposes table data and has no native data URL', () => {
    const source = createSvgChartSource({ getTableData: () => table, getRoot: () => null })
    expect(source.getTableData()).toBe(table)
    expect(source.getDataURL).toBeUndefined()
    expect(source.getSvgElement?.()).toBeNull()
  })
})

describe('mergeSvgLayers', () => {
  const node = (name: string) => ({ name, cloneNode: () => node(name) })
  const layer = (id: string, names: string[]) => ({
    id,
    tagName: 'svg',
    getAttribute: () => null,
    children: names.map(node),
    cloneNode() {
      return {
        id,
        children: names.map(node),
        appendChild(c: ReturnType<typeof node>) {
          this.children.push(c)
        },
      }
    },
  })

  it('returns null when there is no svg', () => {
    expect(mergeSvgLayers(null)).toBeNull()
    expect(mergeSvgLayers({ querySelectorAll: () => [] } as any)).toBeNull()
  })

  it('skips svgs that belong to the toolbar (icons share the chart container)', () => {
    const icon = { ...layer('icon', ['path']), closest: () => ({}) }
    const marks = layer('marks', ['bars'])
    const root = { querySelectorAll: () => [icon, marks] } as any
    const merged = mergeSvgLayers(root) as any
    expect(merged.id).toBe('marks')
    expect(mergeSvgLayers({ querySelectorAll: () => [icon] } as any)).toBeNull()
  })

  it('appends later layers into the first, in paint order, without mutating sources', () => {
    const marks = layer('marks', ['bars'])
    const overlay = layer('overlay', ['axes', 'labels'])
    const root = { querySelectorAll: () => [marks, overlay] } as any
    const merged = mergeSvgLayers(root) as any
    expect(merged.children.map((c: { name: string }) => c.name)).toEqual(['bars', 'axes', 'labels'])
    expect(marks.children.map((c) => c.name)).toEqual(['bars'])
  })
})

describe('downloadCSV', () => {
  it('writes CSV from any ChartSource (id column omitted)', async () => {
    let blob: Blob | undefined
    vi.stubGlobal('URL', {
      createObjectURL: (b: Blob) => ((blob = b), 'blob:x'),
      revokeObjectURL: vi.fn(),
    })
    const anchor = { click: vi.fn(), href: '', download: '' }
    vi.stubGlobal('document', { createElement: () => anchor })

    downloadCSV({ getTableData: () => table }, 'My Chart')

    expect(anchor.download).toBe('my-chart.csv')
    expect(await blob?.text()).toBe('"Group","y-value"\n"A",1\n"B",2')
  })
})

describe('exportImage', () => {
  it('downloads the native data URL when the source provides one', () => {
    const anchor = { click: vi.fn(), href: '', download: '' }
    vi.stubGlobal('document', { createElement: () => anchor })
    exportImage(fakeEChartsInstance(), 'My Chart', 'png')
    expect(anchor.href).toBe('data:image/png;base64,AAA')
    expect(anchor.download).toBe('my-chart.png')
  })

  it('does nothing when the source has neither data URL nor svg', () => {
    const anchor = { click: vi.fn(), href: '', download: '' }
    vi.stubGlobal('document', { createElement: () => anchor })
    exportImage({ getTableData: () => table }, 'x', 'png')
    expect(anchor.click).not.toHaveBeenCalled()
  })
})
