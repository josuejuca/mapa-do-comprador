import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionRadioCard } from '../components/question-base-ui'

const OPTIONS = [
  { value: 'less-than-1-month', label: 'Menos de 1 mês' },
  { value: '1-to-3-months', label: 'De 1 a 3 meses' },
  { value: '3-to-6-months', label: 'De 3 a 6 meses' },
  { value: '6-months-to-1-year', label: 'De 6 meses a 1 ano' },
  { value: 'more-than-1-year', label: 'Mais de 1 ano' },
]

export default function QuestionRadioDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionRadioCard
        current={5}
        total={22}
        label="Durante quanto tempo você procurou um imóvel antes desta compra?"
        options={OPTIONS}
        onBack={() => navigate('/question-base/mult-question')}
        onNext={() => navigate('/question-base/rating')}
      />
    </QuestionBaseUI>
  )
}
