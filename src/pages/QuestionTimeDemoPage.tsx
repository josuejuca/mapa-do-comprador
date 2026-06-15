import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionFieldCard } from '../components/question-base-ui'

export default function QuestionTimeDemoPage() {
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
        current={14}
        total={22}
        label="Qual horário você prefere?"
        type="time"
        onBack={() => navigate('/question-base/date')}
        onNext={() => navigate('/question-base/select')}
      />
    </QuestionBaseUI>
  )
}
