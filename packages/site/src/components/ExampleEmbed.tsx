import React from 'react'
import type { EChartsOption } from 'echarts'
import { Compare } from './Compare'
import type { CarbonChartExample } from './CarbonChart'

// Source of every file under examples/<name>/src, loaded as raw text at build time.
const exampleSources = import.meta.glob('../../../../examples/*/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const STACKBLITZ_BASE =
  'https://stackblitz.com/github/carbon-design-system/carbon-echarts-theme/tree/main/examples'

function resolveOptionCode(example: string, variant?: string): string {
  if (variant) {
    const variantKey = Object.keys(exampleSources).find(
      (path) =>
        path.includes(`/examples/${example}/src/variants/`) && path.endsWith(`/${variant}.ts`),
    )
    if (variantKey) return exampleSources[variantKey] ?? ''
  }
  const key = Object.keys(exampleSources).find(
    (path) => path.includes(`/examples/${example}/src/`) && path.endsWith('option.ts'),
  )
  return key ? (exampleSources[key] ?? '') : ''
}

// Eager JS-value imports of all variant modules (no ?raw — real exports).
const variantModules = import.meta.glob('../../../../examples/*/src/variants/*.ts', {
  eager: true,
}) as Record<string, { option?: EChartsOption }>

function getEchartsOption(example: string, variant?: string): EChartsOption {
  if (variant) {
    const key = Object.keys(variantModules).find(
      (path) =>
        path.includes(`/examples/${example}/src/variants/`) && path.endsWith(`/${variant}.ts`),
    )
    if (key) return variantModules[key]?.option ?? {}
  }
  return {}
}

export interface ExampleEmbedProps {
  title: string
  /** Folder name under /examples, e.g. `line` */
  example: string
  /** Variant slug — appended as `?variant=<slug>` to the StackBlitz URL and used to resolve option + code */
  variant?: string
  /** Carbon Charts equivalent for parity comparison */
  carbonExample?: CarbonChartExample
  /** Vanilla class name string, e.g. 'LineChart' */
  chartClass?: string
  /** Whether this is an extended chart (no Carbon Charts equivalent) */
  extended?: boolean
}

/**
 * Thin wrapper over Compare. Resolves `echartsOption` and `optionCode` from the
 * standalone `/examples/<name>` project and delegates all rendering to Compare.
 */
export function ExampleEmbed({
  title,
  example,
  variant,
  carbonExample,
  chartClass,
  extended,
}: ExampleEmbedProps) {
  const optionCode = React.useMemo(() => resolveOptionCode(example, variant), [example, variant])
  const echartsOption = React.useMemo(() => getEchartsOption(example, variant), [example, variant])
  const stackblitzUrl = variant
    ? `${STACKBLITZ_BASE}/${example}?file=src%2FApp.tsx&query=variant%3D${encodeURIComponent(variant)}`
    : `${STACKBLITZ_BASE}/${example}?file=src%2FApp.tsx`

  return (
    <Compare
      title={title}
      echartsOption={echartsOption}
      optionCode={optionCode}
      stackblitzUrl={stackblitzUrl}
      carbonExample={carbonExample}
      chartClass={chartClass}
      extended={extended}
    />
  )
}
