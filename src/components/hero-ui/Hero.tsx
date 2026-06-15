import { useMemo } from 'react'
import { DEFAULT_HERO_CONFIG } from './config'
import { HeroBackground } from './HeroBackground'
import { HeroChips } from './HeroChips'
import { HeroClip } from './HeroClip'
import { HeroContent } from './HeroContent'
import { HeroFrame } from './HeroFrame'
import { HeroHeader } from './HeroHeader'
import { HeroShell } from './HeroShell'
import type { HeroConfig } from './types'
import { useHeroIntro } from './useHeroIntro'

type HeroProps = {
  config?: HeroConfig
  onCtaClick?: () => void
  onLogoClick?: () => void
}

export default function Hero({ config = DEFAULT_HERO_CONFIG, onCtaClick, onLogoClick }: HeroProps) {
  const { assets, copy, meta } = config
  const criticalAssets = useMemo(
    () => [assets.background, assets.logo, assets.logoDark],
    [assets.background, assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <HeroShell ready={ready}>
      <HeroBackground src={assets.background} />
      <HeroClip logoSrc={assets.logo} />
      <HeroFrame />
      <HeroHeader logoSrc={assets.logoDark} title={meta.headerTitle} onLogoClick={onLogoClick} />
      <HeroContent
        eyebrow={copy.eyebrow}
        title={copy.title}
        titleAriaLabel={copy.titleAriaLabel}
        lede={copy.lede}
        cta={copy.cta}
        onCtaClick={onCtaClick}
      />
      <HeroChips
        editionLabel={meta.editionLabel}
        editionValue={meta.editionValue}
        satisfactionLabel={meta.satisfactionLabel}
      />
    </HeroShell>
  )
}
