import { forwardRef } from 'react';

import { cn } from 'utils/cn';

const styles = {
  size: {
    lg: 'max-w-[1760px] max-3xl:max-w-[1472px] max-2xl:px-10',
    md: 'max-w-[1760px] max-3xl:max-w-[1472px] max-2xl:max-w-[1216px] max-xl:max-w-[936px]',
    medium: 'max-w-[1472px] max-2xl:px-10',
    sm: 'max-w-[1460px] max-2xl:max-w-[1216px] max-xl:max-w-[936px]',
    small: 'max-w-[1344px] px-8',
    xs: 'max-w-[860px]',
    xxs: 'max-w-[704px] max-md:px-5',
    1920: 'max-w-[1856px] px-8',
    1600: 'max-w-[1600px] px-8',
    1472: 'max-w-[1536px] px-8',
    1408: 'max-w-[1472px] px-8',
    1344: 'max-w-[1408px] px-8',
    1280: 'max-w-[1280px] px-8',
    1152: 'max-w-6xl px-8',
    1100: 'max-w-[1100px]',
    1088: 'max-w-[1088px]',
    960: 'max-w-[960px] max-md:px-5',
    832: 'max-w-208',
    768: 'max-w-3xl',
    640: 'max-w-[640px]',
    576: 'max-w-[576px]',
    branching:
      'max-w-[1216px] max-3xl:max-w-[1216px] max-xl:max-w-full max-xl:px-8 max-md:px-8 max-sm:px-5',
  } as const,
};

type SizeKey = keyof typeof styles.size;

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  size: SizeKey;
  children: React.ReactNode;
  as?: React.ElementType;
}

const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ className, size, children, as: Tag = 'div', ...otherProps }, ref) => (
    <Tag
      className={cn(
        'relative mx-auto max-lg:max-w-none max-lg:px-8 max-md:px-5',
        styles.size[size],
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {children}
    </Tag>
  )
);

Container.displayName = 'Container';

export default Container;
