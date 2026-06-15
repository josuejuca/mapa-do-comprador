import { useEffect } from 'react'

export function useRemoveBootLoader() {
  useEffect(() => {
    const boot = document.getElementById('boot-loader')
    if (!boot) return
    boot.setAttribute('data-leaving', '1')
    const t = setTimeout(() => boot.remove(), 350)
    return () => clearTimeout(t)
  }, [])
}
