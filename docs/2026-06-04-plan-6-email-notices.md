# Plan 6 — Email & Notices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all 8 React Email templates in `packages/email/`, wire up the Resend sending calls in `apps/web`, add the site-wide notice banner to public pages, and implement the Payload `Notices` afterChange hook that sends email blasts.

**Architecture:** React Email templates live in `packages/email/src/` and are exported as named functions. `apps/web/src/lib/email.ts` (from Plan 5) is extended to use these templates instead of plain-text strings. The notice banner is a Server Component on the public layout. The Payload hook in `apps/cms/src/collections/Notices.ts` calls a webhook on `apps/web` to trigger the blast, keeping CMS concerns out of the web app.

**Tech Stack:** `@react-email/components` v1 (React 19 compatible), `resend`, Next.js App Router, Payload afterChange hook.

**Prerequisite:** Plans 1–5 complete. `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_EMAIL` in both apps' `.env.local`. `NEXT_PUBLIC_APP_URL` set so the CMS can call back to `apps/web`.

---

## File Map

```
packages/email/src/
├── index.ts                           # Export all templates
├── templates/
│   ├── inquiry-notification.tsx       # Admin alert: new inquiry submitted
│   ├── vendor-confirmation.tsx        # Vendor: registration received
│   ├── vendor-admin-alert.tsx         # Admin: new vendor registered
│   ├── vendor-approved.tsx            # Vendor: account approved
│   ├── vendor-rejected.tsx            # Vendor: application rejected
│   ├── project-created.tsx            # Client: project created by admin
│   ├── document-uploaded.tsx          # Party: document uploaded to their project
│   ├── notice-broadcast.tsx           # Users: site-wide notice broadcast
│   ├── otp.tsx                        # User: 6-digit OTP code
│   └── magic-link.tsx                 # User: sign-in magic link

apps/web/src/
├── lib/
│   └── email.ts                       # (replace plain-text sends with template renders)
├── app/
│   ├── api/
│   │   └── notices/
│   │       └── blast/route.ts         # POST — triggered by CMS hook to send email blast
│   └── layout.tsx                     # (already exists — notice banner already added via SiteFooter)
└── components/
    └── notice-banner.tsx              # Server Component: active notice banner

apps/cms/src/collections/
└── Notices.ts                         # (modify afterChange hook to call blast API)
```

---

## Task 1: Base Email Template Component

**Files:**
- Create: `packages/email/src/templates/_base.tsx`

- [ ] **Step 1: Create `packages/email/src/templates/_base.tsx`**

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components'
import React from 'react'

