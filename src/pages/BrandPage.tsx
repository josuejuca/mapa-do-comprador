import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRemoveBootLoader } from '../hooks/useBootLoader'
import './BrandPage.css'

// ── Data ───────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'tokens', label: 'Tokens' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'assets', label: 'Assets' },
  { id: 'hero', label: 'Hero' },
  { id: 'hero-config', label: 'HeroConfig', indent: true },
  { id: 'hero-componentes', label: 'Sub-componentes', indent: true },
  { id: 'hero-css', label: 'CSS Variables', indent: true },
  { id: 'questions', label: 'Question Types' },
  { id: 'q-texto', label: 'Texto', indent: true },
  { id: 'q-campo', label: 'Campo', indent: true },
  { id: 'q-escolha', label: 'Escolha única', indent: true },
  { id: 'q-multi', label: 'Múltipla escolha', indent: true },
  { id: 'q-avaliacao', label: 'Avaliação', indent: true },
  { id: 'question-ui', label: 'QuestionBaseUI' },
]

const COLOR_TOKENS = [
  { name: '--navy-950', value: '#001335', label: 'Navy 950', usage: 'Textos principais, headings' },
  { name: '--navy-800', value: '#1a2d4a', label: 'Navy 800', usage: 'Corpo de texto, labels' },
  { name: '--blue-700', value: '#0055cc', label: 'Blue 700', usage: 'Links, labels de código' },
  { name: '--action', value: '#0070FF', label: 'Action Blue', usage: 'CTA primário, botões' },
  { name: '--question-accent', value: '#40C0FA', label: 'Cyan Light', usage: 'Accent nas telas de pergunta' },
  { name: '--off', value: '#FAFBFD', label: 'Off White', usage: 'Fundo geral claro' },
  { name: '--line', value: 'rgba(0,19,53,.1)', value2: '#001335', label: 'Line', usage: 'Bordas, separadores' },
  { name: '--mute', value: 'rgba(0,19,53,.48)', value2: '#001335', label: 'Mute', usage: 'Texto secundário, subtítulos' },
]

const TYPE_TOKENS = [
  { label: 'Cormorant Garamond', usage: 'Títulos editoriais (Hero h1, seções principais)', sample: 'Mapa do Comprador', className: 'brand-type-serif' },
  { label: 'Sistema sans-serif', usage: 'Corpo, labels, navegação (inter/system-ui)', sample: 'Cada imóvel carrega uma história.', className: 'brand-type-sans' },
  { label: 'JetBrains Mono', usage: 'Código inline, tokens, nomes de propriedades', sample: 'HeroConfig · --clip-top', className: 'brand-type-mono' },
]

const LOGOS = [
  { src: '/quadraimob-logo-dark.png', name: 'Logo (fundo escuro)', path: '/quadraimob-logo-dark.png', bg: 'dark', usage: 'Sobre fundos escuros — Hero, painel azul, telas com background escuro.' },
  { src: '/quadraimob-logo.png', name: 'Logo (fundo claro)', path: '/quadraimob-logo.png', bg: 'light', usage: 'Sobre fundos claros — tela de pergunta, brand page, formulários.' },
]

const HERO_PROPS = [
  { prop: 'assets.background', type: 'string', desc: 'URL da imagem de fundo. Renderizada com tint escuro para contraste.' },
  { prop: 'assets.logo', type: 'string', desc: 'Logo versão clara — usada sobre o fundo escuro da Hero.' },
  { prop: 'assets.logoDark', type: 'string', desc: 'Logo versão escura — usada no header branco/claro.' },
  { prop: 'copy.eyebrow', type: 'ReactNode', desc: 'Linha de contexto acima do título principal.' },
  { prop: 'copy.title', type: 'ReactNode', desc: 'Título principal. Aceita JSX com spans para variações tipográficas.' },
  { prop: 'copy.titleAriaLabel', type: 'string', desc: 'Texto alternativo acessível para o título (aria-label).' },
  { prop: 'copy.lede', type: 'ReactNode', desc: 'Parágrafo de apoio com a proposta da pesquisa.' },
  { prop: 'copy.cta.label', type: 'string', desc: 'Texto exibido no botão de CTA.' },
  { prop: 'copy.cta.href', type: 'string', desc: 'Href do botão. Usado apenas quando onCtaClick não é passado.' },
  { prop: 'meta.headerTitle', type: 'string', desc: 'Título exibido no header sticky (versão compacta).' },
  { prop: 'meta.editionLabel', type: 'string', desc: 'Label do chip de edição (ex: "Edição").' },
  { prop: 'meta.editionValue', type: 'string', desc: 'Valor do chip de edição (ex: "2026").' },
  { prop: 'meta.satisfactionLabel', type: 'string', desc: 'Label do chip de satisfação lateral.' },
]

