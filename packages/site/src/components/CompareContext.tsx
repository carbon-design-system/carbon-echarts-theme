import React from 'react'

export interface CompareContextValue {
  expandAll: boolean
}

export const CompareContext = React.createContext<CompareContextValue>({
  expandAll: false,
})

export function useCompareContext() {
  return React.useContext(CompareContext)
}
