# Plan 5 — Vendor Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/vendors/register` page with a dynamic form driven by `VendorFieldSchema` CMS entries, S3 presigned URL license upload, submission to Payload `vendors` collection, and confirmation/notification emails via Resend.

**Architecture:** The page is a Server Component that fetches active `VendorFieldSchema` fields and renders a Client Component form. On submit, the client: (1) requests a presigned PUT URL from our API, (2) uploads the license file directly to S3, (3) POSTs vendor data + S3 key to our API route which writes to Payload. Two Resend emails fire after successful creation: confirmation to the vendor and notification to admin.

**Tech Stack:** Next.js App Router, Payload REST API, AWS S3 presigned URLs (reuses `apps/web/src/lib/s3.ts` from Plan 4), Resend.

**Prerequisite:** Plan 1 (Payload running with VendorFieldSchema + Vendors collections). Plan 4 (S3 helpers in `apps/web/src/lib/s3.ts`). `RESEND_API_KEY`, `RESEND_FROM` in `apps/web/.env.local`. Admin email set in SiteSettings global via CMS.

---

## File Map

```
apps/web/src/
├── app/
│   ├── vendors/
│   │   └── register/
│   │       ├── page.tsx               # Server Component — fetches schema, renders form
│   │       └── vendor-form.tsx        # Client Component — dynamic form + S3 upload
│   └── api/
│       └── vendors/
│           └── route.ts               # POST: create vendor record + send emails
└── lib/
    ├── s3.ts                          # (already exists from Plan 4)
    └── email.ts                       # Resend helper (thin wrapper)
```

---

## Task 1: Email Helper

**Files:**
- Create: `apps/web/src/lib/email.ts`

- [ ] **Step 1: Create `apps/web/src/lib/email.ts`**

```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'noreply@mgarts.co.in'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@mgarts.co.in'

export async function sendVendorConfirmation(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'MG Arts — Vendor Registration Received',
    text: `Hi ${name},\n\nThank you for registering with MG Arts as a vendor. Your application is under review.\n\nWe'll notify you once your account is approved.\n\nMG Arts Team`,
  })
}

export async function sendVendorAdminAlert(vendorName: string, tradeType: string, city: string) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Vendor Registration — ${vendorName} (${tradeType}, ${city})`,
    text: `A new vendor has registered:\n\nName: ${vendorName}\nTrade: ${tradeType}\nCity: ${city}\n\nReview and approve in the Payload admin.`,
  })
}

export async function sendVendorApproved(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'MG Arts — Your Vendor Account is Approved',
    text: `Hi ${name},\n\nGreat news — your vendor account has been approved. MG Arts will contact you when work is available in your area.\n\nMG Arts Team`,
  })
}

export async function sendVendorRejected(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'MG Arts — Vendor Application Update',
    text: `Hi ${name},\n\nThank you for your interest. Unfortunately we're unable to onboard your application at this time.\n\nMG Arts Team`,
  })
}
```

- [ ] **Step 2: Add `ADMIN_EMAIL` to `apps/web/.env.local`**

```bash
echo "ADMIN_EMAIL=your-admin@email.com" >> apps/web/.env.local
```

Replace `your-admin@email.com` with the real MG Arts admin email.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/email.ts apps/web/.env.local
git commit -m "feat(vendors): add Resend email helpers for vendor flow"
```

---

## Task 2: Vendor API Route

**Files:**
- Create: `apps/web/src/app/api/vendors/route.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p apps/web/src/app/api/vendors
```

