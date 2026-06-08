import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { hasRole } from '@/lib/access'
import type { Inquiry } from '@/payload-types'

const STATUS_COLORS: Record<string, string> = {
  new: '#e0a02b',
  contacted: '#3498db',
  converted: '#27ae60',
}

export default async function InquiriesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  if (hasRole(session.user, 'architect')) redirect('/dashboard')

  const payload = await getPayload({ config })
  const { docs: inquiries } = await payload.find({
    collection: 'inquiries',
    where: { user: { equals: Number(session.user.id) } },
    sort: '-createdAt',
    limit: 50,
    overrideAccess: true,
  })

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-6">My Inquiries</h1>
      {inquiries.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">You haven&apos;t submitted any inquiries yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Source', 'Phone', 'Status', 'Date'].map((h) => (
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
            {(inquiries as Inquiry[]).map((inq) => (
              <tr key={inq.id} className="border-b border-[var(--border)]">
                <td className="py-3 pr-3 text-sm capitalize text-[var(--text)]">{inq.source}</td>
                <td className="py-3 pr-3 text-sm text-[var(--text-muted)]">{inq.phone}</td>
                <td className="py-3 pr-3">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: STATUS_COLORS[inq.status] ?? '#888' }}
                  >
                    {inq.status}
                  </span>
                </td>
                <td className="py-3 text-[13px] text-[var(--text-muted)]">
                  {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
