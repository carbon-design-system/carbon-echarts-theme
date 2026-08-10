import type { TableData } from './types'

// ── Boxplot ───────────────────────────────────────────────────────────────────

/**
 * Extracts boxplot data matching Carbon Charts' tabular format:
 *   Group | Minimum | Q1 | Median | Q3 | Maximum | IQR | Outlier(s)
 *
 * ECharts boxplot series data is [min, Q1, median, Q3, max] tuples.
 * IQR is computed as Q3 - Q1. Outlier(s) come from a companion scatter
 * series (type: 'scatter') that ECharts renders alongside the boxplot.
 */
export function extractBoxplot(series: any[], categoryData: string[]): TableData | null {
  const s = series.find((s: any) => (s.type ?? '').toLowerCase() === 'boxplot')
  if (!s?.data?.length) return null

  // Companion scatter series holds outlier points: each item is [catIndex, value]
  const outlierSeries = series.find((s: any) => (s.type ?? '').toLowerCase() === 'scatter')
  const outlierMap = new Map<number, number[]>()
  if (outlierSeries?.data?.length) {
    for (const pt of outlierSeries.data as any[]) {
      const [catIdx, val] = Array.isArray(pt)
        ? pt
        : [(pt as any)?.value?.[0], (pt as any)?.value?.[1]]
      if (catIdx !== undefined && val !== undefined) {
        if (!outlierMap.has(catIdx)) outlierMap.set(catIdx, [])
        outlierMap.get(catIdx)!.push(val)
      }
    }
  }

  const headers = [
    { key: 'group', header: 'Group' },
    { key: 'minimum', header: 'Minimum' },
    { key: 'q1', header: 'Q1' },
    { key: 'median', header: 'Median' },
    { key: 'q3', header: 'Q3' },
    { key: 'maximum', header: 'Maximum' },
    { key: 'iqr', header: 'IQR' },
    { key: 'outliers', header: 'Outlier(s)' },
  ]

  const rows = (s.data as any[]).map((d: any, i: number) => {
    const vals: number[] = Array.isArray(d) ? d : (d.value ?? [])
    const min = vals[0] ?? null
    const q1 = vals[1] ?? null
    const median = vals[2] ?? null
    const q3 = vals[3] ?? null
    const max = vals[4] ?? null
    const iqr = q1 !== null && q3 !== null ? q3 - q1 : null
    const outliers = outlierMap.get(i)
    const outliersStr = outliers?.length ? outliers.join(', ') : '\u2013'
    return {
      id: String(i),
      group: categoryData[i] ?? String(i),
      minimum: min,
      q1,
      median,
      q3,
      maximum: max,
      iqr,
      outliers: outliersStr,
    }
  })

  return { headers, rows }
}
