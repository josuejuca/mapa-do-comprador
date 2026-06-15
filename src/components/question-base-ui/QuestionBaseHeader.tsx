import { HeroHeader } from '../hero-ui'

type QuestionBaseHeaderProps = {
  logoSrc: string
  title: string
  href?: string
  onLogoClick?: () => void
}

export function QuestionBaseHeader({ logoSrc, title, href, onLogoClick }: QuestionBaseHeaderProps) {
  return (
    <HeroHeader
      className="white-hero-header"
      href={href}
      onLogoClick={onLogoClick}
      logoSrc={logoSrc}
      title={title}
    />
  )
}
