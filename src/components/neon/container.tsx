import { forwardRef, ElementType, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const sizes = {
  lg: 'max-w-[1760px] 3xl:max-w-[1472px] 2xl:px-10',
  md: 'max-w-[1760px] 3xl:max-w-[1472px] 2xl:max-w-[1216px] xl:max-w-[936px]',
  medium: 'max-w-[1472px] 2xl:px-10',
  sm: 'max-w-[1460px] 2xl:max-w-[1216px] xl:max-w-[936px]',
  small: 'max-w-[1344px] px-8',
  xs: 'max-w-[860px]',
  xxs: 'max-w-[704px] md:px-5',
  1920: 'max-w-[1856px] px-8',
  1600: 'max-w-[1600px] px-8',
  1472: 'max-w-[1536px] px-8',
  1408: 'max-w-[1472px] px-8',
  1344: 'max-w-[1408px] px-8',
  1280: 'max-w-[1280px] px-8',
  1152: 'max-w-6xl px-8',
  960: 'max-w-[960px] md:px-5',
} as const

type ContainerSize = keyof typeof sizes

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  size: ContainerSize
  as?: string
}

const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ className, size, children, as: Tag = 'div', ...otherProps }, ref) => {
    const El = Tag as ElementType
    return (
      <El
        className={cn('relative mx-auto lg:max-w-none lg:px-8 md:px-5', sizes[size], className)}
        ref={ref}
        {...otherProps}
      >
        {children}
      </El>
    )
  }
)

Container.displayName = 'Container'

export default Container
