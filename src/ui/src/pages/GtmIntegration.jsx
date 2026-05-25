import { useState, useCallback, useEffect } from 'react'
import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'

const TAG_ACTIONS = [
  {
    id: 'SecuritiScanning',
    label: 'Securiti scanning',
    description: 'Load all tracking tags with the Securiti Scanning tag.',
    event: 'securiti_scanning',
    payload: {
      SecuritiScanning: true
    },
  },
  {
    id: 'page_view',
    label: 'Page view',
    description: 'Simulates a virtual page view hit.',
    event: 'page_view',
    payload: { page_title: 'GTM Integration Test', page_path: '/gtm-integration' },
  },
  {
    id: 'view_item',
    label: 'View item',
    description: 'Product detail page view with item metadata.',
    event: 'view_item',
    payload: {
      currency: 'USD',
      value: 29.99,
      items: [{ item_id: 'SKU-001', item_name: 'Test Product', item_category: 'Demo' }],
    },
  },
  {
    id: 'select_item',
    label: 'Select item',
    description: 'User clicks a product from a list.',
    event: 'select_item',
    payload: {
      item_list_id: 'list-001',
      item_list_name: 'Featured Products',
      items: [{ item_id: 'SKU-001', item_name: 'Test Product' }],
    },
  },
  {
    id: 'add_to_cart',
    label: 'Add to cart',
    description: 'E-commerce add_to_cart with sample product data.',
    event: 'add_to_cart',
    payload: {
      currency: 'USD',
      value: 29.99,
      items: [{ item_id: 'SKU-001', item_name: 'Test Product', quantity: 1 }],
    },
  },
  {
    id: 'remove_from_cart',
    label: 'Remove from cart',
    description: 'Item removed from the shopping cart.',
    event: 'remove_from_cart',
    payload: {
      currency: 'USD',
      value: 29.99,
      items: [{ item_id: 'SKU-001', item_name: 'Test Product', quantity: 1 }],
    },
  },
  {
    id: 'begin_checkout',
    label: 'Begin checkout',
    description: 'Checkout flow started.',
    event: 'begin_checkout',
    payload: {
      currency: 'USD',
      value: 59.98,
      items: [{ item_id: 'SKU-001', item_name: 'Test Product', quantity: 1 }],
    },
  },
  {
    id: 'purchase',
    label: 'Purchase',
    description: 'E-commerce purchase with transaction details.',
    event: 'purchase',
    payload: {
      transaction_id: 'T-10001',
      currency: 'USD',
      value: 49.99,
      items: [{ item_id: 'SKU-002', item_name: 'Premium Plan', quantity: 1 }],
    },
  },
  {
    id: 'refund',
    label: 'Refund',
    description: 'Transaction refund event.',
    event: 'refund',
    payload: {
      transaction_id: 'T-10001',
      currency: 'USD',
      value: 49.99,
      items: [{ item_id: 'SKU-002', item_name: 'Premium Plan', quantity: 1 }],
    },
  },
  {
    id: 'sign_up',
    label: 'Sign up',
    description: 'Fires a sign_up conversion event.',
    event: 'sign_up',
    payload: { method: 'email' },
  },
  {
    id: 'generate_lead',
    label: 'Generate lead',
    description: 'Lead form submission event.',
    event: 'generate_lead',
    payload: { lead_type: 'newsletter', value: 1 },
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Site search query submitted.',
    event: 'search',
    payload: { search_term: 'consent management' },
  },
  {
    id: 'share',
    label: 'Share',
    description: 'Content shared via social or native share.',
    event: 'share',
    payload: { method: 'email', content_type: 'article', item_id: 'post-001' },
  },
  {
    id: 'tutorial_complete',
    label: 'Tutorial complete',
    description: 'Onboarding or tutorial finished.',
    event: 'tutorial_complete',
    payload: { tutorial_name: 'CMP Setup Guide' },
  },
  {
    id: 'custom_event',
    label: 'Custom event',
    description: 'Arbitrary custom event for tag trigger testing.',
    event: 'cmp_test_event',
    payload: { category: 'cmp_testing', action: 'button_click' },
  },
]

function formatTime() {
  return new Date().toTimeString().slice(0, 8)
}

