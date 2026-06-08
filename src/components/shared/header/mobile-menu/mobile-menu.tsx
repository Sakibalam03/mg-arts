'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useContext, useState } from 'react';

import Button from 'components/shared/button';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import { TopbarContext } from 'contexts/topbar-context';
import useMobileMenu from 'hooks/use-mobile-menu';
import type { NavItem } from '@/types/nav';
import ChevronIcon from 'icons/chevron-down-thin.inline';
import { cn } from 'utils/cn';

import Burger from '../burger';
import MobileMenuAuth from './mobile-menu-auth';

const ANIMATION_DURATION = 0.2;

const MobileMenuItem = ({ text, to, sections }: NavItem) => {
  const [isMenuItemOpen, setIsMenuItemOpen] = useState<boolean | undefined>();
  const Tag = sections?.length ? Button : Link;
  const hasSubmenu = (sections?.length ?? 0) > 0;

  const handleMenuItemClick = () => {
    if (sections) {
      setIsMenuItemOpen(!isMenuItemOpen);
    }
  };

  return (
    <li
      className={cn(
        'shrink-0 overflow-hidden border-b border-gray-new-94 last:border-b-0 dark:border-gray-new-20',
        { 'pb-14 max-sm:pb-10': isMenuItemOpen }
      )}
    >
      <Tag
        className="relative flex w-full items-center py-7 text-2xl leading-none font-medium tracking-extra-tight max-sm:py-5 max-sm:text-xl"
        to={to}
        tagName="Mobile Menu"
        handleClick={handleMenuItemClick}
      >
        {text}
        {sections?.length && <ChevronIcon className="ml-auto text-gray-new-30 dark:text-gray-new-70" />}
      </Tag>
      <LazyMotion features={domAnimation}>
        {hasSubmenu && (
          <AnimatePresence>
            {isMenuItemOpen && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
                className="flex gap-x-3.5 max-md:flex-col max-md:gap-y-9"
              >
                <ul className="grid grid-cols-[224px,224px] gap-x-5 gap-y-9 pt-3 max-sm:grid-cols-2 max-xs:grid-cols-1">
                  {sections!.map(({ title, items }, index) => (
                    <li key={index}>
                      {title && (
                        <h3 className="mb-5 text-[10px] leading-none tracking-snug text-gray-new-50 uppercase">
                          {title}
                        </h3>
                      )}
                      <ul className="flex flex-col gap-5">
                        {items.map(({ title: itemTitle, description, to: itemTo }) => (
                          <li key={itemTitle}>
                            <Link
                              className="grid gap-y-2 text-[13px] leading-tight tracking-snug text-gray-new-40 dark:text-gray-new-60"
                              to={itemTo}
                              tagName="MobileMenu"
                            >
                              <span className="text-lg leading-none font-medium tracking-extra-tight text-black-pure dark:text-white max-sm:text-base">
                                {itemTitle}
                              </span>
                              {description}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </m.div>
            )}
          </AnimatePresence>
        )}
      </LazyMotion>
    </li>
  );
};

interface MobileMenuProps {
  isDocPage?: boolean;
  docPageType?: string | null;
  navItems?: NavItem[];
}

const MobileMenu = ({ isDocPage = false, docPageType = null, navItems = [] }: MobileMenuProps) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  const { hasTopbar } = useContext(TopbarContext);

  return (
    <>
      <div className={cn("absolute right-7 z-50 hidden gap-5 max-lg:flex max-lg:items-center max-lg:gap-x-4 max-sm:right-4", hasTopbar ? "top-12" : "top-3")}>
        {isDocPage && <InkeepTrigger className="mobile-search" docPageType={docPageType} />}
        <Burger
          className="relative flex text-black dark:text-white"
          isToggled={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        />
      </div>
      {isMobileMenuOpen && (
        <nav className="fixed inset-0 z-40 hidden flex-col justify-between bg-white safe-paddings dark:bg-black-pure max-lg:flex">
          <div
            className={cn('relative h-full pt-14 pb-[101px] max-sm:pb-[125px]', {
              'pt-[96px]': hasTopbar,
              'pb-[148px] max-sm:pb-[172px]': isDocPage,
            })}
          >
            <ul className="no-scrollbars flex h-full flex-col overflow-y-auto px-8 pt-1 max-sm:px-5 max-sm:pt-3">
              {navItems.map((item, index) => (
                <MobileMenuItem key={index} {...item} />
              ))}
            </ul>
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-gray-new-94 bg-white p-8 dark:border-gray-new-20 dark:bg-black-pure max-sm:grid-cols-1 max-sm:p-5',
                { 'pb-20 max-sm:pb-[68px]': isDocPage }
              )}
            >
              <MobileMenuAuth isDocPage={isDocPage} />
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default MobileMenu;
