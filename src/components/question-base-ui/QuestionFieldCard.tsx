import { useRef, useState, type FormEvent, type HTMLAttributes } from 'react'
import './QuestionTextCard.css'
import './QuestionFieldCard.css'

export type QuestionFieldInputType = 'email' | 'tel' | 'number' | 'date' | 'time'

type QuestionFieldCardProps = {
  current?: number
  total?: number
  label: string
  description?: string
  type: QuestionFieldInputType
  placeholder?: string
  value?: string
  defaultValue?: string
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  required?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  maxLength?: number
  formatValue?: (value: string) => string
  nextLabel?: string
  errorMessage?: string
  onBack?: () => void
  onNext?: (value: string) => void
  onValueChange?: (value: string) => void
}

export function QuestionFieldCard({
  current = 10,
  total = 22,
  label,
  description,
  type,
  placeholder,
  value,
  defaultValue = '',
  inputMode,
  required = true,
  min,
  max,
  step,
  maxLength,
  formatValue,
  nextLabel = 'Próximo',
  errorMessage = 'Preencha este campo para continuar.',
  onBack,
  onNext,
  onValueChange,
}: QuestionFieldCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localValue, setLocalValue] = useState(defaultValue)
  const [errorText, setErrorText] = useState('')
  const inputValue = value ?? localValue
  const isInvalid = errorText !== ''

  function handleChange(nextValue: string) {
    const formattedValue = formatValue ? formatValue(nextValue) : nextValue

    if (value === undefined) setLocalValue(formattedValue)
    if (errorText) setErrorText('')
    onValueChange?.(formattedValue)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if ((required && inputValue.trim() === '') || !inputRef.current?.validity.valid) {
      setErrorText(errorMessage)
      inputRef.current?.reportValidity()
      return
    }

    onNext?.(inputValue)
  }

  return (
    <form className="question-card question-card--field" onSubmit={handleSubmit}>
      <div className="question-card__meta">
        {String(current).padStart(2, '0')} de {total}
      </div>

      <div className="question-card__copy">
        <h1>{label}</h1>
        {description && <p>{description}</p>}
      </div>

      <div className="question-card__field">
        <input
          aria-invalid={isInvalid}
          aria-label={label}
          className="question-card__input question-field-card__input"
          inputMode={inputMode}
          max={max}
          maxLength={maxLength}
          min={min}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          ref={inputRef}
          required={required}
          step={step}
          type={type}
          value={inputValue}
        />
        {isInvalid && (
          <small className="question-card__error">
            {errorText}
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
