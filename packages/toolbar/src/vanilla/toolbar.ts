import type { EChartsType } from 'echarts'
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  onFullscreenChange,
} from '../core/fullscreen'
import { downloadCSV, exportImage } from '../core/export'
import { createTableModal } from './modal'
import { makeSvg, ICON_TABLE, ICON_MAXIMIZE, ICON_MINIMIZE, ICON_OVERFLOW } from './icons'

export interface ChartToolbarOptions {
  /** Used as filename base for CSV/PNG/JPG exports and the modal heading. */
  title?: string
  /**
   * The element to make fullscreen. Defaults to the toolbar's container element.
   * Typically the chart panel wrapper.
   */
  fullscreenTarget?: HTMLElement
}

/**
 * Signature of `echarts.getInstanceByDom` — resolves an ECharts instance from
 * the DOM element passed to `echarts.init`. Pass it directly from your echarts
 * import so autoToolbar never needs to import echarts itself.
 */
export type GetInstanceByDom = (el: HTMLElement) => EChartsType | undefined

export interface ChartToolbarHandle {
  /** Remove the toolbar and all event listeners from the DOM. */
  destroy(): void
  /** Re-render the toolbar (e.g. after chartInstance changes). */
  update(instance: EChartsType | null): void
}

/**
 * Mounts a Carbon-styled toolbar onto `container` for the given ECharts instance.
 * Returns a handle — call destroy() on cleanup.
 *
 * @example
 * const toolbar = createChartToolbar(wrapperEl, chartInstance, { title: 'My Chart' })
 * // on cleanup:
 * toolbar.destroy()
 */
export function createChartToolbar(
  container: HTMLElement,
  instance: EChartsType | null,
  options: ChartToolbarOptions = {},
): ChartToolbarHandle {
  const title = options.title ?? 'chart'
  const fullscreenTarget = options.fullscreenTarget ?? container

  let currentInstance = instance
  let destroyModal: (() => void) | null = null
  let menuOpen = false

  // ── Root toolbar element ───────────────────────────────────────────────────
  const toolbar = document.createElement('div')
  toolbar.className = 'cds--cc--toolbar'
  toolbar.setAttribute('role', 'toolbar')
  toolbar.setAttribute('aria-label', 'Chart controls')

  // ── Table button ───────────────────────────────────────────────────────────
  const tableBtn = makeButton('Show as table', makeSvg(ICON_TABLE))
  tableBtn.addEventListener('click', () => {
    if (!currentInstance) return
    if (destroyModal) {
      destroyModal()
      destroyModal = null
      return
    }
    destroyModal = createTableModal({
      title,
      instance: currentInstance,
      onClose: () => {
        destroyModal?.()
        destroyModal = null
      },
    })
  })

  // ── Fullscreen button ──────────────────────────────────────────────────────
  const fullscreenBtn = makeButton(
    'Make fullscreen',
    makeSvg(isFullscreen() ? ICON_MINIMIZE : ICON_MAXIMIZE),
  )
  fullscreenBtn.addEventListener('click', () => {
    if (isFullscreen()) {
      void exitFullscreen()
    } else {
      void enterFullscreen(fullscreenTarget)
    }
  })

  // Sync icon when fullscreen state changes externally (Escape key etc.)
  const unsubFullscreen = onFullscreenChange((fs) => {
    fullscreenBtn.innerHTML = makeSvg(fs ? ICON_MINIMIZE : ICON_MAXIMIZE)
    fullscreenBtn.title = fs ? 'Exit fullscreen' : 'Make fullscreen'
    fullscreenBtn.setAttribute('aria-label', fs ? 'Exit fullscreen' : 'Make fullscreen')
  })

  // ── Overflow menu ──────────────────────────────────────────────────────────
  const menuWrap = document.createElement('div')
  menuWrap.className = 'cds--cc--toolbar-overflow-wrap'
  menuWrap.style.position = 'relative'

  const overflowBtn = makeButton('More options', makeSvg(ICON_OVERFLOW))
  overflowBtn.setAttribute('aria-haspopup', 'menu')
  overflowBtn.setAttribute('aria-expanded', 'false')

  const menu = document.createElement('div')
  menu.className = 'cds--overflow-menu-options cds--overflow-menu--flip'
  menu.setAttribute('role', 'menu')

  const menuItems: Array<{ label: string; action: () => void }> = [
    {
      label: 'Export to CSV',
      action: () => {
        if (currentInstance) downloadCSV(currentInstance, title)
      },
    },
    {
      label: 'Export to PNG',
      action: () => {
        if (currentInstance) exportImage(currentInstance, title, 'png')
      },
    },
    {
      label: 'Export to JPG',
      action: () => {
        if (currentInstance) exportImage(currentInstance, title, 'jpg')
      },
    },
  ]

  const menuList = document.createElement('ul')
  menuList.style.margin = '0'
  menuList.style.padding = '0'
  menuList.style.listStyle = 'none'

  menuItems.forEach(({ label, action }) => {
    const li = document.createElement('li')
    li.className = 'cds--overflow-menu-options__option'
    li.setAttribute('role', 'menuitem')

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'cds--overflow-menu-options__btn'
    btn.textContent = label
    btn.addEventListener('click', () => {
      closeMenu()
      action()
    })

    li.appendChild(btn)
    menuList.appendChild(li)
  })

  menu.appendChild(menuList)

  function openMenu() {
    menuOpen = true
    menu.classList.add('is-open')
    overflowBtn.setAttribute('aria-expanded', 'true')
    overflowBtn.parentElement?.classList.add('cds--overflow-menu--open')
  }

  function closeMenu() {
    menuOpen = false
    menu.classList.remove('is-open')
    overflowBtn.setAttribute('aria-expanded', 'false')
    overflowBtn.parentElement?.classList.remove('cds--overflow-menu--open')
  }

  overflowBtn.addEventListener('click', (e) => {
    e.stopImmediatePropagation()
    if (menuOpen) closeMenu()
    else openMenu()
  })

  // Close when clicking outside
  const bodyClickHandler = () => closeMenu()
  document.body.addEventListener('click', bodyClickHandler)

  menuWrap.appendChild(overflowBtn)
  menuWrap.appendChild(menu)

  // ── Assemble ───────────────────────────────────────────────────────────────
  toolbar.appendChild(tableBtn)
  toolbar.appendChild(fullscreenBtn)
  toolbar.appendChild(menuWrap)
  container.appendChild(toolbar)

  // ── Handle ────────────────────────────────────────────────────────────────
  return {
    destroy() {
      destroyModal?.()
      unsubFullscreen()
      document.body.removeEventListener('click', bodyClickHandler)
      toolbar.remove()
    },
    update(newInstance: EChartsType | null) {
      currentInstance = newInstance
      tableBtn.disabled = !newInstance
      overflowBtn.disabled = !newInstance
    },
  }
}

