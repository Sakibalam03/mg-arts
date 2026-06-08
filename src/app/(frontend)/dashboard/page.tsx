import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/access'
import type { Project } from '@/payload-types'

const STATUS_COLORS: Record<string, string> = {
  inquiry: '#e05b2b',
  quoted: '#e0a02b',
  active: '#27ae60',
  completed: '#888',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  const { user } = session

  if (hasRole(user, 'architect') && !(user as any).approved) {
    return (
      <div className="p-8">
        <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-2">Pending Approval</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Your architect account is awaiting approval from the MG Arts team. You&apos;ll be notified by email once approved.
        </p>
      </div>
    )
  }

  const payload = await getPayload({ config })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = hasRole(user, 'architect')
    ? { architect: { equals: Number(user.id) } }
    : { client: { equals: Number(user.id) } }

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where,
    limit: 5,
    sort: '-updatedAt',
    overrideAccess: true,
  })

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-1">Overview</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        {hasRole(user, 'architect') ? 'Your PMC engagements with MG Arts.' : 'Your active projects with MG Arts.'}
      </p>

      {projects.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No projects yet. MG Arts will create one after your inquiry is processed.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {(projects as Project[]).map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="border border-[var(--border)] rounded-lg px-5 py-4 flex justify-between items-center no-underline text-[var(--text)] bg-[var(--bg)] hover:bg-[#0a0a0a] transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">{p.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.city}</p>
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: STATUS_COLORS[p.status] ?? '#888' }}
              >
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
