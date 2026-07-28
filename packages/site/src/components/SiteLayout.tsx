import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ThemeSwitcher } from './ThemeSwitcher'
import { IbmFooter } from './IbmFooter'

interface NavItem {
  label: string
  path: string
  v2?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    label: 'Getting started',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation & setup', path: '/installation' },
      { label: 'Chart anatomy', path: '/anatomy' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Chart data', path: '/data' },
      { label: 'Toolbar', path: '/toolbar' },
      { label: 'Zoombar', path: '/zoombar' },
    ],
  },
  {
    label: 'Design',
    items: [
      { label: 'Themes', path: '/themes' },
      { label: 'Axes', path: '/axes' },
      { label: 'Color palette', path: '/palettes' },
      { label: 'Dashboards', path: '/dashboards' },
      { label: 'Legends', path: '/legends' },
      { label: 'Tooltips', path: '/tooltips' },
    ],
  },
  {
    label: 'Chart types',
    items: [
      { label: 'Bar', path: '/bar' },
      { label: 'Line', path: '/line' },
      { label: 'Area', path: '/area' },
      { label: 'Scatter & Bubble', path: '/scatter' },
      { label: 'Donut & Pie', path: '/donut' },
      { label: 'Gauge & Meter', path: '/gauge' },
      { label: 'Heatmap', path: '/heatmap' },
      { label: 'Treemap', path: '/treemap' },
      { label: 'Radar', path: '/radar' },
      { label: 'Boxplot', path: '/boxplot' },
      { label: 'Histogram', path: '/histogram' },
      { label: 'Combo', path: '/combo' },
      { label: 'Lollipop & Sparkline', path: '/lollipop' },
      { label: 'Alluvial & Sankey', path: '/alluvial' },
      { label: 'Tree', path: '/tree' },
      { label: 'Bullet', path: '/bullet', v2: true },
      { label: 'Choropleth', path: '/choropleth', v2: true },
      { label: 'Word cloud', path: '/wordcloud', v2: true },
    ],
  },
  {
    label: 'ECharts extended',
    items: [
      { label: 'Sunburst', path: '/extended/sunburst' },
      { label: 'Graph', path: '/extended/graph' },
      { label: 'Funnel', path: '/extended/funnel' },
      { label: 'Parallel', path: '/extended/parallel' },
      { label: 'Theme River', path: '/extended/theme-river' },
      { label: 'Candlestick', path: '/extended/candlestick' },
    ],
  },
]

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const location = useLocation()
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV.map((g) => [g.label, true])),
  )

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  // Keep the group containing the active route open
  React.useEffect(() => {
    const activeGroup = NAV.find((g) => g.items.some((i) => i.path === location.pathname))
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup.label]: true }))
    }
  }, [location.pathname])

  return (
    <div className="site-layout">
      {/* ── Header ── */}
      <header className="site-header" role="banner">
        <div className="site-header__inner">
          <NavLink to="/" className="site-header__wordmark">
            Carbon ECharts Theme
          </NavLink>
          <nav className="site-header__actions" aria-label="Site actions">
            <ThemeSwitcher />
            <a
              href="https://github.com/carbon-design-system/carbon-echarts-theme"
              className="site-header__github"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div className="site-body">
        {/* ── Left nav ── */}
        <nav className="site-nav" aria-label="Main navigation">
          {NAV.map((group) => (
            <div key={group.label} className="site-nav__group">
              <button
                type="button"
                className="site-nav__group-heading"
                aria-expanded={openGroups[group.label]}
                onClick={() => toggleGroup(group.label)}
              >
                {group.label}
                <span className="site-nav__chevron" aria-hidden="true">
                  {openGroups[group.label] ? '▾' : '▸'}
                </span>
              </button>
              {openGroups[group.label] && (
                <ul className="site-nav__list" role="list">
                  {group.items.map((item) => (
                    <li key={item.path} className="site-nav__item">
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                          `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
                        }
                      >
                        {item.label}
                        {item.v2 && (
                          <span className="site-nav__badge" aria-label="Coming in v2">
                            v2
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* ── Main content ── */}
        <main className="site-content" id="main-content">
          {children}
        </main>
      </div>

      <IbmFooter />
    </div>
  )
}
