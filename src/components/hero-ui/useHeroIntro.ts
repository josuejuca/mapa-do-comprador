import { useEffect, useState } from 'react'

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
    if (img.complete) resolve()
  })
}

export function useHeroIntro(assets: string[]) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const bootHold = new Promise<void>((resolve) => setTimeout(resolve, 950))
    const criticalAssets = Promise.all(assets.map(loadImage))
    const failsafe = new Promise<void>((resolve) => setTimeout(resolve, 2200))

    Promise.race([Promise.all([bootHold, criticalAssets]), failsafe]).then(() => {
      if (cancelled) return

      const boot = document.getElementById('boot-loader')
      if (boot) boot.remove()

      requestAnimationFrame(() => {
        if (!cancelled) setReady(true)
      })
    })

    return () => {
      cancelled = true
    }
  }, [assets])

  return ready
}
