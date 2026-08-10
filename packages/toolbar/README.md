# `@carbon/echarts-toolbar`

A standalone chart toolbar for [Apache ECharts](https://echarts.apache.org) that matches the **Carbon Charts v11** visual language. Drop it onto any ECharts chart to add show-as-table, fullscreen, and export (CSV / PNG / JPG) actions — no Carbon component library required at runtime.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](../../LICENSE)
[![npm](https://img.shields.io/npm/v/@carbon/echarts-toolbar)](https://www.npmjs.com/package/@carbon/echarts-toolbar)

**[→ echarts-theme.carbondesignsystem.com](https://echarts-theme.carbondesignsystem.com)**

---

## Features

- **Show as table** — opens a Carbon-styled modal with the chart data rendered as an accessible `<table>`, with a "Download as CSV" button.
- **Fullscreen** — enters / exits fullscreen on the chart wrapper; icon syncs with the browser Escape key.
- **Overflow export menu** — exports the chart as CSV, PNG, or JPG.
- **Zero Carbon runtime dependency** — all styling is self-contained CSS using `var(--cds-*)` tokens, which resolve automatically from whatever Carbon theme your app applies.
- **Framework-agnostic core** — low-level utilities (`downloadCSV`, `exportImage`, fullscreen helpers) are exported separately so you can build your own toolbar UI.

---

## Installation

```sh
npm install @carbon/echarts-toolbar
# peer dependency — install if not already present
npm install echarts
```

---

## Quick start

### 1 — Import the styles

Add the stylesheet once, typically in your app entry module:

```ts
import '@carbon/echarts-toolbar/styles'
```

### 2 — Mount the toolbar

#### `autoToolbar` (recommended)

Pass the chart wrapper element and `echarts.getInstanceByDom` — the toolbar resolves the ECharts instance automatically, even if `echarts.init` is called after `autoToolbar`.

```ts
import * as echarts from 'echarts'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'

const wrapper = document.getElementById('chart-wrapper')!

// Init chart as normal
const chart = echarts.init(wrapper)
chart.setOption({/* ... */})

// Mount toolbar — returns a cleanup function
const cleanup = autoToolbar(wrapper, echarts.getInstanceByDom, {
  title: 'Monthly Sales',
})

// Call cleanup() when the chart is removed from the DOM
```

#### `createChartToolbar` (manual)

Use this when you already hold the `EChartsType` instance and prefer explicit control:

```ts
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'

const handle = createChartToolbar(wrapper, chart, { title: 'My Chart' })

// Update instance later (e.g. after a re-init)
handle.update(newChartInstance)

// Remove toolbar and all event listeners
handle.destroy()
```

---

## Example — bar chart

```html
<!-- index.html -->
<div id="chart-wrapper" style="position: relative; width: 600px; height: 400px;"></div>
```

```ts
import * as echarts from 'echarts'
import { registerCarbonThemes } from '@carbon/echarts-theme'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
import '@carbon/echarts-toolbar/styles'

// Register the Carbon theme (optional but recommended)
registerCarbonThemes(echarts)

const wrapper = document.getElementById('chart-wrapper')!
const chart = echarts.init(wrapper, 'carbon-white')

chart.setOption({
  title: { text: 'Monthly Sales' },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Revenue',
      type: 'bar',
      data: [12000, 18500, 14200, 21000, 17300, 23800],
    },
  ],
})

// Attach the toolbar — one line
const cleanup = autoToolbar(wrapper, echarts.getInstanceByDom, {
  title: 'Monthly Sales',
})

// Cleanup when unmounting
window.addEventListener('beforeunload', cleanup)
```

The toolbar mounts itself in the top-right corner of `wrapper` and inherits the Carbon theme tokens already applied to the page.

---

## Framework adapters

### React

```tsx
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
import '@carbon/echarts-toolbar/styles'

export function BarChart() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const chart = echarts.init(wrapRef.current, 'carbon-white')
    chart.setOption({
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [120, 200, 150] }],
    })

    // autoToolbar returns the cleanup function directly — perfect for useEffect
    return autoToolbar(wrapRef.current, echarts.getInstanceByDom, {
      title: 'Monthly Sales',
    })
  }, [])

  return <div ref={wrapRef} style={{ position: 'relative', width: 600, height: 400 }} />
}
```

### Vue 3

```ts
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import { autoToolbar } from '@carbon/echarts-toolbar/vanilla'
import '@carbon/echarts-toolbar/styles'

const wrapRef = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (!wrapRef.value) return
  const chart = echarts.init(wrapRef.value, 'carbon-white')
  chart.setOption({/* ... */})
  cleanup = autoToolbar(wrapRef.value, echarts.getInstanceByDom, { title: 'My Chart' })
})

onUnmounted(() => cleanup?.())
```

---

## Core utilities (framework-agnostic)

Import the low-level utilities directly from the main entry when you want to build your own toolbar UI:

```ts
import {
  downloadCSV,
  exportImage,
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  onFullscreenChange,
} from '@carbon/echarts-toolbar'
```

| Export                                          | Description                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `downloadCSV(instance, filename)`               | Triggers a browser download of chart data as a `.csv` file.                         |
| `exportImage(instance, filename, 'png'\|'jpg')` | Downloads the chart as a PNG or JPG. Falls back to SVG→canvas for the SVG renderer. |
| `enterFullscreen(el)`                           | Requests fullscreen on an element (Safari-compatible).                              |
| `exitFullscreen()`                              | Exits fullscreen.                                                                   |
| `isFullscreen()`                                | Returns `true` when fullscreen is active.                                           |
| `onFullscreenChange(cb)`                        | Subscribes to fullscreen state changes. Returns an unsubscribe function.            |

---

## API reference

### `autoToolbar(container, getInstanceByDom, options?)`

| Parameter                  | Type                                            | Description                                                                         |
| -------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `container`                | `HTMLElement`                                   | The wrapper element that contains the ECharts canvas/SVG.                           |
| `getInstanceByDom`         | `(el: HTMLElement) => EChartsType \| undefined` | Pass `echarts.getInstanceByDom` directly.                                           |
| `options.title`            | `string`                                        | Used as the filename base for exports and the modal heading. Defaults to `'chart'`. |
| `options.fullscreenTarget` | `HTMLElement`                                   | Element to make fullscreen. Defaults to `container`.                                |

Returns `() => void` — call it to destroy the toolbar and remove all listeners.

---

### `createChartToolbar(container, instance, options?)`

Same options as `autoToolbar`. `instance` may be `null` (buttons are disabled until you call `handle.update(instance)`).

Returns a `ChartToolbarHandle`:

| Method                    | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `handle.destroy()`        | Removes the toolbar from the DOM and cleans up all listeners. |
| `handle.update(instance)` | Swaps the active ECharts instance (e.g. after a re-init).     |

---

## Styling

The toolbar uses `var(--cds-*)` CSS custom properties and resolves automatically from the Carbon theme applied to the page. No extra setup is needed if your app already loads a Carbon theme.

If you are not using Carbon elsewhere, you can still apply the White theme tokens manually:

```ts
import '@carbon/themes/css/white.css'
import '@carbon/echarts-toolbar/styles'
```

---

## License

Apache 2.0 — see [LICENSE](../../LICENSE).
