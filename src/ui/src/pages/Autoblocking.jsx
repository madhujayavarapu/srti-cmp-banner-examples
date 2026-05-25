import { useState, useCallback, useRef } from 'react'
import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'

const CATEGORIES = ['analytics', 'marketing', 'functional']

const CATEGORY_LABELS = {
  analytics: 'Analytics',
  marketing: 'Marketing',
  functional: 'Functional',
}

const CATEGORY_SCRIPTS = {
  analytics: 'gtag.js',
  marketing: 'fbevents.js',
  functional: 'widget-loader.js',
}

function formatTime() {
  return new Date().toTimeString().slice(0, 8)
}

export default function Autoblocking() {
  const [consent, setConsent] = useState({
    analytics: false,
    marketing: false,
    functional: false,
  })
  const [statuses, setStatuses] = useState({
    analytics: 'waiting',
    marketing: 'waiting',
    functional: 'waiting',
    necessary: 'allowed',
  })
  const [logs, setLogs] = useState([])
  const checkboxRefs = useRef({})

  const addLog = useCallback((type, message) => {
    setLogs((prev) => [{ time: formatTime(), type, message }, ...prev])
  }, [])

  const applyConsent = useCallback(
    (newConsent) => {
      const newStatuses = { necessary: 'allowed' }
      const newLogs = []

      CATEGORIES.forEach((cat) => {
        if (newConsent[cat]) {
          newStatuses[cat] = 'allowed'
          newLogs.push({
            time: formatTime(),
            type: 'allow',
            message: `[ALLOW] ${CATEGORY_LABELS[cat]} script unblocked and executed.`,
          })
        } else {
          newStatuses[cat] = 'blocked'
          newLogs.push({
            time: formatTime(),
            type: 'block',
            message: `[BLOCK] ${CATEGORY_LABELS[cat]} script intercepted and held.`,
          })
        }
      })

      setStatuses(newStatuses)
      setLogs((prev) => [...newLogs.reverse(), ...prev])
    },
    []
  )

  const acceptAll = () => {
    const newConsent = { analytics: true, marketing: true, functional: true }
    setConsent(newConsent)
    addLog('consent', '[CONSENT] User accepted all categories.')
    applyConsent(newConsent)
  }

  const rejectAll = () => {
    const newConsent = { analytics: false, marketing: false, functional: false }
    setConsent(newConsent)
    addLog('consent', '[CONSENT] User rejected all optional categories.')
    applyConsent(newConsent)
  }

  const savePrefs = () => {
    const newConsent = { ...consent }
    CATEGORIES.forEach((cat) => {
      newConsent[cat] = checkboxRefs.current[cat]?.checked || false
    })
    setConsent(newConsent)

    const accepted = CATEGORIES.filter((cat) => newConsent[cat])
    const msg = accepted.length
      ? `[CONSENT] Preferences saved \u2014 accepted: ${accepted.join(', ')}.`
      : '[CONSENT] Preferences saved \u2014 no optional categories accepted.'
    addLog('consent', msg)
    applyConsent(newConsent)
  }

  const consentSummary = (() => {
    const active = CATEGORIES.filter((c) => consent[c])
    if (active.length === 0) return { text: 'No consent given', cls: 'consent-status--none' }
    if (active.length === 3) return { text: 'All categories accepted', cls: 'consent-status--all' }
    return {
      text: active.map((c) => c[0].toUpperCase() + c.slice(1)).join(', ') + ' accepted',
      cls: 'consent-status--partial',
    }
  })()

  function renderStatusPill(category) {
    const status = statuses[category]
    return <span className={`status-pill status-pill--${status}`}>{status}</span>
  }

  function renderOutput(category) {
    const status = statuses[category]
    if (status === 'waiting') {
      return (
        <div className="demo-output">
          <span className="dot dot--waiting" />
          <span>Awaiting {category} consent&hellip;</span>
        </div>
      )
    }
    if (status === 'allowed') {
      return (
        <div className="demo-output">
          <span className="dot dot--allowed" />
          <span>{CATEGORY_SCRIPTS[category] || category} &mdash; loaded and executing.</span>
        </div>
      )
    }
    return (
      <div className="demo-output">
        <span className="dot dot--blocked" />
        <span>{CATEGORY_SCRIPTS[category] || category} &mdash; blocked. Consent required.</span>
      </div>
    )
  }

  return (
    <PageLayout narrow>
      <UseCaseHeader badge="Autoblocking" badgeAccent />

      <Hero
        label="Use case"
        title="Autoblocking examples"
        description="See how scripts and resources are blocked until the user provides consent, and how they unlock once consent is granted."
      />

      {/* How it works */}
      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="icon">{'\u26D4'}</div>
            <h3>Block by default</h3>
            <p>Third-party scripts are intercepted and held before execution until the user&rsquo;s consent state is resolved.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F513}'}</div>
            <h3>Unlock on consent</h3>
            <p>Once the user accepts relevant categories, blocked scripts are released and allowed to execute normally.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F5C2}\uFE0F'}</div>
            <h3>Category-based</h3>
            <p>Each script maps to a consent category (analytics, marketing, etc.). Consent for that category unblocks it.</p>
          </div>
        </div>
      </section>

      {/* Consent panel */}
      <section className="section">
        <h2 className="section-title">Simulated consent state</h2>
        <div className="consent-panel">
          <div className="consent-panel-header">
            <span>consent-simulator &middot; categories</span>
            <span className={consentSummary.cls}>{consentSummary.text}</span>
          </div>
          <div className="consent-panel-body">
            <div className="consent-categories">
              <div className="consent-row">
                <div>
                  <div className="consent-row-label">Strictly necessary</div>
                  <div className="consent-row-desc">Always active &mdash; required for the site to function.</div>
                </div>
                <div className="toggle-wrap">
                  <label className="toggle">
                    <input type="checkbox" checked disabled />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
              {CATEGORIES.map((cat) => (
                <div className="consent-row" key={cat}>
                  <div>
                    <div className="consent-row-label">{CATEGORY_LABELS[cat]}</div>
                    <div className="consent-row-desc">
                      {cat === 'analytics' && 'Tracking and usage analytics scripts.'}
                      {cat === 'marketing' && 'Ad targeting and remarketing pixels.'}
                      {cat === 'functional' && 'Preferences, chat widgets, and embedded content.'}
                    </div>
                  </div>
                  <div className="toggle-wrap">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={consent[cat]}
                        ref={(el) => (checkboxRefs.current[cat] = el)}
                        onChange={(e) => setConsent((prev) => ({ ...prev, [cat]: e.target.checked }))}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="consent-actions">
              <button className="btn-accept-all" onClick={acceptAll}>Accept all</button>
              <button className="btn-reject-all" onClick={rejectAll}>Reject all</button>
              <button className="btn-save-prefs" onClick={savePrefs}>Save preferences</button>
            </div>
          </div>
        </div>
      </section>

      {/* Script blocking status */}
      <section className="section">
        <h2 className="section-title">Script blocking status</h2>
        <div className="demo-grid">
          <div className="demo-card">
            <div className="demo-card-header">
              <span className="demo-card-title">Analytics tracker</span>
              {renderStatusPill('analytics')}
            </div>
            <div className="demo-card-body">
              <p>Simulates a third-party analytics script (e.g. Google Analytics). Blocked until <strong>Analytics</strong> consent is given.</p>
              {renderOutput('analytics')}
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-card-header">
              <span className="demo-card-title">Marketing pixel</span>
              {renderStatusPill('marketing')}
            </div>
            <div className="demo-card-body">
              <p>Simulates an ad pixel (e.g. Meta Pixel). Blocked until <strong>Marketing</strong> consent is given.</p>
              {renderOutput('marketing')}
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-card-header">
              <span className="demo-card-title">Chat widget</span>
              {renderStatusPill('functional')}
            </div>
            <div className="demo-card-body">
              <p>Simulates a support chat widget (e.g. Intercom). Blocked until <strong>Functional</strong> consent is given.</p>
              {renderOutput('functional')}
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-card-header">
              <span className="demo-card-title">Core script</span>
              <span className="status-pill status-pill--allowed">allowed</span>
            </div>
            <div className="demo-card-body">
              <p>Strictly necessary scripts are never blocked &mdash; they execute regardless of consent state.</p>
              <div className="demo-output">
                <span className="dot dot--allowed" />
                <span>Executed &mdash; always permitted.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event log */}
      <section className="section">
        <h2 className="section-title">Event log</h2>
        <div className="event-log">
          <div className="event-log-header">
            <span>autoblocking &middot; events</span>
            <button className="btn-clear-log" onClick={() => setLogs([])}>clear</button>
          </div>
          <div className="event-log-body">
            {logs.length === 0 ? (
              <span className="log-empty">
                No events yet. Use the consent panel above to trigger blocking and unblocking.
              </span>
            ) : (
              logs.map((entry, i) => (
                <div className="log-entry" key={i}>
                  <span className="log-time">{entry.time}</span>
                  <span className={`log-event--${entry.type}`}>{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </PageLayout>
  )
}
