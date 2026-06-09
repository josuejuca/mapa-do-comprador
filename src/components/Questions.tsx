import { useEffect, useRef, useState } from 'react'
import './Questions.css'

const QUESTIONS = [
  {
    title: 'Qual é o seu perfil de comprador?',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    title: 'Como foi sua experiência de busca pelo imóvel?',
    body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  },
  {
    title: 'Quais canais influenciaram sua decisão de compra?',
    body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.',
  },
  {
    title: 'O que mais pesou na escolha do imóvel?',
    body: 'Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum.',
  },
  {
    title: 'Como avalia o processo de compra do início ao fim?',
    body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est.',
  },
  {
    title: 'Quais foram os maiores desafios durante a jornada?',
    body: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  },
  {
    title: 'Você recomendaria a quadraimob para amigos ou familiares?',
    body: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis dicta.',
  },
  {
    title: 'O que podemos melhorar para a sua próxima experiência?',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore fugiat.',
  },
]

const TITLE_WORDS = ['Conte', 'um', 'pouco', 'mais', 'sobre', 'você.']

export default function Questions() {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="perguntas"
      ref={sectionRef}
      className={`questions${revealed ? ' revealed' : ''}`}
    >
      <div className="questions-inner">

        {/* header */}
        <header className="qs-header">
          <p className="qs-eyebrow">
            <span className="qs-eyebrow-dot" />
            Mapa do Comprador 2026
          </p>

          <h2 className="qs-title">
            {TITLE_WORDS.map((word, i) => (
              <span
                key={i}
                className="qs-word"
                style={{ '--word-i': i } as React.CSSProperties}
              >
                {word}
              </span>
            ))}
          </h2>

          <div className="qs-accent-line" />
        </header>

        {/* cards */}
        <ol className="qs-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {QUESTIONS.map((q, i) => (
            <li
              key={i}
              className="q-card"
              style={{ '--card-i': i } as React.CSSProperties}
            >
              <div
                className="q-badge"
                style={{ '--card-i': i } as React.CSSProperties}
              >
                {i + 1}
              </div>
              <p className="q-title">{q.title}</p>
              <p className="q-body">{q.body}</p>
            </li>
          ))}
        </ol>

      </div>
    </section>
  )
}
