import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionTextCard } from '../components/question-base-ui'

export default function QuestionTextDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI
      ready={ready}
      logoSrc={assets.logo}
      title={meta.headerTitle}
    >
      <QuestionTextCard
        current={1}
        total={22}
        label="Nome do empreendimento"
        placeholder="Digite o nome do empreendimento"
        onNext={() => navigate('/question-base/yes-or-not')}
      />
    </QuestionBaseUI>
  )
}
