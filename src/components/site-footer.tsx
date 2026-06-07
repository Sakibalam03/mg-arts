'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import Container from './neon/container'
import NeonLink from './neon/link'
import Logo from './neon/logo'
import MENUS from '@/constants/menus'
import { SunIcon, MoonIcon, SystemIcon, ChevronDownIcon } from './neon/icons'

/* ─── ThemeSelect ────────────────────────────────────────────────────────── */

const ThemeSelect = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const themes = ['system', 'light', 'dark'] as const

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div
      className={cn(
        'relative flex gap-x-1 rounded-full border border-gray-new-80 dark:border-gray-new-20',
        'after:pointer-events-none after:absolute after:-top-px after:-left-px after:h-7 after:w-7 after:rounded-full after:border after:border-inherit',
        'after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.34,1,0.64,1)] after:will-change-transform',
        {
          'after:translate-x-0': theme === 'system',
          'after:translate-x-[30px]': theme === 'light',
          'after:translate-x-[60px]': theme === 'dark',
        },
        className
      )}
      role="radiogroup"
      aria-label="Select theme"
    >
      {themes.map((_theme) => {
        const isSelected = _theme === theme
        const iconClass = cn('text-gray-new-50 dark:text-gray-new-70', {
          'text-black-pure! dark:text-white!': isSelected,
        })
        return (
          <button
            key={_theme}
            type="button"
            role="radio"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-full -outline-offset-1"
            aria-checked={isSelected}
            data-state={isSelected ? 'checked' : 'unchecked'}
            value={_theme}
            aria-label={_theme}
            onClick={() => setTheme(_theme)}
          >
            {_theme === 'system' && <SystemIcon className={iconClass} />}
            {_theme === 'light' && <SunIcon className={iconClass} />}
            {_theme === 'dark' && <MoonIcon className={iconClass} />}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */

export default function SiteFooter() {
  return (
    <footer className="relative z-30 mt-auto border-t border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-black-pure">
      <Container className="flex justify-between gap-x-10 py-12 sm:py-5" size={1920}>
        <div className="flex flex-col items-start lg:w-full">
          <div className="mb-auto lg:mb-11">
            <Logo className="sm:h-6 sm:w-auto" width={102} height={28} />
            <span
              className={cn(
                'mt-3.5 block text-[13px] leading-none tracking-extra-tight whitespace-nowrap',
                'text-gray-new-40 dark:text-gray-new-60',
                'xl:mt-3'
              )}
            >
              Interior Execution & PMC
            </span>
          </div>

          <ThemeSelect className="mb-8 lg:mb-6" />

          <div className="flex flex-col items-start justify-between gap-y-5 lg:w-full lg:flex-row sm:flex-col">
            <div
              className={cn(
                'flex max-w-2xl flex-col gap-y-2 text-[13px] leading-none tracking-extra-tight text-gray-new-40',
                'dark:text-gray-new-60'
              )}
            >
              <p>© MG Arts {new Date().getFullYear()}. All rights reserved.</p>
              <p className="flex flex-wrap gap-x-3 gap-y-1">
                <NeonLink className="hover:text-gray-new-20 dark:hover:text-gray-new-80" to="/privacy">
                  Privacy Policy
                </NeonLink>
                <NeonLink className="hover:text-gray-new-20 dark:hover:text-gray-new-80" to="/terms">
                  Terms of Use
                </NeonLink>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-fit gap-x-[88px] xl:gap-x-6 lg:hidden">
          {MENUS.footer.map(({ heading, items }, index) => (
            <div className="grid content-start gap-y-7" key={index}>
              <span className="text-[10px] leading-none text-gray-new-10 uppercase dark:text-white">
                {heading}
              </span>
              <ul className="flex flex-col gap-y-5">
                {items.map(({ to, text }, itemIndex) => {
                  const isExternalUrl = to?.startsWith('http')
                  return (
                    <li key={itemIndex} className="-my-px flex min-w-[148px] py-px">
                      <NeonLink
                        className={cn(
                          '-my-px flex cursor-pointer items-center rounded-sm py-px whitespace-nowrap',
                          'text-[15px] leading-none tracking-extra-tight text-gray-new-40',
                          'transition-colors duration-200 hover:text-black-pure',
                          'dark:text-gray-new-60 dark:hover:text-white'
                        )}
                        to={to}
                        isExternal={isExternalUrl}
                      >
                        {text}
                      </NeonLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </footer>
  )
}