- [ ] **Step 2: Create `apps/web/src/app/api/vendors/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { sendVendorConfirmation, sendVendorAdminAlert } from '@/lib/email'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { name, phone, email, tradeType, city, licenseKey, extraFields } = body

  if (!name || !phone || !email || !tradeType || !city) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Create vendor record in Payload
  const res = await fetch(`${CMS_URL}/api/vendors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phone,
      email,
      tradeType,
      city,
      licenseFile: licenseKey ?? null,
      extraFields: extraFields ?? {},
      status: 'pending',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: 'Failed to create vendor record', details: err }, { status: 500 })
  }

  // Fire emails non-blocking — don't let email failure block the response
  Promise.all([
    sendVendorConfirmation(email, name),
    sendVendorAdminAlert(name, tradeType, city),
  ]).catch((err) => console.error('[vendors] email send failed:', err))

  return NextResponse.json({ success: true }, { status: 201 })
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/api/vendors/
git commit -m "feat(vendors): add vendor API route with Payload write and email notifications"
```

---

## Task 3: Dynamic Vendor Form (Client Component)

**Files:**
- Create: `apps/web/src/app/vendors/register/vendor-form.tsx`

- [ ] **Step 1: Create directories**

```bash
mkdir -p apps/web/src/app/vendors/register
```

- [ ] **Step 2: Create `apps/web/src/app/vendors/register/vendor-form.tsx`**

```tsx
'use client'

import { useState, useRef } from 'react'

type SchemaField = {
  id: string
  label: string
  fieldKey: string
  fieldType: 'text' | 'number' | 'select' | 'file'
  options?: { value: string }[]
  required: boolean
  order: number
}

const TRADE_TYPES = [
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'civil', label: 'Civil Contractor' },
  { value: 'other', label: 'Other' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '9px 12px',
  fontSize: 14,
  background: 'var(--bg)',
  color: 'var(--text)',
  boxSizing: 'border-box',
  marginTop: 6,
}

