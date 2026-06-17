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
}

const ALL_COOKIES = [
  ...Object.values(CLASSIFIED_COOKIES).flatMap((cat) => cat.cookies),
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

export default function GartnerUseCase() {
  const cmpConfig = resolveCmpConfig()
  useCmpBanner(cmpConfig)

  useEffect(() => {
    dropAllCookies()

    return () => {
      removeAllCookies()
    }
  }, [])

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
          CMP must detect unclassified cookies in the portal, alert the privacy team, and keep the live site compliant via autoblocking — even before the team reacts.
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
            <p>Evaluates live behavior against jurisdiction requirements and flags compliance risks.</p>
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
      <Footer />
    </PageLayout>
  )
}
