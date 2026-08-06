// SVG path content strings lifted from Carbon Charts' getControlIconByType()
// viewBox is always 32x32

export const ICON_TABLE = `<rect x="4" y="6" width="18" height="2"/><rect x="4" y="12" width="18" height="2"/><rect x="4" y="18" width="18" height="2"/><rect x="4" y="24" width="18" height="2"/><rect x="26" y="6" width="2" height="2"/><rect x="26" y="12" width="2" height="2"/><rect x="26" y="18" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/>`

export const ICON_MAXIMIZE = `<polygon points="21 2 21 4 26.59 4 17 13.58 18.41 15 28 5.41 28 11 30 11 30 2 21 2"/><polygon points="15 18.42 13.59 17 4 26.59 4 21 2 21 2 30 11 30 11 28 5.41 28 15 18.42"/>`

export const ICON_MINIMIZE = `<polygon points="4 18 4 20 10.586 20 2 28.582 3.414 30 12 21.414 12 28 14 28 14 18 4 18"/><polygon points="30 3.416 28.592 2 20 10.586 20 4 18 4 18 14 28 14 28 12 21.414 12 30 3.416"/>`

export const ICON_OVERFLOW = `<circle cx="16" cy="8" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="16" cy="24" r="2"></circle>`

export const ICON_CLOSE = `<path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"/>`

export function makeSvg(paths: string, size = 16): string {
  return `<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true" style="pointer-events:none">${paths}</svg>`
}
