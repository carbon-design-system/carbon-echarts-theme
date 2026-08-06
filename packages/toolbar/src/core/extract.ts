import type { EChartsType } from 'echarts'

export interface TableData {
  headers: Array<{ key: string; header: string }>
  rows: Array<{ id: string } & Record<string, unknown>>
}

/**
 * Extracts tabular data from a live ECharts instance.
 * Returns null when the option has no series or no data.
 *
 * Handles all ECharts series types used in this project:
 *   - Category-axis (bar, line, area, histogram, lollipop)
 *   - Coordinate (scatter, bubble, heatmap)
 *   - Boxplot  → labelled 5-number summary columns
 *   - Pie/donut → name + value columns
 *   - Gauge     → name + value (skips phantom/label series)
 *   - Radar     → group per series, one column per indicator
 *   - Treemap / Tree → flattened leaf rows (name + value / path)
 *   - Graph (network) → reads `links` like sankey
 *   - Sankey/alluvial → reads `links` (source / target / value)
 *   - WordCloud → name + value (drops textStyle objects)
 */
export function buildTableData(instance: EChartsType): TableData | null {
  const option = instance.getOption() as any
  if (!option) return null

  const series: any[] = Array.isArray(option.series) ? option.series : []
  if (!series.length) return null

  // ── Per-type extractors ───────────────────────────────────────────────────

  const type0: string = (series[0]?.type ?? '').toLowerCase()

  // Radar — special top-level `radar.indicator` config
  if (type0 === 'radar') {
    return extractRadar(option, series)
  }

  // Treemap / Tree — hierarchical; flatten to leaf rows
  if (type0 === 'treemap') {
    return extractHierarchy(series)
  }
  if (type0 === 'tree') {
    return extractHierarchy(series)
  }

  // Gauge — read only the first real data point; skip phantom/label series
  if (type0 === 'gauge') {
    return extractGauge(series)
  }

  // Sankey / Graph (network) — read `links` not `data`
  if (type0 === 'sankey' || type0 === 'graph') {
    return extractLinks(series)
  }

  // Heatmap — data is [xIdx, yIdx, value]; resolve category labels from axes
  if (type0 === 'heatmap') {
    const xAxisArr: any[] = Array.isArray(option.xAxis)
      ? option.xAxis
      : option.xAxis
        ? [option.xAxis]
        : []
    const yAxisArr: any[] = Array.isArray(option.yAxis)
      ? option.yAxis
      : option.yAxis
        ? [option.yAxis]
        : []
    return extractHeatmap(
      series,
      xAxisArr[0]?.data ?? [],
      yAxisArr[0]?.data ?? [],
      xAxisArr[0]?.name,
      yAxisArr[0]?.name,
    )
  }

  // Category axis present → wide pivot
  const xAxis: any[] = Array.isArray(option.xAxis)
    ? option.xAxis
    : option.xAxis
      ? [option.xAxis]
      : []
  const yAxis: any[] = Array.isArray(option.yAxis)
    ? option.yAxis
    : option.yAxis
      ? [option.yAxis]
      : []

  const categoryAxis =
    xAxis.find((a: any) => a?.type === 'category') ?? yAxis.find((a: any) => a?.type === 'category')
  const categoryData: string[] = categoryAxis?.data ?? []

  const timeAxis =
    xAxis.find((a: any) => a?.type === 'time') ?? yAxis.find((a: any) => a?.type === 'time')

  // Filter to only real (non-phantom/hidden) series for the table
  const visibleSeries = series.filter(
    (s: any) =>
      !s.silent &&
      s.type !== 'scatter' && // lollipop dot overlay — skip
      (s.data?.length || s.links?.length),
  )

  // Boxplot — intercept before category-axis pivot; needs categoryData from above
  if (type0 === 'boxplot') {
    return extractBoxplot(series, categoryData)
  }

  // Lollipop — alternating scatter (dot) + bar (silent stick) pairs per group.
  // Detected when series alternate scatter/bar and the bar series are all silent.
  const isLollipop =
    type0 === 'scatter' &&
    series.length >= 2 &&
    series.every((s: any, i: number) =>
      i % 2 === 0
        ? (s.type ?? '').toLowerCase() === 'scatter'
        : (s.type ?? '').toLowerCase() === 'bar' && s.silent === true,
    )

  if (isLollipop) {
    const xAxisObj = xAxis[0]
    const yAxisObj = yAxis[0]
    // The category axis may be x (vertical lollipop) or y (horizontal)
    const catAxis = xAxisObj?.type === 'category' ? xAxisObj : yAxisObj
    const valAxis = xAxisObj?.type === 'value' ? xAxisObj : yAxisObj
    const xColName: string = catAxis?.name || 'x-value'
    const yColName: string = valAxis?.name || 'y-value'
    const cats: string[] = catAxis?.data ?? categoryData
    return extractLollipop(series, cats, xColName, yColName, catAxis === yAxisObj)
  }

  // Histogram — bar chart where the last category is a closing boundary (null data)
  // Detected when: all visible bar series have null as their last data entry.
  const isHistogram =
    type0 === 'bar' &&
    categoryData.length >= 2 &&
    (visibleSeries.length ? visibleSeries : series).every((s: any) => {
      const d: unknown[] = s.data ?? []
      const last = d[d.length - 1]
      return (
        last === null ||
        last === undefined ||
        (typeof last === 'object' && (last as any)?.value == null)
      )
    })

  if (isHistogram) {
    return extractHistogram(categoryData, visibleSeries.length ? visibleSeries : series)
  }

  // Discrete category-axis line (and area) — emit long format matching Carbon Charts.
  // Line series data items are objects { name, value } (produced by groupByGroup).
  // Bar charts use the wide pivot instead, so we gate on type === 'line'.
  const allLineType = (visibleSeries.length ? visibleSeries : series).every(
    (s: any) => (s.type ?? '').toLowerCase() === 'line',
  )

  if (allLineType && categoryData.length) {
    const xTitle: string | undefined = categoryAxis?.name || undefined
    const valueAxis = yAxis.find((a: any) => a?.type === 'value' || !a?.type) ?? yAxis[0]
    const yTitle: string | undefined =
      (Array.isArray(valueAxis) ? valueAxis[0] : valueAxis)?.name || undefined
    return extractCategoryAxisLong(visibleSeries.length ? visibleSeries : series, xTitle, yTitle)
  }

  // Scatter / bubble — all series are scatter type with numeric or string x values.
  // Intercept here so we have access to axis names for column headers.
  const allScatterType = series.every((s: any) => (s.type ?? '').toLowerCase() === 'scatter')

  if (allScatterType) {
    // Resolve axis name labels: prefer axis.name; fall back to generic labels
    const xAxisObj = xAxis[0]
    const yAxisObj = yAxis[0]
    const xName: string = xAxisObj?.name || 'x-value'
    const yName: string = yAxisObj?.name || 'y-value'
    return extractScatterBubble(series, xName, yName)
  }

  // If all series are pie/wordcloud — use flat extractor
  const allFlat = series.every((s: any) =>
    ['pie', 'wordcloud'].includes((s.type ?? '').toLowerCase()),
  )

  if (categoryData.length && !allFlat) {
    const activeSeries = visibleSeries.length ? visibleSeries : series
    const types = new Set(activeSeries.map((s: any) => (s.type ?? '').toLowerCase()))
    const isCombo = types.size > 1

    if (isCombo) {
      // Combo chart: mixed series types — emit long format matching Carbon Charts
      // Group | <xAxisName> | <primaryValName> | <secondaryValName>
      const xTitle: string | undefined = categoryAxis?.name || undefined
      const primaryAxis = yAxis.find((a: any) => a?.type === 'value' || !a?.type)
      const secondaryAxis = yAxis.length > 1 ? yAxis[1] : undefined
      const primaryName: string | undefined = primaryAxis?.name || undefined
      const secondaryName: string | undefined = secondaryAxis?.name || undefined
      return extractComboLong(activeSeries, categoryData, xTitle, primaryName, secondaryName)
    }

    const categoryAxisName: string | undefined = categoryAxis?.name || undefined
    return extractCategoryAxis(categoryData, activeSeries, categoryAxisName)
  }

  // Time axis → long-format table with Group / date / value columns
  if (timeAxis) {
    const xTitle: string | undefined = timeAxis.name || undefined
    const valueAxis = yAxis.find((a: any) => a?.type === 'value' || !a?.type) ?? yAxis[0]
    const yTitle: string | undefined = valueAxis?.name || undefined
    return extractTimeSeries(visibleSeries.length ? visibleSeries : series, xTitle, yTitle)
  }

  // Pie / donut
  if (type0 === 'pie') {
    return extractPie(series)
  }

  // Flat coordinate (heatmap, wordcloud)
  return extractFlat(series)
}

