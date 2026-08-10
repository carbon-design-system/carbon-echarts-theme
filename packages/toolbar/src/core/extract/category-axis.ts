import type { TableData } from './types'

// ── Category-axis long format (line discrete) ─────────────────────────────────

/**
 * Extracts discrete category-axis line data as long-format matching Carbon Charts:
 *   Group | <xAxisTitle> | <yAxisTitle>
 *
 * Each series contributes one row per data point. Series data items are
 * expected to be { name, value } objects (as produced by createLineOptions).
 */
export function extractCategoryAxisLong(
  series: any[],
  categoryData: string[],
  xTitle?: string,
  yTitle?: string,
): TableData | null {
  const xKey = xTitle ?? 'x-value'
  const yKey = yTitle ?? 'y-value'

  const headers = [
    { key: 'group', header: 'Group' },
    { key: xKey, header: xKey },
    { key: yKey, header: yKey },
  ]

  const rows: Array<{ id: string } & Record<string, unknown>> = []
  let rowId = 0

  for (const s of series) {
    const groupName: string = s.name ?? 'Series'
    const data: any[] = s.data ?? []
    for (let idx = 0; idx < data.length; idx++) {
      const item = data[idx]
      let xVal: unknown
      let yVal: unknown
      if (Array.isArray(item)) {
        xVal = item[0]
        yVal = item[1]
      } else if (item !== null && typeof item === 'object') {
        xVal = item.name ?? item.x ?? null
        yVal = item.value ?? item.y ?? null
      } else {
        // Scalar value — x comes from the parallel categoryData array (stacked
        // time-series uses plain scalars with dates stored in categoryData).
        xVal = categoryData[idx] ?? null
        yVal = item
      }
      if (yVal === null || yVal === undefined) continue
      // Format date-like x-values the same way extractTimeSeries does
      let displayX: unknown = xVal
      if (typeof xVal === 'string' && !Number.isNaN(Date.parse(xVal))) {
        const parsed = new Date(xVal)
        if (!Number.isNaN(parsed.getTime())) {
          const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(xVal)
          displayX = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(isDateOnly ? { timeZone: 'UTC' } : {}),
          }).format(parsed)
        }
      }
      rows.push({ id: String(rowId++), group: groupName, [xKey]: displayX ?? null, [yKey]: yVal })
    }
  }

  if (!rows.length) return null
  return { headers, rows }
}

// ── Combo long format (mixed series types on category axis) ──────────────────

/**
 * Emits long-format rows matching Carbon Charts' combo tabular output:
 *   Group | <xAxisName> | <primaryValueName> | <secondaryValueName>
 *
 * Each series contributes one row per category. Series on yAxisIndex 1 populate
 * the secondary value column; all others populate the primary value column.
 * The other column gets null (rendered as "–" in the table).
 */
export function extractComboLong(
  series: any[],
  categoryData: string[],
  xTitle?: string,
  primaryName?: string,
  secondaryName?: string,
): TableData | null {
  const xKey = xTitle ?? 'Category'
  const priKey = primaryName ?? 'Value'
  const secKey = secondaryName ?? (primaryName ? 'Secondary value' : 'Value 2')

  // Only add the secondary column if there are actually secondary-axis series
  const hasSecondary = series.some((s: any) => (s.yAxisIndex ?? 0) === 1)

  const headers: Array<{ key: string; header: string }> = [
    { key: 'group', header: 'Group' },
    { key: xKey, header: xKey },
    { key: priKey, header: priKey },
    ...(hasSecondary ? [{ key: secKey, header: secKey }] : []),
  ]

  const rows: Array<{ id: string } & Record<string, unknown>> = []
  let rowId = 0

  for (const s of series) {
    const groupName: string = s.name ?? 'Series'
    const isSecondary = (s.yAxisIndex ?? 0) === 1
    const data: any[] = s.data ?? []

    categoryData.forEach((cat, ci) => {
      const raw = data[ci]
      let val: unknown = raw
      if (raw !== null && raw !== undefined && typeof raw === 'object' && !Array.isArray(raw)) {
        val = (raw as any).value ?? null
      }
      if (Array.isArray(val)) val = val[1] ?? val[0]
      if (val !== null && typeof val === 'object') val = JSON.stringify(val)

      const row: { id: string } & Record<string, unknown> = {
        id: String(rowId++),
        group: groupName,
        [xKey]: cat,
        [priKey]: isSecondary ? null : (val ?? null),
        ...(hasSecondary ? { [secKey]: isSecondary ? (val ?? null) : null } : {}),
      }
      rows.push(row)
    })
  }

  if (!rows.length) return null
  return { headers, rows }
}

// ── Category-axis wide pivot ──────────────────────────────────────────────────

export function extractCategoryAxis(
  categoryData: string[],
  series: any[],
  categoryAxisName?: string,
): TableData | null {
  // Detect the "simple discrete bar" pattern: N series where each series has
  // exactly one non-null data point at the index matching its own name.
  // This is produced by createBarOptions when resolvedXField === 'group',
  // and results in a sparse pivot matrix. Emit long format instead so the
  // table matches Carbon Charts' Group | x-value | y-value output.
  const isSimpleDiscrete =
    series.length > 1 &&
    series.every((s: any, si: number) => {
      const nonNulls = (s.data ?? []).filter(
        (d: any) =>
          d !== null && d !== undefined && (typeof d !== 'object' || (d as any).value !== null),
      )
      return nonNulls.length === 1 && categoryData[si] === (s.name ?? '')
    })

  if (isSimpleDiscrete) {
    const rows = series.map((s: any, si: number) => {
      const raw = s.data?.find(
        (d: any) =>
          d !== null && d !== undefined && (typeof d !== 'object' || (d as any).value !== null),
      )
      let val: unknown =
        raw !== null && raw !== undefined && typeof raw === 'object' && !Array.isArray(raw)
          ? ((raw as any).value ?? null)
          : raw
      if (Array.isArray(val)) val = val[1] ?? val[0]
      const groupName: string = s.name ?? `Series ${si + 1}`
      return { id: String(si), group: groupName, 'x-value': groupName, 'y-value': val ?? null }
    })
    return {
      headers: [
        { key: 'group', header: 'Group' },
        { key: 'x-value', header: 'x-value' },
        { key: 'y-value', header: 'y-value' },
      ],
      rows,
    }
  }

  const catHeader = categoryAxisName ?? 'Category'
  const seriesNames = series.map((s: any, i: number) => s.name ?? `Series ${i + 1}`)
  const headers = [
    { key: 'category', header: catHeader },
    ...seriesNames.map((n) => ({ key: n, header: n })),
  ]
  const rows = categoryData.map((cat, ci) => {
    const row: { id: string } & Record<string, unknown> = { id: String(ci), category: cat }
    series.forEach((s: any, si: number) => {
      const raw = s.data?.[ci]
      let val: unknown = raw
      if (raw !== null && raw !== undefined && typeof raw === 'object' && !Array.isArray(raw)) {
        val = (raw as any).value ?? null
      }
      if (Array.isArray(val)) {
        val = val[1] ?? val[0]
      }
      if (val !== null && typeof val === 'object') val = JSON.stringify(val)
      row[seriesNames[si]] = val ?? null
    })
    return row
  })
  return { headers, rows }
}
