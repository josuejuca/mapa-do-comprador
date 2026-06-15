import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionTextareaCard } from '../components/question-base-ui'

export default function QuestionTextareaDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionTextareaCard
        current={9}
        total={22}
        label="Conte um pouco mais sobre sua experiência"
        placeholder="Escreva sua resposta..."
        onBack={() => navigate('/question-base/nps-score')}
        onNext={() => navigate('/question-base/email')}
      />
    </QuestionBaseUI>
  )
}
