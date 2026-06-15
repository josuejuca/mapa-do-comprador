import { useState } from 'react'
import './QuestionTextCard.css'
import './QuestionNpsScoreCard.css'

type NpsValue = `${0|1|2|3|4|5|6|7|8|9|10}`

type QuestionNpsScoreCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  value?: NpsValue | ''
  defaultValue?: NpsValue | ''
  required?: boolean
  nextLabel?: string
  leftLabel?: string
  rightLabel?: string
  onBack?: () => void
  onNext?: (value: NpsValue) => void
  onValueChange?: (value: NpsValue) => void
}

const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as NpsValue[]

function getTone(value: NpsValue) {
  const numeric = Number(value)
  if (numeric <= 6) return 'detractor'
  if (numeric <= 8) return 'passive'
  return 'promoter'
}

export function QuestionNpsScoreCard({
  current = 8,
  total = 22,
  label,
  description,
  value,
  defaultValue = '',
  required = true,
  nextLabel = 'Próximo',
  leftLabel = 'Muito improvável',
  rightLabel = 'Muito provável',
  onBack,
  onNext,
  onValueChange,
}: QuestionNpsScoreCardProps) {
  const [localValue, setLocalValue] = useState<NpsValue | ''>(defaultValue)
  const [showError, setShowError] = useState(false)
  const selectedValue = value ?? localValue
  const isInvalid = showError && required && selectedValue === ''

  function handleSelect(nextValue: NpsValue) {
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
    <form className="question-card question-card--nps" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="nps-options" role="radiogroup" aria-label={label} aria-invalid={isInvalid}>
        {VALUES.map((optionValue) => {
          const isSelected = selectedValue === optionValue

          return (
            <button
              aria-checked={isSelected}
              className={`nps-option nps-option--${getTone(optionValue)} ${isSelected ? 'nps-option--selected' : ''}`}
              key={optionValue}
              onClick={() => handleSelect(optionValue)}
              role="radio"
              type="button"
            >
              {optionValue}
            </button>
          )
        })}
      </div>

      <div className="nps-labels" aria-hidden="true">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      {isInvalid && (
        <small className="question-card__error">
          Escolha uma nota para continuar.
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
