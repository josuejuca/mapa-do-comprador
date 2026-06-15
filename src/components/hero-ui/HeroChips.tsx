type HeroChipsProps = {
  editionLabel: string
  editionValue: string
  satisfactionLabel: string
}

export function HeroChips({
  editionLabel,
  editionValue,
  satisfactionLabel,
}: HeroChipsProps) {
  return (
    <>
      <ul className="hero-chip hero-chip-tl">
        <li><small>{editionLabel}</small></li>
        <li><strong>{editionValue}</strong></li>
      </ul>

      <div className="hero-chip hero-chip-br">
        <small>{satisfactionLabel}</small>
        <div className="hero-chip-bar"><span /></div>
      </div>
    </>
  )
}