export function VendorForm({ schemaFields }: { schemaFields: SchemaField[] }) {
  const [base, setBase] = useState({ name: '', phone: '', email: '', tradeType: '', city: '' })
  const [extra, setExtra] = useState<Record<string, string>>({})
  const licenseRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function updateBase(k: string, v: string) { setBase((p) => ({ ...p, [k]: v })) }
  function updateExtra(k: string, v: string) { setExtra((p) => ({ ...p, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('uploading')
    setErrorMsg('')

    let licenseKey: string | null = null
    const licenseFile = licenseRef.current?.files?.[0]

    if (licenseFile) {
      try {
        const urlRes = await fetch(
          `/api/s3/upload-url?fileName=${encodeURIComponent(licenseFile.name)}&contentType=${encodeURIComponent(licenseFile.type)}&projectId=vendor-licenses`
        )
        if (!urlRes.ok) throw new Error('Failed to get upload URL')
        const { url, key } = await urlRes.json()

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
          }
          xhr.onload = () => xhr.status === 200 ? resolve() : reject(new Error('S3 upload failed'))
          xhr.onerror = () => reject(new Error('S3 upload failed'))
          xhr.open('PUT', url)
          xhr.setRequestHeader('Content-Type', licenseFile.type)
          xhr.send(licenseFile)
        })
        licenseKey = key
      } catch {
        setStatus('error')
        setErrorMsg('License upload failed. Please try again.')
        return
      }
    }

    setStatus('submitting')

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...base, licenseKey, extraFields: extra }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Submission failed. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '2.5rem', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 8 }}>Registration Submitted!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Thank you for registering. We'll review your application and send you an email once approved.
        </p>
      </div>
    )
  }

  const isLoading = status === 'uploading' || status === 'submitting'

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Base fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Full Name *</label>
          <input required style={inputStyle} value={base.name} onChange={(e) => updateBase('name', e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Phone *</label>
          <input required type="tel" style={inputStyle} value={base.phone} onChange={(e) => updateBase('phone', e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Email *</label>
          <input required type="email" style={inputStyle} value={base.email} onChange={(e) => updateBase('email', e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>City *</label>
          <input required style={inputStyle} value={base.city} onChange={(e) => updateBase('city', e.target.value)} placeholder="e.g. Mumbai" />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Trade Type *</label>
        <select required style={inputStyle} value={base.tradeType} onChange={(e) => updateBase('tradeType', e.target.value)}>
          <option value="">Select trade type…</option>
          {TRADE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Dynamic extra fields from VendorFieldSchema */}
      {schemaFields.map((field) => (
        <div key={field.id}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {field.label}{field.required ? ' *' : ''}
          </label>
          {field.fieldType === 'text' && (
            <input style={inputStyle} required={field.required} value={extra[field.fieldKey] ?? ''} onChange={(e) => updateExtra(field.fieldKey, e.target.value)} />
          )}
          {field.fieldType === 'number' && (
            <input type="number" style={inputStyle} required={field.required} value={extra[field.fieldKey] ?? ''} onChange={(e) => updateExtra(field.fieldKey, e.target.value)} />
          )}
          {field.fieldType === 'select' && (
            <select style={inputStyle} required={field.required} value={extra[field.fieldKey] ?? ''} onChange={(e) => updateExtra(field.fieldKey, e.target.value)}>
              <option value="">Select…</option>
              {field.options?.map((o) => <option key={o.value} value={o.value}>{o.value}</option>)}
            </select>
          )}
        </div>
      ))}

      {/* License upload */}
      <div>
        <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
          License / Registration Document (PDF, JPG, PNG)
        </label>
        <input ref={licenseRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ fontSize: 13 }} />
        {status === 'uploading' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--accent)', width: `${uploadProgress}%`, transition: 'width 200ms' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Uploading… {uploadProgress}%</p>
          </div>
        )}
      </div>

      {errorMsg && <p style={{ fontSize: 13, color: 'var(--accent)' }}>{errorMsg}</p>}

      <button
        type="submit"
        disabled={isLoading}
        style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '12px', fontWeight: 600, fontSize: 14, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
      >
        {status === 'uploading' ? 'Uploading license…' : status === 'submitting' ? 'Submitting…' : 'Register as Vendor'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/vendors/
git commit -m "feat(vendors): add dynamic vendor registration form with S3 license upload"
```

---

## Task 4: /vendors/register Server Page

**Files:**
- Create: `apps/web/src/app/vendors/register/page.tsx`

- [ ] **Step 1: Create `apps/web/src/app/vendors/register/page.tsx`**

```tsx
import { VendorForm } from './vendor-form'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export const metadata = {
  title: 'Vendor Registration',
  description: 'Register as a vendor with MG Arts — plumbers, electricians, carpenters, and civil contractors welcome.',
}

async function getSchemaFields() {
  try {
    const res = await fetch(
      `${CMS_URL}/api/vendor-field-schema?where=${encodeURIComponent(JSON.stringify({ active: { equals: true } }))}&sort=order&limit=50`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs as {
      id: string
      label: string
      fieldKey: string
      fieldType: 'text' | 'number' | 'select' | 'file'
      options?: { value: string }[]
      required: boolean
      order: number
    }[]
  } catch { return [] }
}

export default async function VendorRegisterPage() {
  const schemaFields = await getSchemaFields()

  return (
    <main style={{ maxWidth: 660, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.75rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        Register as a Vendor
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, marginBottom: '2.5rem' }}>
        Join MG Arts' vendor network to receive work in your city and trade. All applications are reviewed by our team.
      </p>
      <VendorForm schemaFields={schemaFields} />
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/vendors/register/page.tsx
git commit -m "feat(vendors): add /vendors/register server page with dynamic schema fields"
```

---

## Task 5: Smoke Test Vendor Registration

- [ ] **Step 1: Seed a VendorFieldSchema entry in CMS admin**

Navigate to `http://localhost:3001/admin` → Vendor Field Schema → Create:
- Label: "Years of Experience"
- Field Key: `yearsExperience`
- Field Type: Number
- Required: Yes
- Active: Yes

- [ ] **Step 2: Open `http://localhost:3000/vendors/register`**

Expected: Form shows base fields + "Years of Experience" number input.

- [ ] **Step 3: Fill and submit the form (with a test PDF for license)**

Expected:
1. PDF uploads to S3 (progress bar visible)
2. "Submitting…" shown
3. "Registration Submitted!" success state shown
4. Vendor confirmation email received at test address
5. Admin notification email sent to `ADMIN_EMAIL`

- [ ] **Step 4: Verify in CMS admin**

Navigate to `http://localhost:3001/admin` → Vendors. New vendor appears with `status: pending` and `licenseFile` populated with S3 key.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Plan 5 — vendor registration with dynamic form, S3 upload, and emails"
```
