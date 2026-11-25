import React from 'react'
import type { EChartsOption } from 'echarts'
import { Compare } from './Compare'
import type { CarbonChartExample } from './CarbonChart'

// Source of every variant file under data/echarts/<name>, loaded as raw text at build time.
const exampleSources = import.meta.glob('../data/echarts/*/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function resolveOptionCode(example: string, variant?: string): string {
  if (!variant) return ''
  const key = Object.keys(exampleSources).find(
    (path) => path.includes(`/data/echarts/${example}/`) && path.endsWith(`/${variant}.ts`),
  )
  return key ? (exampleSources[key] ?? '') : ''
}

// Eager JS-value imports of all variant modules (no ?raw — real exports).
const variantModules = import.meta.glob('../data/echarts/*/*.ts', {
  eager: true,
}) as Record<string, { option?: EChartsOption }>

function getEchartsOption(example: string, variant?: string): EChartsOption {
  if (variant) {
    const key = Object.keys(variantModules).find(
      (path) => path.includes(`/data/echarts/${example}/`) && path.endsWith(`/${variant}.ts`),
    )
    if (key) return variantModules[key]?.option ?? {}
  }
  return {}
}

export interface ExampleEmbedProps {
  title: string
  /** Folder name under `src/data/echarts`, e.g. `line` */
  example: string
  /** Variant slug — resolves the option and its source from `data/echarts/<example>/<slug>.ts` */
  variant?: string
  /** Carbon Charts equivalent for parity comparison */
  carbonExample?: CarbonChartExample
  /** Vanilla class name string, e.g. 'LineChart' */
  chartClass?: string
  /** Whether this is an extended chart (no Carbon Charts equivalent) */
  extended?: boolean
}

/**
 * Thin wrapper over Compare. Resolves `echartsOption` from `data/echarts/<name>/<variant>.ts`
 * and passes that file's source to the StackBlitz launchers (which replace the code tabs).
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
  const stackblitz = React.useMemo(
    () => (optionCode ? { title, optionSource: optionCode } : undefined),
    [title, optionCode],
  )

  return (
    <Compare
      title={title}
      echartsOption={echartsOption}
      stackblitz={stackblitz}
      carbonExample={carbonExample}
      chartClass={chartClass}
      extended={extended}
    />
  )
}