export function EmailBase({ children, preview }: { children: React.ReactNode; preview?: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'DM Sans, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        {preview && <Text style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>{preview}</Text>}
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', margin: 0 }}>
              MG Arts
            </Text>
          </Section>
          {children}
          <Hr style={{ borderColor: '#e5e5e5', margin: '32px 0' }} />
          <Text style={{ fontSize: 12, color: '#6b6b6b', lineHeight: 1.6 }}>
            MG Arts — Interior Design & Execution · mgarts.co.in<br />
            You're receiving this because you interacted with MG Arts.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/email/src/templates/_base.tsx
git commit -m "feat(email): add base email layout component"
```

---

## Task 2: All 8 Email Templates

**Files:**
- Create: `packages/email/src/templates/inquiry-notification.tsx`
- Create: `packages/email/src/templates/vendor-confirmation.tsx`
- Create: `packages/email/src/templates/vendor-admin-alert.tsx`
- Create: `packages/email/src/templates/vendor-approved.tsx`
- Create: `packages/email/src/templates/vendor-rejected.tsx`
- Create: `packages/email/src/templates/project-created.tsx`
- Create: `packages/email/src/templates/document-uploaded.tsx`
- Create: `packages/email/src/templates/notice-broadcast.tsx`
- Create: `packages/email/src/templates/otp.tsx`
- Create: `packages/email/src/templates/magic-link.tsx`

- [ ] **Step 1: Create `packages/email/src/templates/inquiry-notification.tsx`**

```tsx
import { Section, Text, Button } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

type Props = { name: string; phone: string; email?: string; message?: string; source: string; adminUrl: string }

export function InquiryNotification({ name, phone, email, message, source, adminUrl }: Props) {
  return (
    <EmailBase preview={`New inquiry from ${name} via ${source}`}>
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>New Inquiry</Text>
        <Text style={{ fontSize: 14, color: '#6b6b6b', marginBottom: 24 }}>Submitted via the {source} page.</Text>
        {[
          ['Name', name],
          ['Phone', phone],
          ['Email', email ?? '—'],
          ['Source', source],
        ].map(([label, value]) => (
          <Section key={label} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>{label}</Text>
            <Text style={{ fontSize: 15, color: '#0a0a0a', margin: 0 }}>{value}</Text>
          </Section>
        ))}
        {message && (
          <Section style={{ marginTop: 16, padding: '12px 16px', background: '#f9f9f9', borderRadius: 6 }}>
            <Text style={{ fontSize: 14, color: '#0a0a0a', lineHeight: 1.6, margin: 0 }}>{message}</Text>
          </Section>
        )}
        <Button href={adminUrl} style={{ display: 'inline-block', marginTop: 24, background: '#c0392b', color: '#ffffff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          View in Admin
        </Button>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 2: Create `packages/email/src/templates/vendor-confirmation.tsx`**

```tsx
import { Section, Text } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

export function VendorConfirmation({ name }: { name: string }) {
  return (
    <EmailBase preview="Your vendor registration with MG Arts has been received">
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>Registration Received</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          Hi {name},
        </Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          Thank you for registering with MG Arts as a vendor. Our team will review your application and get back to you shortly.
        </Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          You'll receive another email once your account is approved.
        </Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, marginTop: 24 }}>MG Arts Team</Text>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 3: Create `packages/email/src/templates/vendor-admin-alert.tsx`**

```tsx
import { Section, Text, Button } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

type Props = { vendorName: string; tradeType: string; city: string; adminUrl: string }

export function VendorAdminAlert({ vendorName, tradeType, city, adminUrl }: Props) {
  return (
    <EmailBase preview={`New vendor registration — ${vendorName}`}>
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>New Vendor Registration</Text>
        {[['Name', vendorName], ['Trade', tradeType], ['City', city]].map(([label, value]) => (
          <Section key={label} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>{label}</Text>
            <Text style={{ fontSize: 15, color: '#0a0a0a', margin: 0 }}>{value}</Text>
          </Section>
        ))}
        <Button href={adminUrl} style={{ display: 'inline-block', marginTop: 24, background: '#c0392b', color: '#ffffff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          Review in Admin
        </Button>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 4: Create `packages/email/src/templates/vendor-approved.tsx`**

```tsx
import { Section, Text } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

export function VendorApproved({ name }: { name: string }) {
  return (
    <EmailBase preview="Your MG Arts vendor account is approved">
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>You're Approved!</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>Hi {name},</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          Great news — your vendor account has been approved. MG Arts will contact you directly when work is available in your city and trade.
        </Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, marginTop: 24 }}>MG Arts Team</Text>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 5: Create `packages/email/src/templates/vendor-rejected.tsx`**

```tsx
import { Section, Text } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

export function VendorRejected({ name }: { name: string }) {
  return (
    <EmailBase preview="Update on your MG Arts vendor application">
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>Application Update</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>Hi {name},</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          Thank you for your interest in joining MG Arts' vendor network. Unfortunately, we're unable to onboard your application at this time.
        </Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>We appreciate you reaching out and wish you well.</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, marginTop: 24 }}>MG Arts Team</Text>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 6: Create `packages/email/src/templates/project-created.tsx`**

```tsx
import { Section, Text, Button } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

type Props = { clientName: string; projectTitle: string; city: string; dashboardUrl: string }

export function ProjectCreated({ clientName, projectTitle, city, dashboardUrl }: Props) {
  return (
    <EmailBase preview={`Your project "${projectTitle}" has been created`}>
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>Project Created</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>Hi {clientName},</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          Your project <strong>{projectTitle}</strong> in {city} has been created by the MG Arts team. You can now track progress and upload documents from your dashboard.
        </Text>
        <Button href={dashboardUrl} style={{ display: 'inline-block', marginTop: 24, background: '#c0392b', color: '#ffffff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          View Project
        </Button>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 7: Create `packages/email/src/templates/document-uploaded.tsx`**

```tsx
import { Section, Text, Button } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

type Props = { recipientName: string; fileName: string; label: string; projectTitle: string; dashboardUrl: string }

export function DocumentUploaded({ recipientName, fileName, label, projectTitle, dashboardUrl }: Props) {
  return (
    <EmailBase preview={`New document uploaded to ${projectTitle}`}>
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 8 }}>New Document</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>Hi {recipientName},</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7 }}>
          A new <strong>{label}</strong> document (<em>{fileName}</em>) has been uploaded to project <strong>{projectTitle}</strong>.
        </Text>
        <Button href={dashboardUrl} style={{ display: 'inline-block', marginTop: 24, background: '#c0392b', color: '#ffffff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          View Document
        </Button>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 8: Create `packages/email/src/templates/notice-broadcast.tsx`**

```tsx
import { Section, Text } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

export function NoticeBroadcast({ title, body }: { title: string; body: string }) {
  return (
    <EmailBase preview={title}>
      <Section>
        <Text style={{ fontSize: 22, fontWeight: 800, color: '#0a0a0a', marginBottom: 16 }}>{title}</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{body}</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, marginTop: 24 }}>MG Arts Team</Text>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 9: Create `packages/email/src/templates/otp.tsx`**

```tsx
import { Section, Text } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

export function OtpEmail({ otp }: { otp: string }) {
  return (
    <EmailBase preview={`Your MG Arts login code: ${otp}`}>
      <Section>
        <Text style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Your Sign-in Code</Text>
        <Text style={{ fontSize: 48, fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#c0392b', letterSpacing: '0.12em', margin: '16px 0' }}>
          {otp}
        </Text>
        <Text style={{ fontSize: 14, color: '#6b6b6b' }}>Valid for 10 minutes. Don't share this code with anyone.</Text>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 10: Create `packages/email/src/templates/magic-link.tsx`**

```tsx
import { Section, Text, Button } from '@react-email/components'
import React from 'react'
import { EmailBase } from './_base'

export function MagicLinkEmail({ url }: { url: string }) {
  return (
    <EmailBase preview="Sign in to MG Arts">
      <Section>
        <Text style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Sign in to MG Arts</Text>
        <Text style={{ fontSize: 15, color: '#0a0a0a', lineHeight: 1.7, marginBottom: 24 }}>
          Click the button below to sign in. This link expires in 10 minutes.
        </Text>
        <Button href={url} style={{ display: 'inline-block', background: '#c0392b', color: '#ffffff', padding: '12px 24px', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Sign In
        </Button>
        <Text style={{ fontSize: 13, color: '#6b6b6b', marginTop: 24 }}>
          If you didn't request this, you can ignore this email.
        </Text>
      </Section>
    </EmailBase>
  )
}
```

- [ ] **Step 11: Update `packages/email/src/index.ts`**

```ts
export { EmailBase } from './templates/_base'
export { InquiryNotification } from './templates/inquiry-notification'
export { VendorConfirmation } from './templates/vendor-confirmation'
export { VendorAdminAlert } from './templates/vendor-admin-alert'
export { VendorApproved } from './templates/vendor-approved'
export { VendorRejected } from './templates/vendor-rejected'
export { ProjectCreated } from './templates/project-created'
export { DocumentUploaded } from './templates/document-uploaded'
export { NoticeBroadcast } from './templates/notice-broadcast'
export { OtpEmail } from './templates/otp'
export { MagicLinkEmail } from './templates/magic-link'
```

- [ ] **Step 12: Commit**

```bash
git add packages/email/src/
git commit -m "feat(email): add all 10 React Email templates with brand styling"
```

---

## Task 3: Wire Templates into apps/web/src/lib/email.ts

**Files:**
- Modify: `apps/web/src/lib/email.ts`

- [ ] **Step 1: Replace `apps/web/src/lib/email.ts` with template-based version**

```ts
import { Resend } from 'resend'
import { render } from '@react-email/components'
import {
  InquiryNotification,
  VendorConfirmation,
  VendorAdminAlert,
  VendorApproved,
  VendorRejected,
  ProjectCreated,
  DocumentUploaded,
  NoticeBroadcast,
  OtpEmail,
  MagicLinkEmail,
} from '@mg-arts/email'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'noreply@mgarts.co.in'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@mgarts.co.in'
const CMS_ADMIN_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

async function send(to: string, subject: string, react: React.ReactElement) {
  const html = await render(react)
  await resend.emails.send({ from: FROM, to, subject, html })
}

export async function sendInquiryNotification(data: { name: string; phone: string; email?: string; message?: string; source: string }) {
  await send(ADMIN_EMAIL, `New Inquiry — ${data.name} (${data.source})`,
    InquiryNotification({ ...data, adminUrl: `${CMS_ADMIN_URL}/admin/collections/inquiries` })
  )
}

export async function sendVendorConfirmation(to: string, name: string) {
  await send(to, 'MG Arts — Vendor Registration Received', VendorConfirmation({ name }))
}

export async function sendVendorAdminAlert(vendorName: string, tradeType: string, city: string) {
  await send(ADMIN_EMAIL, `New Vendor — ${vendorName} (${tradeType}, ${city})`,
    VendorAdminAlert({ vendorName, tradeType, city, adminUrl: `${CMS_ADMIN_URL}/admin/collections/vendors` })
  )
}

export async function sendVendorApproved(to: string, name: string) {
  await send(to, 'MG Arts — Your Vendor Account is Approved', VendorApproved({ name }))
}

export async function sendVendorRejected(to: string, name: string) {
  await send(to, 'MG Arts — Vendor Application Update', VendorRejected({ name }))
}

export async function sendProjectCreated(to: string, clientName: string, projectTitle: string, city: string, projectId: string) {
  await send(to, `MG Arts — Your Project "${projectTitle}" is Ready`,
    ProjectCreated({ clientName, projectTitle, city, dashboardUrl: `${APP_URL}/dashboard/projects/${projectId}` })
  )
}

export async function sendDocumentUploaded(to: string, recipientName: string, fileName: string, label: string, projectTitle: string, projectId: string) {
  await send(to, `New Document in ${projectTitle}`,
    DocumentUploaded({ recipientName, fileName, label, projectTitle, dashboardUrl: `${APP_URL}/dashboard/projects/${projectId}` })
  )
}

export async function sendNoticeBroadcast(to: string, title: string, body: string) {
  await send(to, title, NoticeBroadcast({ title, body }))
}

export async function sendOtp(to: string, otp: string) {
  await send(to, `Your MG Arts code: ${otp}`, OtpEmail({ otp }))
}

export async function sendMagicLink(to: string, url: string) {
  await send(to, 'Sign in to MG Arts', MagicLinkEmail({ url }))
}
```

- [ ] **Step 2: Update `apps/web` to depend on `@mg-arts/email`**

The `package.json` for `apps/web` already has `@mg-arts/ui` and `@mg-arts/types`. Add email:

```bash
pnpm --filter @mg-arts/web add @mg-arts/email@workspace:*
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/email.ts apps/web/package.json pnpm-lock.yaml
git commit -m "feat(email): wire React Email templates into email helper with render()"
```

---

## Task 4: Update BetterAuth to Use OTP + Magic Link Templates

**Files:**
- Modify: `apps/web/src/lib/auth.ts`

- [ ] **Step 1: Update `apps/web/src/lib/auth.ts` to use email templates**

Replace the plain-text `sendVerificationOTP` and `sendMagicLink` callbacks:

```ts
import { betterAuth } from 'better-auth'
import { emailOTP } from 'better-auth/plugins'
import { magicLink } from 'better-auth/plugins'
import { sendOtp, sendMagicLink } from './email'

export const auth = betterAuth({
  database: {
    provider: 'pg',
    url: process.env.DATABASE_URL!,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      sendVerificationOTP: async ({ email, otp }) => {
        await sendOtp(email, otp)
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLink(email, url)
      },
    }),
  ],
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'client', input: true },
      approved: { type: 'boolean', defaultValue: false, input: false },
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/auth.ts
git commit -m "feat(email): upgrade auth to use branded OTP and magic link email templates"
```

---

## Task 5: Notice Blast API Route

**Files:**
- Create: `apps/web/src/app/api/notices/blast/route.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p apps/web/src/app/api/notices/blast
```

- [ ] **Step 2: Create `apps/web/src/app/api/notices/blast/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { sendNoticeBroadcast } from '@/lib/email'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'
const BLAST_SECRET = process.env.BLAST_WEBHOOK_SECRET ?? ''

export async function POST(req: NextRequest) {
  // Verify shared secret set in both apps
  const secret = req.headers.get('x-blast-secret')
  if (BLAST_SECRET && secret !== BLAST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { noticeId, title, body, targetRole } = await req.json()

  if (!noticeId || !title || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Fetch all users matching targetRole
  const roleFilter = targetRole === 'all' ? {} : { role: { equals: targetRole } }
  const usersRes = await fetch(
    `${CMS_URL}/api/users?where=${encodeURIComponent(JSON.stringify(roleFilter))}&limit=1000&select=email`,
    { headers: { 'Content-Type': 'application/json' } }
  )

  if (!usersRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  const users = (await usersRes.json()).docs as { email: string }[]

  // Send in batches of 10 to avoid Resend rate limits
  let sent = 0
  for (let i = 0; i < users.length; i += 10) {
    const batch = users.slice(i, i + 10)
    await Promise.allSettled(batch.map((u) => sendNoticeBroadcast(u.email, title, body)))
    sent += batch.length
  }

  // Stamp sentAt on the notice record
  await fetch(`${CMS_URL}/api/notices/${noticeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentAt: new Date().toISOString() }),
  })

  return NextResponse.json({ sent })
}
```

- [ ] **Step 3: Add `BLAST_WEBHOOK_SECRET` to both `.env.local` files**

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Copy the output and set in both files:
```bash
# apps/web/.env.local
echo "BLAST_WEBHOOK_SECRET=<generated-secret>" >> apps/web/.env.local

# apps/cms/.env.local
echo "BLAST_WEBHOOK_SECRET=<same-secret>" >> apps/cms/.env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> apps/cms/.env.local
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/notices/
git commit -m "feat(email): add notice blast API route with batched Resend sends"
```

---

## Task 6: Update Payload Notices Hook

**Files:**
- Modify: `apps/cms/src/collections/Notices.ts`

- [ ] **Step 1: Update the afterChange hook in `apps/cms/src/collections/Notices.ts`**

Replace the placeholder hook body with the real webhook call:

```ts
hooks: {
  afterChange: [
    async ({ doc, operation }) => {
      if (
        doc.sendEmail &&
        !doc.sentAt &&
        (operation === 'create' || operation === 'update')
      ) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
        const secret = process.env.BLAST_WEBHOOK_SECRET ?? ''
        try {
          const res = await fetch(`${appUrl}/api/notices/blast`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-blast-secret': secret,
            },
            body: JSON.stringify({
              noticeId: doc.id,
              title: doc.title,
              body: typeof doc.body === 'string' ? doc.body : JSON.stringify(doc.body),
              targetRole: doc.targetRole ?? 'all',
            }),
          })
          if (!res.ok) console.error('[Notices] blast failed:', await res.text())
          else console.log('[Notices] blast sent, noticeId:', doc.id)
        } catch (err) {
          console.error('[Notices] blast error:', err)
        }
      }
    },
  ],
},
```

- [ ] **Step 2: Commit**

```bash
git add apps/cms/src/collections/Notices.ts
git commit -m "feat(email): wire Notices afterChange hook to call blast API"
```

---

## Task 7: Notice Banner Component

**Files:**
- Create: `apps/web/src/components/notice-banner.tsx`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Create `apps/web/src/components/notice-banner.tsx`**

```tsx
import { getActiveNotice } from '@/lib/cms'

export async function NoticeBanner() {
  let notice: { id: string; title: string } | null = null
  try { notice = await getActiveNotice() } catch {}
  if (!notice) return null

  return (
    <div
      role="alert"
      style={{
        background: 'var(--accent)',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 1.5rem',
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    >
      {notice.title}
    </div>
  )
}
```

- [ ] **Step 2: Add `NoticeBanner` above `SiteNav` in `apps/web/src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { NoticeBanner } from '@/components/notice-banner'

export const metadata: Metadata = {
  title: {
    default: 'MG Arts — Interior Design & Execution',
    template: '%s | MG Arts',
  },
  description: 'Turnkey interior design and execution — civil, electrical, plumbing, carpentry. Transparent pricing, Pan-India delivery.',
  metadataBase: new URL('https://mgarts.co.in'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers>
          <NoticeBanner />
          <SiteNav />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/notice-banner.tsx apps/web/src/app/layout.tsx
git commit -m "feat(email): add NoticeBanner server component to public layout"
```

---

## Task 8: Smoke Test Email + Notices

- [ ] **Step 1: Test inquiry email**

Submit the contact form at `http://localhost:3000/contact`. Check admin inbox for the `InquiryNotification` template with correct styling.

- [ ] **Step 2: Test OTP email**

Sign in at `http://localhost:3000/auth`. Verify the OTP email uses the branded `OtpEmail` template with the large red code.

- [ ] **Step 3: Test notice banner**

In CMS admin, create a Notice with `active: true`. Reload `http://localhost:3000`. Expected: red banner appears at top with the notice title.

- [ ] **Step 4: Test email blast**

Create a Notice in CMS with `active: true`, `sendEmail: true`, then save. Expected:
1. CMS hook fires the blast API
2. Users receive `NoticeBroadcast` email
3. `sentAt` is stamped on the Notice record in CMS admin
4. Re-saving the notice does NOT send a second blast (sentAt check)

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Plan 6 — all email templates, notice banner, and blast system"
```
