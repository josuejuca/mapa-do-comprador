type HeroHeaderProps = {
  logoSrc: string
  title: string
  href?: string
  onLogoClick?: () => void
  className?: string
}

export function HeroHeader({ logoSrc, title, href = '/', onLogoClick, className }: HeroHeaderProps) {
  const classes = ['hero-header', className].filter(Boolean).join(' ')

  return (
    <header className={classes}>
      <a
        className="hero-brand"
        href={onLogoClick ? '#' : href}
        aria-label="quadraimob - início"
        onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick() } : undefined}
      >
        <img src={logoSrc} alt="quadraimob" />
      </a>
      <span className="hero-header-title">
        <span className="hero-header-title-text">{title}</span>
        <span className="hero-header-title-line hero-header-title-line-top" aria-hidden="true" />
        <span className="hero-header-title-line hero-header-title-line-right" aria-hidden="true" />
        <span className="hero-header-title-line hero-header-title-line-bottom" aria-hidden="true" />
        <span className="hero-header-title-line hero-header-title-line-left" aria-hidden="true" />
      </span>
    </header>
  )
}
