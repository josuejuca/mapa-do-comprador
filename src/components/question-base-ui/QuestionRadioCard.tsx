import { useState } from 'react'
import './QuestionTextCard.css'
import './QuestionRadioCard.css'

export type RadioOption = {
  value: string
  label: string
  isOther?: boolean
}

type RadioPayload = {
  selected: string
  other?: string
}

type QuestionRadioCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  options: RadioOption[]
  value?: string
  defaultValue?: string
  otherValue?: string
  otherPlaceholder?: string
  required?: boolean
  nextLabel?: string
  onBack?: () => void
  onNext?: (value: RadioPayload) => void
  onValueChange?: (value: RadioPayload) => void
}

export function QuestionRadioCard({
  current = 5,
  total = 22,
  label,
  description,
  options,
  value,
  defaultValue = '',
  otherValue,
  otherPlaceholder = 'Descreva sua resposta...',
  required = true,
  nextLabel = 'Próximo',
  onBack,
  onNext,
  onValueChange,
}: QuestionRadioCardProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const [localOtherValue, setLocalOtherValue] = useState(otherValue ?? '')
  const [showError, setShowError] = useState(false)

  const selectedValue = value ?? localValue
  const currentOtherValue = otherValue ?? localOtherValue
  const selectedOption = options.find((opt) => opt.value === selectedValue)
  const hasOtherSelected = Boolean(selectedOption?.isOther)

  const actualInvalid = required && (
    selectedValue === '' || (hasOtherSelected && currentOtherValue.trim() === '')
  )

  function handleSelect(nextValue: string) {
    if (value === undefined) setLocalValue(nextValue)
    if (showError) setShowError(false)
    const opt = options.find((o) => o.value === nextValue)
    onValueChange?.({ selected: nextValue, other: opt?.isOther ? currentOtherValue : undefined })
  }

  function handleOtherChange(text: string) {
    if (otherValue === undefined) setLocalOtherValue(text)
    onValueChange?.({ selected: selectedValue, other: text })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (actualInvalid) {
      setShowError(true)
      return
    }

    onNext?.({ selected: selectedValue, other: hasOtherSelected ? currentOtherValue : undefined })
  }

  const isInvalid = showError && actualInvalid
  const isGridMode = options.length > 5

  return (
    <form
      className={`question-card question-card--radio${isGridMode ? ' question-card--radio-grid' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      {isGridMode ? (
        <>
          <span className="radio-grid-accent" aria-hidden="true" />
          <div className="radio-grid" role="radiogroup" aria-label={label} aria-invalid={isInvalid}>
            {options.map((option) => {
              const isSelected = selectedValue === option.value
              return (
                <label
                  className={`radio-grid-option${isSelected ? ' radio-grid-option--selected' : ''}`}
                  key={option.value}
                >
                  <input
                    checked={isSelected}
                    name="question-radio"
                    onChange={() => handleSelect(option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <span className="radio-grid-option__box" aria-hidden="true" />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </>
      ) : (
        <div className="radio-options" role="radiogroup" aria-label={label} aria-invalid={isInvalid}>
          {options.map((option) => {
            const isSelected = selectedValue === option.value
            return (
              <label className={`radio-option ${isSelected ? 'radio-option--selected' : ''}`} key={option.value}>
                <input
                  checked={isSelected}
                  name="question-radio"
                  onChange={() => handleSelect(option.value)}
                  type="radio"
                  value={option.value}
                />
                <span className="radio-option__mark" aria-hidden="true" />
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      )}

      {hasOtherSelected && (
        <div className="question-card__field">
          <input
            aria-invalid={showError && currentOtherValue.trim() === ''}
            aria-label="Descreva sua resposta"
            autoFocus
            className="question-card__input"
            onChange={(e) => handleOtherChange(e.target.value)}
            placeholder={otherPlaceholder}
            type="text"
            value={currentOtherValue}
          />
        </div>
      )}

      {isInvalid && (
        <small className="question-card__error">
          {selectedValue === '' ? 'Escolha uma opção para continuar.' : 'Descreva sua resposta para continuar.'}
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
