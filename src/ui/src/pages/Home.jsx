import { PageLayout, Hero } from '../components/Layout'
import UseCaseCard from '../components/UseCaseCard'
import useCases from '../data/useCases'

export default function Home() {
  return (
    <PageLayout>
      <header className="main-header">
        <div className="logo">
          <div className="logo-icon">CMP</div>
          <span className="logo-text">Testing</span>
        </div>
        <span className="badge">Securiti &middot; Dev</span>
      </header>

      <Hero
        center
        title="Consent & compliance testing"
        description="Use these examples to test banner behavior, risk analysis, and compliance report scanning in a controlled environment."
      />

      <p className="section-label">Use cases</p>
      <div className="use-cases">
        {useCases.map((uc) => (
          <UseCaseCard key={uc.id} useCase={uc} />
        ))}
      </div>

      <footer className="main-footer">
        <span className="footer-desc">
          Explore a suite of use cases designed to simplify and accelerate your CMP banner testing.<br />
          Each scenario helps you validate banner behavior, consent logic, risk analysis, and reporting—all in one place.
        </span>
        &middot;{' '}
   
        <a href="https://securiti.xyz" target="_blank" rel="noopener noreferrer">
          Securiti
        </a>
      </footer>
    </PageLayout>
  )
}
