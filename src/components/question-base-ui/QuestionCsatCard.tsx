import { useState } from 'react'
import './QuestionTextCard.css'
import './QuestionCsatCard.css'

type CsatValue = '1' | '2' | '3' | '4' | '5'

type CsatOption = {
  value: CsatValue
  emoji: string
  label: string
}

type QuestionCsatCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  options?: CsatOption[]
  value?: CsatValue | ''
  defaultValue?: CsatValue | ''
  required?: boolean
  nextLabel?: string
  onBack?: () => void
  onNext?: (value: CsatValue) => void
  onValueChange?: (value: CsatValue) => void
}

const DEFAULT_OPTIONS: CsatOption[] = [
  { value: '1', emoji: '😡', label: 'Péssimo' },
  { value: '2', emoji: '😕', label: 'Ruim' },
  { value: '3', emoji: '😐', label: 'Regular' },
  { value: '4', emoji: '😊', label: 'Bom' },
  { value: '5', emoji: '😍', label: 'Ótimo' },
]

export function QuestionCsatCard({
  current = 7,
  total = 22,
  label,
  description,
  options = DEFAULT_OPTIONS,
  value,
  defaultValue = '',
  required = true,
  nextLabel = 'Próximo',
  onBack,
  onNext,
  onValueChange,
}: QuestionCsatCardProps) {
  const [localValue, setLocalValue] = useState<CsatValue | ''>(defaultValue)
  const [showError, setShowError] = useState(false)
  const selectedValue = value ?? localValue
  const isInvalid = showError && required && selectedValue === ''

  function handleSelect(nextValue: CsatValue) {
    if (value === undefined) setLocalValue(nextValue)
    if (showError) setShowError(false)
    onValueChange?.(nextValue)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (required && selectedValue === '') {
      setShowError(true)
      return
    }

    if (selectedValue) onNext?.(selectedValue)
  }

  return (
    <form className="question-card question-card--csat" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="csat-options" role="radiogroup" aria-label={label} aria-invalid={isInvalid}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value

          return (
            <button
              aria-checked={isSelected}
              className={`csat-option ${isSelected ? 'csat-option--selected' : ''}`}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              role="radio"
              type="button"
            >
              <span className="csat-option__emoji" aria-hidden="true">{option.emoji}</span>
              <strong>{option.label}</strong>
            </button>
          )
        })}
      </div>

      {isInvalid && (
        <small className="question-card__error">
          Escolha uma opção para continuar.
        </small>
      )}

      <div className="question-card__actions">
        <button className="question-card__button question-card__button--ghost" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Voltar
        </button>

        <button className="question-card__button question-card__button--primary" type="submit">
          {nextLabel}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  )
}
