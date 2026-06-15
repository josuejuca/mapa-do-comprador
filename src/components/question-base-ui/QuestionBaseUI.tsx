import type { ReactNode } from 'react'
import { QuestionBaseHeader } from './QuestionBaseHeader'
import { QuestionBaseLines } from './QuestionBaseLines'
import { QuestionBaseLoading } from './QuestionBaseLoading'
import { QuestionBaseShell } from './QuestionBaseShell'
import { QuestionBaseSkyline } from './QuestionBaseSkyline'

type SkylineColors = {
  mainColor?: string
  softColor?: string
  thinColor?: string
  hatchColor?: string
}

type QuestionBaseUIProps = {
  ready: boolean
  logoSrc: string
  title: string
  href?: string
  onLogoClick?: () => void
  className?: string
  skylineColors?: SkylineColors
  children?: ReactNode
}

export function QuestionBaseUI({
  ready,
  logoSrc,
  title,
  href,
  onLogoClick,
  className,
  skylineColors,
  children,
}: QuestionBaseUIProps) {
  return (
    <QuestionBaseShell ready={ready} className={className}>
      <QuestionBaseLoading logoSrc={logoSrc} />
      <QuestionBaseLines />
      <QuestionBaseHeader logoSrc={logoSrc} title={title} href={href} onLogoClick={onLogoClick} />
      {children}
      <QuestionBaseSkyline {...skylineColors} />
    </QuestionBaseShell>
  )
}
