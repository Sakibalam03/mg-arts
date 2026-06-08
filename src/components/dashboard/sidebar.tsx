'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'

const CLIENT_NAV = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Inquiries', href: '/dashboard/inquiries' },
]

const ARCHITECT_NAV = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Resources', href: '/dashboard/resources' },
  { label: 'New Brief', href: '/dashboard/new' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const rawRole = (session?.user as any)?.role
  const isArchitect = Array.isArray(rawRole) ? rawRole.includes('architect') : rawRole === 'architect'
  const nav = isArchitect ? ARCHITECT_NAV : CLIENT_NAV

  function handleSignOut() {
    signOut({ fetchOptions: { onSuccess: () => { window.location.replace('/auth') } } })
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col min-h-screen bg-black border-r border-[#1a1a1a]">
      <div className="px-4 py-5 border-b border-[#1a1a1a]">
        <span className="font-serif text-white text-base font-semibold tracking-tight">MG Arts</span>
      </div>

      <nav className="flex-1 py-4">
        <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#444]">
          {isArchitect ? 'Architect' : 'Client'}
        </p>
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center px-4 py-2 text-[13px] border-l-2 transition-colors',
                active
                  ? 'border-[#c0392b] bg-[#0a0a0a] text-white font-semibold'
                  : 'border-transparent text-[#888] hover:text-white hover:bg-[#0a0a0a]',
              ].join(' ')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[#1a1a1a] space-y-2">
        <p className="text-[12px] text-[#555] break-all">{session?.user?.email}</p>
        <button
          onClick={handleSignOut}
          className="text-[12px] text-[#555] hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
