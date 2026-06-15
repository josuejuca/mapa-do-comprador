import type { ReactNode } from 'react'
import '../../pages/WhitePage.css'

type QuestionBaseShellProps = {
  ready: boolean
  className?: string
  children: ReactNode
}

export function QuestionBaseShell({ ready, className, children }: QuestionBaseShellProps) {
  const classes = ['white-page', ready ? 'white-page--ready' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={classes}>
      {children}
    </main>
  )
}
