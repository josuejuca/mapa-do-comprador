import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionFieldCard } from '../components/question-base-ui'

export default function QuestionDateDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionFieldCard
        current={13}
        total={22}
        label="Qual data faz mais sentido para a sua visita?"
        type="date"
        onBack={() => navigate('/question-base/number')}
        onNext={() => navigate('/question-base/time')}
      />
    </QuestionBaseUI>
  )
}
