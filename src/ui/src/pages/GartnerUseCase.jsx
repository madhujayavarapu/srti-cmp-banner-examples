import { useEffect, useState, useCallback } from 'react'
import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'
import useCmpBanner from '../hooks/useCmpBanner'
import { resolveCmpConfig } from '../data/cmpConfigs'
import { setCookie, deleteCookie, getCookie } from '../utils/cookies'
import useExternalScript from '../hooks/useExternalScript'

const CLASSIFIED_COOKIES = {
  essential: {
    label: 'Essential',
    icon: '\u{1F512}',
    description: 'Discovered in the initial domain scan. Required for core site operation.',
    cookies: [
      { name: 'session_id', value: 'sess-abc123-scan-token', options: { maxAge: 86400 } },
      { name: 'csrf_token', value: 'csrf-xyz789-scan-value', options: { maxAge: 3600 } },
    ],
  }
  // analytics: {
  //   label: 'Analytics',
  //   icon: '\u{1F4CA}',
  //   description: 'Categorized during scan. Blocked until analytics consent is granted.',
  //   cookies: [
  //     { name: '_ga', value: 'GA1.1.123456789.1234567890', options: { maxAge: 63072000 } },
  //     { name: '_gid', value: 'GA1.1.987654321.9876543210', options: { maxAge: 86400 } },
  //   ],
  // },
  // advertising: {
  //   label: 'Advertising',
  //   icon: '\u{1F4E2}',
  //   description: 'Categorized during scan. Blocked until marketing consent is granted.',
  //   cookies: [
  //     { name: '_fbp', value: 'fb.1.1234567890.123456789', options: { maxAge: 7776000 } },
  //   ],
  // },
  // functional: {
  //   label: 'Functional',
  //   icon: '\u2699\uFE0F',
  //   description: 'Categorized during scan. Blocked until functional consent is granted.',
  //   cookies: [
  //     { name: 'lang_pref', value: 'en-US', options: { maxAge: 31536000 } },
  //   ],
  // },
}

const UNKNOWN_COOKIES = [
  {
    name: 'rogue_pixel_id',
    value: 'rp-9f3a2b1c-unclassified',
    description: 'Dropped by a new marketing pixel script added after the scan.',
    options: { maxAge: 7776000 },
  },
  {
    name: 'rogue_campaign_ref',
    value: 'camp-summer-2026-unknown',
    description: 'Campaign tracking cookie from an unapproved initiator.',
    options: { maxAge: 2592000 },
  },
  {
    name: 'new_vendor_session',
    value: 'nvs-a1b2c3d4-e5f6',
    description: 'Session cookie from a third-party vendor not in scan results.',
    options: { maxAge: 86400 },
  },
]

const ALL_COOKIES = [
  ...Object.values(CLASSIFIED_COOKIES).flatMap((cat) => cat.cookies),
  ...UNKNOWN_COOKIES,
]

const GAP_TABLE = [
  {
    config: 'Unknown Initiators Blocking ON',
    live: 'Compliant (tracker blocked)',
    detects: 'No — scanner sees the same blocked state',
    alert: 'No',
  },
  {
    config: 'Unknown Initiators Blocking OFF',
    live: 'Non-compliant (tracker runs)',
    detects: 'Yes',
    alert: 'Yes',
  },
]

const DEMO_FLOW = [
  { surface: 'Live website (real visitors)', behavior: 'Unknown tracker is blocked → compliant' },
  { surface: 'Domain scan', behavior: 'Bypasses autoblocking → discovers unknown tracker → surfaces as unclassified in portal' },
  { surface: 'Alert email', behavior: 'Fires for the privacy person' },
  { surface: 'Compliance scan', behavior: 'Runs against real website behavior → validates autoblocking is working correctly' },
]

function dropAllCookies() {
  ALL_COOKIES.forEach(({ name, value, options }) => {
    setCookie(name, value, options)
  })
}

function removeAllCookies() {
  ALL_COOKIES.forEach(({ name, options }) => {
    deleteCookie(name, options)
  })
}

function readClassifiedStatus() {
  const status = {}
  for (const [categoryId, category] of Object.entries(CLASSIFIED_COOKIES)) {
    status[categoryId] = category.cookies.map(({ name }) => ({
      name,
      present: getCookie(name) !== null,
      value: getCookie(name),
    }))
  }
  return status
}

function readUnknownStatus() {
  return UNKNOWN_COOKIES.map(({ name }) => ({
    name,
    present: getCookie(name) !== null,
    value: getCookie(name),
  }))
}

function readScanningEvents() {
  if (!window.__srtiScanningEvents?.length) return []
  return [...window.__srtiScanningEvents]
}

