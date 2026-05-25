import { Link } from 'react-router-dom'

export default function UseCaseCard({ useCase }) {
  const { id, icon, title, description, arrow, accentBg, accent, placeholder } = useCase

  if (placeholder) {
    return (
      <div
        className="card card--placeholder"
        style={{ '--card-accent': accent }}
      >
        <div className="card-icon" style={{ background: accentBg }}>{icon}</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <span className="card-arrow"></span>
      </div>
    )
  }

  return (
    <Link
      to={`/${id}`}
      className="card"
      style={{ '--card-accent': accent }}
    >
      <div className="card-icon" style={{ background: accentBg }}>{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="card-arrow">{arrow}</span>
    </Link>
  )
}
