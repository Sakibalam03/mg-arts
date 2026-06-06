import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  return (
    <main className="p-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--text)]">
        Welcome, {session.user.name || session.user.email}
      </h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Dashboard — Plan 4 to follow.
      </p>
    </main>
  )
}
