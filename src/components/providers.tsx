'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import { ThemeProvider } from '@/lib/theme'

function NProgressHandler() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.done()
  }, [pathname])

  useEffect(() => {
    // Keep --nprogress-top in sync with the actual bottom of the sticky header
    const syncTop = () => {
      const header = document.querySelector<HTMLElement>('header.header')
      const bottom = header ? header.getBoundingClientRect().bottom : 0
      document.documentElement.style.setProperty('--nprogress-top', `${Math.max(0, bottom)}px`)
    }
    syncTop()
    window.addEventListener('scroll', syncTop, { passive: true })
    window.addEventListener('resize', syncTop, { passive: true })
    return () => {
      window.removeEventListener('scroll', syncTop)
      window.removeEventListener('resize', syncTop)
    }
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target === '_blank') return
      try {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
      } catch {
        return
      }
      NProgress.start()
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NProgressHandler />
      {children}
    </ThemeProvider>
  )
}
