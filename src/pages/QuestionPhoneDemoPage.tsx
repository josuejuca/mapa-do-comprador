import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, useHeroIntro } from '../components/hero-ui'
import { QuestionBaseUI, QuestionFieldCard } from '../components/question-base-ui'

function formatBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function QuestionPhoneDemoPage() {
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
        current={11}
        total={22}
        label="Qual telefone podemos usar para contato?"
        type="tel"
        inputMode="tel"
        placeholder="(00) 00000-0000"
        maxLength={15}
        formatValue={formatBrazilianPhone}
        onBack={() => navigate('/question-base/email')}
        onNext={() => navigate('/question-base/number')}
      />
    </QuestionBaseUI>
  )
}
