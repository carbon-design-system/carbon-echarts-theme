import type { EChartsType } from 'echarts'
import { buildTableData } from '../core/extract'
import { downloadCSV } from '../core/export'
import { makeSvg, ICON_CLOSE } from './icons'

export interface TableModalOptions {
  title: string
  instance: EChartsType
  onClose: () => void
}

export function createTableModal({ title, instance, onClose }: TableModalOptions): () => void {
  const data = buildTableData(instance)

  // ── Overlay ────────────────────────────────────────────────────────────────
  const overlay = document.createElement('div')
  overlay.className = 'cds--modal is-visible'
  overlay.setAttribute('role', 'presentation')
  overlay.addEventListener('click', onClose)

  // ── Container ──────────────────────────────────────────────────────────────
  const container = document.createElement('div')
  container.className = 'cds--modal-container'
  container.setAttribute('role', 'dialog')
  container.setAttribute('aria-modal', 'true')
  container.setAttribute('aria-label', 'Tabular representation')
  container.addEventListener('click', (e) => e.stopPropagation())
  overlay.appendChild(container)

  // ── Header ─────────────────────────────────────────────────────────────────
  const header = document.createElement('div')
  header.className = 'cds--modal-header'

  const label = document.createElement('p')
  label.className = 'cds--modal-header__label'
  label.textContent = 'Tabular representation'

  const heading = document.createElement('p')
  heading.className = 'cds--modal-header__heading'
  heading.textContent = title

  const closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.className = 'cds--modal-close'
  closeBtn.setAttribute('aria-label', 'Close')
  closeBtn.innerHTML = makeSvg(ICON_CLOSE, 20)
  closeBtn.addEventListener('click', onClose)

  header.appendChild(label)
  header.appendChild(heading)
  header.appendChild(closeBtn)
  container.appendChild(header)

  // ── Body ───────────────────────────────────────────────────────────────────
  const body = document.createElement('div')
  body.className = 'cds--modal-content'

  if (data) {
    const displayHeaders = data.headers.filter((h) => h.key !== 'id')
    const table = document.createElement('table')
    table.className = 'cds--data-table cds--data-table--no-border'

    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')
    displayHeaders.forEach(({ header: label }) => {
      const th = document.createElement('th')
      th.scope = 'col'
      const div = document.createElement('div')
      div.className = 'cds--table-header-label'
      div.textContent = label
      th.appendChild(div)
      headerRow.appendChild(th)
    })
    thead.appendChild(headerRow)
    table.appendChild(thead)

    const tbody = document.createElement('tbody')
    data.rows.forEach((row) => {
      const tr = document.createElement('tr')
      displayHeaders.forEach(({ key }) => {
        const td = document.createElement('td')
        const val = row[key]
        td.textContent =
          val === null || val === undefined
            ? '–'
            : typeof val === 'number' && isFinite(val)
              ? val.toLocaleString()
              : String(val)
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })
    table.appendChild(tbody)
    body.appendChild(table)
  } else {
    const empty = document.createElement('p')
    empty.className = 'cds--modal-content--empty'
    empty.textContent = 'No tabular data available for this chart.'
    body.appendChild(empty)
  }

  container.appendChild(body)

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footer = document.createElement('div')
  footer.className = 'cds--modal-footer'

  const spacer = document.createElement('div')
  spacer.className = 'cds--modal-footer-spacer'

  const downloadBtn = document.createElement('button')
  downloadBtn.type = 'button'
  downloadBtn.className = 'cds--btn cds--btn--primary'
  downloadBtn.textContent = 'Download as CSV'
  downloadBtn.disabled = !data
  downloadBtn.addEventListener('click', () => {
    if (data) downloadCSV(instance, title)
  })

  footer.appendChild(spacer)
  footer.appendChild(downloadBtn)
  container.appendChild(footer)

  // ── Escape key ─────────────────────────────────────────────────────────────
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', escHandler)

  document.body.appendChild(overlay)

  // Return destroy function
  return () => {
    document.removeEventListener('keydown', escHandler)
    overlay.remove()
  }
}
