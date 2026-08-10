import React from 'react'
import * as echarts from 'echarts'
import { feature } from 'topojson-client'
import { createChoroplethOptions } from '@carbon/echarts-theme/presets'
import { ChartPage } from '../components/ChartPage'
import { Compare } from '../components/Compare'
import ChoroplethMdx from '../content/choropleth.mdx'
import {
  chartTypes,
  options,
  missingDataOptions,
  customColorsOptions,
  data,
  missingData,
} from '../data/carboncharts/choropleth'
import worldTopoJsonRaw from '../data/carboncharts/topojson-110-data.json'

// ── Register the world map once at module init ────────────────────────────────
// feature() converts the bundled TopoJSON to the GeoJSON FeatureCollection that
// echarts.registerMap() accepts — same approach as Carbon Charts' geo-projection.ts.
const worldGeoJson = feature(worldTopoJsonRaw as any, (worldTopoJsonRaw as any).objects.countries)
echarts.registerMap('world', worldGeoJson as Parameters<typeof echarts.registerMap>[1])

// ── Build ECharts options via preset ─────────────────────────────────────────

const echartsGeoData = data.map((d) => ({ name: d.name as string, value: d.value as number }))
const echartsMissingData = missingData.map((d) => ({
  name: d.name as string,
  value: d.value as number,
}))

// pairing 1 = purple (Carbon Charts default), 2 = blue, 3 = cyan, 4 = teal
const geoDataOption = createChoroplethOptions(echartsGeoData, { title: 'Geo data', pairing: 1 })
const missingDataOption = createChoroplethOptions(echartsMissingData, {
  title: 'Missing data',
  pairing: 1,
})
const customColorsOption = createChoroplethOptions(echartsGeoData, {
  title: 'Custom colors',
  // mirrors Carbon Charts color.gradient.colors: ['#0f62fe', '#ffc2c5', '#8d8d8d']
  colors: ['#0f62fe', '#ffc2c5', '#8d8d8d'],
})

// ── Option code snippets ──────────────────────────────────────────────────────

const codeGeoData = `import * as echarts from 'echarts'
import { feature } from 'topojson-client'
import { createChoroplethOptions } from '@carbon/echarts-theme/presets'
import worldTopoJson from './world-110m.json'

// Convert TopoJSON → GeoJSON and register the map (do this once at app startup)
const worldGeoJson = feature(worldTopoJson, worldTopoJson.objects.countries)
echarts.registerMap('world', worldGeoJson)

// pairing: 1=purple (default), 2=blue, 3=cyan, 4=teal — mirrors color.pairing.option
const option = createChoroplethOptions(data, { pairing: 1 })

// data format: [{ name: string, value: number }]
// 'name' must match the 'NAME' property in the Natural Earth TopoJSON
const data = [
  { name: 'Canada', value: 84 },
  { name: 'Brazil',  value: 32 },
  // … all countries
]`

const codeMissingData = `import * as echarts from 'echarts'
import { feature } from 'topojson-client'
import { createChoroplethOptions } from '@carbon/echarts-theme/presets'
import worldTopoJson from './world-110m.json'

const worldGeoJson = feature(worldTopoJson, worldTopoJson.objects.countries)
echarts.registerMap('world', worldGeoJson)

// Countries omitted from data will render in the default (no-data) map color
const option = createChoroplethOptions(partialData, { pairing: 1 })`

const codeCustomColors = `import * as echarts from 'echarts'
import { feature } from 'topojson-client'
import { createChoroplethOptions } from '@carbon/echarts-theme/presets'
import worldTopoJson from './world-110m.json'

const worldGeoJson = feature(worldTopoJson, worldTopoJson.objects.countries)
echarts.registerMap('world', worldGeoJson)

// colors mirrors Carbon Charts color.gradient.colors
const option = createChoroplethOptions(data, {
  colors: ['#0f62fe', '#ffc2c5', '#8d8d8d'],
})`

// ── Page ──────────────────────────────────────────────────────────────────────

export function ChoroplethPage() {
  return (
    <ChartPage
      title="Choropleth"
      description="Encode a quantitative variable as color fill across geographic regions."
      overview={<ChoroplethMdx />}
      examples={
        <>
          <Compare
            title="Geo data"
            chartClass={chartTypes.vanilla}
            carbonExample={{ data, options }}
            echartsOption={geoDataOption}
            height="400px"
            optionCode={codeGeoData}
          />
          <Compare
            title="Missing data"
            chartClass={chartTypes.vanilla}
            carbonExample={{ data: missingData, options: missingDataOptions }}
            echartsOption={missingDataOption}
            height="400px"
            optionCode={codeMissingData}
          />
          <Compare
            title="Custom colors"
            chartClass={chartTypes.vanilla}
            carbonExample={{ data, options: customColorsOptions }}
            echartsOption={customColorsOption}
            height="400px"
            optionCode={codeCustomColors}
          />
        </>
      }
    />
  )
}
