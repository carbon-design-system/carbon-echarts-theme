import React from 'react'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { Toggle } from '@carbon/react'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
import { useTheme } from './ThemeContext'
import { useCompareContext } from './CompareContext'
import { CarbonChart } from './CarbonChart'
import type { CarbonChartExample } from './CarbonChart'

// ── Framework tab IDs ─────────────────────────────────────────────────────────

const FRAMEWORK_TABS = ['react', 'angular', 'vue', 'svelte', 'vanilla', 'data'] as const
type FrameworkTab = (typeof FRAMEWORK_TABS)[number]

const TAB_LABELS: Record<FrameworkTab, string> = {
  react: 'React',
  angular: 'Angular',
  vue: 'Vue',
  svelte: 'Svelte',
  vanilla: 'Vanilla JS',
  data: 'Chart data',
}

// ── Per-framework boilerplate templates ───────────────────────────────────────
// {{OPTION_CODE}} is replaced with the chart-specific option construction block.

function makeReact(optionCode: string): string {
  return `import { useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
// Import once at your app entry point:
// import '@carbon/echarts-toolbar/styles'

${optionCode}

export function MyChart() {
  // ── Toolbar instantiation ────────────────────────────────────────────────
  const wrapRef    = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<ReturnType<typeof createChartToolbar>>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    toolbarRef.current = createChartToolbar(wrap, null, { title: 'My Chart' })
    return () => toolbarRef.current?.destroy()
  }, [])

  return (
    <div ref={wrapRef}>
      <ReactECharts
        option={option}
        theme="carbon-white"
        onChartReady={(inst) => toolbarRef.current?.update(inst)}
      />
    </div>
  )
}`
}

function makeAngular(optionCode: string): string {
  return `import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core'
import * as echarts from 'echarts'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
// Import once in angular.json styles or a global scss:
// @import '@carbon/echarts-toolbar/styles'

${optionCode}

@Component({
  selector: 'app-my-chart',
  template: '<div #wrap><div #chart style="height:400px"></div></div>',
})
export class MyChartComponent implements OnInit, OnDestroy {
  @ViewChild('wrap',  { static: true }) wrapRef!: ElementRef<HTMLDivElement>
  @ViewChild('chart', { static: true }) chartRef!: ElementRef<HTMLDivElement>

  private cleanup?: () => void

  ngOnInit() {
    const chart = echarts.init(this.chartRef.nativeElement, 'carbon-white')
    chart.setOption(option)
    // ── Toolbar instantiation ────────────────────────────────────────────────
    this.cleanup = autoToolbar(this.wrapRef.nativeElement, echarts.getInstanceByDom, { title: 'My Chart' })
  }

  ngOnDestroy() { this.cleanup?.() }
}`
}

function makeVue(optionCode: string): string {
  return `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
// Import once in main.ts:
// import '@carbon/echarts-toolbar/styles'

${optionCode}

const wrapRef  = ref<HTMLDivElement>()
const chartRef = ref<HTMLDivElement>()

// ── Toolbar instantiation ──────────────────────────────────────────────────
let cleanup: (() => void) | undefined
onMounted(() => {
  const chart = echarts.init(chartRef.value!, 'carbon-white')
  chart.setOption(option)
  cleanup = autoToolbar(wrapRef.value!, echarts.getInstanceByDom, { title: 'My Chart' })
})
onUnmounted(() => cleanup?.())
</script>

<template>
  <div ref="wrapRef">
    <div ref="chartRef" style="height: 400px" />
  </div>
</template>`
}

function makeSvelte(optionCode: string): string {
  return `<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import * as echarts from 'echarts'
  import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
  // Import once in your app entry:
  // import '@carbon/echarts-toolbar/styles'

  ${optionCode.split('\n').join('\n  ')}

  let wrapEl:  HTMLDivElement
  let chartEl: HTMLDivElement

  // ── Toolbar instantiation ──────────────────────────────────────────────────
  onMount(() => {
    const chart = echarts.init(chartEl, 'carbon-white')
    chart.setOption(option)
    return autoToolbar(wrapEl, echarts.getInstanceByDom, { title: 'My Chart' })
  })
</script>

<div bind:this={wrapEl}>
  <div bind:this={chartEl} style="height: 400px" />
</div>`
}

