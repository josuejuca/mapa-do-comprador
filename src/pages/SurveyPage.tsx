import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DEFAULT_HERO_CONFIG, Hero, useHeroIntro, type HeroConfig } from '../components/hero-ui'
import {
  QuestionBaseUI,
  QuestionCsatCard,
  QuestionFieldCard,
  QuestionMultiSelectCard,
  QuestionNpsScoreCard,
  QuestionRadioCard,
  QuestionRatingCard,
  QuestionSelectCard,
  QuestionTextareaCard,
  QuestionTextCard,
  QuestionYesOrNoCard,
  type QuestionFieldInputType,
  type MultiSelectOption,
  type RadioOption,
  type SelectOption,
} from '../components/question-base-ui'
import ErrorPage from './ErrorPage'
import './SurveyResultsCard.css'

const SURVEY_API_BASE = 'https://nps-quadraimob.juk.re/api/v1/survey'

type SurveyParams = {
  id: string
}

type QuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'time'
  | 'radio'
  | 'select'
  | 'multiselect'
  | 'yes_no'
  | 'rating'
  | 'csat'
  | 'nps_score'

type SurveyQuestion = {
  id: string
  name: string
  label: string
  description: string | null
  type: QuestionType
  isRequired: boolean
  order: number
  options: string[]
}

type SurveyResponse = {
  enrollment: {
    id: string
    status: string
    openedAt: string | null
    submittedAt: string | null
    contact: {
      name: string | null
    }
  }
  campaign: {
    id: string
    name: string
    type: string
    slug: string
    status: string
  }
  questions: SurveyQuestion[]
  answers: Record<string, string>
}

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; data: SurveyResponse }
  | { status: 'error'; variant: 'invalid-link' | '404' | '500'; detail?: string }

type PageState = 'hero' | 'survey' | 'lgpd' | 'done' | 'results'

type ChoicePayload = {
  selected: string
  other?: string
}

type MultiChoicePayload = {
  selected: string[]
  other?: string
}

const AUTOSAVE_DEBOUNCE_MS = 1500

const RATING_VALUES = ['1', '2', '3', '4', '5'] as const
const NPS_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const

const AUTO_ADVANCE_TYPES: QuestionType[] = ['yes_no', 'radio', 'rating', 'csat', 'nps_score']

function isOtherOption(option: string) {
  return option.trim().toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ') === 'outros'
}

function toChoiceOptions(options: string[]): SelectOption[] {
  return options.map((option) => ({
    value: option,
    label: option,
    isOther: isOtherOption(option),
  }))
}

function toRadioOptions(options: string[]): RadioOption[] {
  return options.map((option) => ({
    value: option,
    label: option,
    isOther: isOtherOption(option),
  }))
}

function toMultiOptions(options: string[]): MultiSelectOption[] {
  return options.map((option) => ({
    value: option,
    label: option,
    isOther: isOtherOption(option),
  }))
}

function formatBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function getAnswerValue(answers: Record<string, string>, question: SurveyQuestion) {
  return answers[question.name] ?? ''
}

function isAnswerValid(question: SurveyQuestion, value: string): boolean {
  switch (question.type) {
    case 'yes_no':
      return value === 'Sim' || value === 'Não'
    case 'multiselect':
      return value.split('|').filter(Boolean).length > 0
    case 'text':
    case 'textarea':
    case 'email':
    case 'phone':
    case 'radio':
      return value.trim() !== ''
    default:
      return value !== ''
  }
}

function getChoiceValue(answer: string, options: string[]) {
  if (options.includes(answer)) return { selected: answer, other: '' }

  const otherOption = options.find(isOtherOption)
  if (answer && otherOption) return { selected: otherOption, other: answer }

  return { selected: '', other: '' }
}

function getMultiValue(answer: string, options: string[]) {
  const selectedValues = answer.split('|').filter(Boolean)
  const otherOption = options.find(isOtherOption)
  const known = selectedValues.filter((item) => options.includes(item))
  const other = selectedValues.find((item) => !options.includes(item)) ?? ''

  if (other && otherOption && !known.includes(otherOption)) known.push(otherOption)

  return {
    selected: known,
    other,
  }
}

