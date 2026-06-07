'use client'

import NextLink from 'next/link'
import { forwardRef, ReactNode, AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRightIcon, ExternalIcon } from './icons'
import sendGtagEvent from '@/utils/send-gtag-event'
import getNodeText from '@/utils/get-node-text'

const underlineCommonStyles =
  'relative cursor-pointer transition-colors duration-500 before:absolute before:-bottom-1.5 before:left-0 before:h-1.5 before:w-full before:transition-all before:duration-500 hover:before:bottom-full hover:before:opacity-0 before:pointer-events-none'

const sizeStyles = {
  lg: 'text-2xl font-semibold',
  md: 'text-xl font-semibold',
  sm: 'text-lg',
  xs: 'text-base',
  '2xs': 'text-sm',
} as const

const themeStyles = {
  black: 'text-black transition-colors duration-200 hover:text-green-45 dark:text-white dark:hover:text-green-45',
  'black-no-hover': 'text-black',
  white: 'text-white transition-colors duration-200 hover:text-green-45',
  'black-primary-1': `${underlineCommonStyles} before:bg-green-45 hover:text-green-45 dark:before:bg-green-45 dark:text-white dark:hover:text-green-45`,
  'gray-30': 'text-gray-new-30 transition-colors duration-200 hover:text-green-45',
  'gray-50': 'text-gray-new-50 transition-colors duration-200 hover:text-green-45',
  'gray-70': 'text-gray-new-70 dark:text-gray-new-70 transition-colors duration-200 hover:text-green-45',
  'gray-80': 'text-gray-new-80 transition-colors duration-200 hover:text-green-45',
  'gray-90': 'text-gray-new-90 transition-colors duration-200 hover:text-green-45',
} as const

type LinkSize = keyof typeof sizeStyles
type LinkTheme = keyof typeof themeStyles

type NeonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to?: string | null
  size?: LinkSize
  theme?: LinkTheme
  withArrow?: boolean
  arrowClassName?: string
  icon?: 'external' | null
  tagName?: string
  tagText?: string
  children: ReactNode
  prefetch?: boolean
  isExternal?: boolean
}

const NeonLink = forwardRef<HTMLAnchorElement, NeonLinkProps>(
  (
    {
      className: additionalClassName,
      size,
      theme,
      to,
      withArrow = false,
      arrowClassName,
      icon,
      tagName,
      tagText,
      children,
      prefetch,
      isExternal = false,
      onClick,
      onMouseEnter,
      ...props
    },
    ref
  ) => {
    const className = cn(
      size && theme && 'inline-flex leading-none! items-center',
      size && sizeStyles[size],
      theme && themeStyles[theme],
      withArrow && 'group inline-flex w-fit items-center gap-1',
      additionalClassName
    )

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (tagName) {
        sendGtagEvent('Link Clicked', {
          style: theme,
          text: tagText || getNodeText(children),
          tag_name: tagName,
          destination: to,
        })
      }
      onClick?.(e)
    }

    const content = (
      <>
        {withArrow ? <span>{children}</span> : children}
        {withArrow && (
          <ArrowRightIcon
            className={cn(
              '-mb-px size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]',
              arrowClassName
            )}
          />
        )}
        {icon === 'external' && (
          <span className="whitespace-nowrap no-underline">
            <ExternalIcon className="ml-1 inline-block size-3.5! shrink-0 align-[-0.125em]" />
          </span>
        )}
      </>
    )

    if (to?.includes('#')) {
      return (
        <a className={className} href={to} ref={ref} onClick={handleClick} onMouseEnter={onMouseEnter} {...props}>
          {content}
        </a>
      )
    }

    if (to?.startsWith('/')) {
      return (
        <NextLink
          className={className}
          href={to}
          ref={ref}
          prefetch={prefetch}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          {...props}
        >
          {content}
        </NextLink>
      )
    }

    return (
      <a
        className={className}
        href={to ?? undefined}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {content}
      </a>
    )
  }
)

NeonLink.displayName = 'NeonLink'

export default NeonLink
