'use client';

import Link from '../link';
import { cn } from 'utils/cn';

interface LogoProps {
  className?: string | null;
  width?: number;
  height?: number;
  isHeader?: boolean;
  priority?: boolean;
}

const Logo = ({ className = null }: LogoProps) => {
  return (
    <Link
      className={cn('block w-fit focus-visible:outline-offset-4', className)}
      to="/"
    >
      <span className="font-sans font-extrabold tracking-[-0.03em] text-[17px] leading-none text-black-pure dark:text-white select-none">
        MG Arts
      </span>
    </Link>
  );
};

export default Logo;
