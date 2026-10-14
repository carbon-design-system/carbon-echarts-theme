// ── Framework tab IDs ─────────────────────────────────────────────────────────

export const FRAMEWORK_TABS = ['react', 'angular', 'vue', 'svelte', 'vanilla', 'data'] as const
export type FrameworkTab = (typeof FRAMEWORK_TABS)[number]

export const TAB_LABELS: Record<FrameworkTab, string> = {
  react: 'React',
  angular: 'Angular',
  vue: 'Vue',
  svelte: 'Svelte',
  vanilla: 'Vanilla JS',
  data: 'Chart data',
}

// ── Per-framework boilerplate generators ──────────────────────────────────────
// Each generator wraps the chart-specific `optionCode` block with the
// framework's component boilerplate and toolbar instantiation.

export function makeReact(optionCode: string): string {
  return `import { useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
// Import once at your app entry point:
// import '@carbon/echarts-toolbar/styles'

// Register Carbon themes once at app startup (e.g. in main.tsx / index.tsx):
// registerCarbonThemes(echarts)

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

export function makeAngular(optionCode: string): string {
  return `import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
// Import once in angular.json styles or a global scss:
// @import '@carbon/echarts-toolbar/styles'

// Register Carbon themes once at app startup (e.g. in main.ts):
// registerCarbonThemes(echarts)

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

export function makeVue(optionCode: string): string {
  return `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
// Import once in main.ts:
// import '@carbon/echarts-toolbar/styles'
// registerCarbonThemes(echarts)

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

export function makeSvelte(optionCode: string): string {
  return `<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import * as echarts from 'echarts'
  import { registerCarbonThemes } from '@carbon/echarts-theme'
  import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
  // Import once in your app entry:
  // import '@carbon/echarts-toolbar/styles'
  // registerCarbonThemes(echarts)

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

export function makeVanilla(optionCode: string): string {
  return `import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
import '@carbon/echarts-toolbar/styles'

// Register Carbon themes once at app startup:
registerCarbonThemes(echarts)

${optionCode}

const wrap  = document.getElementById('chart-wrap')   // outer div
const el    = document.getElementById('chart')        // inner chart div
const chart = echarts.init(el, 'carbon-white')
chart.setOption(option)

// ── Toolbar instantiation ──────────────────────────────────────────────────
const cleanup = autoToolbar(wrap, echarts.getInstanceByDom, { title: 'My Chart' })
// On cleanup: cleanup()`
}
