import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/access'
import type { ArchitectResource, Media } from '@/payload-types'

const TYPE_LABELS: Record<string, string> = {
  'boq-template': 'BOQ Template',
  'rate-sheet': 'Rate Sheet',
  guideline: 'Guideline',
}

export default async function ResourcesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  if (!hasRole(session.user, 'architect', 'admin')) redirect('/dashboard')

  const payload = await getPayload({ config })
  const { docs: resources } = await payload.find({
    collection: 'architect-resources',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-6">Resources</h1>
      {resources.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No resources available yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {(resources as ArchitectResource[]).map((r) => {
            const media = r.file as Media | null
            const fileUrl = media?.url ?? null
            return (
              <div
                key={r.id}
                className="border border-[var(--border)] rounded-lg px-5 py-4 flex justify-between items-center bg-[var(--bg)]"
              >
                <div>
                  <p className="font-semibold text-sm text-[var(--text)]">{r.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{TYPE_LABELS[r.type] ?? r.type}</p>
                </div>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    download
                    className="text-[13px] font-semibold text-[var(--accent)] no-underline border border-[var(--accent)] rounded-md px-3.5 py-1.5 hover:bg-[var(--accent)] hover:text-white transition-colors"
                  >
                    Download
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
