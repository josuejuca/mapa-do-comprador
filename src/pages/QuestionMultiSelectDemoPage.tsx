import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionMultiSelectCard } from '../components/question-base-ui'

const OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'quadraimob-site', label: 'Site da Quadraimob' },
  { value: 'broker', label: 'Corretor' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'builder-site', label: 'Site da construtora' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'google', label: 'Google' },
  { value: 'real-estate-portal', label: 'Portal imobiliário' },
  { value: 'event', label: 'Evento/Feira' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'friends-family', label: 'Indicação de amigos/familiares' },
  { value: 'other', label: 'Outro', isOther: true },
]

export default function QuestionMultiSelectDemoPage() {
  const navigate = useNavigate()
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const ready = useHeroIntro(criticalAssets)

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle}>
      <QuestionMultiSelectCard
        current={4}
        total={22}
        label="Como você conheceu este empreendimento?"
        options={OPTIONS}
        otherPlaceholder="Conte como você conheceu..."
        onBack={() => navigate('/question-base/yes-or-not')}
        onNext={() => navigate('/question-base/radio')}
      />
    </QuestionBaseUI>
  )
}
