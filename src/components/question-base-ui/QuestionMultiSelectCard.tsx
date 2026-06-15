import { useState } from 'react'
import './QuestionTextCard.css'
import './QuestionMultiSelectCard.css'

export type MultiSelectOption = {
  value: string
  label: string
  isOther?: boolean
}

type QuestionMultiSelectCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  otherValue?: string
  otherPlaceholder?: string
  required?: boolean
  nextLabel?: string
  onBack?: () => void
  onNext?: (value: { selected: string[]; other?: string }) => void
  onValueChange?: (value: { selected: string[]; other?: string }) => void
}

export function QuestionMultiSelectCard({
  current = 4,
  total = 22,
  label,
  description,
  options,
  value,
  defaultValue = [],
  otherValue,
  otherPlaceholder = 'Digite sua resposta...',
  required = true,
  nextLabel = 'Próximo',
  onBack,
  onNext,
  onValueChange,
}: QuestionMultiSelectCardProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const [localOtherValue, setLocalOtherValue] = useState(otherValue ?? '')
  const [showError, setShowError] = useState(false)
  const selectedValues = value ?? localValue
  const otherOption = options.find((option) => option.isOther)
  const hasOtherSelected = Boolean(otherOption && selectedValues.includes(otherOption.value))
  const currentOtherValue = otherValue ?? localOtherValue
  const isInvalid = showError && required && selectedValues.length === 0
  const isOtherInvalid = showError && hasOtherSelected && currentOtherValue.trim() === ''

  function emit(nextSelected: string[], nextOther = currentOtherValue) {
    onValueChange?.({
      selected: nextSelected,
      other: nextOther,
    })
  }

  function handleToggle(optionValue: string) {
    const nextSelected = selectedValues.includes(optionValue)
      ? selectedValues.filter((item) => item !== optionValue)
      : [...selectedValues, optionValue]

    if (value === undefined) setLocalValue(nextSelected)
    if (showError) setShowError(false)
    emit(nextSelected)
  }

  function handleOtherChange(nextOther: string) {
    if (otherValue === undefined) setLocalOtherValue(nextOther)
    if (showError) setShowError(false)
    emit(selectedValues, nextOther)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const actualInvalid = required && selectedValues.length === 0
    const actualOtherInvalid = hasOtherSelected && currentOtherValue.trim() === ''

    if (actualInvalid || actualOtherInvalid) {
      setShowError(true)
      return
    }

    onNext?.({
      selected: selectedValues,
      other: hasOtherSelected ? currentOtherValue : undefined,
    })
  }

  return (
    <form className="question-card question-card--multi-select" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <span className="multi-select-accent" aria-hidden="true" />

      <div className="multi-select-grid">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value)

          return (
            <label className="multi-select-option" key={option.value}>
              <input
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                type="checkbox"
                value={option.value}
              />
              <span className="multi-select-option__box" aria-hidden="true" />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>

      {hasOtherSelected && (
        <div className="multi-select-other">
          <input
            aria-invalid={isOtherInvalid}
            aria-label="Descreva a opção Outro"
            className="question-card__input multi-select-other__input"
            onChange={(event) => handleOtherChange(event.target.value)}
            placeholder={otherPlaceholder}
            type="text"
            value={currentOtherValue}
          />
        </div>
      )}

      {(isInvalid || isOtherInvalid) && (
        <small className="question-card__error">
          {isOtherInvalid ? 'Descreva a opção Outro para continuar.' : 'Escolha pelo menos uma opção para continuar.'}
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