// ── Time-axis long-format (line / area time-series) ──────────────────────────

/**
 * Extracts time-series data as a long-format table with three columns:
 *   Group | <xAxisTitle or "Date"> | <yAxisLabel or "Value">
 *
 * Each series contributes one row per data point. Series data items are
 * expected to be [timestamp, value] tuples (as produced by createAreaOptions /
 * createLineOptions when timeSeries:true).
 */
function extractTimeSeries(series: any[], xTitle?: string, yTitle?: string): TableData | null {
  const dateKey = xTitle ?? 'Date'
  const valueKey = yTitle ?? 'Value'
  const rows: Array<{ id: string } & Record<string, unknown>> = []

  for (const s of series) {
    const groupName: string = s.name ?? ''
    const pts: any[] = s.data ?? []
    for (const pt of pts) {
      let x: unknown
      let y: unknown
      if (Array.isArray(pt)) {
        x = pt[0]
        y = pt[1]
      } else if (pt !== null && typeof pt === 'object') {
        x = (pt as any).name ?? (pt as any).value?.[0] ?? null
        y = Array.isArray((pt as any).value) ? (pt as any).value[1] : ((pt as any).value ?? null)
      } else {
        x = null
        y = pt
      }

      // Format timestamp as a human-readable date if it looks like one.
      // Use timeZone:'UTC' so that ISO date strings like '2023-01-01' (which are
      // parsed as UTC midnight) don't shift to the previous day in behind-UTC locales.
      let dateStr: unknown = x
      if (
        typeof x === 'number' ||
        (typeof x === 'string' && !Number.isNaN(Date.parse(x as string)))
      ) {
        const parsed = new Date(x as number | string)
        if (!Number.isNaN(parsed.getTime())) {
          // Use UTC for pure date strings (no time component); use local time for timestamps
          const isDateOnly = typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)
          dateStr = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(isDateOnly ? { timeZone: 'UTC' } : {}),
          }).format(parsed)
        }
      }

      const row: { id: string } & Record<string, unknown> = {
        id: String(rows.length),
        group: groupName,
      }
      row[dateKey] = dateStr
      row[valueKey] = y
      rows.push(row)
    }
  }

  if (!rows.length) return null

  const headers = [
    { key: 'group', header: 'Group' },
    { key: dateKey, header: dateKey },
    { key: valueKey, header: valueKey },
  ]
  return { headers, rows }
}

