import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'

export default function RiskAnalysis() {
  return (
    <PageLayout narrow>
      <UseCaseHeader badge="Risk analysis" badgeAccent />

      <Hero
        label="Use case"
        title="Risk analysis"
        description="Test how consent signals and cookie scans feed into risk scoring. Add your CMP provider script below to run risk analysis in this environment."
      />

      <section className="section">
        <h2 className="section-title">What you can test</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="icon">{'\u{1F4CA}'}</div>
            <h3>Risk score</h3>
            <p>Verify how consent state and cookie coverage affect the computed risk level.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F517}'}</div>
            <h3>Consent signals</h3>
            <p>Confirm that consent choices are correctly passed into the risk engine.</p>
          </div>
          <div className="info-card">
            <div className="icon">{'\u{1F4CB}'}</div>
            <h3>Report output</h3>
            <p>Check report structure and export for audits and compliance reviews.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Risk output</h2>
        <div className="risk-preview">
          <div className="risk-preview-header">risk-analysis &middot; output</div>
          <div className="risk-preview-body">
            <div className="risk-score-row">
              <span className="score-dot" />
              <span>Results will appear here after the CMP provider runs.</span>
            </div>
            <p>
              Use this page to validate risk analysis behavior once your script is loaded.
              You can replace this placeholder with your own UI or leave it as a reference.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </PageLayout>
  )
}
