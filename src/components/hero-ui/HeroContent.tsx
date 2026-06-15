import type { ReactNode } from 'react'
import { HeroCTA } from './HeroCTA'
import { IntroLine } from './IntroLine'

type HeroContentProps = {
  eyebrow: ReactNode
  title: ReactNode
  titleAriaLabel: string
  lede: ReactNode
  cta: {
    href: string
    label: string
  }
  onCtaClick?: () => void
}

export function HeroContent({
  eyebrow,
  title,
  titleAriaLabel,
  lede,
  cta,
  onCtaClick,
}: HeroContentProps) {
  return (
    <div className="hero-content">
      <div className="hero-content-inner">
        <small className="hero-eyebrow">
          <IntroLine>{eyebrow}</IntroLine>
        </small>

        <h1 className="hero-title" aria-label={titleAriaLabel}>
          <IntroLine delay={0.08}>{title}</IntroLine>
        </h1>

        <div className="hero-lede-wrap">
          <p className="hero-lede">{lede}</p>
        </div>

        <HeroCTA href={cta.href} label={cta.label} onClick={onCtaClick} />
      </div>
    </div>
  )
}
