import React from 'react'
import { useTheme, type CarbonTheme } from './ThemeContext'

const THEMES: { value: CarbonTheme; label: string }[] = [
  { value: 'white', label: 'White' },
  { value: 'g10', label: 'G10' },
  { value: 'g90', label: 'G90' },
  { value: 'g100', label: 'G100' },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-switcher" role="group" aria-label="Select Carbon theme">
      {THEMES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          className={`theme-switcher__btn${theme === value ? ' theme-switcher__btn--active' : ''}`}
          onClick={() => setTheme(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
