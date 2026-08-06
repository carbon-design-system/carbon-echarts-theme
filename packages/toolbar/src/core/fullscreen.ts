/**
 * Requests fullscreen on the given element.
 * Falls back to webkitRequestFullscreen for Safari < 16.4.
 * No-op if already fullscreen.
 */
export function enterFullscreen(el: HTMLElement): Promise<void> {
  if (document.fullscreenElement) return Promise.resolve()
  const fn = el.requestFullscreen ?? (el as any).webkitRequestFullscreen
  return fn ? fn.call(el) : Promise.resolve()
}

/**
 * Exits fullscreen.
 * Falls back to webkitExitFullscreen for Safari < 16.4.
 * No-op if not in fullscreen.
 */
export function exitFullscreen(): Promise<void> {
  if (!document.fullscreenElement) return Promise.resolve()
  const fn = document.exitFullscreen ?? (document as any).webkitExitFullscreen
  return fn ? fn.call(document) : Promise.resolve()
}

/** Returns true when the document is currently in fullscreen mode. */
export function isFullscreen(): boolean {
  return !!(document.fullscreenElement ?? (document as any).webkitFullscreenElement)
}

/**
 * Registers a callback that fires whenever fullscreen state changes.
 * Returns an unsubscribe function.
 */
export function onFullscreenChange(cb: (fullscreen: boolean) => void): () => void {
  const handler = () => cb(isFullscreen())
  document.addEventListener('fullscreenchange', handler)
  document.addEventListener('webkitfullscreenchange', handler)
  return () => {
    document.removeEventListener('fullscreenchange', handler)
    document.removeEventListener('webkitfullscreenchange', handler)
  }
}
