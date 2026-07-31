import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'

// Getting started
import { IntroductionPage } from './pages/IntroductionPage'
import { InstallationPage } from './pages/InstallationPage'
import { AnatomyPage } from './pages/AnatomyPage'

// Configuration
import { DataPage } from './pages/DataPage'
import { ToolbarPage } from './pages/ToolbarPage'
import { ZoombarPage } from './pages/ZoombarPage'

// Design
import { ThemesPage } from './pages/ThemesPage'
import { AxesPage } from './pages/AxesPage'
import { PalettesPage } from './pages/PalettesPage'
import { DashboardsPage } from './pages/DashboardsPage'
import { LegendsPage } from './pages/LegendsPage'
import { TooltipsPage } from './pages/TooltipsPage'

// Chart types — alphabetical
import { AlluvialPage } from './charts/AlluvialPage'
import { AreaPage } from './charts/AreaPage'
import { BarPage } from './charts/BarPage'
import { BoxplotPage } from './charts/BoxplotPage'
import { BubblePage } from './charts/BubblePage'
import { BulletPage } from './charts/BulletPage'
import { ChoroplethPage } from './charts/ChoroplethPage'
import { CirclepackPage } from './charts/CirclepackPage'
import { ComboPage } from './charts/ComboPage'
import { DonutPage } from './charts/DonutPage'
import { GaugePage } from './charts/GaugePage'
import { HeatmapPage } from './charts/HeatmapPage'
import { HistogramPage } from './charts/HistogramPage'
import { LinePage } from './charts/LinePage'
import { LollipopPage } from './charts/LollipopPage'
import { MeterPage } from './charts/MeterPage'
import { NetworkDiagramPage } from './charts/NetworkDiagramPage'
import { PiePage } from './charts/PiePage'
import { RadarPage } from './charts/RadarPage'
import { ScatterPage } from './charts/ScatterPage'
import { TreePage } from './charts/TreePage'
import { TreemapPage } from './charts/TreemapPage'
import { WordcloudPage } from './charts/WordcloudPage'

// Extended chart types
import { SunburstPage } from './charts/extended/SunburstPage'
import { GraphPage } from './charts/extended/GraphPage'
import { FunnelPage } from './charts/extended/FunnelPage'
import { ParallelPage } from './charts/extended/ParallelPage'
import { ThemeRiverPage } from './charts/extended/ThemeRiverPage'
import { CandlestickPage } from './charts/extended/CandlestickPage'
import { GanttPage } from './charts/extended/GanttPage'

export function App() {
  return (
    <SiteLayout>
      <Routes>
        {/* Getting started */}
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/installation" element={<InstallationPage />} />
        <Route path="/anatomy" element={<AnatomyPage />} />

        {/* Configuration */}
        <Route path="/data" element={<DataPage />} />
        <Route path="/toolbar" element={<ToolbarPage />} />
        <Route path="/zoombar" element={<ZoombarPage />} />

        {/* Design */}
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/axes" element={<AxesPage />} />
        <Route path="/palettes" element={<PalettesPage />} />
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/legends" element={<LegendsPage />} />
        <Route path="/tooltips" element={<TooltipsPage />} />

        {/* Chart types — alphabetical */}
        <Route path="/alluvial" element={<AlluvialPage />} />
        <Route path="/area" element={<AreaPage />} />
        <Route path="/bar" element={<BarPage />} />
        <Route path="/boxplot" element={<BoxplotPage />} />
        <Route path="/bubble" element={<BubblePage />} />
        <Route path="/bullet" element={<BulletPage />} />
        <Route path="/choropleth" element={<ChoroplethPage />} />
        <Route path="/circlepack" element={<CirclepackPage />} />
        <Route path="/combo" element={<ComboPage />} />
        <Route path="/donut" element={<DonutPage />} />
        <Route path="/gauge" element={<GaugePage />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="/histogram" element={<HistogramPage />} />
        <Route path="/line" element={<LinePage />} />
        <Route path="/lollipop" element={<LollipopPage />} />
        <Route path="/meter" element={<MeterPage />} />
        <Route path="/network-diagrams" element={<NetworkDiagramPage />} />
        <Route path="/pie" element={<PiePage />} />
        <Route path="/radar" element={<RadarPage />} />
        <Route path="/scatter" element={<ScatterPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/treemap" element={<TreemapPage />} />
        <Route path="/wordcloud" element={<WordcloudPage />} />

        {/* Extended */}
        <Route path="/extended/sunburst" element={<SunburstPage />} />
        <Route path="/extended/graph" element={<GraphPage />} />
        <Route path="/extended/funnel" element={<FunnelPage />} />
        <Route path="/extended/parallel" element={<ParallelPage />} />
        <Route path="/extended/theme-river" element={<ThemeRiverPage />} />
        <Route path="/extended/candlestick" element={<CandlestickPage />} />
        <Route path="/extended/gantt" element={<GanttPage />} />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="content-page" style={{ padding: '2rem' }}>
              <h1>Page not found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </SiteLayout>
  )
}