export default function GtmIntegration() {
  const [logs, setLogs] = useState([])
  const [tagState, setTagState] = useState({})

  useEffect(() => {
    // Get gtm container ID from environment
    const gtmContainerId = process.env.VITE_GTM_CONTAINER_ID
    console.log('gtmContainerId', gtmContainerId)

    if(!gtmContainerId) {
      return
    }

    // Load Gtm integration script
    const script = document.createElement('script')
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtmContainerId
    document.head.appendChild(script)

    // Initialize Gtm
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    window.dataLayer.push({ 'gtm.containerId': gtmContainerId })
    window.gtag = function() { dataLayer.push(arguments) }

    return () => {
      script.remove()
      window.dataLayer = []
      window.gtag = null
    }
  }, [])

  const addLog = useCallback((type, message) => {
    setLogs((prev) => [{ time: formatTime(), type, message }, ...prev])
  }, [])

  const fireTag = (action) => {
    window.dataLayer = window.dataLayer || []
    const payload = { event: action.event, ...action.payload }
    window.dataLayer.push(payload)

    const time = formatTime()
    setTagState((prev) => ({
      ...prev,
      [action.id]: {
        count: (prev[action.id]?.count ?? 0) + 1,
        lastFired: time,
      },
    }))
    addLog('event', `[TAG] ${action.label} — dataLayer.push(${JSON.stringify(payload)})`)
  }

  return (
    <PageLayout>
      <UseCaseHeader badge="GTM integration" badgeAccent />

      <Hero
        label="Use case"
        title="Google Tag Manager integration"
        description="Test how GTM containers interact with the CMP banner. Verify that tags fire only after consent, autoblocking holds GTM until permitted, and custom events reach your triggers."
      />

      <section className="section">
        <h2 className="section-title">What is GTM?</h2>
        <p className="text-muted gtm-intro">
          Google Tag Manager (GTM) is a tag management system that lets you deploy and manage
          marketing and analytics tags without changing site code. Tags are grouped in a container
          and fired by triggers based on page events, user actions, or the <code>dataLayer</code>.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Use cases</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="icon">{'\u{1F6E1}\uFE0F'}</div>
            <h3>Consent gating</h3>
            <p>Confirm GTM and its tags stay blocked until the user grants the relevant consent category.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F4E1}'}</div>
            <h3>Tag firing</h3>
            <p>Push test events to the dataLayer and verify triggers fire the expected tags in GTM Preview mode.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F517}'}</div>
            <h3>CMP + GTM sync</h3>
            <p>Validate that consent updates propagate to GTM consent mode or custom consent variables.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Fire GTM tags &amp; watch the log</h2>
        <p className="text-muted gtm-tag-intro">
          Click a tag on the left to push an event to <code>window.dataLayer</code>. The button
          updates with its fire count and timestamp, and the log on the right captures the full
          payload &mdash; visible side-by-side.
        </p>

        <div className="gtm-workspace">
          <div className="gtm-workspace-tags">
            <div className="gtm-tag-grid">
              {TAG_ACTIONS.map((action) => {
                const state = tagState[action.id]
                const fired = Boolean(state?.count)
                return (
                  <button
                    key={action.id}
                    type="button"
                    className={`gtm-tag-btn${fired ? ' gtm-tag-btn--fired' : ''}`}
                    onClick={() => fireTag(action)}
                  >
                    <span className="gtm-tag-btn-row">
                      <span className="gtm-tag-btn-label">{action.label}</span>
                      {fired && (
                        <span className="gtm-tag-btn-count" title="Fire count">
                          &times;{state.count}
                        </span>
                      )}
                    </span>
                    <span className="gtm-tag-btn-desc">{action.description}</span>
                    <span className="gtm-tag-btn-meta">
                      <span className="gtm-tag-btn-event">{action.event}</span>
                      {fired ? (
                        <span className="gtm-tag-btn-status gtm-tag-btn-status--fired">
                          fired {state.lastFired}
                        </span>
                      ) : (
                        <span className="gtm-tag-btn-status">not fired</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <aside className="gtm-workspace-log">
            <div className="event-log gtm-log-sticky">
              <div className="event-log-header">
                <span>gtm-integration &middot; dataLayer events</span>
                <button
                  type="button"
                  className="btn-clear-log"
                  onClick={() => {
                    setLogs([])
                    setTagState({})
                  }}
                >
                  clear
                </button>
              </div>
              <div className="event-log-body gtm-log-body">
                {logs.length === 0 ? (
                  <span className="log-empty">
                    No events yet. Fire a tag on the left to see activity here.
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
          </aside>
        </div>
      </section>

      <Footer />
    </PageLayout>
  )
}
