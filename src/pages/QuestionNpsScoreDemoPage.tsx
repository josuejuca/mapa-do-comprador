import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionNpsScoreCard } from '../components/question-base-ui'

export default function QuestionNpsScoreDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionNpsScoreCard
        current={8}
        total={22}
        label="O quanto você recomendaria esta experiência?"
        onBack={() => navigate('/question-base/csat')}
        onNext={() => navigate('/question-base/textarea')}
      />
    </QuestionBaseUI>
  )
}
