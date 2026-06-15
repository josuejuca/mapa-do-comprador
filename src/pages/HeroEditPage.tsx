import {
  DEFAULT_CRITICAL_ASSETS,
  DEFAULT_HERO_CONFIG,
  HeroBackground,
  HeroChips,
  HeroClip,
  HeroContent,
  HeroFrame,
  HeroHeader,
  HeroShell,
  useHeroIntro,
} from '../components/hero-ui'

export default function HeroEditPage() {
  const ready = useHeroIntro(DEFAULT_CRITICAL_ASSETS)
  const { assets, copy, meta } = DEFAULT_HERO_CONFIG

  return (
    <HeroShell ready={ready} className="hero--edit">
      <HeroBackground src={assets.background} />
      <HeroClip logoSrc={assets.logo} />
      <HeroFrame />
      <HeroHeader logoSrc={assets.logoDark} title={meta.headerTitle} />
      <HeroContent
        eyebrow={copy.eyebrow}
        title={copy.title}
        titleAriaLabel={copy.titleAriaLabel}
        lede={copy.lede}
        cta={copy.cta}
      />
      <HeroChips
        editionLabel={meta.editionLabel}
        editionValue={meta.editionValue}
        satisfactionLabel={meta.satisfactionLabel}
      />
    </HeroShell>
  )
}
