import { useState } from 'react'
import './QuestionTextCard.css'
import './QuestionRatingCard.css'

type RatingValue = '1' | '2' | '3' | '4' | '5'

type RatingOption = {
  value: RatingValue
  label: string
}

type QuestionRatingCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  options?: RatingOption[]
  value?: RatingValue | ''
  defaultValue?: RatingValue | ''
  required?: boolean
  nextLabel?: string
  onBack?: () => void
  onNext?: (value: RatingValue) => void
  onValueChange?: (value: RatingValue) => void
}

const DEFAULT_OPTIONS: RatingOption[] = [
  { value: '1', label: 'Péssimo' },
  { value: '2', label: 'Ruim' },
  { value: '3', label: 'Regular' },
  { value: '4', label: 'Bom' },
  { value: '5', label: 'Ótimo' },
]

export function QuestionRatingCard({
  current = 6,
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
}: QuestionRatingCardProps) {
  const [localValue, setLocalValue] = useState<RatingValue | ''>(defaultValue)
  const [showError, setShowError] = useState(false)
  const selectedValue = value ?? localValue
  const isInvalid = showError && required && selectedValue === ''

  function handleSelect(nextValue: RatingValue) {
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
    <form className="question-card question-card--rating" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="rating-options" role="radiogroup" aria-label={label} aria-invalid={isInvalid}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value

          return (
            <button
              aria-checked={isSelected}
              className={`rating-option ${isSelected ? 'rating-option--selected' : ''}`}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              role="radio"
              title={option.label}
              type="button"
            >
              <span>{option.value}</span>
              <small>{option.label}</small>
            </button>
          )
        })}
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
