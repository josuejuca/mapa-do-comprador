import { useEffect, useState } from 'react'
import './Hero.css'

/* Pre-carrega os assets críticos. Enquanto carrega, o hero já está
   montado com a tela cheia colorida + spinner circular no centro.
   Quando tudo chega, adicionamos `.hero--ready` que dispara a intro
   (clip shrink, fade-out do spinner, reveal do texto). */
const CRITICAL_ASSETS = [
  '/hero_bg_home.png',
  '/quadraimob-logo.png',
  '/quadraimob-logo-dark.png',
]

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()       /* failsafe */
    img.src = src
  })
}

export default function Hero() {
  const [ready, setReady] = useState(false)

  /* Orquestra a transição do boot-loader (HTML inline) → hero (React).
     Espera o entrance do boot terminar + os assets carregarem, então:
       1. remove o boot do DOM (React loader idêntico fica visível)
       2. no próximo frame, dispara .hero--ready (inicia o shrink) */
  useEffect(() => {
    let cancelled = false
    /* boot-reveal (0.65s) + spinner-in delay (0.20s) ≈ 0.85s
       deixamos 100ms de "respiro" pra estabilizar antes de seguir */
    const bootHold = new Promise<void>((r) => setTimeout(r, 950))
    const assets   = Promise.all(CRITICAL_ASSETS.map(loadImage))

    Promise.all([bootHold, assets]).then(() => {
      if (cancelled) return
      const boot = document.getElementById('boot-loader')
      if (boot) boot.remove()
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true)
      })
    })
    return () => { cancelled = true }
  }, [])

  return (
    <section className={`hero ${ready ? 'hero--ready' : ''}`}>
      {/* foto de fundo (prédio) */}
      <div className="hero-bg" aria-hidden="true">
        <img src="/hero_bg_home.png" alt="" />
        <div className="hero-bg-tint" />
      </div>

      {/* quadrado azul recortado — começa cobrindo a tela inteira,
          shrinka quando .hero--ready é aplicada */}
      <div className="hero-clip" aria-hidden="true">
        <div className="hero-clip-surface" />

        {/* loader: anel rotativo + logo branca, centralizados.
            durante o loading: ambos visíveis (anel girando, logo pulsando)
            quando ready: anel some, logo faz fade-out junto com o shrink */}
        <div className="hero-loader" aria-hidden="true">
          <span className="hero-loader-ring" />
          <div className="hero-loader-logo-wrap">
            <img className="hero-loader-logo" src="/quadraimob-logo.png" alt="" />
          </div>
        </div>

        {/* logo callback dentro do quadrado final, fade-in depois do intro */}
        <img className="hero-clip-logo" src="/quadraimob-logo.png" alt="" />
      </div>

      {/* moldura — linhas finas e translúcidas */}
      <div className="hero-frame" aria-hidden="true">
        <span className="frame-bar frame-top" />
        <span className="frame-bar frame-right" />
        <span className="frame-bar frame-bottom" />
        <span className="frame-bar frame-left" />
      </div>

      {/* header: logo (esquerda) + título (direita) — só logo no mobile */}
      <header className="hero-header">
        <a className="hero-brand" href="/" aria-label="quadraimob — início">
          <img src="/quadraimob-logo-dark.png" alt="quadraimob" />
        </a>
        <span className="hero-header-title">Mapa do Comprador</span>
      </header>

      {/* conteúdo */}
      <div className="hero-content">
        <div className="hero-content-inner">
          <small className="hero-eyebrow">
            <Line delay={0}>Um convite quadraimob</Line>
          </small>

          <h1 className="hero-title" aria-label="Mapa do Comprador Quadraimob 2026">
            <Line delay={0.08}>Mapa do Comprador</Line>
          </h1>

          <div className="hero-lede-wrap">
            <p className="hero-lede">
              Cada imóvel carrega uma história, um sonho e um novo começo.
              Criamos o Mapa do Comprador Quadraimob 2026 para entendermos
              melhor o perfil, as motivações e as preferências dos nossos
              clientes ao conquistarem um novo imóvel. Suas respostas nos
              ajudam a desenvolver experiências cada vez mais alinhadas ao
              que realmente importa nessa jornada.
            </p>
          </div>

          <div className="hero-cta-wrap">
            <a className="hero-cta" href="#perguntas">
              <span className="hero-cta-label">Começar minha jornada</span>
              <svg className="hero-cta-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* chips de info — escondidos no mobile */}
      <ul className="hero-chip hero-chip-tl">
        <li><small>Edição</small></li>
        <li><strong>2026</strong></li>
      </ul>

      <div className="hero-chip hero-chip-br">
        <small>Nível de satisfação</small>
        <div className="hero-chip-bar"><span /></div>
      </div>

      {/* <div className="hero-chip hero-chip-bl">
        <small>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          Brasília, DF
        </small>
        <strong>quadraimob</strong>
      </div> */}
    </section>
  )
}

/* máscara linha-por-linha (intro-line-mask, igual ao Daylight) */
function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="intro-line-mask">
      <span className="intro-line" style={{ animationDelay: `calc(var(--intro-text-start) + ${delay}s)` }}>
        {children}
      </span>
    </span>
  )
}