function serializeChoice(value: ChoicePayload) {
  if (value.other !== undefined) return value.other || value.selected
  return value.selected
}

function serializeMultiChoice(value: MultiChoicePayload) {
  const otherText = value.other ?? ''
  return value.selected
    .map((item) => (isOtherOption(item) ? otherText || item : item))
    .filter(Boolean)
    .join('|')
}

function getYesNoCardValue(answer: string) {
  if (answer === 'Sim' || answer === 'yes') return 'yes'
  if (answer === 'Não' || answer === 'Nao' || answer === 'no') return 'no'
  return undefined
}

function serializeYesNo(value: 'yes' | 'no') {
  return value === 'yes' ? 'Sim' : 'Não'
}

function asRatingValue(value: string) {
  return RATING_VALUES.includes(value as (typeof RATING_VALUES)[number])
    ? value as (typeof RATING_VALUES)[number]
    : ''
}

function asNpsValue(value: string) {
  return NPS_VALUES.includes(value as (typeof NPS_VALUES)[number])
    ? value as (typeof NPS_VALUES)[number]
    : ''
}

function deriveCta(
  loadState: LoadState,
  answers: Record<string, string>,
  submittedLocally: boolean,
): string {
  if (loadState.status === 'ready') {
    const { enrollment, questions } = loadState.data

    if (submittedLocally || enrollment.status === 'complete' || enrollment.submittedAt !== null) {
      return 'Verificar minha jornada'
    }

    const hasAny = Object.keys(answers).length > 0
    if (!hasAny) return 'Começar minha jornada'

    const allRequired = questions.every(
      (q) => !q.isRequired || (answers[q.name] ?? '').trim() !== '',
    )
    return allRequired ? 'Verificar minha jornada' : 'Continuar minha jornada'
  }

  return 'Começar minha jornada'
}

function ThanksCard({ onFinalize, onShowAnswers }: { onFinalize: () => void; onShowAnswers: () => void }) {
  return (
    <div className="question-card">
      <div className="question-card__copy">
        <h1>Obrigado por participar do Mapa do Comprador Quadraimob 2026</h1>
        <p>
          Sua participação é muito importante para entendermos os sonhos, comportamentos
          e tendências dos novos compradores do mercado imobiliário.
        </p>
        <p>
          Desejamos que seu novo imóvel seja palco de momentos incríveis, conquistas e
          muitas memórias especiais.
        </p>
      </div>

      <div className="thanks-card__actions">
        <button
          className="question-card__button question-card__button--primary thanks-card__cta"
          type="button"
          onClick={onShowAnswers}
        >
          Ver minhas respostas
        </button>

        <button
          className="thanks-card__finalizar"
          type="button"
          onClick={onFinalize}
        >
          Finalizar
        </button>
      </div>
    </div>
  )
}

function formatAnswerDisplay(question: SurveyQuestion, raw: string): string {
  if (!raw) return '—'
  if (question.type === 'multiselect') return raw.split('|').filter(Boolean).join(' · ')
  return raw
}

