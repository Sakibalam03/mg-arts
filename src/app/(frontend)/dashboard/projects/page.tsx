import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import type { Project } from '@/payload-types'

const STATUS_COLORS: Record<string, string> = {
  inquiry: '#e05b2b',
  quoted: '#e0a02b',
  active: '#27ae60',
  completed: '#888',
}

export default async function ProjectsListPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  const { user } = session
  const role = (user as any).role as string | undefined

  const payload = await getPayload({ config })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any =
    role === 'architect'
      ? { architect: { equals: Number(user.id) } }
      : { client: { equals: Number(user.id) } }

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where,
    sort: '-updatedAt',
    limit: 100,
    overrideAccess: true,
  })

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-6">
        {role === 'architect' ? 'PMC Engagements' : 'My Projects'}
      </h1>

      {projects.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No projects yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Project', 'City', 'Status', 'Last Updated'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] pb-2 pr-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(projects as Project[]).map((p) => (
              <tr key={p.id} className="border-b border-[var(--border)]">
                <td className="py-3 pr-3">
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="font-semibold text-sm text-[var(--text)] no-underline hover:text-[var(--accent)]"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="py-3 pr-3 text-sm text-[var(--text-muted)]">{p.city}</td>
                <td className="py-3 pr-3">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: STATUS_COLORS[p.status] ?? '#888' }}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 text-[13px] text-[var(--text-muted)]">
                  {new Date(p.updatedAt).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
