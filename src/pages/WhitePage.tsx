import { useMemo } from 'react'
import { DEFAULT_HERO_CONFIG, HeroHeader, useHeroIntro } from '../components/hero-ui'
import SkylineBrasilia from '../components/SkylineBrasilia'
import './WhitePage.css'

export default function WhitePage() {
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <main className={`white-page ${ready ? 'white-page--ready' : ''}`}>
      <div className="white-loading-clip" aria-hidden="true">
        <div className="white-loading-surface" />
        <div className="white-loading-loader">
          <img className="white-loading-logo" src={assets.logo} alt="" />
        </div>
      </div>

      <div className="white-page-lines" aria-hidden="true">
        <span className="white-line white-line-top" />
        <span className="white-line white-line-header-bottom" />
        <span className="white-line white-line-label-left" />
        <span className="white-line white-line-label-right" />
        <span className="white-line white-line-far-right" />
        <span className="white-line white-line-footer" />
      </div>

      <HeroHeader
        className="white-hero-header"
        logoSrc={assets.logo}
        title={meta.headerTitle}
      />

      <SkylineBrasilia
        className="white-skyline"
        mainColor="#0013351f"
        softColor="#0013351f"
        thinColor="#0013351f"
        hatchColor="#0013351f"
      />
    </main>
  )
}
