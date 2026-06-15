import { useState } from 'react'
import { Check, X } from 'lucide-react'
import './QuestionTextCard.css'
import './QuestionYesOrNoCard.css'

type YesOrNoValue = 'yes' | 'no'

type QuestionYesOrNoCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  value?: YesOrNoValue
  defaultValue?: YesOrNoValue
  required?: boolean
  nextLabel?: string
  yesLabel?: string
  noLabel?: string
  onBack?: () => void
  onNext?: (value: YesOrNoValue) => void
  onValueChange?: (value: YesOrNoValue) => void
}

const OPTIONS = [
  { value: 'yes' as const, label: 'Sim' },
  { value: 'no' as const, label: 'Não' },
]

export function QuestionYesOrNoCard({
  current = 2,
  total = 22,
  label,
  description,
  value,
  defaultValue,
  required = true,
  nextLabel = 'Próximo',
  yesLabel = 'Sim',
  noLabel = 'Não',
  onBack,
  onNext,
  onValueChange,
}: QuestionYesOrNoCardProps) {
  const [localValue, setLocalValue] = useState<YesOrNoValue | undefined>(defaultValue)
  const [showError, setShowError] = useState(false)
  const selectedValue = value ?? localValue
  const isInvalid = showError && required && !selectedValue

  const options = OPTIONS.map((option) => ({
    ...option,
    label: option.value === 'yes' ? yesLabel : noLabel,
  }))

  function handleSelect(nextValue: YesOrNoValue) {
    if (value === undefined) setLocalValue(nextValue)
    if (showError) setShowError(false)
    onValueChange?.(nextValue)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (required && !selectedValue) {
      setShowError(true)
      return
    }

    if (selectedValue) onNext?.(selectedValue)
  }

  return (
    <form className="question-card question-card--yes-or-no" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="yes-no-options" role="radiogroup" aria-label={label} aria-invalid={isInvalid}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value

          return (
            <button
              aria-checked={isSelected}
              className={`yes-no-option ${isSelected ? 'yes-no-option--selected' : ''}`}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              role="radio"
              type="button"
            >
              <span className="yes-no-option__check" aria-hidden="true" />
              <span className="yes-no-option__icon" aria-hidden="true">
                {option.value === 'yes' ? (
                  <Check className="yes-no-option__symbol yes-no-option__symbol--yes" strokeWidth={2.25} />
                ) : (
                  <X className="yes-no-option__symbol yes-no-option__symbol--no" strokeWidth={2.25} />
                )}
              </span>
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
