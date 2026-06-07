'use client';

import { useSession, signOut } from '@/lib/auth-client';

import Button from 'components/shared/button';
import LINKS from 'constants/links';
import { cn } from 'utils/cn';

interface SidebarAuthProps {
  isDocs?: boolean;
}

const Avatar = ({ name, image }: { name?: string | null; image?: string | null }) => {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? 'User'}
        className="size-8 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-gray-new-10 text-xs font-semibold text-white dark:bg-gray-new-90 dark:text-black-pure">
      {initials}
    </span>
  );
};

const SidebarAuth = ({ isDocs }: SidebarAuthProps) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className={cn('flex', isDocs ? 'gap-x-2' : 'gap-x-3.5')}>
        <div className="h-9 w-16 animate-pulse rounded-full bg-gray-new-90 dark:bg-gray-new-20" />
        <div className="h-9 w-20 animate-pulse rounded-full bg-gray-new-90 dark:bg-gray-new-20" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className={cn('flex items-center', isDocs ? 'gap-x-2' : 'gap-x-3')}>
        <Avatar name={session.user.name} image={session.user.image} />
        <Button
          className="h-9 px-[18px]"
          to={LINKS.dashboard}
          theme="outlined"
          size="xxs"
          tagName="Header"
        >
          Dashboard
        </Button>
        <button
          className="h-9 px-[18px] text-sm font-medium tracking-extra-tight text-gray-new-30 transition-colors hover:text-black-pure dark:text-gray-new-70 dark:hover:text-white"
          type="button"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex', isDocs ? 'gap-x-2' : 'gap-x-3.5')}>
      <Button
        className="h-9 px-[18px]"
        to={LINKS.login}
        theme="outlined"
        size="xxs"
        tagName="Header"
      >
        Log in
      </Button>
      <Button
        className="h-9 px-[18px]"
        to={LINKS.signup}
        theme="white-filled-multi"
        size="xxs"
        tagName="Header"
      >
        Sign up
      </Button>
    </div>
  );
};

export default SidebarAuth;
