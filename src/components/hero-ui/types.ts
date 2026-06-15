import type { ReactNode } from 'react'

export type HeroAssets = {
  background: string
  logo: string
  logoDark: string
}

export type HeroCopy = {
  eyebrow: ReactNode
  title: ReactNode
  titleAriaLabel: string
  lede: ReactNode
  cta: {
    label: string
    href: string
  }
}

export type HeroMeta = {
  headerTitle: string
  editionLabel: string
  editionValue: string
  satisfactionLabel: string
}

export type HeroConfig = {
  assets: HeroAssets
  copy: HeroCopy
  meta: HeroMeta
}
