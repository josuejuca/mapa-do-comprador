import type { ReactNode } from 'react'

type IntroLineProps = {
  children: ReactNode
  delay?: number
}

export function IntroLine({ children, delay = 0 }: IntroLineProps) {
  return (
    <span className="intro-line-mask">
      <span
        className="intro-line"
        style={{ animationDelay: `calc(var(--intro-text-start) + ${delay}s)` }}
      >
        {children}
      </span>
    </span>
  )
}
