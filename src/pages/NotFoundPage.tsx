import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar ao início</Link>
    </main>
  )
}
