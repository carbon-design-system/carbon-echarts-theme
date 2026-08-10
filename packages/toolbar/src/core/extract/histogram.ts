import type { TableData } from './types'

// ── Histogram wide pivot (Range header, bin-range labels) ─────────────────────

/**
 * Extracts histogram data with range labels matching Carbon Charts' output.
 * The category axis contains bin-start values plus a closing boundary as the
 * last entry (e.g. ["20","25",…,"85","90"]). Each bin becomes a "start – end"
 * range label. The last category (closing boundary) is omitted as all series
 * have null data there.
 */
export function extractHistogram(categoryData: string[], series: any[]): TableData | null {
  if (!categoryData.length) return null

  // The real bins are all entries except the last (closing boundary)
  const binCount = categoryData.length - 1
  const seriesNames = series.map((s: any, i: number) => s.name ?? `Series ${i + 1}`)

  const headers = [
    { key: 'range', header: 'Range' },
    ...seriesNames.map((n) => ({ key: n, header: n })),
  ]

  const rows = Array.from({ length: binCount }, (_, ci) => {
    const rangeLabel = `${categoryData[ci]} – ${categoryData[ci + 1]}`
    const row: { id: string } & Record<string, unknown> = { id: String(ci), range: rangeLabel }
    series.forEach((s: any, si: number) => {
      const raw = s.data?.[ci]
      let val: unknown = raw
      if (raw !== null && raw !== undefined && typeof raw === 'object' && !Array.isArray(raw)) {
        val = (raw as any).value ?? null
      }
      if (Array.isArray(val)) val = val[1] ?? val[0]
      if (val !== null && typeof val === 'object') val = JSON.stringify(val)
      row[seriesNames[si]] = val ?? null
    })
    return row
  })

  return { headers, rows }
}
