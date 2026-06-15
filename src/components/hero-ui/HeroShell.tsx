import type { ReactNode } from 'react'
import '../Hero.css'

type HeroShellProps = {
  ready: boolean
  className?: string
  children: ReactNode
}

export function HeroShell({ ready, className, children }: HeroShellProps) {
  const classes = ['hero', ready ? 'hero--ready' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classes}>
      {children}
    </section>
  )
}
