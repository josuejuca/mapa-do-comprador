import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionRatingCard } from '../components/question-base-ui'

export default function QuestionRatingDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionRatingCard
        current={6}
        total={22}
        label="Como você avalia sua experiência até aqui?"
        onBack={() => navigate('/question-base/radio')}
        onNext={() => navigate('/question-base/csat')}
      />
    </QuestionBaseUI>
  )
}
