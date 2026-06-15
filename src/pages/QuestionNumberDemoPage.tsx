import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionFieldCard } from '../components/question-base-ui'

export default function QuestionNumberDemoPage() {
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
        current={12}
        total={22}
        label="Quantas pessoas vão morar no imóvel?"
        type="number"
        inputMode="numeric"
        min={1}
        placeholder="Digite um número"
        onBack={() => navigate('/question-base/phone')}
        onNext={() => navigate('/question-base/date')}
      />
    </QuestionBaseUI>
  )
}
