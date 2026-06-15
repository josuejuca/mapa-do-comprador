import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionFieldCard } from '../components/question-base-ui'

export default function QuestionEmailDemoPage() {
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
        current={10}
        total={22}
        label="Qual é o seu melhor e-mail?"
        type="email"
        placeholder="seu@email.com"
        errorMessage="Digite um e-mail válido para continuar."
        onBack={() => navigate('/question-base/textarea')}
        onNext={() => navigate('/question-base/phone')}
      />
    </QuestionBaseUI>
  )
}
