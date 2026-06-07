import Image from 'next/image';

import Link from 'components/shared/link';
import links from 'constants/links';
import ArrowTopRightIcon from 'icons/arrow-right.inline';
import { cn } from 'utils/cn';

import bannerImage from './image/banner-pattern';
import noiseBackground from './image/noise-background';

interface MenuBannerProps {
  linkProps?: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    className?: string;
  };
}

const MenuBanner = ({ linkProps: { className, ...linkProps } = {} }: MenuBannerProps) => (
  <Link
    className={cn(
      'group relative flex h-[340px] w-[320px] items-end! overflow-hidden border border-gray-new-10 bg-black-pure p-6 max-lg:w-auto max-md:h-[240px] max-md:w-[320px]',
      className
    )}
    to={links.whyNeon}
    tagName="Menu Banner"
    tagText="What is Neon"
    {...linkProps}
  >
    <Image
      className="pointer-events-none absolute -bottom-4 left-[-11px] z-0 max-w-none max-md:-bottom-0.5"
      src={noiseBackground}
      width={383}
      height={365}
      alt=""
    />
    <Image
      className="pointer-events-none absolute -bottom-4 left-[-11px] z-[1] max-w-none max-md:-bottom-0.5"
      src={bannerImage}
      width={383}
      height={365}
      alt=""
    />

    <div className="flex flex-col gap-y-2">
      <p className="flex items-baseline gap-x-2.5 text-2xl leading-none font-medium tracking-tighter whitespace-nowrap text-white max-lg:text-lg max-md:text-base">
        What is Neon
        <ArrowTopRightIcon className="-translate-x-2 scale-75 text-white opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100" />
      </p>
      <p className="text-[15px] leading-tight tracking-extra-tight text-gray-new-60 max-lg:text-[13px]">
        Serverless Postgres, by Databricks
      </p>
    </div>
  </Link>
);

export default MenuBanner;
