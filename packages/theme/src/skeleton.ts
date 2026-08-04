import { tokens } from './tokens'
import type { ThemeKey } from './tokens'

// ── Primary API ───────────────────────────────────────────────────────────────

/**
 * Overlays a Carbon Charts-matching skeleton shimmer grid on a DOM element and
 * returns a cleanup function that removes it.
 *
 * The target element must have `position: relative` (or any non-static
 * position) so the overlay can fill it.
 *
 * @example
 * ```js
 * import { showSkeleton } from '@carbon/echarts-theme/skeleton'
 *
 * const hide = showSkeleton(chartContainerEl)
 * // later, once data has loaded:
 * hide()
 * ```
 *
 * @example with echarts-for-react
 * ```jsx
 * const ref = useRef()
 * useEffect(() => {
 *   const hide = showSkeleton(ref.current, 'g90')
 *   fetchData().then(data => { setData(data); hide() })
 * }, [])
 * <div ref={ref} style={{ position: 'relative' }}>
 *   <ReactECharts option={option} theme="carbon-g90" />
 * </div>
 * ```
 */
export function showSkeleton(el: HTMLElement, theme: ThemeKey = 'white'): () => void {
  const { background, layerAccent01 } = getSkeletonTokens(theme)

  // Scoped keyframe name avoids collisions when multiple themes are on-screen.
  const keyframe = `_cc-sk-shimmer-${theme}`

  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')

  // All styles are applied inline so there is no global stylesheet to manage.
  // The ::after shimmer sweep is reproduced via a nested <span> because inline
  // styles cannot target pseudo-elements.
  const shimmer = document.createElement('span')

  Object.assign(overlay.style, {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    backgroundColor: background,
    backgroundImage: [
      `repeating-linear-gradient(to right, ${layerAccent01} 0, ${layerAccent01} 1px, transparent 1px, transparent calc(100% / 18))`,
      `repeating-linear-gradient(to bottom, ${layerAccent01} 0, ${layerAccent01} 1px, transparent 1px, transparent calc(100% / 5))`,
    ].join(', '),
    borderRight: `1px solid ${layerAccent01}`,
    borderBottom: `1px solid ${layerAccent01}`,
    pointerEvents: 'none',
    zIndex: '9999',
  })

  Object.assign(shimmer.style, {
    position: 'absolute',
    inset: '0',
    background:
      'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
    animation: `${keyframe} 2.5s infinite linear`,
  })

  // Inject the keyframe rule into a dedicated <style> tag that we own and
  // remove on cleanup — no leaking into the global stylesheet.
  const styleEl = document.createElement('style')
  styleEl.textContent = `@keyframes ${keyframe} { from { transform: translateX(-100%) } to { transform: translateX(100%) } }`

  document.head.appendChild(styleEl)
  overlay.appendChild(shimmer)
  el.appendChild(overlay)

  return () => {
    overlay.remove()
    styleEl.remove()
  }
}

// ── Lower-level utilities (for framework integrations / SSR CSS) ──────────────

/** The two Carbon token values the skeleton CSS requires. */
export interface SkeletonTokens {
  /** `--cds-background` — fills the grid backdrop */
  background: string
  /** `--cds-layer-accent-01` — colours the grid lines */
  layerAccent01: string
}

/** Returns the resolved token values for the given Carbon theme. */
export function getSkeletonTokens(theme: ThemeKey): SkeletonTokens {
  const { background, layerAccent01 } = tokens[theme]
  return { background, layerAccent01 }
}

/**
 * Returns a self-contained CSS string for the skeleton grid.
 * Useful for SSR, CSS-in-JS, or injecting a shared stylesheet once at startup.
 * For DOM usage prefer `showSkeleton()`.
 *
 * @param theme - Carbon theme key
 * @param selector - CSS selector for the skeleton element (default `.chart-skeleton`)
 */
export function createSkeletonCSS(theme: ThemeKey = 'white', selector = '.chart-skeleton'): string {
  const { background, layerAccent01 } = getSkeletonTokens(theme)
  const keyframe = `_cc-sk-shimmer-${theme}`

  return `\
@keyframes ${keyframe} {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%);  }
}
${selector} {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: ${background};
  background-image:
    repeating-linear-gradient(to right, ${layerAccent01} 0, ${layerAccent01} 1px, transparent 1px, transparent calc(100% / 18)),
    repeating-linear-gradient(to bottom, ${layerAccent01} 0, ${layerAccent01} 1px, transparent 1px, transparent calc(100% / 5));
  border-right: 1px solid ${layerAccent01};
  border-bottom: 1px solid ${layerAccent01};
  pointer-events: none;
}
${selector}::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
  animation: ${keyframe} 2.5s infinite linear;
}`
}

/** Pre-built CSS strings for all four Carbon themes. */
export const skeletonCSS: Record<ThemeKey, string> = {
  white: createSkeletonCSS('white'),
  g10: createSkeletonCSS('g10'),
  g90: createSkeletonCSS('g90'),
  g100: createSkeletonCSS('g100'),
}