const HERO_COMPONENTS = [
  { name: 'HeroShell', desc: 'Raiz do bloco. Aplica o estado hero--ready e define as CSS custom properties de layout.' },
  { name: 'HeroBackground', desc: 'Imagem arquitetônica com tint escuro (linear-gradient) sobre ela.' },
  { name: 'HeroClip', desc: 'Painel azul animado com o loader central e o logotipo final dentro do recorte.' },
  { name: 'HeroFrame', desc: 'Linhas finas decorativas que reforçam a composição e o grid visual.' },
  { name: 'HeroHeader', desc: 'Logo + título curto no topo, consistente entre todas as telas do produto.' },
  { name: 'HeroContent', desc: 'Eyebrow, título principal, lede e CTA com animação de entrada orquestrada.' },
  { name: 'HeroChips', desc: 'Chips laterais com metadados editoriais: edição e indicador de satisfação.' },
  { name: 'HeroCTA', desc: 'Botão primário glass com ícone de seta. Controlado pelo prop onCtaClick.' },
  { name: 'IntroLine', desc: 'Linha animada de introdução usada como separador visual nas entradas.' },
]

const HERO_CSS_VARS = [
  { name: '--clip-top', default: '0px', desc: 'Posição top do recorte azul.' },
  { name: '--clip-right', default: '0px', desc: 'Posição right do recorte azul.' },
  { name: '--clip-bottom', default: '0px', desc: 'Posição bottom do recorte azul.' },
  { name: '--clip-left', default: '60%', desc: 'Posição left do recorte azul (controla largura).' },
  { name: '--hero-bg-opacity', default: '1', desc: 'Opacidade da imagem de fundo.' },
]