function AnswersSummaryCard({
  questions,
  answers,
  onFinalize,
}: {
  questions: SurveyQuestion[]
  answers: Record<string, string>
  onFinalize: () => void
}) {
  return (
    <div className="question-card answers-card">
      <div className="question-card__meta">Suas respostas</div>

      <div className="answers-card__header">
        <h2 className="answers-card__title">Resumo da sua jornada</h2>
        <p className="answers-card__subtitle">
          Veja abaixo as respostas que você registrou.
        </p>
      </div>

      <div className="answers-card__list">
        {questions.map((q, i) => {
          const raw = answers[q.name] ?? ''
          const display = formatAnswerDisplay(q, raw)
          const isEmpty = !raw

          return (
            <div key={q.id} className="answers-card__item">
              <span className="answers-card__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="answers-card__body">
                <p className="answers-card__question">{q.label}</p>
                <p className={`answers-card__answer${isEmpty ? ' answers-card__answer--empty' : ''}`}>
                  {display}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="question-card__actions">
        <button
          className="question-card__button question-card__button--primary"
          type="button"
          onClick={onFinalize}
        >
          Finalizar
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

function LgpdConsentCard({
  onBack,
  onSubmit,
  isSubmitting,
}: {
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}) {
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="question-card lgpd-card">
      <div className="question-card__meta">Aceite obrigatório</div>

      <div className="question-card__copy">
        <h1>Política de Privacidade e LGPD</h1>
        <p>Para finalizar, confirme seu consentimento abaixo.</p>
      </div>

      <label className="lgpd-card__label">
        <input
          type="checkbox"
          className="lgpd-card__checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span className="lgpd-card__text">
          Declaro estar de acordo com a utilização das informações fornecidas para fins
          estatísticos e de melhoria da experiência Quadraimob, em conformidade com a LGPD
          e a{' '}
          <a
            className="lgpd-card__link"
            href="https://quadraimob.com.br/codigo-de-etica-e-conduta/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade
          </a>
          {' '}da empresa.
        </span>
      </label>

      <div className="question-card__actions">
        <button
          className="question-card__button question-card__button--ghost"
          type="button"
          onClick={onBack}
        >
          <span aria-hidden="true">←</span>
          Voltar
        </button>

        <button
          className="question-card__button question-card__button--primary"
          type="button"
          disabled={!accepted || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

export default function SurveyPage() {
  const { id } = useParams<SurveyParams>()
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
  const [pageState, setPageState] = useState<PageState>('hero')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedLocally, setSubmittedLocally] = useState(false)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answersRef = useRef<Record<string, string>>({})
  const { assets, meta } = DEFAULT_HERO_CONFIG
  const criticalAssets = useMemo(
    () => [assets.logo, assets.logoDark],
    [assets.logo, assets.logoDark],
  )
  const assetsReady = useHeroIntro(criticalAssets)

  useEffect(() => {
    if (!id) return

    const surveyId = id
    const controller = new AbortController()

    async function loadSurvey() {
      setLoadState({ status: 'loading' })
      setCurrentIndex(0)

      try {
        const response = await axios.get<SurveyResponse>(
          `${SURVEY_API_BASE}/${encodeURIComponent(surveyId)}`,
          { signal: controller.signal },
        )

        answersRef.current = response.data.answers ?? {}
        setAnswers(response.data.answers ?? {})
        setLoadState({ status: 'ready', data: response.data })
      } catch (error) {
        if (controller.signal.aborted) return

        if (axios.isAxiosError(error) && error.response) {
          setLoadState({
            status: 'error',
            variant: error.response.status === 404 ? '404' : '500',
            detail: `${error.response.status} ${error.response.statusText}`,
          })
        } else {
          setLoadState({
            status: 'error',
            variant: '500',
            detail: error instanceof Error ? error.message : 'Falha ao carregar a pesquisa.',
          })
        }
      }
    }

    void loadSurvey()

    return () => controller.abort()
  }, [id])

  if (!id) {
    return <ErrorPage variant="invalid-link" />
  }

  if (loadState.status === 'error') {
    return <ErrorPage variant={loadState.variant} detail={loadState.detail} />
  }

  const questions = loadState.status === 'ready'
    ? [...loadState.data.questions].sort((a, b) => a.order - b.order)
    : []

  const isAlreadySubmitted =
    loadState.status === 'ready' &&
    (loadState.data.enrollment.status === 'complete' || loadState.data.enrollment.submittedAt !== null)

  const isEffectivelySubmitted = isAlreadySubmitted || submittedLocally

  const currentQuestion = questions[currentIndex]
  const ready = assetsReady && loadState.status === 'ready'
  const ctaLabel = deriveCta(loadState, answers, submittedLocally)

  const surveyHeroConfig: HeroConfig = {
    ...DEFAULT_HERO_CONFIG,
    copy: {
      ...DEFAULT_HERO_CONFIG.copy,
      cta: {
        ...DEFAULT_HERO_CONFIG.copy.cta,
        label: ctaLabel,
        href: '#perguntas',
      },
    },
  }

  function handleLogoClick() {
    setPageState('hero')
    setCurrentIndex(0)
  }

  function scheduleAutosave() {
    if (!id) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      void axios.patch(`${SURVEY_API_BASE}/${encodeURIComponent(id)}`, {
        answers: answersRef.current,
      })
    }, AUTOSAVE_DEBOUNCE_MS)
  }

  function updateAnswer(question: SurveyQuestion, value: string, autoAdvance = false) {
    setAnswers((current) => {
      const merged = { ...current, [question.name]: value }
      answersRef.current = merged
      return merged
    })
    scheduleAutosave()
    if (autoAdvance) goNext()
  }

  function goBack() {
    if (currentIndex === 0) {
      setPageState('hero')
      return
    }
    setCurrentIndex((index) => Math.max(index - 1, 0))
  }

  function goNext() {
    setCurrentIndex((index) => Math.min(index + 1, Math.max(questions.length - 1, 0)))
  }

  async function handleSubmit() {
    if (!id || isSubmitting) return

    const firstMissing = questions.find(
      (q) => q.isRequired && !isAnswerValid(q, answers[q.name] ?? ''),
    )
    if (firstMissing) {
      setCurrentIndex(questions.indexOf(firstMissing))
      return
    }

    setIsSubmitting(true)
    try {
      await axios.post(`${SURVEY_API_BASE}/${encodeURIComponent(id)}/submit`, { answers })
      setSubmittedLocally(true)
      setPageState('done')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setPageState('done')
        } else if (error.response.status === 422) {
          const fields = error.response.data?.fields as Array<{ name: string }> | undefined
          const firstFieldName = fields?.[0]?.name
          const missingQuestion = firstFieldName
            ? questions.find((q) => q.name === firstFieldName)
            : undefined
          if (missingQuestion) {
            setCurrentIndex(questions.indexOf(missingQuestion))
          }
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageState === 'hero') {
    return (
      <Hero
        config={surveyHeroConfig}
        onCtaClick={() => {
          if (isEffectivelySubmitted) {
            setPageState('done')
          } else {
            setPageState('survey')
            setCurrentIndex(0)
          }
        }}
        onLogoClick={handleLogoClick}
      />
    )
  }

  if (pageState === 'done') {
    return (
      <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle} onLogoClick={handleLogoClick}>
        <ThanksCard
          onFinalize={handleLogoClick}
          onShowAnswers={() => setPageState('results')}
        />
      </QuestionBaseUI>
    )
  }

  if (pageState === 'lgpd') {
    return (
      <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle} onLogoClick={handleLogoClick}>
        <LgpdConsentCard
          onBack={() => {
            setPageState('survey')
            setCurrentIndex(questions.length - 1)
          }}
          onSubmit={() => void handleSubmit()}
          isSubmitting={isSubmitting}
        />
      </QuestionBaseUI>
    )
  }

  if (pageState === 'results') {
    return (
      <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle} onLogoClick={handleLogoClick}>
        <AnswersSummaryCard
          questions={questions}
          answers={answers}
          onFinalize={handleLogoClick}
        />
      </QuestionBaseUI>
    )
  }

  function renderQuestion(question: SurveyQuestion) {
    const answer = getAnswerValue(answers, question)
    const isFirst = currentIndex === 0
    const isLast = currentIndex === questions.length - 1
    const shouldAutoAdvance = isFirst && AUTO_ADVANCE_TYPES.includes(question.type)

    const commonProps = {
      current: currentIndex + 1,
      total: questions.length,
      label: question.label,
      description: question.description ?? undefined,
      required: question.isRequired,
      onBack: goBack,
    }

    if (isLast && !isEffectivelySubmitted) {
      const goToLgpd = () => setPageState('lgpd')

      switch (question.type) {
        case 'text':
          return (
            <QuestionTextCard
              {...commonProps}
              value={answer}
              placeholder="Digite sua resposta..."
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, value)}
              onNext={(value) => {
                updateAnswer(question, value)
                goToLgpd()
              }}
            />
          )

        case 'textarea':
          return (
            <QuestionTextareaCard
              {...commonProps}
              value={answer}
              placeholder="Digite sua resposta..."
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, value)}
              onNext={(value) => {
                updateAnswer(question, value)
                goToLgpd()
              }}
            />
          )

        case 'email':
        case 'phone':
        case 'number':
        case 'date':
        case 'time': {
          const isPhone = question.type === 'phone'
          const fieldType: QuestionFieldInputType = isPhone
            ? 'tel'
            : question.type as QuestionFieldInputType

          return (
            <QuestionFieldCard
              {...commonProps}
              value={answer}
              type={fieldType}
              nextLabel="Continuar"
              inputMode={question.type === 'number' ? 'numeric' : isPhone ? 'tel' : undefined}
              placeholder={isPhone ? '(00) 00000-0000' : question.type === 'email' ? 'seu@email.com' : undefined}
              maxLength={isPhone ? 15 : undefined}
              formatValue={isPhone ? formatBrazilianPhone : undefined}
              errorMessage={question.type === 'email' ? 'Digite um e-mail válido para continuar.' : undefined}
              onValueChange={(value) => updateAnswer(question, value)}
              onNext={(value) => {
                updateAnswer(question, value)
                goToLgpd()
              }}
            />
          )
        }

        case 'yes_no':
          return (
            <QuestionYesOrNoCard
              {...commonProps}
              value={getYesNoCardValue(answer)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, serializeYesNo(value))}
              onNext={(value) => {
                updateAnswer(question, serializeYesNo(value))
                goToLgpd()
              }}
            />
          )

        case 'radio': {
          const radioValue = getChoiceValue(answer, question.options)
          return (
            <QuestionRadioCard
              {...commonProps}
              value={radioValue.selected}
              otherValue={radioValue.other}
              options={toRadioOptions(question.options)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, serializeChoice(value))}
              onNext={(value) => {
                updateAnswer(question, serializeChoice(value))
                goToLgpd()
              }}
            />
          )
        }

        case 'select': {
          const selectValue = getChoiceValue(answer, question.options)
          return (
            <QuestionSelectCard
              {...commonProps}
              value={selectValue.selected}
              otherValue={selectValue.other}
              options={toChoiceOptions(question.options)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, serializeChoice(value))}
              onNext={(value) => {
                updateAnswer(question, serializeChoice(value))
                goToLgpd()
              }}
            />
          )
        }

        case 'multiselect': {
          const multiValue = getMultiValue(answer, question.options)
          return (
            <QuestionMultiSelectCard
              {...commonProps}
              value={multiValue.selected}
              otherValue={multiValue.other}
              options={toMultiOptions(question.options)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, serializeMultiChoice(value))}
              onNext={(value) => {
                updateAnswer(question, serializeMultiChoice(value))
                goToLgpd()
              }}
            />
          )
        }

        case 'rating':
          return (
            <QuestionRatingCard
              {...commonProps}
              value={asRatingValue(answer)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, value)}
              onNext={(value) => {
                updateAnswer(question, value)
                goToLgpd()
              }}
            />
          )

        case 'csat':
          return (
            <QuestionCsatCard
              {...commonProps}
              value={asRatingValue(answer)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, value)}
              onNext={(value) => {
                updateAnswer(question, value)
                goToLgpd()
              }}
            />
          )

        case 'nps_score':
          return (
            <QuestionNpsScoreCard
              {...commonProps}
              value={asNpsValue(answer)}
              nextLabel="Continuar"
              onValueChange={(value) => updateAnswer(question, value)}
              onNext={(value) => {
                updateAnswer(question, value)
                goToLgpd()
              }}
            />
          )

        default:
          return null
      }
    }

    switch (question.type) {
      case 'text':
        return (
          <QuestionTextCard
            {...commonProps}
            value={answer}
            placeholder="Digite sua resposta..."
            onValueChange={(value) => updateAnswer(question, value)}
            onNext={(value) => {
              updateAnswer(question, value)
              goNext()
            }}
          />
        )

      case 'textarea':
        return (
          <QuestionTextareaCard
            {...commonProps}
            value={answer}
            placeholder="Digite sua resposta..."
            onValueChange={(value) => updateAnswer(question, value)}
            onNext={(value) => {
              updateAnswer(question, value)
              goNext()
            }}
          />
        )

      case 'email':
      case 'phone':
      case 'number':
      case 'date':
      case 'time': {
        const isPhone = question.type === 'phone'
        const fieldType: QuestionFieldInputType = isPhone
          ? 'tel'
          : question.type as QuestionFieldInputType

        return (
          <QuestionFieldCard
            {...commonProps}
            value={answer}
            type={fieldType}
            inputMode={question.type === 'number' ? 'numeric' : isPhone ? 'tel' : undefined}
            placeholder={isPhone ? '(00) 00000-0000' : question.type === 'email' ? 'seu@email.com' : undefined}
            maxLength={isPhone ? 15 : undefined}
            formatValue={isPhone ? formatBrazilianPhone : undefined}
            errorMessage={question.type === 'email' ? 'Digite um e-mail válido para continuar.' : undefined}
            onValueChange={(value) => updateAnswer(question, value)}
            onNext={(value) => {
              updateAnswer(question, value)
              goNext()
            }}
          />
        )
      }

      case 'yes_no':
        return (
          <QuestionYesOrNoCard
            {...commonProps}
            value={getYesNoCardValue(answer)}
            onValueChange={(value) => {
              updateAnswer(question, serializeYesNo(value), shouldAutoAdvance)
            }}
            onNext={(value) => {
              updateAnswer(question, serializeYesNo(value))
              goNext()
            }}
          />
        )

      case 'radio': {
        const radioValue = getChoiceValue(answer, question.options)
        return (
          <QuestionRadioCard
            {...commonProps}
            value={radioValue.selected}
            otherValue={radioValue.other}
            options={toRadioOptions(question.options)}
            onValueChange={(value) => {
              updateAnswer(question, serializeChoice(value), shouldAutoAdvance && !isOtherOption(value.selected))
            }}
            onNext={(value) => {
              updateAnswer(question, serializeChoice(value))
              goNext()
            }}
          />
        )
      }

      case 'select': {
        const selectValue = getChoiceValue(answer, question.options)

        return (
          <QuestionSelectCard
            {...commonProps}
            value={selectValue.selected}
            otherValue={selectValue.other}
            options={toChoiceOptions(question.options)}
            onValueChange={(value) => updateAnswer(question, serializeChoice(value))}
            onNext={(value) => {
              updateAnswer(question, serializeChoice(value))
              goNext()
            }}
          />
        )
      }

      case 'multiselect': {
        const multiValue = getMultiValue(answer, question.options)

        return (
          <QuestionMultiSelectCard
            {...commonProps}
            value={multiValue.selected}
            otherValue={multiValue.other}
            options={toMultiOptions(question.options)}
            onValueChange={(value) => updateAnswer(question, serializeMultiChoice(value))}
            onNext={(value) => {
              updateAnswer(question, serializeMultiChoice(value))
              goNext()
            }}
          />
        )
      }

      case 'rating':
        return (
          <QuestionRatingCard
            {...commonProps}
            value={asRatingValue(answer)}
            onValueChange={(value) => {
              updateAnswer(question, value, shouldAutoAdvance)
            }}
            onNext={(value) => {
              updateAnswer(question, value)
              goNext()
            }}
          />
        )

      case 'csat':
        return (
          <QuestionCsatCard
            {...commonProps}
            value={asRatingValue(answer)}
            onValueChange={(value) => {
              updateAnswer(question, value, shouldAutoAdvance)
            }}
            onNext={(value) => {
              updateAnswer(question, value)
              goNext()
            }}
          />
        )

      case 'nps_score':
        return (
          <QuestionNpsScoreCard
            {...commonProps}
            value={asNpsValue(answer)}
            onValueChange={(value) => {
              updateAnswer(question, value, shouldAutoAdvance)
            }}
            onNext={(value) => {
              updateAnswer(question, value)
              goNext()
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <QuestionBaseUI ready={ready} logoSrc={assets.logo} title={meta.headerTitle} onLogoClick={handleLogoClick}>
      {currentQuestion && renderQuestion(currentQuestion)}
    </QuestionBaseUI>
  )
}
