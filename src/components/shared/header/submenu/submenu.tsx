import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus';
import { cn } from 'utils/cn';

import MenuBanner from '../menu-banner';

interface SubmenuProps {
  activeMenuIndex: number | null;
  containerHeight: number;
  submenuContainerRef: React.RefObject<HTMLDivElement | null>;
  submenuLinkClassName: string;
  handleSubmenuNavigation: (containerIndex: number) => (e: React.KeyboardEvent) => void;
  handleSubmenuEnter: () => void;
  handleSubmenuLeave: () => void;
}

const Submenu = ({
  activeMenuIndex,
  containerHeight,
  submenuContainerRef,
  submenuLinkClassName,
  handleSubmenuNavigation,
  handleSubmenuEnter,
  handleSubmenuLeave,
}: SubmenuProps) => (
  <div
    className={cn(
      'main-navigation-submenu absolute top-full left-0 z-40 -mt-px w-full overflow-hidden',
      'border-b border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-black-pure',
      'transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
      {
        'pointer-events-none': activeMenuIndex === null,
        'pointer-events-auto!': activeMenuIndex !== null,
      }
    )}
    style={{ height: `${containerHeight}px` }}
    onMouseEnter={handleSubmenuEnter}
    onMouseLeave={handleSubmenuLeave}
  >
    <div className="relative w-full" ref={submenuContainerRef}>
      {MENUS.header.map((menu, index) => {
        const isActive = activeMenuIndex === index;
        const sections = menu.sections || [];
        const isProduct = menu.text === 'Product';

        return (
          <div
            className={cn(
              'absolute top-0 left-0 w-full',
              'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
              isActive ? 'active opacity-100' : 'pointer-events-none opacity-0'
            )}
            key={index}
            id={`submenu-${index}`}
            role="navigation"
            aria-label={menu.text}
            aria-hidden={!isActive}
            data-submenu-panel
          >
            {sections.length > 0 && (
              <Container
                className="flex w-full gap-x-40 overflow-hidden pt-7 pb-20 max-xl:gap-x-8"
                size={1920}
              >
                <ul className="flex gap-x-[128px] pl-[195px] max-xl:gap-x-5 max-xl:pl-[143px]" role="menu">
                  {sections.map(({ title, items }, sectionIndex) => (
                    <li key={sectionIndex} role="none">
                      {title && (
                        <span
                          className="mb-6 block text-[10px] leading-none font-medium tracking-snug text-gray-new-50 uppercase"
                          id={`submenu-${index}-section-${sectionIndex}`}
                        >
                          {title}
                        </span>
                      )}
                      <ul
                        className="flex flex-col gap-y-6"
                        role="group"
                        aria-labelledby={
                          title ? `submenu-${index}-section-${sectionIndex}` : undefined
                        }
                      >
                        {items?.map(({ title, description, to, ...itemRest }) => {
                          const isExternal = 'isExternal' in itemRest ? (itemRest as { isExternal?: boolean }).isExternal : undefined;
                          return (
                          <li key={title} role="none">
                            <Link
                              className={`group ${submenuLinkClassName} -mx-1 -my-3 grid min-w-[224px] gap-y-2 rounded px-1 py-3 text-[13px] leading-tight tracking-snug text-gray-new-40 dark:text-gray-new-60`}
                              to={to}
                              isExternal={isExternal}
                              tagName="Navigation"
                              tagText={title}
                              role="menuitem"
                              tabIndex={isActive ? 0 : -1}
                              onKeyDown={handleSubmenuNavigation(index)}
                            >
                              <span className="text-lg leading-none font-medium text-black-pure transition-colors duration-200 group-hover:text-gray-new-20 dark:text-white dark:group-hover:text-gray-new-80">
                                {title}
                              </span>
                              {description}
                            </Link>
                          </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
                {isProduct && (
                  <MenuBanner
                    linkProps={{
                      className: submenuLinkClassName,
                      role: 'menuitem',
                      tabIndex: isActive ? 0 : -1,
                      onKeyDown: handleSubmenuNavigation(index) as unknown as React.KeyboardEventHandler<HTMLAnchorElement>,
                    }}
                  />
                )}
              </Container>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default Submenu;
