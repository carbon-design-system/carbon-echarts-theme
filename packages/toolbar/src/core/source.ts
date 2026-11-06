import type { EChartsType } from 'echarts'
import { buildTableData } from './extract'
import type { TableData } from './extract/types'

/**
 * Renderer-neutral description of a chart, as the toolbar needs it.
 *
 * The toolbar never talks to a charting library directly. It asks a
 * `ChartSource` for the chart's tabular data (table modal, CSV) and for an
 * image (PNG/JPG). ECharts instances are adapted automatically; any other
 * library (Semiotic, Plot, …) implements this interface.
 */
export interface ChartSource {
  /** Tabular data for the table modal and CSV export. `null` when there is nothing to show. */
  getTableData(): TableData | null
  /**
   * Optional. Return a PNG/JPEG data URL when the renderer can produce one natively
   * (e.g. canvas). Return `undefined` to fall back to rasterising `getSvgElement()`.
   */
  getDataURL?(type: 'png' | 'jpeg'): string | undefined
  /** Optional. Single `<svg>` element to rasterise when `getDataURL` is absent or unavailable. */
  getSvgElement?(): SVGSVGElement | null
}

/** What the toolbar accepts: an ECharts instance (unchanged behaviour) or a `ChartSource`. */
export type ChartSourceInput = EChartsType | ChartSource

function isChartSource(input: ChartSourceInput): input is ChartSource {
  return typeof (input as ChartSource).getTableData === 'function'
}

/** Adapts an ECharts instance to a `ChartSource`. */
export function fromECharts(instance: EChartsType): ChartSource {
  return {
    getTableData: () => buildTableData(instance),
    getDataURL: (type) =>
      instance.getDataURL({ type, pixelRatio: 2, backgroundColor: '#ffffff' }) || undefined,
    getSvgElement: () =>
      ((instance as any).getDom?.() as HTMLElement | null)?.querySelector('svg') ?? null,
  }
}

/** Normalises a toolbar input to a `ChartSource`. */
export function toChartSource(input: ChartSourceInput): ChartSource {
  return isChartSource(input) ? input : fromECharts(input)
}

const CSS_VAR = /var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g

/**
 * A standalone SVG rasterised through `<img>` cannot see the page's CSS custom
 * properties or inherited fonts. Replace each `var(--x, fallback)` with its
 * computed value so the exported image keeps the chart's theme.
 */
function inlineCssVars(el: Element, computed: CSSStyleDeclaration): void {
  for (const attr of Array.from(el.attributes)) {
    if (!attr.value.includes('var(')) continue
    el.setAttribute(
      attr.name,
      attr.value.replace(CSS_VAR, (_, name: string, fallback?: string) => {
        return computed.getPropertyValue(name).trim() || fallback?.trim() || ''
      }),
    )
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/** Rendered size of a chart layer in CSS pixels, or `null` when it cannot be measured. */
function layerSize(el: Element): { width: number; height: number } | null {
  const rect = el.getBoundingClientRect?.()
  if (rect && rect.width > 0 && rect.height > 0) return { width: rect.width, height: rect.height }
  const width = parseFloat(el.getAttribute('width') ?? '')
  const height = parseFloat(el.getAttribute('height') ?? '')
  return width > 0 && height > 0 ? { width, height } : null
}

/** Wraps a canvas layer as an SVG `<image>` so it can be painted inside the merged SVG. */
function canvasToSvgImage(canvas: HTMLCanvasElement): SVGImageElement | null {
  const size = layerSize(canvas)
  if (!size) return null
  let dataUrl: string
  try {
    dataUrl = canvas.toDataURL('image/png')
  } catch {
    return null // tainted canvas: skip the layer rather than fail the export
  }
  const image = document.createElementNS(SVG_NS, 'image')
  image.setAttribute('href', dataUrl)
  image.setAttribute('x', '0')
  image.setAttribute('y', '0')
  image.setAttribute('width', String(size.width))
  image.setAttribute('height', String(size.height))
  return image
}

/**
 * Some libraries (e.g. Semiotic) draw a chart in several stacked layers: `<svg>`
 * for background, axes and labels, and a `<canvas>` for the marks. Returns one
 * `<svg>` with all layers merged in paint order, ready to rasterise. Canvas
 * layers are embedded as `<image>`. Returns `null` if `root` has no chart `<svg>`.
 *
 * The first `<svg>` is the base and must be the bottom layer; a canvas that
 * appears before it in the DOM is not supported.
 *
 * The toolbar's own icons live inside the same container, so layers inside the
 * toolbar are skipped. In a browser, the rendered size is set explicitly (the
 * layers are often sized only by CSS), and CSS variables and the inherited font
 * are inlined so the image matches the on-screen chart.
 */
export function mergeSvgLayers(root: ParentNode | null): SVGSVGElement | null {
  const layers = Array.from(root?.querySelectorAll('svg, canvas') ?? []).filter(
    (el) => !el.closest?.('.cds--cc--toolbar'),
  )
  const base = layers.find((el) => el.tagName?.toLowerCase() !== 'canvas')
  if (!base) return null

  const merged = base.cloneNode(true) as SVGSVGElement
  const baseIndex = layers.indexOf(base)
  for (const layer of layers.slice(baseIndex + 1)) {
    if (layer.tagName?.toLowerCase() === 'canvas') {
      const image = canvasToSvgImage(layer as HTMLCanvasElement)
      if (image) merged.appendChild(image)
    } else {
      Array.from(layer.children).forEach((child) => merged.appendChild(child.cloneNode(true)))
    }
  }

  const size = layerSize(base)
  if (size) {
    merged.setAttribute('width', String(size.width))
    merged.setAttribute('height', String(size.height))
    merged.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`)
  }
  if (typeof getComputedStyle === 'function' && base.isConnected) {
    const computed = getComputedStyle(base)
    merged.style.fontFamily = computed.fontFamily
    inlineCssVars(merged, computed)
    merged.querySelectorAll('*').forEach((el) => inlineCssVars(el, computed))
  }
  return merged
}

export interface SvgChartSourceOptions {
  /** Tabular data for the table modal and CSV export. */
  getTableData: () => TableData | null
  /** The element containing the rendered chart's `<svg>` layer(s). */
  getRoot: () => ParentNode | null
}

/**
 * Builds a `ChartSource` for any SVG-rendered chart. Image export rasterises
 * the (merged) SVG layers.
 *
 * @example
 * const source = createSvgChartSource({
 *   getTableData: () => ({ headers, rows }),
 *   getRoot: () => wrapRef.current,
 * })
 * createChartToolbar(wrapRef.current, source, { title: 'My chart' })
 */
export function createSvgChartSource(options: SvgChartSourceOptions): ChartSource {
  return {
    getTableData: options.getTableData,
    getSvgElement: () => mergeSvgLayers(options.getRoot()),
  }
}
