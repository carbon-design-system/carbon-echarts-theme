import React from 'react'
import { palettesLight } from '@carbon/echarts-theme'

export function PalettesPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Color palette</h1>
      </div>
      <div className="content-page" style={{ maxWidth: '800px' }}>
        <p>
          IBM data-vis color palettes are sourced directly from the IBM Design Language. They are
          not Carbon Charts–specific — they represent IBM&apos;s official guidance for data
          visualization and apply equally to any charting library styled with Carbon.
        </p>

        <h2>Categorical palette</h2>
        <p>
          Use for discrete, unordered categories. Each series in a multi-series chart gets one color
          from this palette. Never use sequential colors for unordered data.
        </p>
        <div className="palette-row">
          {palettesLight.categorical.map((color, i) => (
            <div
              key={i}
              className="palette-swatch"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <pre>
          <code>{`import { palettesLight } from '@carbon/echarts-theme'
// palettesLight.categorical — 14 colors`}</code>
        </pre>

        <h2>Sequential palettes</h2>
        <p>
          Use for ordered, single-variable data (heatmaps, choropleth maps). Each palette is a
          single-hue ramp from light (low) to dark (high).
        </p>
        <div className="palette-row">
          {palettesLight.sequential.purple.map((color, i) => (
            <div
              key={i}
              className="palette-swatch"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <pre>
          <code>{`import { palettesLight } from '@carbon/echarts-theme'
// palettesLight.sequential.purple
// palettesLight.sequential.blue
// palettesLight.sequential.cyan
// palettesLight.sequential.teal`}</code>
        </pre>

        <h2>Diverging palettes</h2>
        <p>
          Use when data has a meaningful midpoint (e.g., above/below zero, before/after a
          threshold). Two palettes are available: Red–Cyan and Purple–Teal.
        </p>
        <div className="palette-row">
          {palettesLight.diverging.redCyan.map((color, i) => (
            <div
              key={i}
              className="palette-swatch"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <h2>Alert palette</h2>
        <p>
          Use for status or severity data. Maps to Red (critical), Orange (high), Yellow (warning),
          Green (good).
        </p>
        <div className="palette-row">
          {palettesLight.alert.map((color, i) => (
            <div
              key={i}
              className="palette-swatch"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
