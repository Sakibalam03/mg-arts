'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

import { cn } from 'utils/cn';

const ANIMATION_DURATION = 0.2;
const ANIMATION_DELAY = ANIMATION_DURATION;
const OPACITY_STEP_DURATION = 0.01;
const LINE_STYLE = {
  transformOrigin: '50% 50%',
  willChange: 'transform, opacity',
};

interface BurgerProps {
  className?: string | null;
  isToggled?: boolean | null;
  onClick?: (() => void) | null;
}

const Burger = ({ className = null, isToggled = null, onClick = null }: BurgerProps) => (
  <LazyMotion features={domAnimation}>
    <m.button
      className={cn('relative flex h-8 w-8 shrink', className)}
      type="button"
      initial={false}
      animate={isToggled ? 'toggled' : 'initial'}
      aria-label={isToggled ? 'Close menu' : 'Open menu'}
      onClick={onClick ?? undefined}
    >
      <m.span
        className="absolute top-2 left-1 block h-0.5 w-6 bg-current"
        style={LINE_STYLE}
        variants={{
          initial: {
            transform: 'translateY(0)',
            opacity: 1,
            transition: {
              transform: { duration: ANIMATION_DURATION, delay: ANIMATION_DELAY },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
          toggled: {
            transform: 'translateY(4px)',
            opacity: 0,
            transition: {
              transform: { duration: ANIMATION_DURATION },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
        }}
      />
      <m.span
        className="absolute top-4 left-1 block h-0.5 w-6 bg-current"
        style={LINE_STYLE}
        variants={{
          initial: {
            transform: 'translateY(0)',
            opacity: 1,
            transition: {
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
          toggled: {
            transform: 'translateY(0)',
            opacity: 0,
            transition: {
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
        }}
      />
      <m.span
        className="absolute top-6 left-1 block h-0.5 w-6 bg-current"
        style={LINE_STYLE}
        variants={{
          initial: {
            transform: 'translateY(0)',
            opacity: 1,
            transition: {
              transform: { duration: ANIMATION_DURATION, delay: ANIMATION_DELAY },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
          toggled: {
            transform: 'translateY(-4px)',
            opacity: 0,
            transition: {
              transform: { duration: ANIMATION_DURATION },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
        }}
      />
      <m.span
        className="absolute top-4 left-[5px] block h-0.5 w-[22px] bg-current"
        style={LINE_STYLE}
        variants={{
          initial: {
            transform: 'rotate(0deg) scaleX(0.95)',
            opacity: 0,
            transition: {
              transform: { duration: ANIMATION_DURATION },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
          toggled: {
            transform: 'rotate(45deg) scaleX(1)',
            opacity: 1,
            transition: {
              transform: { duration: ANIMATION_DURATION, delay: ANIMATION_DELAY },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
        }}
      />
      <m.span
        className="absolute top-4 left-[5px] block h-0.5 w-[22px] bg-current"
        style={LINE_STYLE}
        variants={{
          initial: {
            transform: 'rotate(0deg) scaleX(0.95)',
            opacity: 0,
            transition: {
              transform: { duration: ANIMATION_DURATION },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
          toggled: {
            transform: 'rotate(-45deg) scaleX(1)',
            opacity: 1,
            transition: {
              transform: { duration: ANIMATION_DURATION, delay: ANIMATION_DELAY },
              opacity: { duration: OPACITY_STEP_DURATION, delay: ANIMATION_DELAY },
            },
          },
        }}
      />
    </m.button>
  </LazyMotion>
);

export default Burger;