const QUESTION_GROUPS = [
  {
    id: 'q-texto',
    label: 'Texto',
    desc: 'Captura respostas abertas em uma linha ou múltiplas linhas.',
    types: [
      { type: 'text', label: 'Text', component: 'QuestionTextCard', demo: '/brand/question-base/text', desc: 'Campo de uma linha para respostas curtas.' },
      { type: 'textarea', label: 'Textarea', component: 'QuestionTextareaCard', demo: '/brand/question-base/textarea', desc: 'Área de texto expandível para respostas longas.' },
    ],
  },
  {
    id: 'q-campo',
    label: 'Campo',
    desc: 'Entradas com validação de formato específico.',
    types: [
      { type: 'email', label: 'Email', component: 'QuestionFieldCard', demo: '/brand/question-base/email', desc: 'Campo e-mail com validação de formato.' },
      { type: 'phone', label: 'Phone', component: 'QuestionFieldCard', demo: '/brand/question-base/phone', desc: 'Telefone com máscara (00) 00000-0000.' },
      { type: 'number', label: 'Number', component: 'QuestionFieldCard', demo: '/brand/question-base/number', desc: 'Campo numérico com teclado numérico em mobile.' },
      { type: 'date', label: 'Date', component: 'QuestionFieldCard', demo: '/brand/question-base/date', desc: 'Seletor de data nativo do browser.' },
      { type: 'time', label: 'Time', component: 'QuestionFieldCard', demo: '/brand/question-base/time', desc: 'Seletor de horário nativo do browser.' },
    ],
  },
  {
    id: 'q-escolha',
    label: 'Escolha única',
    desc: 'O respondente seleciona exatamente uma opção.',
    types: [
      { type: 'yes_no', label: 'Yes / No', component: 'QuestionYesOrNoCard', demo: '/brand/question-base/yes-or-not', desc: 'Botões Sim / Não com ícone. Avança automaticamente ao selecionar.' },
      { type: 'radio', label: 'Radio', component: 'QuestionRadioCard', demo: '/brand/question-base/radio', desc: 'Lista de opções com suporte a "Outros" com campo aberto.' },
      { type: 'select', label: 'Select', component: 'QuestionSelectCard', demo: '/brand/question-base/select', desc: 'Dropdown de seleção com suporte a "Outros".' },
    ],
  },
  {
    id: 'q-multi',
    label: 'Múltipla escolha',
    desc: 'O respondente pode selecionar mais de uma opção.',
    types: [
      { type: 'multiselect', label: 'Multi-select', component: 'QuestionMultiSelectCard', demo: '/brand/question-base/mult-question', desc: 'Checkboxes com suporte a "Outros" com campo aberto.' },
    ],
  },
  {
    id: 'q-avaliacao',
    label: 'Avaliação',
    desc: 'Métricas quantitativas de satisfação e recomendação.',
    types: [
      { type: 'rating', label: 'Rating', component: 'QuestionRatingCard', demo: '/brand/question-base/rating', desc: 'Escala de 1 a 5 estrelas.' },
      { type: 'csat', label: 'CSAT', component: 'QuestionCsatCard', demo: '/brand/question-base/csat', desc: 'Customer Satisfaction Score (1–5) com ícones emoji.' },
      { type: 'nps_score', label: 'NPS Score', component: 'QuestionNpsScoreCard', demo: '/brand/question-base/nps-score', desc: 'Net Promoter Score — escala de 0 a 10.' },
    ],
  },
]

const QUESTION_UI_PROPS = [
  { prop: 'ready', type: 'boolean', desc: 'Controla o estado de carregamento. Passa true após assets críticos carregarem.' },
  { prop: 'logoSrc', type: 'string', desc: 'URL do logo exibido no header e no loader.' },
  { prop: 'title', type: 'string', desc: 'Título curto exibido no header sticky.' },
  { prop: 'href', type: 'string?', desc: 'Href do logo no header (opcional).' },
  { prop: 'onLogoClick', type: '() => void?', desc: 'Callback ao clicar no logo (alternativa ao href).' },
  { prop: 'className', type: 'string?', desc: 'Classe extra na raiz para variações visuais.' },
  { prop: 'skylineColors', type: 'SkylineColors?', desc: 'Sobrescreve as cores do skyline decorativo (mainColor, softColor, thinColor, hatchColor).' },
  { prop: 'children', type: 'ReactNode', desc: 'O card de pergunta ativo.' },
]

// ── Components ─────────────────────────────────────────────────────

function SectionHeading({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="bs-heading">
      <span className="bs-tag">{tag}</span>
      <h2>{title}</h2>
    </div>
  )
}

