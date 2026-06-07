'use client';

import { useSession, signOut } from '@/lib/auth-client';

import Button from 'components/shared/button';
import LINKS from 'constants/links';

const MobileMenuAuth = ({ isDocPage }: { isDocPage?: boolean }) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <>
        <div className="h-9 animate-pulse rounded-full bg-gray-new-90 dark:bg-gray-new-20" />
        <div className="h-9 animate-pulse rounded-full bg-gray-new-90 dark:bg-gray-new-20" />
      </>
    );
  }

  if (session?.user) {
    const initials = session.user.name
      ? session.user.name
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '?';

    return (
      <>
        <div className="col-span-2 flex items-center gap-3 max-sm:col-span-1">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? 'User'}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-new-10 text-xs font-semibold text-white dark:bg-gray-new-90 dark:text-black-pure">
              {initials}
            </span>
          )}
          <span className="truncate text-sm font-medium tracking-extra-tight text-black-pure dark:text-white">
            {session.user.name ?? session.user.email}
          </span>
        </div>
        <Button
          className="h-9 px-[18px]"
          to={LINKS.dashboard}
          theme="outlined"
          size="xxs"
          tagName="MobileMenu"
        >
          Dashboard
        </Button>
        <button
          className="flex h-9 w-full items-center justify-center rounded-full border border-gray-new-40 text-sm font-medium tracking-extra-tight text-gray-new-30 transition-colors hover:text-black-pure dark:text-gray-new-70 dark:hover:text-white"
          type="button"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      <Button
        className="h-9 border border-gray-new-40 px-[18px]"
        to={LINKS.login}
        theme="transparent"
        size="xxs"
        tagName="MobileMenu"
      >
        Log in
      </Button>
      <Button
        className="h-9 px-[18px]"
        to={LINKS.signup}
        theme="white-filled-multi"
        size="xxs"
        tagName="MobileMenu"
      >
        Sign up
      </Button>
    </>
  );
};

export default MobileMenuAuth;
