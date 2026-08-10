export interface TableData {
  headers: Array<{ key: string; header: string }>
  rows: Array<{ id: string } & Record<string, unknown>>
}
