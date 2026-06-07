'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import NeonLink from './link'
import { LogoLightIcon, LogoDarkIcon } from './icons'
import useContextMenu from '@/hooks/use-context-menu'

type LogoProps = {
  className?: string
  width: number
  height: number
  isHeader?: boolean
}

const Logo = ({ className, width, height, isHeader = false }: LogoProps) => {
  const { clicked, setClicked } = useContextMenu()

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setClicked(true)
  }

  return (
    <div className="relative shrink-0">
      <NeonLink
        className="block w-fit focus-visible:outline-offset-4"
        to="/"
        onContextMenu={isHeader ? handleContextMenu : undefined}
      >
        <span className="sr-only">MG Arts</span>
        <LogoLightIcon className={cn('dark:hidden', className)} width={width} height={height} />
        <LogoDarkIcon className={cn('hidden dark:block', className)} width={width} height={height} />
      </NeonLink>
      {isHeader && clicked && (
        <div
          className={cn(
            'absolute top-10 z-50 flex min-w-[200px] flex-col items-start gap-1',
            'border border-gray-new-80 bg-gray-new-98 p-2',
            'shadow-[0_10px_20px_0_rgba(0,0,0,0.06)]',
            'dark:border-gray-new-20 dark:bg-[#0A0A0B]',
            'dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.40)]'
          )}
        >
          <a
            className={cn(
              'group flex w-full items-center gap-x-2 p-3 whitespace-nowrap',
              'text-left text-[15px] leading-dense tracking-extra-tight text-gray-new-10',
              'transition-colors duration-200',
              'hover:bg-gray-new-90 hover:text-gray-new-10',
              'dark:text-gray-new-90 dark:hover:bg-gray-new-8'
            )}
            href="/brand/mg-arts-assets.zip"
          >
            Download logo pack
          </a>
        </div>
      )}
    </div>
  )
}

export default Logo
