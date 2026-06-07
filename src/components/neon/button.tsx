'use client'

import { forwardRef, ReactNode, ButtonHTMLAttributes, MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import NeonLink from './link'
import sendGtagEvent from '@/utils/send-gtag-event'
import getNodeText from '@/utils/get-node-text'

const sizeStyles = {
  lg: 'text-base h-12 px-[54px] lg:h-11 lg:px-11 lg:text-sm font-semibold',
  'lg-new': 'text-base h-11 px-7 tracking-extra-tight xl:text-sm xl:px-[18px] xl:h-9 md:px-[14px]',
  md: 'py-7 px-11 2xl:py-[26px] xl:py-[21px] xl:px-9 md:py-5 md:px-8 font-semibold',
  'md-new': 'px-9 h-12 font-medium tracking-tighter lg:h-11 lg:px-11',
  sm: 'py-[26px] px-11 2xl:py-[21px] 2xl:px-9 xl:py-5 xl:px-8 font-semibold',
  'sm-new': 'h-[38px] px-7 tracking-extra-tight text-sm',
  xs: 'py-[14px] px-[26px] font-medium',
  xxs: 'h-8 px-4 text-sm tracking-extra-tight font-medium',
  new: 'h-11 px-7 tracking-extra-tight lg:h-9 lg:text-sm lg:px-[18px]',
} as const

const themeStyles = {
  primary: 'bg-green-45 text-black hover:bg-[#00e5bf]',
  secondary: 'bg-black text-white hover:bg-[#292929] disabled:bg-[#292929]',
  'white-filled': 'bg-white text-black hover:bg-gray-new-80',
  'white-filled-multi': 'dark:bg-white dark:text-black-pure hover:dark:bg-gray-new-80 bg-black-pure text-white hover:bg-gray-new-20',
  outlined: 'bg-black-pure/[0.02] text-black-pure border-gray-new-60 hover:border-black-pure dark:bg-white/[0.02] border dark:border-gray-new-40 dark:text-white hover:dark:border-white',
  'outlined-new': 'bg-black-pure/[0.02] text-black-pure border-gray-new-20 hover:border-black-pure dark:bg-white/[0.02] border dark:border-gray-new-40 dark:text-white hover:dark:border-white',
  'green-filled': 'bg-green-52 text-black-pure hover:bg-[#2dc88a]',
  'gray-10': 'bg-gray-new-10 text-white hover:bg-gray-new-20',
  'gray-20': 'bg-gray-new-20 text-white hover:bg-gray-new-40',
  transparent: 'bg-transparent text-black-pure hover:bg-gray-new-90 hover:dark:bg-gray-new-10 dark:text-white',
  black: 'bg-transparent text-black-pure dark:text-white hover:text-gray-new-30 dark:hover:text-gray-new-70',
} as const

type ButtonSize = keyof typeof sizeStyles
type ButtonTheme = keyof typeof themeStyles

const BASE =
  'inline-flex cursor-pointer items-center justify-center leading-none! text-center whitespace-nowrap rounded-full transition-colors duration-200'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  to?: string | null
  size?: ButtonSize
  theme?: ButtonTheme
  tagName?: string
  analyticsOnHover?: boolean
  handleClick?: () => void
  withArrow?: boolean
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className: additionalClassName,
      to,
      size,
      theme,
      tagName,
      analyticsOnHover = false,
      handleClick,
      withArrow = false,
      children,
      onClick,
      onMouseEnter,
      ...otherProps
    },
    ref
  ) => {
    const className = cn(
      BASE,
      size ? sizeStyles[size] : undefined,
      theme ? themeStyles[theme] : undefined,
      additionalClassName
    )

    const fireAnalytics = (eventType = 'clicked') => {
      if (!tagName) return
      sendGtagEvent(`Button ${eventType}`, {
        style: theme,
        text: getNodeText(children),
        tag_name: tagName,
      })
    }

    if (to || withArrow) {
      return (
        <NeonLink
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          className={className}
          to={to}
          withArrow={withArrow}
          onClick={(e) => {
            if (handleClick) handleClick()
            fireAnalytics('clicked')
            ;(onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined)?.(e)
          }}
          onMouseEnter={
            analyticsOnHover
              ? () => fireAnalytics('hovered')
              : (onMouseEnter as unknown as React.MouseEventHandler<HTMLAnchorElement>)
          }
          {...(otherProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </NeonLink>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={(e) => {
          if (handleClick) handleClick()
          fireAnalytics('clicked')
          onClick?.(e)
        }}
        onMouseEnter={
          analyticsOnHover
            ? () => fireAnalytics('hovered')
            : onMouseEnter
        }
        {...otherProps}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
