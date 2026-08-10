import type { TableData } from './types'

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

export function extractHierarchy(series: any[]): TableData | null {
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
