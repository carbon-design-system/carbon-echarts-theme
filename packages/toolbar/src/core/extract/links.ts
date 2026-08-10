import type { TableData } from './types'

// ── Graph / Sankey: read `links` ──────────────────────────────────────────────

export function extractLinks(series: any[]): TableData | null {
  const allLinks: any[] = series.flatMap((s: any) => s.links ?? [])
  if (!allLinks.length) return null

  // Build id→name lookup from graph node data so numeric IDs are resolved to
  // human-readable names in the tabular view (e.g. '11' → 'Valjean').
  const nodeById = new Map<string, string>()
  for (const s of series) {
    for (const node of s.data ?? []) {
      if (node?.id !== undefined && node?.name !== undefined) {
        nodeById.set(String(node.id), String(node.name))
      }
    }
  }

  const resolvedLinks = allLinks.map((link: any) => {
    const src = String(link.source ?? '')
    const tgt = String(link.target ?? '')
    return {
      ...link,
      source: nodeById.get(src) ?? src,
      target: nodeById.get(tgt) ?? tgt,
    }
  })

  const colKeys = Array.from(new Set(resolvedLinks.flatMap(Object.keys))).filter(
    (k) => typeof resolvedLinks[0][k] !== 'object',
  )
  const headers = colKeys.map((k) => ({ key: k, header: k }))
  const rows = resolvedLinks.map((link: any, i: number) => {
    const row: { id: string } & Record<string, unknown> = { id: String(i) }
    colKeys.forEach((k) => {
      const v = link[k]
      row[k] = v !== null && typeof v === 'object' ? JSON.stringify(v) : v
    })
    return row
  })
  return { headers, rows }
}
