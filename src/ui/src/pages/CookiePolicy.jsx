import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'
import { COOKIE_POLICY_SECTIONS, RETENTION_POLICY } from '../data/cookiePolicy'

const CATEGORY_COLORS = {
  Analytics: 'analytics',
  Advertising: 'advertising',
  Essential: 'essential',
  Functional: 'functional',
}

export default function CookiePolicy() {
  const totalCookies = COOKIE_POLICY_SECTIONS.reduce(
    (sum, section) => sum + section.cookies.length,
    0,
  )

  return (
    <PageLayout narrow>
      <UseCaseHeader badge="Cookie policy" />

      <Hero
        label="Policy"
        title="Cookie policy"
        description="This page describes the cookies set on this CMP test site by the scripts loaded in index.html. Values and retention periods match the test scripts in advertising.js, analytics.js, and performance-functionality.js."
      />

      <section className="section">
        <h2 className="section-title">Overview</h2>
        <p className="cookie-policy-lead">
          This is a <strong>dummy policy</strong> for internal CMP testing only — not a production privacy notice.
          Three scripts are injected on every page load via <code>index.html</code> and drop{' '}
          <strong>{totalCookies} cookies</strong> across analytics and advertising categories.
          When the Securiti CMP banner and autoblocking are active, non-essential cookies should only persist after the visitor grants the matching consent category.
        </p>
        <div className="cookie-policy-summary">
          {COOKIE_POLICY_SECTIONS.map((section) => (
            <div key={section.id} className="cookie-policy-summary__item">
              <code>{section.script}</code>
              <span>{section.cookies.length} cookie{section.cookies.length === 1 ? '' : 's'}</span>
            </div>
          ))}
        </div>
      </section>

      {COOKIE_POLICY_SECTIONS.map((section) => (
        <section key={section.id} className="section">
          <h2 className="section-title">{section.script}</h2>
          <p className="cookie-policy-lead">{section.description}</p>
          <div className="cookie-policy-table-wrap">
            <table className="cookie-policy-table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Category</th>
                  <th>Provider</th>
                  <th>Purpose</th>
                  <th>Retention</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {section.cookies.map((cookie) => (
                  <tr key={cookie.name}>
                    <td><code>{cookie.name}</code></td>
                    <td>
                      <span className={`cookie-policy-category cookie-policy-category--${CATEGORY_COLORS[cookie.category] || 'default'}`}>
                        {cookie.category}
                      </span>
                    </td>
                    <td>{cookie.provider}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.retention}</td>
                    <td>{cookie.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="section">
        <h2 className="section-title">Retention policy</h2>
        <p className="cookie-policy-lead">
          Retention periods below reflect the <code>max-age</code> values set in each test script.
          Cookies expire automatically when the period elapses unless consent is refreshed or the cookie is cleared by the browser.
        </p>
        <div className="cookie-policy-retention">
          {RETENTION_POLICY.map((item) => (
            <article key={item.category} className="cookie-policy-retention__card">
              <h3>{item.category}</h3>
              <p className="cookie-policy-retention__policy">{item.policy}</p>
              <p className="cookie-policy-retention__default">
                Default retention: <strong>{item.defaultRetention}</strong>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How cookies are loaded on this site</h2>
        <div className="cookie-policy-code-block">
          <div className="cookie-policy-code-block__header">index.html</div>
          <pre>{`<script src="/advertising.js"></script>
<script src="/analytics.js"></script>
<script src="/performance-functionality.js"></script>`}</pre>
        </div>
        <p className="cookie-policy-lead cookie-policy-lead--spaced">
          Each script uses <code>document.cookie</code> to set test values immediately on page load.
          Use browser DevTools → Application → Cookies to verify which cookies are present before and after consent.
        </p>
      </section>

      <Footer />
    </PageLayout>
  )
}
