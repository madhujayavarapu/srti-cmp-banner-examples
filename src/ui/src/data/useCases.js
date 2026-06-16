const useCases = [
  {
    id: 'banner-testing',
    icon: '\u{1F6E1}\uFE0F',
    title: 'Banner testing (IAB + Autoblocking)',
    description:
      'Run the full consent banner with IAB TCF and autoblocking scripts. Validates banner display, consent capture, and script blocking.',
    arrow: 'Open test page',
    accentBg: 'rgba(99, 179, 237, 0.15)',
    accent: 'var(--accent-cyan)',
  },
  {
    id: 'autoblocking',
    icon: '\u26D4',
    title: 'Autoblocking examples',
    description:
      'Test autoblocking behavior in isolation. See how scripts are blocked until consent is given and how they unlock after.',
    arrow: 'Open examples',
    accentBg: 'rgba(56, 178, 172, 0.15)',
    accent: 'var(--accent-teal)',
  },
  {
    id: 'gtm-integration',
    icon: '\u{1F3F7}\uFE0F',
    title: 'GTM integration testing',
    description:
      'Test Google Tag Manager with the CMP banner. Load a GTM container, fire dataLayer events, and verify consent gating and tag triggers.',
    arrow: 'Open test page',
    accentBg: 'rgba(99, 179, 237, 0.15)',
    accent: 'var(--accent-cyan)',
  },
  {
    id: 'base64-image-viewer',
    icon: '\u{1F5BC}\uFE0F',
    title: 'Base64 image viewer',
    description:
      'Paste a base64-encoded image string to instantly decode and preview it. Supports PNG, JPEG, GIF, WebP, BMP, and SVG.',
    arrow: 'Open viewer',
    accentBg: 'rgba(99, 179, 237, 0.15)',
    accent: 'var(--accent-cyan)',
  },
  {
    id: 'gartner-use-case',
    icon: '\u{1F3AC}',
    title: 'Gartner demo — unknown tracker compliance',
    description:
      'Demo how CMP stays compliant when rogue trackers appear after a scan. Simulate classified vs unknown cookies and domain/compliance scan events.',
    arrow: 'Open demo',
    accentBg: 'rgba(237, 137, 54, 0.15)',
    accent: 'var(--accent-coral)',
  },
  {
    id: 'risk-analysis',
    icon: '\u{1F4CA}',
    title: 'Risk analysis',
    description:
      'Simulate and validate risk analysis flows. Test how consent signals and cookie scans feed into risk scoring and reporting.',
    arrow: 'Open',
    accentBg: 'rgba(236, 201, 75, 0.15)',
    accent: 'var(--accent-amber)',
  },
  {
    id: 'compliance',
    icon: '\u{1F4CB}',
    title: 'Compliance report scanning',
    description:
      'Test compliance report generation and scanning. Verify report structure, coverage, and export for audits.',
    arrow: 'Coming soon',
    accentBg: 'rgba(104, 211, 145, 0.15)',
    accent: 'var(--accent-mint)',
    placeholder: true,
  },
  {
    id: 'scanning',
    icon: '\u{1F50D}',
    title: 'Cookie & consent scanning',
    description:
      'Run cookie and consent scans against this test site. Validate detection, categorization, and remediation suggestions.',
    arrow: 'Coming soon',
    accentBg: 'rgba(237, 137, 54, 0.15)',
    accent: 'var(--accent-coral)',
    placeholder: true,
  },
]

export default useCases
