type HeroBackgroundProps = {
  src: string
}

export function HeroBackground({ src }: HeroBackgroundProps) {
  return (
    <div className="hero-bg" aria-hidden="true">
      <img src={src} alt="" />
      <div className="hero-bg-tint" />
    </div>
  )
}