function PropsTable({ rows }: { rows: { prop: string; type: string; desc: string }[] }) {
  return (
    <div className="bs-table-wrap">
      <table className="bs-table">
        <thead>
          <tr>
            <th>Propriedade</th>
            <th>Tipo</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop}>
              <td><code>{r.prop}</code></td>
              <td><code className="bs-type">{r.type}</code></td>
              <td>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function QuestionPreview({ demo, label }: { demo: string; label: string }) {
  const [active, setActive] = useState(false)

  return (
    <div className={`bs-preview${active ? ' bs-preview--active' : ''}`}>
      <iframe
        src={demo}
        title={label}
        loading="lazy"
        tabIndex={active ? 0 : -1}
        className="bs-preview__iframe"
        style={{ pointerEvents: active ? 'auto' : 'none' }}
      />
      {!active && (
        <button className="bs-preview__overlay" onClick={() => setActive(true)} aria-label={`Ativar preview de ${label}`}>
          <span className="bs-preview__badge">Clique para interagir</span>
        </button>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────

export default function BrandPage() {
  useRemoveBootLoader()
  const [activeId, setActiveId] = useState('tokens')
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.getAttribute('data-section') ?? '')
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bs-root">

      {/* ── Sidebar ── */}
      <aside className="bs-sidebar">
        <Link to="/" className="bs-sidebar__logo">
          <img src="/quadraimob-logo.png" alt="Quadraimob" />
        </Link>

        <div className="bs-sidebar__label">Design System</div>

        <nav className="bs-nav" aria-label="Seções">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`bs-nav__item${s.indent ? ' bs-nav__item--indent' : ''}${activeId === s.id ? ' bs-nav__item--active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="bs-sidebar__footer">
          <span>Mapa do Comprador</span>
          <span>2026</span>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="bs-main" ref={mainRef}>

        {/* Page header */}
        <header className="bs-page-header">
          <span className="bs-tag">Quadraimob · Design System</span>
          <h1>Brand &amp; Components</h1>
          <p>
            Referência visual e técnica para tokens, assets, Hero e todos os tipos de
            pergunta do Mapa do Comprador 2026.
          </p>
        </header>

        {/* ── TOKENS ── */}
        <section id="tokens" data-section="tokens" className="bs-section">
          <SectionHeading tag="01" title="Tokens de cor" />
          <div className="bs-color-grid">
            {COLOR_TOKENS.map((c) => (
              <article key={c.name} className="bs-color-card">
                <div
                  className="bs-color-swatch"
                  style={{ background: c.value }}
                />
                <div className="bs-color-info">
                  <strong>{c.label}</strong>
                  <code>{c.name}</code>
                  <span>{c.value}</span>
                  <p>{c.usage}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── TIPOGRAFIA ── */}
        <section id="tipografia" data-section="tipografia" className="bs-section">
          <SectionHeading tag="02" title="Tipografia" />
          <div className="bs-type-list">
            {TYPE_TOKENS.map((t) => (
              <article key={t.label} className="bs-type-card">
                <p className={`bs-type-sample ${t.className}`}>{t.sample}</p>
                <div className="bs-type-meta">
                  <strong>{t.label}</strong>
                  <span>{t.usage}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── ASSETS ── */}
        <section id="assets" data-section="assets" className="bs-section">
          <SectionHeading tag="03" title="Assets" />
          <div className="bs-asset-grid">
            {LOGOS.map((logo) => (
              <article key={logo.name} className={`bs-asset-card bs-asset-card--${logo.bg}`}>
                <div className="bs-asset-preview">
                  <img src={logo.src} alt={logo.name} />
                </div>
                <div className="bs-asset-info">
                  <strong>{logo.name}</strong>
                  <code>{logo.path}</code>
                  <p>{logo.usage}</p>
                </div>
              </article>
            ))}
            <article className="bs-asset-card bs-asset-card--wide">
              <div className="bs-hero-preview">
                <iframe
                  src="/brand/hero-demo"
                  title="Hero preview"
                  loading="lazy"
                  tabIndex={-1}
                  className="bs-hero-preview__iframe"
                />
              </div>
              <div className="bs-asset-info">
                <strong>Hero Background</strong>
                <code>/hero_bg_home.png</code>
                <p>
                  Imagem arquitetônica com tint escuro automático. A máscara azul (<code>HeroClip</code>)
                  e as linhas (<code>HeroFrame</code>) são sobrepostas via CSS absoluto — não fazem
                  parte da imagem.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ── HERO ── */}
        <section id="hero" data-section="hero" className="bs-section">
          <SectionHeading tag="04" title="Hero Component" />
          <p className="bs-section__desc">
            A Hero é composta por sub-componentes independentes orquestrados pelo{' '}
            <code>HeroShell</code>. Toda a customização passa pelo objeto{' '}
            <code>HeroConfig</code>.
          </p>

          <div className="bs-code-block">
            <div className="bs-code-block__label">Uso mínimo</div>
            <pre>{`import { Hero } from '../components/hero-ui'
import { DEFAULT_HERO_CONFIG } from '../components/hero-ui'

<Hero
  config={DEFAULT_HERO_CONFIG}
  onCtaClick={() => setPageState('survey')}
  onLogoClick={() => setPageState('hero')}
/>`}</pre>
          </div>

          <div id="hero-config" data-section="hero-config" className="bs-subsection">
            <h3>HeroConfig</h3>
            <PropsTable rows={HERO_PROPS} />
          </div>

          <div id="hero-componentes" data-section="hero-componentes" className="bs-subsection">
            <h3>Sub-componentes</h3>
            <div className="bs-comp-grid">
              {HERO_COMPONENTS.map((c) => (
                <article key={c.name} className="bs-comp-card">
                  <code>{c.name}</code>
                  <p>{c.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="hero-css" data-section="hero-css" className="bs-subsection">
            <h3>CSS Custom Properties</h3>
            <p className="bs-section__desc">
              Todas as propriedades abaixo ficam no <code>HeroShell</code> e controlam o
              recorte azul. Frame, logo e chips acompanham automaticamente.
            </p>
            <PropsTable rows={HERO_CSS_VARS.map((v) => ({
              prop: v.name,
              type: `default: "${v.default}"`,
              desc: v.desc,
            }))} />
          </div>
        </section>

        {/* ── QUESTION TYPES ── */}
        <section id="questions" data-section="questions" className="bs-section">
          <SectionHeading tag="05" title="Question Types" />
          <p className="bs-section__desc">
            Todos os cards de pergunta compartilham as mesmas props base. O tipo é
            determinado pelo campo <code>type</code> da pergunta vinda da API.
          </p>

          <div className="bs-code-block">
            <div className="bs-code-block__label">Props comuns a todos os cards</div>
            <pre>{`type QuestionCardBaseProps = {
  current:     number          // número da pergunta atual
  total:       number          // total de perguntas
  label:       string          // texto da pergunta
  description?: string         // texto de apoio opcional
  required?:   boolean         // valida antes de avançar
  nextLabel?:  string          // texto do botão (default: "Próximo")
  onBack?:     () => void
  onNext?:     (value: string) => void
  onValueChange?: (value: string) => void
}`}</pre>
          </div>

          {QUESTION_GROUPS.map((group) => (
            <div key={group.id} id={group.id} data-section={group.id} className="bs-q-group">
              <h3>{group.label}</h3>
              <p className="bs-section__desc">{group.desc}</p>
              <div className="bs-q-grid">
                {group.types.map((qt) => (
                  <article key={qt.type} className="bs-q-card">
                    <QuestionPreview demo={qt.demo} label={qt.label} />
                    <div className="bs-q-card__info">
                      <div className="bs-q-card__header">
                        <code className="bs-q-type">{qt.type}</code>
                        <code className="bs-q-component">{qt.component}</code>
                      </div>
                      <p>{qt.desc}</p>
                      <Link to={qt.demo} className="bs-q-demo-link" target="_blank">
                        Abrir demo →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── QUESTION BASE UI ── */}
        <section id="question-ui" data-section="question-ui" className="bs-section">
          <SectionHeading tag="06" title="QuestionBaseUI" />
          <p className="bs-section__desc">
            Shell de layout compartilhado por todas as telas de pergunta e por telas de
            apoio como agradecimento, resultados e LGPD. Inclui header com logo, skyline
            decorativo de Brasília e estado de loading.
          </p>

          <div className="bs-code-block">
            <div className="bs-code-block__label">Uso</div>
            <pre>{`import { QuestionBaseUI } from '../components/question-base-ui'

<QuestionBaseUI
  ready={ready}
  logoSrc={assets.logo}
  title={meta.headerTitle}
  onLogoClick={() => setPageState('hero')}
>
  <QuestionTextCard ... />
</QuestionBaseUI>`}</pre>
          </div>

          <PropsTable rows={QUESTION_UI_PROPS} />
        </section>

        <footer className="bs-footer">
          <span>Quadraimob · Mapa do Comprador 2026</span>
          <Link to="/">Voltar para home</Link>
        </footer>
      </main>
    </div>
  )
}
