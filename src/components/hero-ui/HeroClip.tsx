type HeroClipProps = {
  logoSrc: string
}

export function HeroClip({ logoSrc }: HeroClipProps) {
  return (
    <div className="hero-clip" aria-hidden="true">
      <div className="hero-clip-surface" />

      <div className="hero-loader" aria-hidden="true">
        <span className="hero-loader-ring" />
        <div className="hero-loader-logo-wrap">
          <img className="hero-loader-logo" src={logoSrc} alt="" />
        </div>
      </div>

      <img className="hero-clip-logo" src={logoSrc} alt="" />
    </div>
  )
}
