import React from 'react'

export function ToolbarPage() {
  return (
    <div>
      <div className="content-page__hero">
        <h1>Toolbar</h1>
      </div>
      <div className="content-page">
        <p>
          ECharts provides a built-in <code>toolbox</code> component for chart interactions: save as
          image, data view, zoom, and reset. The Carbon theme styles the toolbox icons using Carbon
          token colors.
        </p>

        <h2>Enable the toolbox</h2>
        <pre>
          <code>{`const option = {
  toolbox: {
    show: true,
    feature: {
      saveAsImage: { title: 'Save as image' },
      dataView: { title: 'Data view', readOnly: true },
      dataZoom: { title: { zoom: 'Zoom', back: 'Reset zoom' } },
      restore: { title: 'Reset' },
    },
  },
  // ...rest of option
}`}</code>
        </pre>

        <h2>Toolbar position</h2>
        <pre>
          <code>{`toolbox: {
  orient: 'horizontal', // 'horizontal' (default) or 'vertical'
  right: 16,            // position from right edge
  top: 16,              // position from top edge
}`}</code>
        </pre>

        <p>
          All Carbon preset functions accept a <code>toolbox</code> option to inject toolbox config
          into the generated option object.
        </p>
      </div>
    </div>
  )
}
