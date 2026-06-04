# Plan 4 — Dashboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full role-aware dashboard — client and architect views for projects, document upload/download via S3 presigned URLs, architect resources page, inquiry history, and new PMC brief form.

**Architecture:** All dashboard pages are Next.js Server Components that read the BetterAuth session server-side, then fetch from Payload REST API with the user's session token. Document upload uses a two-step flow: client requests a presigned PUT URL from our API route, browser uploads directly to S3, then posts the S3 key + metadata to Payload. Downloads use presigned GET URLs generated server-side and returned to the client.

**Tech Stack:** Next.js App Router, BetterAuth `auth.api.getSession()`, Payload REST API, AWS S3 SDK (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`), `motion` (card stagger).

**Prerequisite:** Plan 2 complete (auth working, dashboard shell in place). AWS S3 bucket created, `S3_*` env vars set in `apps/web/.env.local`.

---

## File Map

```
apps/web/src/
├── app/
│   ├── api/
│   │   ├── s3/
│   │   │   ├── upload-url/route.ts        # GET presigned PUT URL for S3 upload
│   │   │   └── download-url/route.ts      # GET presigned GET URL for S3 download
│   │   └── inquiries/route.ts             # (already exists from Plan 3)
│   └── dashboard/
│       ├── layout.tsx                     # (already exists — sidebar shell)
│       ├── page.tsx                       # (replace with full role-aware home)
│       ├── projects/
│       │   ├── page.tsx                   # /dashboard/projects — project list
│       │   └── [id]/
│       │       ├── page.tsx               # /dashboard/projects/[id] — detail + docs
│       │       └── upload-form.tsx        # Client Component: file upload UI
│       ├── resources/
│       │   └── page.tsx                   # /dashboard/resources (architect only)
│       ├── inquiries/
│       │   └── page.tsx                   # /dashboard/inquiries (client only)
│       └── new/
│           └── page.tsx                   # /dashboard/new — PMC brief (architect only)
└── lib/
    ├── auth.ts                            # (already exists)
    └── s3.ts                              # S3 client + presigned URL helpers
```

---

## Task 1: Install AWS SDK

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install packages**

```bash
pnpm --filter @mg-arts/web add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

- [ ] **Step 2: Verify env vars exist in `apps/web/.env.local`**

```bash
cat apps/web/.env.local | grep S3
```

Expected: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` all present with real values.

- [ ] **Step 3: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "feat(dashboard): add AWS SDK for S3 presigned URLs"
```

---

## Task 2: S3 Helpers + API Routes

**Files:**
- Create: `apps/web/src/lib/s3.ts`
- Create: `apps/web/src/app/api/s3/upload-url/route.ts`
- Create: `apps/web/src/app/api/s3/download-url/route.ts`

- [ ] **Step 1: Create `apps/web/src/lib/s3.ts`**

```ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.S3_REGION ?? 'ap-south-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

const BUCKET = process.env.S3_BUCKET!

export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType })
  return getSignedUrl(s3, cmd, { expiresIn: 300 }) // 5 min
}

export async function getDownloadUrl(key: string): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return getSignedUrl(s3, cmd, { expiresIn: 3600 }) // 1 hour
}

export function buildDocumentKey(projectId: string, fileName: string): string {
  const ts = Date.now()
  const safe = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  return `documents/${projectId}/${ts}-${safe}`
}
```

- [ ] **Step 2: Create directories**

```bash
mkdir -p apps/web/src/app/api/s3/upload-url apps/web/src/app/api/s3/download-url
```

- [ ] **Step 3: Create `apps/web/src/app/api/s3/upload-url/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl, buildDocumentKey } from '@/lib/s3'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const fileName = searchParams.get('fileName')
  const contentType = searchParams.get('contentType')
  const projectId = searchParams.get('projectId')

  if (!fileName || !contentType || !projectId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const key = buildDocumentKey(projectId, fileName)
  const url = await getUploadUrl(key, contentType)
  return NextResponse.json({ url, key })
}
```

- [ ] **Step 4: Create `apps/web/src/app/api/s3/download-url/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getDownloadUrl } from '@/lib/s3'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  const url = await getDownloadUrl(key)
  return NextResponse.json({ url })
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/s3.ts apps/web/src/app/api/s3/
git commit -m "feat(dashboard): add S3 presigned URL helpers and API routes"
```

---

## Task 3: Dashboard Home (Role-Aware)

**Files:**
- Modify: `apps/web/src/app/dashboard/page.tsx`

- [ ] **Step 1: Replace `apps/web/src/app/dashboard/page.tsx`**

```tsx
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

async function fetchProjects(userId: string, role: string, token: string) {
  const where = role === 'architect'
    ? JSON.stringify({ architect: { equals: userId } })
    : JSON.stringify({ client: { equals: userId } })
  const res = await fetch(`${CMS_URL}/api/projects?where=${encodeURIComponent(where)}&limit=5&sort=-updatedAt`, {
    headers: { Authorization: `JWT ${token}` },
    next: { revalidate: 0 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs as { id: string; title: string; status: string; city: string; updatedAt: string }[]
}

const STATUS_COLORS: Record<string, string> = {
  inquiry: '#e05b2b', quoted: '#e0a02b', active: '#27ae60', completed: '#888',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  const { user } = session

  if (user.role === 'architect' && !(user as any).approved) {
    return (
      <div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: 8 }}>Pending Approval</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Your architect account is awaiting approval from the MG Arts team. You'll be notified by email once approved.
        </p>
      </div>
    )
  }

  const projects = await fetchProjects(user.id, user.role ?? 'client', '').catch(() => [])

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: 4 }}>
        Overview
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '2rem' }}>
        {user.role === 'architect' ? 'Your PMC engagements with MG Arts.' : 'Your active projects with MG Arts.'}
      </p>

      {projects.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No projects yet. MG Arts will create one after your inquiry is processed.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {projects.map((p) => (
            <a key={p.id} href={`/dashboard/projects/${p.id}`}
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: 'inherit', background: 'var(--bg)' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.city}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[p.status] ?? '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {p.status}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/dashboard/page.tsx
git commit -m "feat(dashboard): replace placeholder home with real project list"
```

---

## Task 4: /dashboard/projects Page

**Files:**
- Create: `apps/web/src/app/dashboard/projects/page.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p apps/web/src/app/dashboard/projects
```

- [ ] **Step 2: Create `apps/web/src/app/dashboard/projects/page.tsx`**

```tsx
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

const STATUS_COLORS: Record<string, string> = {
  inquiry: '#e05b2b', quoted: '#e0a02b', active: '#27ae60', completed: '#888',
}

export default async function ProjectsListPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')
  const { user } = session

  const where = user.role === 'architect'
    ? JSON.stringify({ architect: { equals: user.id } })
    : JSON.stringify({ client: { equals: user.id } })

  let projects: { id: string; title: string; status: string; city: string; updatedAt: string }[] = []
  try {
    const res = await fetch(`${CMS_URL}/api/projects?where=${encodeURIComponent(where)}&sort=-updatedAt&limit=100`, { next: { revalidate: 0 } })
    if (res.ok) projects = (await res.json()).docs
  } catch {}

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
        {user.role === 'architect' ? 'PMC Engagements' : 'My Projects'}
      </h1>

      {projects.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No projects yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Project', 'City', 'Status', 'Last Updated'].map((h) => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '8px 12px 8px 0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 12px 12px 0' }}>
                  <Link href={`/dashboard/projects/${p.id}`} style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>
                    {p.title}
                  </Link>
                </td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 14, color: 'var(--text-muted)' }}>{p.city}</td>
                <td style={{ padding: '12px 12px 12px 0' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[p.status] ?? '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: 'var(--text-muted)' }}>
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
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/dashboard/projects/
git commit -m "feat(dashboard): add /dashboard/projects list with Cloudflare-style table"
```

---

## Task 5: /dashboard/projects/[id] — Detail + Document Upload/Download

**Files:**
- Create: `apps/web/src/app/dashboard/projects/[id]/page.tsx`
- Create: `apps/web/src/app/dashboard/projects/[id]/upload-form.tsx`

- [ ] **Step 1: Create directories**

```bash
mkdir -p "apps/web/src/app/dashboard/projects/[id]"
```

- [ ] **Step 2: Create `apps/web/src/app/dashboard/projects/[id]/upload-form.tsx`** (Client Component)

```tsx
'use client'

import { useState, useRef } from 'react'

const LABELS = ['requirement', 'quote', 'boq', 'drawing', 'other'] as const

export function UploadForm({ projectId, userId, onUploaded }: {
  projectId: string
  userId: string
  onUploaded: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [label, setLabel] = useState<string>('requirement')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setStatus('uploading')
    setProgress(0)

    try {
      // 1. Get presigned PUT URL
      const urlRes = await fetch(
        `/api/s3/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&projectId=${projectId}`
      )
      if (!urlRes.ok) throw new Error('Failed to get upload URL')
      const { url, key } = await urlRes.json()

      // 2. Upload directly to S3
      const xhr = new XMLHttpRequest()
      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error('S3 upload failed')))
        xhr.onerror = () => reject(new Error('S3 upload failed'))
        xhr.open('PUT', url)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      // 3. Record in Payload
      const docRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: projectId,
          uploadedBy: userId,
          fileUrl: key,
          fileType: file.name.split('.').pop() ?? 'bin',
          fileName: file.name,
          label,
          visibleTo: 'all',
        }),
      })
      if (!docRes.ok) throw new Error('Failed to record document')

      setStatus('done')
      if (fileRef.current) fileRef.current.value = ''
      onUploaded()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', background: 'var(--bg)' }}>
      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: '1rem' }}>Upload Document</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Label</label>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 10px', fontSize: 13, background: 'var(--bg)', color: 'var(--text)' }}
          >
            {LABELS.map((l) => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l}</option>)}
          </select>
        </div>
        <div style={{ flex: 2, minWidth: 200 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>File</label>
          <input ref={fileRef} type="file" required style={{ width: '100%', fontSize: 13 }} />
        </div>
      </div>

      {status === 'uploading' && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent)', width: `${progress}%`, transition: 'width 200ms' }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{progress}%</p>
        </div>
      )}
      {status === 'done' && <p style={{ fontSize: 13, color: '#27ae60', marginBottom: 8 }}>Uploaded successfully.</p>}
      {status === 'error' && <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 8 }}>Upload failed — please try again.</p>}

      <button
        type="submit"
        disabled={status === 'uploading'}
        style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 13, cursor: status === 'uploading' ? 'not-allowed' : 'pointer', opacity: status === 'uploading' ? 0.7 : 1 }}
      >
        {status === 'uploading' ? `Uploading ${progress}%…` : 'Upload'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/app/dashboard/projects/[id]/page.tsx`**

```tsx
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDownloadUrl } from '@/lib/s3'
import { UploadForm } from './upload-form'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

const STATUS_COLORS: Record<string, string> = {
  inquiry: '#e05b2b', quoted: '#e0a02b', active: '#27ae60', completed: '#888',
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')

  const { user } = session

  // Fetch project
  const projRes = await fetch(`${CMS_URL}/api/projects/${id}`, { next: { revalidate: 0 } })
  if (!projRes.ok) redirect('/dashboard/projects')
  const project = await projRes.json() as { id: string; title: string; status: string; city: string; notes: unknown }

  // Fetch documents
  let documents: { id: string; fileName: string; label: string; fileUrl: string; fileType: string; createdAt: string; visibleTo: string }[] = []
  try {
    const docsRes = await fetch(
      `${CMS_URL}/api/documents?where=${encodeURIComponent(JSON.stringify({ project: { equals: id } }))}&sort=-createdAt&limit=100`,
      { next: { revalidate: 0 } }
    )
    if (docsRes.ok) documents = (await docsRes.json()).docs
  } catch {}

  // Generate download URLs for each document
  const docs = await Promise.all(
    documents.map(async (doc) => {
      let downloadUrl = ''
      try { downloadUrl = await getDownloadUrl(doc.fileUrl) } catch {}
      return { ...doc, downloadUrl }
    })
  )

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: 4 }}>
              {project.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{project.city}</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLORS[project.status] ?? '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Upload form */}
      <div style={{ marginBottom: '2rem' }}>
        <UploadForm projectId={id} userId={user.id} onUploaded={() => {}} />
      </div>

      {/* Documents table */}
      <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Documents</h2>
      {docs.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No documents uploaded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['File', 'Type', 'Label', 'Uploaded', ''].map((h, i) => (
                <th key={i} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '8px 12px 8px 0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 14, fontWeight: 500 }}>{doc.fileName}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{doc.fileType}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 12, textTransform: 'capitalize', color: 'var(--text-muted)' }}>{doc.label}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td style={{ padding: '12px 0' }}>
                  {doc.downloadUrl && (
                    <a href={doc.downloadUrl} download style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
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
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/dashboard/projects/
git commit -m "feat(dashboard): add project detail page with S3 document upload and download"
```

---

## Task 6: /dashboard/resources, /dashboard/inquiries, /dashboard/new

**Files:**
- Create: `apps/web/src/app/dashboard/resources/page.tsx`
- Create: `apps/web/src/app/dashboard/inquiries/page.tsx`
- Create: `apps/web/src/app/dashboard/new/page.tsx`

- [ ] **Step 1: Create directories**

```bash
mkdir -p apps/web/src/app/dashboard/resources apps/web/src/app/dashboard/inquiries apps/web/src/app/dashboard/new
```

- [ ] **Step 2: Create `apps/web/src/app/dashboard/resources/page.tsx`** (architect only)

```tsx
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDownloadUrl } from '@/lib/s3'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'
const TYPES = { 'boq-template': 'BOQ Template', 'rate-sheet': 'Rate Sheet', 'guideline': 'Guideline' }

export default async function ResourcesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')
  if (session.user.role !== 'architect' && session.user.role !== 'admin') redirect('/dashboard')

  let resources: { id: string; title: string; type: string; fileUrl: string; order: number }[] = []
  try {
    const res = await fetch(
      `${CMS_URL}/api/architect-resources?where=${encodeURIComponent(JSON.stringify({ active: { equals: true } }))}&sort=order&limit=100`,
      { next: { revalidate: 60 } }
    )
    if (res.ok) resources = (await res.json()).docs
  } catch {}

  const resourcesWithUrls = await Promise.all(
    resources.map(async (r) => {
      let downloadUrl = ''
      try { downloadUrl = await getDownloadUrl(r.fileUrl) } catch {}
      return { ...r, downloadUrl }
    })
  )

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
        Resources
      </h1>
      {resourcesWithUrls.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No resources available yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {resourcesWithUrls.map((r) => (
            <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{TYPES[r.type as keyof typeof TYPES] ?? r.type}</p>
              </div>
              {r.downloadUrl && (
                <a href={r.downloadUrl} download style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', border: '1px solid var(--accent)', borderRadius: 6, padding: '6px 14px' }}>
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/app/dashboard/inquiries/page.tsx`** (client only)

```tsx
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export default async function InquiriesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth')
  if (session.user.role === 'architect') redirect('/dashboard')

  let inquiries: { id: string; name: string; phone: string; source: string; status: string; createdAt: string }[] = []
  try {
    const res = await fetch(
      `${CMS_URL}/api/inquiries?where=${encodeURIComponent(JSON.stringify({ user: { equals: session.user.id } }))}&sort=-createdAt&limit=50`,
      { next: { revalidate: 0 } }
    )
    if (res.ok) inquiries = (await res.json()).docs
  } catch {}

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
        My Inquiries
      </h1>
      {inquiries.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>You haven't submitted any inquiries yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Source', 'Phone', 'Status', 'Date'].map((h) => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '8px 12px 8px 0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 14, textTransform: 'capitalize' }}>{inq.source}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 14, color: 'var(--text-muted)' }}>{inq.phone}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 12, textTransform: 'capitalize', color: 'var(--text-muted)', fontWeight: 500 }}>{inq.status}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: 'var(--text-muted)' }}>
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
```

- [ ] **Step 4: Create `apps/web/src/app/dashboard/new/page.tsx`** (architect only — submit PMC brief as inquiry)

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export default function NewBriefPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'pmc' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch { setStatus('error') }
  }

  if (status === 'success') return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 8 }}>Brief Submitted</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>We'll review your brief and be in touch soon. Redirecting…</p>
    </div>
  )

  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '9px 12px', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box', marginTop: 6 }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Submit PMC Brief</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '2rem' }}>Describe your project and we'll get back to you within 1 business day.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div><label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Name *</label><input required style={inputStyle} value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
        <div><label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Phone *</label><input required type="tel" style={inputStyle} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></div>
        <div><label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={(e) => update('email', e.target.value)} /></div>
        <div><label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Project Brief *</label><textarea required rows={5} style={{ ...inputStyle, resize: 'vertical' }} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Describe scope, city, timeline, type of work…" /></div>
        {status === 'error' && <p style={{ fontSize: 13, color: 'var(--accent)' }}>Submission failed — please try again.</p>}
        <button type="submit" disabled={status === 'loading'} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, padding: 11, fontWeight: 600, fontSize: 14, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Submitting…' : 'Submit Brief'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/dashboard/resources/ apps/web/src/app/dashboard/inquiries/ apps/web/src/app/dashboard/new/
git commit -m "feat(dashboard): add resources, inquiries, and new brief pages"
```

---

## Task 7: Smoke Test Dashboard

- [ ] **Step 1: Start dev servers**

```bash
pnpm dev
```

- [ ] **Step 2: Sign in and test each route**

| URL | Expected |
|---|---|
| `/dashboard` | Project list or empty state |
| `/dashboard/projects` | Table view of projects |
| `/dashboard/projects/:id` | Project detail + upload form + docs table |
| `/dashboard/resources` | (architect) resource list with download links |
| `/dashboard/inquiries` | (client) inquiry history table |
| `/dashboard/new` | (architect) PMC brief form |

- [ ] **Step 3: Test document upload**

1. Navigate to `/dashboard/projects/:id`
2. Select a PDF file, choose label "requirement", click Upload
3. Expected: Progress bar fills, "Uploaded successfully" shown, document appears in table with Download link
4. Click Download — expected: file downloads from S3 via presigned URL

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Plan 4 — full role-aware dashboard with S3 document upload/download"
```