function makeVanilla(optionCode: string): string {
  return `import * as echarts from 'echarts'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
import '@carbon/echarts-toolbar/styles'

${optionCode}

const wrap  = document.getElementById('chart-wrap')   // outer div
const el    = document.getElementById('chart')        // inner chart div
const chart = echarts.init(el, 'carbon-white')
chart.setOption(option)

// ── Toolbar instantiation ──────────────────────────────────────────────────
const cleanup = autoToolbar(wrap, echarts.getInstanceByDom, { title: 'My Chart' })
// On cleanup: cleanup()`
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface CompareProps {
  title: string
  /** Vanilla class name string from chartTypes.vanilla, e.g. 'SimpleBarChart' */
  chartClass?: string
  /** Inline Carbon Charts example (rendered via vanilla @carbon/charts) */
  carbonExample?: CarbonChartExample
  /** ECharts option object */
  echartsOption: EChartsOption
  /** Whether this is an extended chart (no Carbon Charts equivalent) */
  extended?: boolean
  /**
   * The chart-specific option construction code shown in framework tabs.
   * Should contain imports + (abbreviated) data + createXxxOptions() call.
   * Each framework tab wraps this with its own component boilerplate + toolbar.
   */
  optionCode?: string
  /**
   * Raw chart data array shown in the "Chart data" tab as formatted JSON.
   * Pass the full unabbreviated dataset here.
   */
  chartData?: unknown[]
  /**
   * When true, renders a Carbon-matching skeleton shimmer grid over the chart.
   * Equivalent to Carbon Charts `data: { loading: true }`.
   */
  showLoading?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Compare({
  title,
  chartClass,
  carbonExample,
  echartsOption,
  extended = false,
  optionCode,
  chartData,
  showLoading = false,
}: CompareProps) {
  const { echartsTheme } = useTheme()
  const { expandAll } = useCompareContext()
  const chartWrapRef = React.useRef<HTMLDivElement>(null)
  const toolbarRef = React.useRef<ReturnType<typeof createChartToolbar>>(null)
  const [codeCopied, setCodeCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<FrameworkTab>('react')

  // `showCarbon` is derived from expandAll (page-level toggle) but can be
  // overridden locally.
  const [carbonToggle, setCarbonToggle] = React.useState<[boolean, boolean]>([expandAll, expandAll])
  const showCarbon = expandAll !== carbonToggle[0] ? expandAll : carbonToggle[1]
  function setShowCarbon(value: boolean) {
    setCarbonToggle([expandAll, value])
  }

  // Mirror the Carbon Charts height when provided
  const carbonHeight =
    carbonExample?.options && 'height' in carbonExample.options
      ? (carbonExample.options as { height?: string }).height
      : undefined
  const chartHeight = carbonHeight ?? '320px'

  const canCompare = !extended && !!carbonExample && !!chartClass

  // Mount toolbar shell. The instance is wired via onChartReady (below) once
  // ReactECharts finishes initialising, bypassing the echarts.getInstanceByDom
  // registry mismatch between the outer echarts import and the copy bundled
  // inside echarts-for-react.
  React.useEffect(() => {
    const wrap = chartWrapRef.current
    if (!wrap) return
    toolbarRef.current = createChartToolbar(wrap, null, { title, fullscreenTarget: wrap })
    return () => toolbarRef.current?.destroy()
  }, [title])

  // ── Build per-tab content ───────────────────────────────────────────────────

  const tabContent: Partial<Record<FrameworkTab, string>> = {}
  if (optionCode) {
    tabContent.react = makeReact(optionCode)
    tabContent.angular = makeAngular(optionCode)
    tabContent.vue = makeVue(optionCode)
    tabContent.svelte = makeSvelte(optionCode)
    tabContent.vanilla = makeVanilla(optionCode)
  }
  if (chartData) {
    tabContent.data = JSON.stringify(chartData, null, 2)
  }

  const visibleTabs = FRAMEWORK_TABS.filter((t) => tabContent[t] !== undefined)
  const hasCode = visibleTabs.length > 0

  // Keep activeTab in sync if the current tab disappears (e.g. no chartData)
  const resolvedTab: FrameworkTab =
    tabContent[activeTab] !== undefined ? activeTab : (visibleTabs[0] ?? 'react')

  const activeCode = tabContent[resolvedTab] ?? ''

  function handleCopyCode() {
    if (!activeCode) return
    void navigator.clipboard.writeText(activeCode).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  return (
    <div className="compare">
      <div className="compare__header">
        <h3 className="compare__title">{title}</h3>
      </div>

      {extended && (
        <div className="compare__extended-banner">
          This chart type has no Carbon Charts equivalent. Styled with{' '}
          <code>@carbon/echarts-theme</code>.
        </div>
      )}

      {/* ECharts panel — always shown */}
      <div className="compare__panel compare__panel--echarts">
        {canCompare && <div className="compare__panel-label">ECharts + carbon theme</div>}
        <div className="compare__chart-wrap" ref={chartWrapRef}>
          <ReactECharts
            option={echartsOption}
            theme={echartsTheme}
            style={{ height: chartHeight, width: '100%' }}
            opts={{ renderer: 'canvas' }}
            onChartReady={(inst) => toolbarRef.current?.update(inst)}
          />
          {showLoading && <div className="compare__skeleton" aria-hidden="true" />}
        </div>
      </div>

      {/* Compare toggle — only when a Carbon Charts equivalent exists */}
      {canCompare && (
        <div className="compare__toggle">
          <Toggle
            id={`compare-toggle-${title.replace(/\s+/g, '-').toLowerCase()}`}
            labelText="Compare with Carbon Charts"
            hideLabel
            labelA="Compare with Carbon Charts"
            labelB="Compare with Carbon Charts"
            toggled={showCarbon}
            onToggle={(checked: boolean) => setShowCarbon(checked)}
            size="sm"
          />
        </div>
      )}

      {/* Carbon Charts panel — revealed below when toggle is on */}
      {canCompare && showCarbon && carbonExample && chartClass && (
        <div className="compare__panel compare__panel--carbon">
          <div className="compare__panel-label">Carbon Charts</div>
          <div className="carbon-chart-holder">
            <CarbonChart chartClass={chartClass} example={carbonExample} />
          </div>
        </div>
      )}

      {hasCode && (
        <div className="compare__code">
          <div className="compare__code-bar">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`compare__code-tab${resolvedTab === tab ? ' compare__code-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
            <button
              type="button"
              className="compare__code-copy"
              onClick={handleCopyCode}
              aria-label="Copy code to clipboard"
            >
              {codeCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="compare__code-content">
            <code>{activeCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
