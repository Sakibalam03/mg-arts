'use client';

import { forwardRef } from 'react';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';
import getNodeText from 'utils/get-node-text';
import sendGtagEvent from 'utils/send-gtag-event';

const styles = {
  base: 'inline-flex cursor-pointer items-center justify-center leading-none! text-center whitespace-nowrap rounded-full transition-colors duration-200',
  size: {
    lg: 'text-base h-12 px-[54px] max-lg:h-11 max-lg:px-11 max-lg:text-sm font-semibold',
    'lg-new':
      'text-base h-11 px-7 tracking-extra-tight max-xl:text-sm max-xl:px-[18px] max-xl:h-9 max-md:px-[14px]',
    md: 't-2xl py-7 px-11 max-2xl:py-[26px] max-xl:py-[21px] max-xl:px-9 max-md:py-5 max-md:px-8 font-semibold',
    'md-new':
      'px-9 h-12 font-medium tracking-tighter max-lg:h-11 max-lg:px-11 max-xs:h-10 max-xs:text-sm',
    sm: 't-xl py-[26px] px-11 max-2xl:py-[21px] max-2xl:px-9 max-xl:py-5 max-xl:px-8 font-semibold',
    'sm-new': 'h-[38px] px-7 tracking-extra-tight text-sm',
    xs: 't-base py-[14px] px-[26px] font-medium',
    xxs: 'h-8 px-4 text-sm tracking-extra-tight font-medium',
    new: 'h-11 px-7 tracking-extra-tight max-lg:h-9 max-lg:text-sm max-lg:px-[18px]',
  },
  theme: {
    primary: 'bg-primary-1 text-black hover:bg-[#00e5bf]',
    secondary: 'bg-black text-white hover:bg-[#292929] disabled:bg-[#292929]',
    'white-off-filled': 'bg-[#E4F1EB] text-gray-new-8',
    'white-filled': 'bg-white text-black hover:bg-gray-new-80',
    'white-filled-multi':
      'dark:bg-white dark:text-black-pure hover:dark:bg-gray-new-80 bg-black-pure text-white hover:bg-gray-new-20',
    outlined:
      'bg-black-pure/0.02 text-black-pure border-gray-new-60 hover:border-black-pure dark:bg-white/0.02 border dark:border-gray-new-40 dark:text-white hover:dark:border-white',
    'outlined-new':
      'bg-black-pure/0.02 text-black-pure border-gray-new-20 hover:border-black-pure dark:bg-white/0.02 border dark:border-gray-new-40 dark:text-white hover:dark:border-white',
    'green-underlined':
      'underline decoration-green-45/40 hover:decoration-green-45/100 text-green-45 transition-colors duration-500',
    'green-filled': 'bg-green-52 text-black-pure hover:bg-code-green-2',
    blue: 'bg-blue-80 text-black hover:bg-[#C6EAF1]',
    'gray-10': 'bg-gray-new-10 text-white hover:bg-gray-new-20',
    'gray-20': 'bg-gray-new-20 text-white hover:bg-gray-new-40',
    'gray-94-filled': 'bg-gray-new-94 text-black hover:bg-gray-6',
    'with-icon':
      'pl-[4.1rem] max-xl:pl-[4.25rem] max-lg:pl-[4.25rem] bg-green-45 text-black hover:bg-[#00e5bf]',
    'red-filled': 'bg-[#F18484] text-black hover:bg-[#FBA8A8]',
    transparent:
      'bg-transparent text-black-pure hover:bg-gray-new-90 hover:dark:bg-gray-new-10 dark:text-white',
    black: 'text-black dark:text-white',
  },
} as const;

type SizeKey = keyof typeof styles.size;
type ThemeKey = keyof typeof styles.theme;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  to?: string | null;
  size?: SizeKey | null;
  theme?: ThemeKey | null;
  tagName?: string | null;
  analyticsOnHover?: boolean;
  handleClick?: (() => void) | null;
  withArrow?: boolean;
  children: React.ReactNode;
}

const getCombinationStyles = (size: SizeKey | null | undefined, theme: ThemeKey | null | undefined) => {
  if (size === 'new' && theme === 'white-filled') return 'font-medium';
  return null;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className: additionalClassName,
      to = null,
      size = null,
      theme = null,
      tagName = null,
      analyticsOnHover = false,
      handleClick = null,
      withArrow = false,
      children,
      ...otherProps
    },
    ref
  ) => {
    const className = cn(
      styles.base,
      size && styles.size[size],
      theme && styles.theme[theme],
      getCombinationStyles(size, theme),
      additionalClassName
    );

    const handleAnalytics = (eventType = 'clicked') => {
      if (!tagName) return;
      sendGtagEvent(`Button ${eventType}`, {
        style: theme,
        text: getNodeText(children),
        tag_name: tagName,
      });
    };

    if (to || withArrow) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          to={to ?? undefined}
          withArrow={withArrow}
          onClick={() => {
            if (handleClick) handleClick();
            handleAnalytics('clicked');
          }}
          onMouseEnter={analyticsOnHover ? () => handleAnalytics('hovered') : undefined}
          {...(otherProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        type="button"
        onClick={() => {
          if (handleClick) handleClick();
          handleAnalytics('clicked');
        }}
        onMouseEnter={analyticsOnHover ? () => handleAnalytics('hovered') : undefined}
        {...(otherProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
