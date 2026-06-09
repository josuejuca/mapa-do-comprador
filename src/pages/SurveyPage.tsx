import { useParams } from 'react-router-dom'
import '../App.css'

type SurveyParams = {
  id: string
}

export default function SurveyPage() {
  const { id } = useParams<SurveyParams>()

  return (
    <main className="survey-container">
      <h1>Pesquisa</h1>
      <p className="survey-id">ID: {id}</p>

      {/* Form structure — API integration pending */}
      <form className="survey-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Suas informações</legend>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input id="name" type="text" name="name" placeholder="Seu nome completo" />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" name="email" placeholder="seu@email.com" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Perguntas</legend>

          <div className="field">
            <label htmlFor="q1">Como você conheceu nosso produto?</label>
            <select id="q1" name="q1">
              <option value="">Selecione...</option>
              <option value="search">Busca online</option>
              <option value="social">Redes sociais</option>
              <option value="indication">Indicação</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="comments">Comentários adicionais</label>
            <textarea id="comments" name="comments" rows={4} placeholder="Escreva aqui..." />
          </div>
        </fieldset>

        <button type="submit" className="submit-btn">Enviar resposta</button>
      </form>
    </main>
  )
}
