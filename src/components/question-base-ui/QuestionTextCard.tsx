import { useState } from 'react'
import './QuestionTextCard.css'

type QuestionTextCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  required?: boolean
  nextLabel?: string
  onBack?: () => void
  onNext?: (value: string) => void
  onValueChange?: (value: string) => void
}

export function QuestionTextCard({
  current = 1,
  total = 22,
  label,
  description,
  placeholder = 'Digite sua resposta...',
  value,
  defaultValue = '',
  required = true,
  nextLabel = 'Próximo',
  onBack,
  onNext,
  onValueChange,
}: QuestionTextCardProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const [showError, setShowError] = useState(false)
  const inputValue = value ?? localValue
  const isInvalid = showError && required && inputValue.trim() === ''

  function handleChange(nextValue: string) {
    if (value === undefined) setLocalValue(nextValue)
    if (showError) setShowError(false)
    onValueChange?.(nextValue)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (required && inputValue.trim() === '') {
      setShowError(true)
      return
    }

    onNext?.(inputValue)
  }

  return (
    <form className="question-card question-card--text" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1 className=''>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="question-card__field">
        <input
          aria-invalid={isInvalid}
          aria-label={label}
          className="question-card__input"
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={inputValue}
        />
        {isInvalid && (
          <small className="question-card__error">
            Digite uma resposta para continuar.
          </small>
        )}
      </div>

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
