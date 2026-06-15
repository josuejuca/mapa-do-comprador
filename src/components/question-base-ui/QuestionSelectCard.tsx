import { useState, type FormEvent } from 'react'
import './QuestionTextCard.css'
import './QuestionSelectCard.css'

export type SelectOption = {
  value: string
  label: string
  isOther?: boolean
}

type QuestionSelectCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  options: SelectOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  otherValue?: string
  otherPlaceholder?: string
  required?: boolean
  nextLabel?: string
  onBack?: () => void
  onNext?: (value: { selected: string; other?: string }) => void
  onValueChange?: (value: { selected: string; other?: string }) => void
}

export function QuestionSelectCard({
  current = 15,
  total = 22,
  label,
  description,
  options,
  placeholder = 'Selecione...',
  value,
  defaultValue = '',
  otherValue,
  otherPlaceholder = 'Digite sua resposta...',
  required = true,
  nextLabel = 'Próximo',
  onBack,
  onNext,
  onValueChange,
}: QuestionSelectCardProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const [localOtherValue, setLocalOtherValue] = useState(otherValue ?? '')
  const [showError, setShowError] = useState(false)
  const selectedValue = value ?? localValue
  const selectedOption = options.find((option) => option.value === selectedValue)
  const hasOtherSelected = Boolean(selectedOption?.isOther)
  const currentOtherValue = otherValue ?? localOtherValue
  const isInvalid = showError && required && selectedValue === ''
  const isOtherInvalid = showError && hasOtherSelected && currentOtherValue.trim() === ''

  function emit(nextSelected: string, nextOther = currentOtherValue) {
    onValueChange?.({
      selected: nextSelected,
      other: options.find((option) => option.value === nextSelected)?.isOther ? nextOther : undefined,
    })
  }

  function handleSelect(nextValue: string) {
    if (value === undefined) setLocalValue(nextValue)
    if (!options.find((option) => option.value === nextValue)?.isOther && otherValue === undefined) {
      setLocalOtherValue('')
    }
    if (showError) setShowError(false)
    emit(nextValue)
  }

  function handleOtherChange(nextOther: string) {
    if (otherValue === undefined) setLocalOtherValue(nextOther)
    if (showError) setShowError(false)
    emit(selectedValue, nextOther)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const actualInvalid = required && selectedValue === ''
    const actualOtherInvalid = hasOtherSelected && currentOtherValue.trim() === ''

    if (actualInvalid || actualOtherInvalid) {
      setShowError(true)
      return
    }

    onNext?.({
      selected: selectedValue,
      other: hasOtherSelected ? currentOtherValue : undefined,
    })
  }

  return (
    <form className="question-card question-card--select" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="question-card__field select-card__field">
        <select
          aria-invalid={isInvalid}
          aria-label={label}
          className="question-card__input select-card__select"
          onChange={(event) => handleSelect(event.target.value)}
          required={required}
          value={selectedValue}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {hasOtherSelected && (
        <div className="select-card__other">
          <input
            aria-invalid={isOtherInvalid}
            aria-label="Descreva a opção Outro"
            className="question-card__input select-card__other-input"
            onChange={(event) => handleOtherChange(event.target.value)}
            placeholder={otherPlaceholder}
            type="text"
            value={currentOtherValue}
          />
        </div>
      )}

      {(isInvalid || isOtherInvalid) && (
        <small className="question-card__error">
          {isOtherInvalid ? 'Descreva a opção Outro para continuar.' : 'Escolha uma opção para continuar.'}
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
