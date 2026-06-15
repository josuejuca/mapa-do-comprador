import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionCsatCard } from '../components/question-base-ui'

export default function QuestionCsatDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionCsatCard
        current={7}
        total={22}
        label="Qual é seu nível de satisfação com esta jornada?"
        onBack={() => navigate('/question-base/rating')}
        onNext={() => navigate('/question-base/nps-score')}
      />
    </QuestionBaseUI>
  )
}