function makeButton(label: string, svgContent: string): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'cds--overflow-menu cds--overflow-menu__trigger'
  btn.title = label
  btn.setAttribute('aria-label', label)
  btn.innerHTML = svgContent
  return btn
}

// ── autoToolbar ───────────────────────────────────────────────────────────────

/**
 * Mounts a Carbon-styled toolbar onto `container` and automatically wires it
 * to the ECharts instance that lives (or will live) inside that container.
 *
 * Pass `echarts.getInstanceByDom` as the second argument — autoToolbar uses it
 * to resolve the instance without importing echarts itself.
 *
 * Returns a cleanup function. Call it on unmount (React `useEffect` return,
 * Vue `onUnmounted`, Svelte `onDestroy`, etc.).
 *
 * @example
 * // React — one line, no instance state needed:
 * useEffect(
 *   () => autoToolbar(wrapRef.current!, echarts.getInstanceByDom, { title: 'My Chart' }),
 *   []
 * )
 *
 * @example
 * // Vanilla JS:
 * const cleanup = autoToolbar(document.getElementById('chart-wrap'), echarts.getInstanceByDom)
 * // later: cleanup()
 */
export function autoToolbar(
  container: HTMLElement,
  getInstanceByDom: GetInstanceByDom,
  options: ChartToolbarOptions = {},
): () => void {
  // Mount the toolbar shell immediately (with no instance — buttons disabled).
  const toolbar = createChartToolbar(container, null, options)

  // Try to resolve an already-initialised instance synchronously.
  // ECharts stores the instance on the canvas/SVG child element it creates
  // inside the container. If init() was called before autoToolbar(), it will
  // already be there.
  function tryResolve(): EChartsType | undefined {
    // The chart root element ECharts creates is a direct child with a canvas or
    // svg inside; getInstanceByDom accepts that child element.
    const child =
      container
        .querySelector<HTMLElement>('canvas, svg')
        ?.closest<HTMLElement>('[_echarts_instance_]') ?? // internal attribute ECharts sets
      (container.firstElementChild as HTMLElement | null) ??
      undefined
    return child ? getInstanceByDom(child) : undefined
  }

  const initial = tryResolve()
  if (initial) {
    toolbar.update(initial)
  }

  // Watch for ECharts to create its DOM child (covers the case where init()
  // is called after autoToolbar, e.g. ReactECharts lazy mount).
  let resolved = !!initial
  const observer = new MutationObserver(() => {
    if (resolved) return
    const instance = tryResolve()
    if (instance) {
      resolved = true
      toolbar.update(instance)
      observer.disconnect()
    }
  })

  if (!resolved) {
    observer.observe(container, { childList: true, subtree: true })
  }

  return () => {
    observer.disconnect()
    toolbar.destroy()
  }
}