// ── Histogram wide pivot (Range header, bin-range labels) ─────────────────────

/**
 * Extracts histogram data with range labels matching Carbon Charts' output.
 * The category axis contains bin-start values plus a closing boundary as the
 * last entry (e.g. ["20","25",…,"85","90"]). Each bin becomes a "start – end"
 * range label. The last category (closing boundary) is omitted as all series
 * have null data there.
 */
function extractHistogram(categoryData: string[], series: any[]): TableData | null {
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

// ── Category-axis long format (line discrete) ─────────────────────────────────

/**
 * Extracts discrete category-axis line data as long-format matching Carbon Charts:
 *   Group | <xAxisTitle> | <yAxisTitle>
 *
 * Each series contributes one row per data point. Series data items are
 * expected to be { name, value } objects (as produced by createLineOptions).
 */
function extractCategoryAxisLong(
  series: any[],
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
    for (const item of data) {
      let xVal: unknown
      let yVal: unknown
      if (Array.isArray(item)) {
        xVal = item[0]
        yVal = item[1]
      } else if (item !== null && typeof item === 'object') {
        xVal = item.name ?? item.x ?? null
        yVal = item.value ?? item.y ?? null
      } else {
        yVal = item
      }
      if (yVal === null || yVal === undefined) continue
      rows.push({ id: String(rowId++), group: groupName, [xKey]: xVal ?? null, [yKey]: yVal })
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
function extractComboLong(
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

function extractCategoryAxis(
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

// ── Pie / donut ───────────────────────────────────────────────────────────────

function extractPie(series: any[]): TableData | null {
  // Use only the first non-phantom series (phantom donut has radius[0]===radius[1])
  const mainSeries =
    series.find((s: any) => {
      if ((s.type ?? '').toLowerCase() !== 'pie') return false
      const r = s.radius
      if (!Array.isArray(r)) return true
      return r[0] !== r[1]
    }) ?? series.find((s: any) => (s.type ?? '').toLowerCase() === 'pie')

  if (!mainSeries?.data?.length) return null

  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ]
  const rows = (mainSeries.data as any[]).map((d: any, i: number) => ({
    id: String(i),
    name: String(d.name ?? ''),
    value: d.value ?? null,
  }))
  return { headers, rows }
}

// ── Gauge ─────────────────────────────────────────────────────────────────────

function extractGauge(series: any[]): TableData | null {
  // Real gauge series have a visible axisLine or progress — skip phantom series
  // that exist only for delta labels (they have progress/axisLine with show:false)
  const real = series.filter(
    (s: any) =>
      (s.type ?? '').toLowerCase() === 'gauge' &&
      s.data?.length &&
      (s.axisLine?.show !== false || s.progress?.show !== false),
  )
  if (!real.length) {
    // Fallback: first gauge series with data
    const first = series.find(
      (s: any) => (s.type ?? '').toLowerCase() === 'gauge' && s.data?.length,
    )
    if (!first) return null
    real.push(first)
  }

  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ]
  const rows: Array<{ id: string } & Record<string, unknown>> = []
  real.forEach((s: any) => {
    ;(s.data as any[]).forEach((d: any, i: number) => {
      rows.push({
        id: String(rows.length + i),
        name: String(d.name ?? ''),
        value: d.value ?? null,
      })
    })
  })
  return rows.length ? { headers, rows } : null
}

// ── Radar ─────────────────────────────────────────────────────────────────────

function extractRadar(option: any, series: any[]): TableData | null {
  const radarConfig = Array.isArray(option.radar) ? option.radar[0] : option.radar
  const indicators: string[] = (radarConfig?.indicator ?? []).map(
    (ind: any) => ind.name ?? ind.text ?? '',
  )

  const radarSeries = series.filter((s: any) => (s.type ?? '').toLowerCase() === 'radar')
  if (!radarSeries.length) return null

  const headers = [
    { key: 'group', header: 'Group' },
    ...indicators.map((ind) => ({ key: ind, header: ind })),
  ]

  const rows: Array<{ id: string } & Record<string, unknown>> = []
  radarSeries.forEach((s: any, si: number) => {
    ;(s.data as any[]).forEach((d: any, di: number) => {
      const values: number[] = Array.isArray(d.value) ? d.value : []
      const row: { id: string } & Record<string, unknown> = {
        id: `${si}-${di}`,
        group: String(d.name ?? s.name ?? `Series ${si + 1}`),
      }
      indicators.forEach((ind, ii) => {
        row[ind] = values[ii] ?? null
      })
      rows.push(row)
    })
  })
  return rows.length ? { headers, rows } : null
}

// ── Treemap / Tree: flatten hierarchy to leaf rows ────────────────────────────

function flattenHierarchy(nodes: any[], rows: Array<Record<string, unknown>>, parentPath: string) {
  for (const node of nodes) {
    const path = parentPath ? `${parentPath} > ${node.name}` : String(node.name ?? '')
    if (node.children?.length) {
      flattenHierarchy(node.children, rows, path)
    } else {
      rows.push({ path, value: node.value ?? null })
    }
  }
}

function extractHierarchy(series: any[]): TableData | null {
  const s = series[0]
  if (!s?.data?.length) return null

  const rawRows: Array<Record<string, unknown>> = []
  flattenHierarchy(Array.isArray(s.data) ? s.data : [s.data], rawRows, '')

  const headers = [
    { key: 'path', header: 'Path' },
    { key: 'value', header: 'Value' },
  ]
  const rows = rawRows.map((r, i) => ({ id: String(i), ...r }))
  return rows.length ? { headers, rows } : null
}

// ── Graph / Sankey: read `links` ──────────────────────────────────────────────

function extractLinks(series: any[]): TableData | null {
  const allLinks: any[] = series.flatMap((s: any) => s.links ?? [])
  if (!allLinks.length) return null

  const colKeys = Array.from(new Set(allLinks.flatMap(Object.keys))).filter(
    (k) => typeof allLinks[0][k] !== 'object',
  )
  const headers = colKeys.map((k) => ({ key: k, header: k }))
  const rows = allLinks.map((link: any, i: number) => {
    const row: { id: string } & Record<string, unknown> = { id: String(i) }
    colKeys.forEach((k) => {
      const v = link[k]
      row[k] = v !== null && typeof v === 'object' ? JSON.stringify(v) : v
    })
    return row
  })
  return { headers, rows }
}

// ── Boxplot ───────────────────────────────────────────────────────────────────

/**
 * Extracts boxplot data matching Carbon Charts' tabular format:
 *   Group | Minimum | Q1 | Median | Q3 | Maximum | IQR | Outlier(s)
 *
 * ECharts boxplot series data is [min, Q1, median, Q3, max] tuples.
 * IQR is computed as Q3 - Q1. Outlier(s) come from a companion scatter
 * series (type: 'scatter') that ECharts renders alongside the boxplot.
 */
function extractBoxplot(series: any[], categoryData: string[]): TableData | null {
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

// ── Scatter / bubble ──────────────────────────────────────────────────────────

/**
 * Extracts scatter/bubble data as a long-format table:
 *   Group | <xAxisName> | <yAxisName> [| Size]
 *
 * Each series contributes one row per data point. Series data items are
 * [x, y] pairs (scatter) or [x, y, size] triples (bubble).
 * The column headers use the axis names set on the ECharts option.
 */
function extractScatterBubble(series: any[], xName: string, yName: string): TableData | null {
  const rows: Array<{ id: string } & Record<string, unknown>> = []
  let hasSize = false

  for (const s of series) {
    const groupName: string = s.name ?? ''
    const pts: any[] = s.data ?? []
    for (const pt of pts) {
      let x: unknown, y: unknown, size: unknown
      if (Array.isArray(pt)) {
        x = pt[0]
        y = pt[1]
        if (pt.length > 2) {
          size = pt[2]
          hasSize = true
        }
      } else if (pt !== null && typeof pt === 'object') {
        const v = (pt as any).value
        if (Array.isArray(v)) {
          x = v[0]
          y = v[1]
          if (v.length > 2) {
            size = v[2]
            hasSize = true
          }
        } else {
          x = v
          y = null
        }
      } else {
        x = pt
        y = null
      }
      const row: { id: string } & Record<string, unknown> = {
        id: String(rows.length),
        group: groupName,
        [xName]: x,
        [yName]: y,
      }
      if (size !== undefined) row['size'] = size
      rows.push(row)
    }
  }

  if (!rows.length) return null

  const headers = [
    { key: 'group', header: 'Group' },
    { key: xName, header: xName },
    { key: yName, header: yName },
    ...(hasSize ? [{ key: 'size', header: 'Size' }] : []),
  ]
  return { headers, rows }
}

// ── Flat coordinate (heatmap, wordcloud) ──────────────────────────────────────

// ── Lollipop ──────────────────────────────────────────────────────────────────

/**
 * Extracts lollipop data as a long-format table: Group | <xCol> | <yCol>
 *
 * Lollipop series alternate scatter (dot) / bar (silent stick) pairs.
 * Each scatter series has data as [catIdx, value] (vertical) or [value, catIdx]
 * (horizontal). We read only the scatter series and resolve catIdx → label.
 */
function extractLollipop(
  series: any[],
  cats: string[],
  xColName: string,
  yColName: string,
  horizontal: boolean,
): TableData | null {
  const rows: Array<{ id: string } & Record<string, unknown>> = []
  let rowId = 0

  // Scatter series are at even indices (0, 2, 4, ...)
  for (let i = 0; i < series.length; i += 2) {
    const s = series[i]
    const groupName: string = s.name ?? `Series ${i / 2 + 1}`
    const raw: any[] = s.data ?? []
    for (const d of raw) {
      const tuple = Array.isArray(d) ? d : null
      if (!tuple) continue
      // vertical: [catIdx, value]; horizontal: [value, catIdx]
      const catIdx = horizontal ? tuple[1] : tuple[0]
      const val = horizontal ? tuple[0] : tuple[1]
      const catLabel = typeof catIdx === 'number' ? (cats[catIdx] ?? catIdx) : catIdx
      rows.push({
        id: String(rowId++),
        group: groupName,
        [xColName]: catLabel,
        [yColName]: val,
      })
    }
  }

  if (!rows.length) return null

  return {
    headers: [
      { key: 'group', header: 'Group' },
      { key: xColName, header: xColName },
      { key: yColName, header: yColName },
    ],
    rows,
  }
}

// ── Heatmap ───────────────────────────────────────────────────────────────────

/**
 * Extracts heatmap data as a long-format table with three columns:
 *   <xAxisName | "Category"> | <yAxisName | "Group"> | Value
 *
 * ECharts heatmap series data is stored as [xCatIdx, yCatIdx, value] tuples.
 * This function resolves the indices back to their category label strings using
 * the xAxis.data and yAxis.data arrays from the chart option.
 */
function extractHeatmap(
  series: any[],
  xCats: string[],
  yCats: string[],
  xName?: string,
  yName?: string,
): TableData | null {
  const colX = xName || 'Category'
  const colY = yName || 'Group'
  const colVal = 'Value'

  const allRows: Array<{ id: string } & Record<string, unknown>> = []
  let rowId = 0

  for (const s of series) {
    const raw: any[] = s.data ?? []
    for (const d of raw) {
      const tuple = Array.isArray(d) ? d : Array.isArray(d?.value) ? d.value : null
      if (!tuple) continue
      const [xi, yi, val] = tuple
      allRows.push({
        id: String(rowId++),
        [colX]: typeof xi === 'number' ? (xCats[xi] ?? xi) : xi,
        [colY]: typeof yi === 'number' ? (yCats[yi] ?? yi) : yi,
        [colVal]: val,
      })
    }
  }

  if (!allRows.length) return null

  return {
    headers: [
      { key: colX, header: colX },
      { key: colY, header: colY },
      { key: colVal, header: colVal },
    ],
    rows: allRows,
  }
}

function extractFlat(series: any[]): TableData | null {
  // Generic flat: scatter / bubble / heatmap / wordcloud
  const allRows = series.flatMap((s: any, si: number) => {
    const raw: any[] = s.data ?? []
    const seriesName = s.name ?? `Series ${si + 1}`
    return raw.map((d: any) => {
      const row: Record<string, unknown> = {}
      if (Array.isArray(d)) {
        d.forEach((v: unknown, idx: number) => {
          row[`dim${idx}`] = v
        })
      } else if (d !== null && typeof d === 'object') {
        const keys = Object.keys(d)
        if (keys.length === 1 && keys[0] === 'value') {
          // Pure { value: N } wrapper
          const unwrapped = (d as any).value
          if (Array.isArray(unwrapped)) {
            unwrapped.forEach((v: unknown, idx: number) => {
              row[`dim${idx}`] = v
            })
          } else {
            row[seriesName] = unwrapped
          }
        } else {
          // Multi-key object (e.g. wordcloud {name, value, textStyle})
          for (const [k, v] of Object.entries(d)) {
            row[k] = v !== null && typeof v === 'object' ? JSON.stringify(v) : v
          }
        }
      } else {
        row[seriesName] = d
      }
      return row
    })
  })

  if (!allRows.length) return null
  const colKeys = Array.from(new Set(allRows.flatMap(Object.keys)))
  const headers = colKeys.map((k) => ({ key: k, header: k }))
  const rows = allRows.map((r, i) => ({ id: String(i), ...r }))
  return { headers, rows }
}
