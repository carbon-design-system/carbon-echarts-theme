import type React from 'react'

// Custom element type declarations for @carbon/ibmdotcom-web-components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'c4d-footer-container': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        size?: string
        disableLocaleButton?: string
      }
      'c4d-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        size?: string
        'language-selector-type'?: string
      }
      'c4d-footer-legal-nav': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      'c4d-footer-legal-nav-item': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        href?: string
      }
    }
  }
}

export {}
