import React from 'react'

export type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100'
export type EChartsThemeName = 'carbon-white' | 'carbon-g10' | 'carbon-g90' | 'carbon-g100'

export interface ThemeContextValue {
  theme: CarbonTheme
  echartsTheme: EChartsThemeName
  setTheme: (theme: CarbonTheme) => void
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'white',
  echartsTheme: 'carbon-white',
  setTheme: () => undefined,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<CarbonTheme>('white')

  const echartsTheme: EChartsThemeName = `carbon-${theme}`

  function setTheme(next: CarbonTheme) {
    setThemeState(next)
    document.documentElement.setAttribute('data-carbon-theme', next)
  }

  // Apply initial theme attribute
  React.useEffect(() => {
    document.documentElement.setAttribute('data-carbon-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, echartsTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
