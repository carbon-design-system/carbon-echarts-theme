import { useState, useRef, useLayoutEffect } from 'react'
import type { EChartsType } from 'echarts'
import { THEME_NAMES, tokens } from '@carbon/echarts-theme'
import type { CarbonThemeName, ThemeKey } from '@carbon/echarts-theme'
import { createChartToolbar } from '@carbon/echarts-toolbar/vanilla'
import { VARIANTS, DEFAULT_SLUG, findVariant } from './variants'
import { LineChart } from './LineChart'

const THEME_OPTIONS = Object.entries(THEME_NAMES) as [ThemeKey, CarbonThemeName][]

// Read ?variant=<slug> from the URL so the StackBlitz link can pre-select a chart.
function readVariantParam(): string {
  try {
    return new URLSearchParams(window.location.search).get('variant') ?? DEFAULT_SLUG
  } catch {
    return DEFAULT_SLUG
  }
}

export function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('white')
  const [slug, setSlug] = useState<string>(readVariantParam)
  const { background, textPrimary, borderSubtle01 } = tokens[themeKey]

  const chartWrapRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<ReturnType<typeof createChartToolbar>>(null)
  const pendingInstanceRef = useRef<EChartsType | null>(null)

  const title = findVariant(slug).label

  useLayoutEffect(() => {
    const wrap = chartWrapRef.current
    if (!wrap) return
    toolbarRef.current = createChartToolbar(wrap, null, { title, fullscreenTarget: wrap })
    if (pendingInstanceRef.current) {
      toolbarRef.current.update(pendingInstanceRef.current)
      pendingInstanceRef.current = null
    }
    return () => {
      toolbarRef.current?.destroy()
      toolbarRef.current = null
    }
  }, [title])

  function handleChartReady(inst: EChartsType) {
    if (toolbarRef.current) {
      toolbarRef.current.update(inst)
    } else {
      pendingInstanceRef.current = inst
    }
  }

  return (
    <div
      data-carbon-theme={themeKey}
      style={{
        minHeight: '100vh',
        padding: '1rem',
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        background,
        color: textPrimary,
      }}
    >
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <label>
          Chart variant{' '}
          <select value={slug} onChange={(e) => setSlug(e.target.value)}>
            {VARIANTS.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Carbon theme{' '}
          <select value={themeKey} onChange={(e) => setThemeKey(e.target.value as ThemeKey)}>
            {THEME_OPTIONS.map(([key]) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        ref={chartWrapRef}
        style={{
          position: 'relative',
          border: `1px solid ${borderSubtle01}`,
          borderRadius: 4,
          padding: '0.5rem',
        }}
      >
        <LineChart slug={slug} theme={THEME_NAMES[themeKey]} onChartReady={handleChartReady} />
      </div>
    </div>
  )
}
