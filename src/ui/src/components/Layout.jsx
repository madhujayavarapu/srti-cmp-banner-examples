import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export function PageLayout({ narrow, children }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`page${narrow ? ' page--narrow' : ''}`}>
      {children}
    </div>
  )
}

export function UseCaseHeader({ backLabel = 'All use cases', badge, badgeAccent }) {
  return (
    <header>
      <Link to="/" className="back-link">{backLabel}</Link>
      <span className={`badge${badgeAccent ? ' badge--accent' : ''}`}>{badge}</span>
    </header>
  )
}

export function Hero({ label, title, description, center }) {
  return (
    <section className={`hero${center ? ' hero--center' : ''}`}>
      {label && <p className="label">{label}</p>}
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

export function Footer() {
  return (
    <footer>
      <Link to="/">&larr; Back to CMP Banner Testing</Link>
    </footer>
  )
}
