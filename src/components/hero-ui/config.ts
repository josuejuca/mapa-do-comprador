import type { HeroConfig } from './types'

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  assets: {
    background: '/hero_bg_home.png',
    logo: '/quadraimob-logo.png',
    logoDark: '/quadraimob-logo-dark.png',
  },
  copy: {
    eyebrow: 'Um convite quadraimob',
    title: 'Mapa do Comprador',
    titleAriaLabel: 'Mapa do Comprador Quadraimob 2026',
    lede: 'Cada imóvel carrega uma história, um sonho e um novo começo. Criamos o Mapa do Comprador Quadraimob 2026 para entendermos melhor o perfil, as motivações e as preferências dos nossos clientes ao conquistarem um novo imóvel. Suas respostas nos ajudam a desenvolver experiências cada vez mais alinhadas ao que realmente importa nessa jornada.',
    cta: {
      label: 'Começar minha jornada',
      href: '/question-base/text',
    },
  },
  meta: {
    headerTitle: 'Mapa do Comprador',
    editionLabel: 'Edição',
    editionValue: '2026',
    satisfactionLabel: 'Nível de satisfação',
  },
}

export const DEFAULT_CRITICAL_ASSETS = [
  DEFAULT_HERO_CONFIG.assets.background,
  DEFAULT_HERO_CONFIG.assets.logo,
  DEFAULT_HERO_CONFIG.assets.logoDark,
]
