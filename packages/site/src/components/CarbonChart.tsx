import React from 'react'
import type { Chart, ChartTabularData, ChartOptions } from '@carbon/charts'
import * as Charts from '@carbon/charts'
import '@carbon/charts/styles.css'

// ── Types ─────────────────────────────────────────────────────────────────────

type ChartConstructor = new (
  holder: HTMLDivElement,
  config: { data: ChartTabularData; options: ChartOptions },
) => Chart

/**
 * Canonical example shape — matches the upstream carbon-charts docs lib exactly.
 * Each `{ data, options }` pair maps 1:1 to one rendered chart.
 */
export interface CarbonChartExample {
  data: ChartTabularData
  options: ChartOptions
  tags?: string[]
}

interface CarbonChartProps {
  /** Vanilla class name string from `chartTypes.vanilla`, e.g. `'SimpleBarChart'` */
  chartClass: string
  example: CarbonChartExample
}

/**
 * Resolves a vanilla chart class name string to its constructor.
 * All classes are imported from @carbon/charts.
 */
function resolveChartClass(name: string): ChartConstructor | null {
  const cls = (Charts as any)[name]
  return typeof cls === 'function' ? (cls as ChartConstructor) : null
}

/**
 * Renders a Carbon Charts chart using the vanilla (framework-agnostic) JS class.
 * Mirrors exactly how charts.carbondesignsystem.com renders examples inline.
 *
 * Note: Carbon Charts' destroy() removes the holder element from the DOM, which
 * breaks React StrictMode's double-invoke of effects. To work around this, we
 * keep a stable outer wrapper (wrapperRef) in React's DOM and give Carbon Charts
 * a fresh inner div each time the effect runs.
 */
export function CarbonChart({ chartClass, example }: CarbonChartProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const instanceRef = React.useRef<Chart | null>(null)

  React.useEffect(() => {
    if (!wrapperRef.current) return
    const Cls = resolveChartClass(chartClass)
    if (!Cls) {
      console.warn(`CarbonChart: unknown chart class "${chartClass}"`)
      return
    }

    // Create a fresh inner container for Carbon Charts on every effect run.
    // Carbon Charts removes the holder element on destroy(), so we must not
    // give it our React-managed node — instead give it a disposable inner div.
    const holder = document.createElement('div')
    wrapperRef.current.appendChild(holder)

    instanceRef.current = new Cls(holder, {
      data: example.data,
      options: example.options,
    })

    return () => {
      instanceRef.current?.destroy?.()
      instanceRef.current = null
      // If destroy() didn't already remove the holder, clean it up ourselves.
      holder.parentNode?.removeChild(holder)
    }
    // Re-mount when class name or data identity changes
  }, [chartClass, example.data, example.options])

  return <div ref={wrapperRef} className="carbon-chart-holder" />
}
