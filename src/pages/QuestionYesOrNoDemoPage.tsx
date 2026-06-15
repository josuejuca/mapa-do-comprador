import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionYesOrNoCard } from '../components/question-base-ui'

export default function QuestionYesOrNoDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionYesOrNoCard
        current={2}
        total={22}
        label="Este é o primeiro imóvel que você compra?"
        onBack={() => navigate('/question-base/text')}
        onNext={() => navigate('/question-base/mult-question')}
      />
    </QuestionBaseUI>
  )
}
