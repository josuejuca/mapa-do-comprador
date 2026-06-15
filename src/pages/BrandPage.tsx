import { Link } from 'react-router-dom'
import { useRemoveBootLoader } from '../hooks/useBootLoader'
import './BrandPage.css'

const heroComponents = [
  {
    name: 'HeroShell',
    role: 'Define a seção raiz, o estado de entrada e as variáveis de layout do bloco.',
  },
  {
    name: 'HeroBackground',
    role: 'Renderiza a imagem arquitetônica com tint escuro para garantir contraste.',
  },
  {
    name: 'HeroClip',
    role: 'Cria o painel azul animado, o loader central e o logo final dentro do recorte.',
  },
  {
    name: 'HeroFrame',
    role: 'Desenha as linhas finas que marcam a composição e reforçam o grid.',
  },
  {
    name: 'HeroHeader',
    role: 'Mantém logo, título curto e área superior consistente entre telas.',
  },
  {
    name: 'HeroContent',
    role: 'Agrupa eyebrow, título, texto de apoio e CTA com a animação de entrada.',
  },
  {
    name: 'HeroChips',
    role: 'Exibe metadados laterais como edição e indicador de satisfação.',
  },
]

const layoutSections = [
  'Hero de abertura com fotografia, recorte azul, CTA e chips editoriais.',
  'Bloco de perguntas em formulário, ancorado por #perguntas na home.',
  'Estados de erro usando o mesmo fundo, header e vocabulário escuro da Hero.',
  'Páginas de apoio para documentação, demonstrações e validação visual.',
]

const tokens = [
  ['Navy base', '#001335'],
  ['Azul ação', '#0070FF'],
  ['Ciano luz', '#40C0FA'],
  ['Off white', '#FAFBFD'],
]

export default function BrandPage() {
  useRemoveBootLoader()

  return (
    <main className="brand-page">
      <header className="brand-nav">
        <Link className="brand-logo" to="/" aria-label="Voltar para home">
          <img src="/quadraimob-logo.png" alt="quadraimob" />
        </Link>
        <nav className="brand-links" aria-label="Páginas de referência">
          <Link to="/">Home</Link>
          <Link to="/hero-demo">Hero demo</Link>
          <Link to="/hero-edit">Hero edit</Link>
          <Link to="/home-mov">Home mov</Link>
        </nav>
      </header>

      <section className="brand-hero">
        <small>Mapa do Comprador 2026</small>
        <h1>Guia dos componentes da Hero e do layout base.</h1>
        <p>
          A Hero foi desmembrada em peças reutilizáveis para manter o padrão
          visual nas próximas etapas sem prender tudo em um único componente.
          Esta página documenta a anatomia, os tokens e a sequência geral do
          produto.
        </p>
      </section>

      <section className="brand-section">
        <div className="brand-section-heading">
          <small>Hero</small>
          <h2>Componentes extraídos</h2>
        </div>
        <div className="brand-component-grid">
          {heroComponents.map((component) => (
            <article className="brand-component-card" key={component.name}>
              <code>{component.name}</code>
              <p>{component.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-section brand-layout">
        <div className="brand-section-heading">
          <small>Layout</small>
          <h2>Como o restante da experiência deve seguir</h2>
        </div>
        <ol className="brand-layout-list">
          {layoutSections.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ol>
      </section>

      <section className="brand-section">
        <div className="brand-section-heading">
          <small>Tokens</small>
          <h2>Base visual</h2>
        </div>
        <div className="brand-token-grid">
          {tokens.map(([label, color]) => (
            <article className="brand-token" key={label}>
              <span style={{ backgroundColor: color }} />
              <strong>{label}</strong>
              <code>{color}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-section brand-rules">
        <div className="brand-section-heading">
          <small>Diretrizes</small>
          <h2>Regras para as próximas etapas</h2>
        </div>
        <div className="brand-rule-grid">
          <p>Usar fotografia real ou render claro quando o usuário precisar reconhecer imóvel, lugar ou material.</p>
          <p>Preservar o contraste alto da Hero: fundo escuro, texto branco e acento azul/ciano apenas como apoio.</p>
          <p>Manter CTAs arredondados, glass leve e animações orquestradas pelo estado <code>hero--ready</code>.</p>
          <p>Controlar posição e tamanho do recorte por <code>--clip-top/right/bottom/left</code>; frame, logo e chips acompanham esses valores.</p>
          <p>Documentar novos blocos nesta página antes de replicar padrões em outras rotas.</p>
        </div>
      </section>
    </main>
  )
}
