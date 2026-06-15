import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionSelectCard } from '../components/question-base-ui'

const visitOptions = [
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' },
  { value: 'fim-de-semana', label: 'Fim de semana' },
  { value: 'outros', label: 'Outros', isOther: true },
]

export default function QuestionSelectDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionSelectCard
        current={15}
        total={22}
        label="Qual período combina melhor com você?"
        options={visitOptions}
        onBack={() => navigate('/question-base/time')}
        onNext={() => navigate('/question-base/text')}
      />
    </QuestionBaseUI>
  )
}
