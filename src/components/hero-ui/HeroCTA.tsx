type HeroCTAProps = {
  href: string
  label: string
  onClick?: () => void
}

export function HeroCTA({ href, label, onClick }: HeroCTAProps) {
  const content = (
    <>
      <span className="hero-cta-label">{label}</span>
      <svg
        className="hero-cta-arrow"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  )

  return (
    <div className="hero-cta-wrap">
      {onClick ? (
        <button className="hero-cta" onClick={onClick} type="button">
          {content}
        </button>
      ) : (
        <a className="hero-cta" href={href}>
          {content}
        </a>
      )}
    </div>
  )
}
