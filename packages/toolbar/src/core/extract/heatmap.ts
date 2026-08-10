import type { TableData } from './types'

// ── Heatmap ───────────────────────────────────────────────────────────────────

/**
 * Extracts heatmap data as a long-format table with three columns:
 *   <xAxisName | "Category"> | <yAxisName | "Group"> | Value
 *
 * ECharts heatmap series data is stored as [xCatIdx, yCatIdx, value] tuples.
 * This function resolves the indices back to their category label strings using
 * the xAxis.data and yAxis.data arrays from the chart option.
 */
export function extractHeatmap(
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

// ── Flat coordinate (wordcloud, fallback) ─────────────────────────────────────

export function extractFlat(series: any[]): TableData | null {
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
