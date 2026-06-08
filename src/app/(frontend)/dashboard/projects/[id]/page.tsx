import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { getDownloadUrl } from '@/lib/s3'
import { UploadForm } from './upload-form'
import type { Project, Document } from '@/payload-types'

const STATUS_COLORS: Record<string, string> = {
  inquiry: '#e05b2b',
  quoted: '#e0a02b',
  active: '#27ae60',
  completed: '#888',
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  const payload = await getPayload({ config })

  let project: Project | null = null
  try {
    project = await payload.findByID({
      collection: 'projects',
      id: Number(id),
      overrideAccess: true,
    })
  } catch {
    redirect('/dashboard/projects')
  }
  if (!project) redirect('/dashboard/projects')

  const { docs: documents } = await payload.find({
    collection: 'documents',
    where: { project: { equals: Number(id) } },
    sort: '-createdAt',
    limit: 100,
    overrideAccess: true,
  })

  const docs = await Promise.all(
    (documents as Document[]).map(async (doc) => {
      let downloadUrl = ''
      try {
        downloadUrl = await getDownloadUrl(doc.fileUrl)
      } catch {}
      return { ...doc, downloadUrl }
    }),
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-1">{project.title}</h1>
          <p className="text-[13px] text-[var(--text-muted)]">{project.city}</p>
        </div>
        <span
          className="text-xs font-bold uppercase tracking-widest mt-1.5"
          style={{ color: STATUS_COLORS[project.status] ?? '#888' }}
        >
          {project.status}
        </span>
      </div>

      <div className="mb-8">
        <UploadForm projectId={id} onUploaded={() => {}} />
      </div>

      <h2 className="font-bold text-base text-[var(--text)] mb-4">Documents</h2>
      {docs.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No documents uploaded yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['File', 'Label', 'Uploaded', ''].map((h, i) => (
                <th
                  key={i}
                  className="text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] pb-2 pr-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="border-b border-[var(--border)]">
                <td className="py-3 pr-3 text-sm font-medium text-[var(--text)]">
                  {doc.fileName || doc.fileUrl.split('/').pop()}
                </td>
                <td className="py-3 pr-3 text-xs capitalize text-[var(--text-muted)]">{doc.label}</td>
                <td className="py-3 pr-3 text-[13px] text-[var(--text-muted)]">
                  {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="py-3">
                  {doc.downloadUrl && (
                    <a
                      href={doc.downloadUrl}
                      download
                      className="text-[13px] font-semibold text-[var(--accent)] no-underline border border-[var(--accent)] rounded-md px-3 py-1 hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      Download
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
