import DocsHeader from 'components/pages/doc/docs-header';
import Container from 'components/shared/container';
import Logo from 'components/shared/logo';
import type { NavItem } from '@/types/nav';

import HeaderWrapper from './header-wrapper';
import MobileMenu from './mobile-menu';
import Navigation from './navigation';
import Sidebar from './sidebar';

interface HeaderProps {
  className?: string | null;
  theme?: 'light' | 'dark' | null;
  isSticky?: boolean;
  isStickyOverlay?: boolean;
  isDocPage?: boolean;
  docPageType?: string | null;
  docsNavigation?: unknown[] | null;
  docsBasePath?: string | null;
  customType?: { title: string; link: string } | null;
  isClient?: boolean;
  navItems?: NavItem[];
}

const Header = ({
  className = null,
  theme = null,
  isSticky = false,
  isStickyOverlay = false,
  isDocPage = false,
  docPageType = null,
  docsNavigation = null,
  docsBasePath = null,
  customType = null,
  isClient = false,
  navItems = [],
}: HeaderProps) => (
  <>
    <HeaderWrapper
      className={className}
      isDocPage={isDocPage}
      isSticky={isSticky}
      isStickyOverlay={isStickyOverlay}
    >
      {isDocPage ? (
        <DocsHeader
          customType={customType}
          docPageType={docPageType}
          isClient={isClient}
          navigation={docsNavigation}
          basePath={docsBasePath}
        />
      ) : (
        <Container
          className="static! z-10 flex w-full items-center justify-between max-md:px-8 max-sm:px-5"
          size={1920}
        >
          <div className="flex items-center gap-x-[92px] max-xl:gap-x-10">
            <Logo width={102} height={28} priority isHeader />
            <Navigation items={navItems} />
          </div>
          <Sidebar isClient={isClient} />
        </Container>
      )}
    </HeaderWrapper>
    <MobileMenu isDocPage={isDocPage} docPageType={docPageType} navItems={navItems} />
  </>
);

export default Header;