function emitScanEvent(scanType) {
  window.__srtiScanningEvents = window.__srtiScanningEvents || []
  window.__srtiScanningEvents.push({
    event_name: 'securiti_scanning',
    scanType,
  })
}

function clearScanningEvents() {
  window.__srtiScanningEvents = []
}

export default function GartnerUseCase() {
  const cmpConfig = resolveCmpConfig()
  useCmpBanner(cmpConfig)

  useExternalScript()

  const [classifiedStatus, setClassifiedStatus] = useState(readClassifiedStatus)
  const [unknownStatus, setUnknownStatus] = useState(readUnknownStatus)
  const [scanningEvents, setScanningEvents] = useState(readScanningEvents)

  const refreshStatus = useCallback(() => {
    setClassifiedStatus(readClassifiedStatus())
    setUnknownStatus(readUnknownStatus())
    setScanningEvents(readScanningEvents())
  }, [])

  useEffect(() => {
    dropAllCookies()
    refreshStatus()

    return () => {
      removeAllCookies()
      clearScanningEvents()
    }
  }, [refreshStatus])

  const handleRedrop = () => {
    dropAllCookies()
    refreshStatus()
  }

  const handleClear = () => {
    removeAllCookies()
    refreshStatus()
  }

  const handleDomainScan = () => {
    emitScanEvent('domainScan')
    refreshStatus()
  }

  const handleComplianceScan = () => {
    emitScanEvent('complianceScan')
    refreshStatus()
  }

  const handleClearScanEvents = () => {
    clearScanningEvents()
    refreshStatus()
  }

  return (
    <PageLayout narrow>
      <UseCaseHeader badge="Gartner Demo 2026" badgeAccent />

      <Hero
        label="Use case"
        title="Gartner demo — unknown tracker compliance"
        description="Demonstrate how Securiti CMP keeps a website compliant when new, unclassified trackers are introduced after the domain scan — while still detecting them for the privacy team."
      />

      <section className="section">
        <h2 className="section-title">The scenario</h2>
        <ol className="gartner-narrative">
          <li>A website is scanned. All cookies and trackers are discovered, categorized, and autoblocking is integrated.</li>
          <li>Later, a developer or marketer adds a new script that drops additional trackers — these are <strong>not</strong> part of the scan results.</li>
          <li>The site is now non-compliant: those new trackers are missing from the cookie notice and are firing without consent.</li>
        </ol>
        <p className="gartner-lead">
          A good CMP must detect unclassified cookies in the portal, alert the privacy team, and keep the live site compliant via autoblocking — even before the team reacts.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">How Securiti CMP solves this</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="icon">{'\u26D4'}</div>
            <h3>Autoblocking</h3>
            <p>Blocks initiators based on consent. Allowed categories run; unconsented categories are blocked.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F6E1}\uFE0F'}</div>
            <h3>Unknown initiators blocking</h3>
            <p>When enabled, any initiator not in scan results is blocked outright — a safety net between scans.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F50D}'}</div>
            <h3>Domain scan</h3>
            <p>Extracts all trackers on the site. Unclassified cookies trigger alert emails to marketing and privacy.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F4CB}'}</div>
            <h3>Compliance scan</h3>
            <p>Evaluates live behavior against jurisdiction requirements and flags pre-consent violations.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">The gap (before the fix)</h2>
        <p className="gartner-lead">
          Today, autoblocking runs the same way during a scan as for a real visitor. With unknown initiators blocking enabled, you can show compliant live behavior <em>or</em> correct detection — but not both at once:
        </p>
        <div className="gartner-table-wrap">
          <table className="gartner-table">
            <thead>
              <tr>
                <th>Configuration</th>
                <th>Live website</th>
                <th>Scan detects unknown?</th>
                <th>Alert email?</th>
              </tr>
            </thead>
            <tbody>
              {GAP_TABLE.map((row) => (
                <tr key={row.config}>
                  <td>{row.config}</td>
                  <td>{row.live}</td>
                  <td>{row.detects}</td>
                  <td>{row.alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Proposed solution</h2>
        <p className="gartner-lead">
          The scanner signals the autoblocking tool before a <strong>domain scan</strong> so unknown initiators blocking is bypassed — letting the scanner observe all cookies. A <strong>compliance scan</strong> does not bypass blocking, because it must validate real user-facing behavior.
        </p>
        <div className="gartner-code-block">
          <div className="gartner-code-block__header">Scanner emits before domain scan</div>
          <pre>{`window.__srtiScanningEvents = window.__srtiScanningEvents || [];
window.__srtiScanningEvents.push({
  event_name: "securiti_scanning",
  scanType: "domainScan" // or "complianceScan"
});`}</pre>
        </div>
        <p className="gartner-lead gartner-lead--spaced">
          With this change, unknown initiators blocking can stay <strong>enabled</strong> and the demo tells one coherent story:
        </p>
        <div className="gartner-table-wrap">
          <table className="gartner-table">
            <thead>
              <tr>
                <th>Surface</th>
                <th>Behavior</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_FLOW.map((row) => (
                <tr key={row.surface}>
                  <td>{row.surface}</td>
                  <td>{row.behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">CMP scripts</h2>
        <div className="cmp-provider-block">
          <p className="cmp-provider-hint">
            The autoblocking and consent SDK scripts are loaded when you open this view.<br />
            Tenant: <code>{cmpConfig.tenantUUID}</code><br />
            Domain: <code>{cmpConfig.domainUUID}</code>
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Interactive demo</h2>
        <p className="gartner-lead">
          This page simulates the Gartner demo environment. Classified cookies represent trackers from the initial scan; unknown cookies simulate a rogue script added afterward. Use the scanner controls to emit <code>__srtiScanningEvents</code> as the domain or compliance scanner would.
        </p>

        <h3 className="gartner-subtitle">Scanner simulation</h3>
        <div className="gartner-actions">
          <button type="button" className="gartner-btn gartner-btn--primary" onClick={handleDomainScan}>
            Emit domain scan event
          </button>
          <button type="button" className="gartner-btn gartner-btn--teal" onClick={handleComplianceScan}>
            Emit compliance scan event
          </button>
          <button type="button" className="gartner-btn" onClick={handleClearScanEvents}>
            Clear scan events
          </button>
        </div>
        <div className="gartner-code-block gartner-code-block--compact">
          <div className="gartner-code-block__header">window.__srtiScanningEvents</div>
          <pre>{scanningEvents.length ? JSON.stringify(scanningEvents, null, 2) : '[]'}</pre>
        </div>

        <h3 className="gartner-subtitle">Cookie controls</h3>
        <div className="gartner-actions">
          <button type="button" className="gartner-btn gartner-btn--primary" onClick={handleRedrop}>
            Re-drop all cookies
          </button>
          <button type="button" className="gartner-btn" onClick={handleClear}>
            Clear all test cookies
          </button>
          <button type="button" className="gartner-btn" onClick={refreshStatus}>
            Refresh status
          </button>
        </div>
        <p className="gartner-hint">
          Cookies drop on page load and are removed when you navigate away. After changing consent in the banner, refresh status to see which cookies remain.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Classified cookies (from scan)</h2>
        <div className="gartner-cookie-grid">
          {Object.entries(CLASSIFIED_COOKIES).map(([categoryId, category]) => (
            <article key={categoryId} className={`gartner-cookie-card gartner-cookie-card--${categoryId}`}>
              <header className="gartner-cookie-card__header">
                <span className="gartner-cookie-card__icon" aria-hidden="true">{category.icon}</span>
                <div>
                  <h3 className="gartner-cookie-card__title">{category.label}</h3>
                  <p className="gartner-cookie-card__desc">{category.description}</p>
                </div>
              </header>
              <ul className="gartner-cookie-list">
                {classifiedStatus[categoryId]?.map(({ name, present, value }) => (
                  <li key={name} className="gartner-cookie-list__item">
                    <span className={`gartner-cookie-status gartner-cookie-status--${present ? 'present' : 'missing'}`}>
                      {present ? 'Present' : 'Missing'}
                    </span>
                    <code className="gartner-cookie-name">{name}</code>
                    {present && (
                      <span className="gartner-cookie-value" title={value}>
                        {value.length > 36 ? `${value.slice(0, 36)}…` : value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Unknown cookies (post-scan rogue trackers)</h2>
        <p className="gartner-lead">
          These cookies are <strong>not</strong> in the approved scan results. They represent trackers introduced after the initial scan — the ones unknown initiators blocking should block on the live site, and domain scan should still discover when the bypass is active.
        </p>
        <ul className="gartner-unknown-list">
          {unknownStatus.map(({ name, present, value }) => {
            const meta = UNKNOWN_COOKIES.find((c) => c.name === name)
            return (
              <li key={name} className="gartner-unknown-list__item">
                <div className="gartner-unknown-list__top">
                  <span className={`gartner-cookie-status gartner-cookie-status--${present ? 'present' : 'missing'}`}>
                    {present ? 'Present' : 'Missing'}
                  </span>
                  <code className="gartner-cookie-name">{name}</code>
                  {present && (
                    <span className="gartner-cookie-value" title={value}>
                      {value.length > 36 ? `${value.slice(0, 36)}…` : value}
                    </span>
                  )}
                </div>
                {meta && <p className="gartner-unknown-list__desc">{meta.description}</p>}
              </li>
            )
          })}
        </ul>
      </section>

      <Footer />
    </PageLayout>
  )
}
