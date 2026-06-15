import { useRemoveBootLoader } from '../hooks/useBootLoader'
import './ErrorPage.css'

interface ErrorPageProps {
  variant: 'invalid-link' | '404' | '500'
  detail?: string
}

const CONFIG = {
  'invalid-link': {
    code: null,
    eyebrow: 'Link inválido',
    title: 'Acesso direto não permitido',
    body: 'Esta pesquisa só pode ser acessada pelo link enviado a você. Verifique o e-mail e tente novamente.',
    hint: '/survey/<id>',
  },
  '404': {
    code: '404',
    eyebrow: 'Não encontrado',
    title: 'Pesquisa não encontrada',
    body: 'O link que você usou não corresponde a nenhuma pesquisa ativa. Ele pode ter expirado ou ter sido digitado incorretamente.',
    hint: null,
  },
  '500': {
    code: '500',
    eyebrow: 'Erro no servidor',
    title: 'Algo deu errado',
    body: 'Não foi possível carregar a pesquisa no momento. Tente novamente em alguns instantes.',
    hint: null,
  },
}

export default function ErrorPage({ variant, detail }: ErrorPageProps) {
  useRemoveBootLoader()
  const c = CONFIG[variant]

  return (
    <div className="ep">
      {/* foto de fundo com tint escuro */}
      <div className="ep-bg" aria-hidden="true">
        <img src="/hero_bg_home.png" alt="" />
        <div className="ep-bg-tint" />
      </div>

      {/* header — mesmo padrão do Hero */}
      <header className="ep-header">
        <a className="ep-brand" href="/" aria-label="quadraimob — início">
          <img src="/quadraimob-logo-dark.png" alt="quadraimob" />
        </a>
        <span className="ep-badge">Mapa do Comprador</span>
      </header>

      {/* linhas decorativas */}
      <div className="ep-frame" aria-hidden="true">
        <span className="ep-frame-top" />
        <span className="ep-frame-bottom" />
      </div>

      {/* número grande em watermark */}
      {c.code && (
        <span className="ep-watermark" aria-hidden="true">{c.code}</span>
      )}

      {/* conteúdo principal */}
      <div className="ep-main">
        <div className="ep-content">
          <small className="ep-eyebrow">{c.eyebrow}</small>
          <div className="ep-accent" />
          <h1 className="ep-title">{c.title}</h1>
          <p className="ep-body">{c.body}</p>

          {(c.hint || detail) && (
            <div className="ep-codes">
              {c.hint && <code className="ep-code">{c.hint}</code>}
              {detail && <code className="ep-code ep-code--detail">[debug] {detail}</code>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
