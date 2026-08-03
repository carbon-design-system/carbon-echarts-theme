import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  Content,
  SkipToContent,
  Dropdown,
} from '@carbon/react'
import { useTheme, type CarbonTheme } from './ThemeContext'

const THEMES: { value: CarbonTheme; text: string }[] = [
  { value: 'white', text: 'White' },
  { value: 'g10', text: 'G10' },
  { value: 'g90', text: 'G90' },
  { value: 'g100', text: 'G100' },
]

interface NavItem {
  label: string
  path: string
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
      { label: 'Alluvial / Sankey', path: '/alluvial' },
      { label: 'Area', path: '/area' },
      { label: 'Bar', path: '/bar' },
      { label: 'Boxplot', path: '/boxplot' },
      { label: 'Bubble', path: '/bubble' },
      { label: 'Bullet', path: '/bullet' },
      { label: 'Choropleth', path: '/choropleth' },
      { label: 'Circle pack', path: '/circlepack' },
      { label: 'Combo', path: '/combo' },
      { label: 'Donut', path: '/donut' },
      { label: 'Gauge', path: '/gauge' },
      { label: 'Heatmap', path: '/heatmap' },
      { label: 'Histogram', path: '/histogram' },
      { label: 'Line', path: '/line' },
      { label: 'Lollipop', path: '/lollipop' },
      { label: 'Meter', path: '/meter' },
      { label: 'Network Diagrams', path: '/network-diagrams' },
      { label: 'Pie', path: '/pie' },
      { label: 'Radar', path: '/radar' },
      { label: 'Scatter', path: '/scatter' },
      { label: 'Tree', path: '/tree' },
      { label: 'Treemap', path: '/treemap' },
      { label: 'Word cloud', path: '/wordcloud' },
    ],
  },
  {
    label: 'ECharts extended',
    items: [
      { label: 'Candlestick', path: '/extended/candlestick' },
      { label: 'Funnel', path: '/extended/funnel' },
      { label: 'Gantt', path: '/extended/gantt' },
      { label: 'Graph', path: '/extended/graph' },
      { label: 'Parallel', path: '/extended/parallel' },
      { label: 'Sunburst', path: '/extended/sunburst' },
      { label: 'Theme River', path: '/extended/theme-river' },
    ],
  },
]

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [sideNavOpenPath, setSideNavOpenPath] = React.useState<string | null>(null)
  const isSideNavExpanded = sideNavOpenPath === location.pathname
  const setIsSideNavExpanded = (open: boolean) =>
    setSideNavOpenPath(open ? location.pathname : null)

  // Scroll back to top on navigation
  React.useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <>
      <Header aria-label="Carbon ECharts Theme">
        <SkipToContent href="#main-content" />
        <HeaderMenuButton
          aria-label={isSideNavExpanded ? 'Close navigation' : 'Open navigation'}
          onClick={() => setIsSideNavExpanded(!isSideNavExpanded)}
          isActive={isSideNavExpanded}
          aria-expanded={isSideNavExpanded}
        />
        <HeaderName as={NavLink} to="/" prefix="">
          Carbon ECharts Theme
          <span className="site-header__version">v{__THEME_VERSION__}</span>
        </HeaderName>
        <HeaderGlobalBar>
          <div className="site-header__theme-select">
            <Dropdown
              id="site-theme-select"
              titleText="Theme"
              label=""
              size="sm"
              items={THEMES}
              itemToString={(item) => item?.text ?? ''}
              selectedItem={THEMES.find((t) => t.value === theme) ?? null}
              onChange={({ selectedItem }) => {
                if (selectedItem) setTheme(selectedItem.value)
              }}
            />
          </div>
          <HeaderGlobalAction
            aria-label="GitHub repository"
            tooltipAlignment="end"
            onClick={() =>
              window.open(
                'https://github.com/carbon-design-system/carbon-echarts-theme',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            {/* GitHub logo inline SVG — @carbon/icons-react LogoGithub */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88A3.71 3.71 0 0 0 6.3 22.1c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45 3 3 0 0 0 4.08 1.16 2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.93a5.4 5.4 0 0 1 1.44-3.76 5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7 5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2Z" />
            </svg>
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      {/* SideNav must be a sibling of Header for the persistent layout to work */}
      <SideNav
        aria-label="Side navigation"
        expanded={isSideNavExpanded}
        onSideNavBlur={() => setIsSideNavExpanded(false)}
        isPersistent
      >
        <SideNavItems>
          {NAV.map((group) => (
            <SideNavMenu key={group.label} title={group.label} defaultExpanded>
              {group.items.map((item) => (
                <SideNavMenuItem
                  key={item.path}
                  as={NavLink}
                  to={item.path}
                  end={item.path === '/'}
                  isActive={
                    item.path === '/' ? location.pathname === '/' : location.pathname === item.path
                  }
                >
                  {item.label}
                </SideNavMenuItem>
              ))}
            </SideNavMenu>
          ))}
        </SideNavItems>
      </SideNav>

      <Content id="main-content" className="site-content">
        {children}
      </Content>
    </>
  )
}
