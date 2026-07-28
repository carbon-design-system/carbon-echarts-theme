import React from 'react'

// Lazy-load the IBM footer web components. We use a ref + innerHTML approach
// to avoid TypeScript JSX custom-element registration issues.
let footerRegistered = false

export function IbmFooter() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!footerRegistered) {
      footerRegistered = true
      import('@carbon/ibmdotcom-web-components/es/components/footer/index.js').catch(() => {
        // Package may not be installed in dev; footer degrades gracefully
      })
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = `<c4d-footer size="micro" language-selector-type="none"></c4d-footer>`
    }
  }, [])

  return <div ref={containerRef} />
}
