import { useMatches } from 'react-router-dom'
import { PageLayout, UseCaseHeader, Hero, Footer } from '../components/Layout'
import { resolveCmpConfig } from '../data/cmpConfigs'

export default function BannerTesting() {
  const cmpConfig = resolveCmpConfig(useMatches())
  return (
    <PageLayout narrow>
      <UseCaseHeader badge="Banner test" />

      <Hero
        label="Use case"
        title="Banner testing (IAB + Autoblocking)"
        description="Run the full consent banner with IAB TCF and autoblocking scripts. Validates banner display, consent capture, and script blocking."
      />

      <section className="section">
        <h2 className="section-title">CMP Scripts</h2>
        <div className="cmp-provider-block">
          <p className="cmp-provider-hint">
            The autoblocking and consent SDK scripts are loaded when you open this view.<br />
            Tenant: <code>{cmpConfig.tenantUUID}</code><br />
            Domain: <code>{cmpConfig.domainUUID}</code>
          </p>
        </div>
      </section>

      <Footer />
    </PageLayout>
  )
}
