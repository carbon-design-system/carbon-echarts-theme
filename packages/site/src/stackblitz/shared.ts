// Pieces shared by every framework builder.

/** Height of the chart container in the generated projects. */
export const CHART_HEIGHT = 400

export const PLEX_FONT_LINKS = `    <link rel="stylesheet" href="https://1.www.s81c.com/common/carbon/plex/sans.css" />
    <link rel="stylesheet" href="https://1.www.s81c.com/common/carbon/plex/sans-condensed.css" />`

/** Global styles every project imports once, at its entry point. */
export const STYLE_IMPORTS = `import '@carbon/styles/css/styles.min.css'
import '@carbon/echarts-toolbar/styles'`

export function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

export function viteIndexHtml(title: string, bodyHtml: string, entry: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
${PLEX_FONT_LINKS}
    <style>
      body { margin: 0; padding: 2rem; font-family: 'IBM Plex Sans', system-ui, sans-serif; }
    </style>
  </head>
  <body>
${bodyHtml}
    <script type="module" src="${entry}"></script>
  </body>
</html>`
}
