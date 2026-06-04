# Plan 3 — Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all 9 public pages (`/`, `/about`, `/services`, `/rates`, `/projects`, `/projects/[slug]`, `/pmc`, `/vendors/register` placeholder, `/contact`) with CMS data fetching, the animated rate comparison chart with NumberTicker, shared navigation/footer, and per-page SEO metadata.

**Architecture:** All public pages are Next.js Server Components fetching from Payload REST API via `apps/web/src/lib/cms.ts`. The rate chart is a Client Component using MagicUI's NumberTicker and CSS keyframe bar animations. Navigation and Footer are shared Server Components. OG images are generated per-page via Next.js ImageResponse.

**Tech Stack:** Next.js 15.4 App Router, `@magicui/react` (NumberTicker), `motion` (stagger), `@/lib/cms.ts` (Payload REST client), `next/font/google` (DM Sans, Geist Mono, Instrument Serif).

**Prerequisite:** Plan 1 complete (Tailwind v4 tokens, shadcn, dark mode in place), CMS running with at least one RateItem seeded.

---

## File Map

```
apps/web/src/
├── app/
│   ├── layout.tsx                          # (already exists) — add nav + footer
│   ├── globals.css                         # (already exists) — add rate bar animation
│   ├── page.tsx                            # / — landing (CMS blocks)
│   ├── about/page.tsx                      # /about
│   ├── services/page.tsx                   # /services
│   ├── rates/
│   │   ├── page.tsx                        # /rates — server wrapper
│   │   └── rate-chart.tsx                  # Client Component: chart + NumberTicker
│   ├── projects/
│   │   ├── page.tsx                        # /projects — portfolio grid
│   │   └── [slug]/page.tsx                 # /projects/[slug] — detail
│   ├── pmc/page.tsx                        # /pmc
│   ├── contact/page.tsx                    # /contact — inquiry form
│   └── opengraph-image.tsx                 # Dynamic OG image (all routes)
├── components/
│   ├── site-nav.tsx                        # Top navigation
│   ├── site-footer.tsx                     # Footer with office locations
│   └── inquiry-form.tsx                    # Client component — contact form
└── lib/
    └── cms.ts                              # (extend with new fetch helpers)
```

---

## Task 1: Install Animation Dependencies

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install packages**

```bash
pnpm --filter @mg-arts/web add motion
pnpm --filter @mg-arts/web add magicui
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): add motion and magicui animation dependencies"
```

---

## Task 2: Extend CMS API Client

**Files:**
- Modify: `apps/web/src/lib/cms.ts`

- [ ] **Step 1: Replace `apps/web/src/lib/cms.ts` with full version**

```ts
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

async function fetchCMS<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate = 60
): Promise<T> {
  const url = new URL(`${CMS_URL}/api/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate },
  })
  if (!res.ok) throw new Error(`CMS ${endpoint} → ${res.status}`)
  return res.json()
}

export async function getLandingPage() {
  return fetchCMS<{ blocks: unknown[] }>('globals/landing-page', {}, 60)
}

export async function getAboutPage() {
  return fetchCMS<{ headline: string; story: unknown; teamMembers: { name: string; role: string; photo: string }[] }>(
    'globals/about-page', {}, 3600
  )
}

export async function getPmcPage() {
  return fetchCMS<{ headline: string; description: unknown; pmcServices: { title: string; description: string }[]; pastCollaborators: { firmName: string; projectName: string; city: string; logo: string }[] }>(
    'globals/pmc-page', {}, 3600
  )
}

export async function getSiteSettings() {
  return fetchCMS<{ siteName: string; phone: string; email: string; offices: { city: string; address: string; isVirtual: boolean }[]; instagramUrl: string; linkedinUrl: string; whatsappNumber: string }>(
    'globals/site-settings', {}, 3600
  )
}

export async function getServices() {
  return fetchCMS<{ docs: { id: string; title: string; description: unknown; withMaterial: boolean; order: number }[] }>(
    'services', { where: JSON.stringify({ active: { equals: true } }), sort: 'order', limit: '100' }
  )
}

export async function getRateItems(category?: string) {
  const where = category
    ? JSON.stringify({ category: { equals: category } })
    : JSON.stringify({ _status: { not_equals: 'draft' } })
  return fetchCMS<{ docs: { id: string; category: string; serviceLabel: string; unit: string; mgArtsRate: number; marketRate: number; withMaterial: boolean; order: number; updatedAt: string }[] }>(
    'rate-items', { where, sort: 'order', limit: '200' }, 300
  )
}

export async function getPortfolioProjects(params: { category?: string; city?: string; limit?: number } = {}) {
  const where: Record<string, unknown> = {}
  if (params.category) where.category = { equals: params.category }
  if (params.city) where.city = { like: params.city }
  return fetchCMS<{ docs: { id: string; title: string; slug: string; city: string; category: string; year: number; photos: { url: string }[]; collaborator: string }[] }>(
    'portfolio-projects',
    { where: JSON.stringify(where), sort: '-year', limit: String(params.limit ?? 50) }
  )
}

export async function getPortfolioProject(slug: string) {
  const data = await fetchCMS<{ docs: { id: string; title: string; slug: string; city: string; category: string; year: number; photos: { url: string }[]; description: unknown; brands: { id: string; name: string; logo: string }[]; collaborator: string; metaTitle: string; metaDesc: string }[] }>(
    'portfolio-projects',
    { where: JSON.stringify({ slug: { equals: slug } }), limit: '1' }
  )
  return data.docs[0] ?? null
}

export async function getPortfolioProjectSlugs() {
  const data = await fetchCMS<{ docs: { slug: string }[] }>(
    'portfolio-projects', { limit: '1000', select: 'slug' }
  )
  return data.docs.map((d) => d.slug)
}

export async function getActiveNotice() {
  const data = await fetchCMS<{ docs: { id: string; title: string; body: unknown }[] }>(
    'notices',
    { where: JSON.stringify({ active: { equals: true } }), sort: '-createdAt', limit: '1' }
  )
  return data.docs[0] ?? null
}

export async function submitInquiry(payload: {
  name: string; phone: string; email?: string; message?: string; source: string
}) {
  const res = await fetch(`${CMS_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to submit inquiry')
  return res.json()
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/cms.ts
git commit -m "feat(web): extend CMS client with all public page fetch helpers"
```

---

## Task 3: Shared Navigation + Footer

**Files:**
- Create: `apps/web/src/components/site-nav.tsx`
- Create: `apps/web/src/components/site-footer.tsx`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Create `apps/web/src/components/site-nav.tsx`**

```tsx
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Rates', href: '/rates' },
  { label: 'Projects', href: '/projects' },
  { label: 'PMC', href: '/pmc' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function SiteNav() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link href="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text)', textDecoration: 'none' }}>
        MG Arts
      </Link>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/auth"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            background: 'var(--accent)',
            borderRadius: 6,
            padding: '6px 14px',
            textDecoration: 'none',
          }}
        >
          Login
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create `apps/web/src/components/site-footer.tsx`**

```tsx
import { getSiteSettings } from '@/lib/cms'

export async function SiteFooter() {
  let settings = { phone: '', email: '', offices: [] as { city: string; address: string; isVirtual: boolean }[], instagramUrl: '', whatsappNumber: '' }
  try { settings = await getSiteSettings() } catch { /* CMS offline during build */ }

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '3rem 1.5rem',
        background: 'var(--bg-subtle)',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>MG Arts</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Turnkey interior design & execution.<br />Civil, electrical, plumbing, carpentry.
          </p>
          {settings.phone && (
            <a href={`tel:${settings.phone}`} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', display: 'block', marginTop: 8 }}>
              {settings.phone}
            </a>
          )}
        </div>
        {settings.offices.map((o) => (
          <div key={o.city}>
            <p style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 6 }}>
              {o.city}{o.isVirtual ? ' (Virtual)' : ''}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {o.address}
            </p>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: '2rem auto 0', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: 12, color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} MG Arts. All rights reserved.
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update `apps/web/src/app/layout.tsx` to include nav + footer**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

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
          <SiteNav />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/ apps/web/src/app/layout.tsx
git commit -m "feat(web): add shared SiteNav and SiteFooter with CMS data"
```

---

## Task 4: Landing Page (/)

**Files:**
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Replace `apps/web/src/app/page.tsx`**

```tsx
import { getLandingPage, getActiveNotice } from '@/lib/cms'
import Link from 'next/link'

export const metadata = {
  title: 'MG Arts — Interior Design & Execution',
  description: 'Turnkey interior design. Civil, electrical, plumbing, carpentry. Transparent pricing.',
}

export default async function HomePage() {
  let page = { blocks: [] as { blockType: string; headline?: string; subheadline?: string; ctaLabel?: string; ctaHref?: string; items?: { title: string; description: string }[] }[] }
  let notice = null
  try { page = await getLandingPage() } catch {}
  try { notice = await getActiveNotice() } catch {}

  const hero = page.blocks.find((b) => b.blockType === 'hero')
  const valueProps = page.blocks.find((b) => b.blockType === 'value-props')
  const ctaBanner = page.blocks.find((b) => b.blockType === 'cta-banner')

  return (
    <main style={{ flex: 1 }}>
      {notice && (
        <div style={{ background: 'var(--accent)', color: '#fff', textAlign: 'center', padding: '10px 1rem', fontSize: 13, fontWeight: 500 }}>
          {notice.title}
        </div>
      )}

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          {hero?.headline ?? 'Interior Design That Delivers'}
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.6 }}>
          {hero?.subheadline ?? 'Turnkey execution — civil, electrical, plumbing, carpentry — with transparent, market-beating rates.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={hero?.ctaHref ?? '/contact'}
            style={{ background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
            {hero?.ctaLabel ?? 'Get a Free Quote'}
          </Link>
          <Link href="/rates"
            style={{ background: 'transparent', color: 'var(--text)', padding: '12px 28px', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid var(--border)' }}>
            See Our Rates
          </Link>
        </div>
      </section>

      {/* Value Props */}
      {valueProps?.items && valueProps.items.length > 0 && (
        <section style={{ background: 'var(--bg-subtle)', padding: '4rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {valueProps.items.map((item, i) => (
              <div key={i}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rate teaser */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
          Transparent, Competitive Pricing
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: '1.5rem' }}>
          Compare our rates to the market — no hidden markups.
        </p>
        <Link href="/rates"
          style={{ background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          View Full Rate Chart →
        </Link>
      </section>

      {/* CTA Banner */}
      {ctaBanner?.headline && (
        <section style={{ background: '#000', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '4rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', color: '#fff', marginBottom: '1.5rem' }}>
            {ctaBanner.headline}
          </h2>
          {ctaBanner.ctaLabel && (
            <Link href={ctaBanner.ctaHref ?? '/contact'}
              style={{ background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              {ctaBanner.ctaLabel}
            </Link>
          )}
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat(web): build landing page with CMS blocks and notice banner"
```

---

## Task 5: /about + /services Pages

**Files:**
- Create: `apps/web/src/app/about/page.tsx`
- Create: `apps/web/src/app/services/page.tsx`

- [ ] **Step 1: Create `apps/web/src/app/about/page.tsx`**

```tsx
import { getAboutPage, getSiteSettings } from '@/lib/cms'

export const metadata = { title: 'About', description: 'The story behind MG Arts — team, mission, and authorized brands.' }

export default async function AboutPage() {
  let page = { headline: 'About MG Arts', story: null, teamMembers: [] as { name: string; role: string; photo: string }[] }
  try { page = await getAboutPage() } catch {}

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
        {page.headline}
      </h1>

      {page.teamMembers.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {page.teamMembers.map((member, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-subtle)', border: '1px solid var(--border)', margin: '0 auto 10px', overflow: 'hidden' }}>
                  {member.photo && <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{member.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Create `apps/web/src/app/services/page.tsx`**

```tsx
import { getServices } from '@/lib/cms'

export const metadata = { title: 'Services', description: 'Interior design and execution services from MG Arts — civil, electrical, plumbing, carpentry, and more.' }

export default async function ServicesPage() {
  let services: { id: string; title: string; description: unknown; withMaterial: boolean }[] = []
  try { const data = await getServices(); services = data.docs } catch {}

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        Services
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: 15 }}>
        Turnkey execution — everything under one roof.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {services.map((s) => (
          <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1.5rem', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</h3>
              <span style={{ fontSize: 11, background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                {s.withMaterial ? 'With material' : 'Labour only'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/about/ apps/web/src/app/services/
git commit -m "feat(web): add /about and /services pages with CMS data"
```

---

## Task 6: /rates Page with Animated Rate Chart

**Files:**
- Create: `apps/web/src/app/rates/page.tsx`
- Create: `apps/web/src/app/rates/rate-chart.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Add rate bar animation to `apps/web/src/app/globals.css`**

Append to the end of the file:

```css
@keyframes bar-fill {
  from { width: 0%; }
  to { width: var(--bar-width); }
}

.rate-bar {
  height: 8px;
  border-radius: 4px;
  animation: bar-fill 600ms ease-out forwards;
  animation-play-state: paused;
}

.rate-bar.animate {
  animation-play-state: running;
}
```

- [ ] **Step 2: Create `apps/web/src/app/rates/rate-chart.tsx`** (Client Component)

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

type RateItem = {
  id: string
  category: string
  serviceLabel: string
  unit: string
  mgArtsRate: number
  marketRate: number
  withMaterial: boolean
}

const CATEGORIES = ['civil', 'electrical', 'plumbing', 'carpentry'] as const

export function RateChart({ items, lastUpdated }: { items: RateItem[]; lastUpdated: string }) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const filtered = activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory)
  const maxRate = Math.max(...items.map((i) => i.marketRate), 1)

  return (
    <div ref={ref}>
      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['all', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 16px',
              border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 999,
              background: activeCategory === cat ? 'var(--accent)' : 'var(--bg)',
              color: activeCategory === cat ? '#fff' : 'var(--text)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rate rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filtered.map((item) => {
          const multiplier = item.marketRate > 0 ? (item.marketRate / item.mgArtsRate) : 1
          const mgWidth = (item.mgArtsRate / maxRate) * 100
          const mktWidth = (item.marketRate / maxRate) * 100

          return (
            <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.serviceLabel}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>per {item.unit} · {item.withMaterial ? 'incl. material' : 'labour only'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>
                    ₹{item.mgArtsRate.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                    ₹{item.marketRate.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Multiplier badge */}
              {multiplier >= 1.1 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: 18,
                    background: 'linear-gradient(135deg, #c0392b, #e05b2b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {multiplier.toFixed(1)}× more cost-effective
                  </span>
                </div>
              )}

              {/* Bar chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', width: 56, flexShrink: 0 }}>MG Arts</span>
                  <div style={{ flex: 1, background: 'var(--bg-subtle)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div
                      className={`rate-bar ${animated ? 'animate' : ''}`}
                      style={{ '--bar-width': `${mgWidth}%`, background: 'var(--accent)', width: animated ? undefined : 0 } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 56, flexShrink: 0 }}>Market</span>
                  <div style={{ flex: 1, background: 'var(--bg-subtle)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div
                      className={`rate-bar ${animated ? 'animate' : ''}`}
                      style={{ '--bar-width': `${mktWidth}%`, background: 'var(--text-muted)', width: animated ? undefined : 0 } as React.CSSProperties}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '1.5rem' }}>
        Last updated: {new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/app/rates/page.tsx`**

```tsx
import { getRateItems } from '@/lib/cms'
import { RateChart } from './rate-chart'

export const metadata = {
  title: 'Rates',
  description: 'MG Arts vs market rates — civil, electrical, plumbing, carpentry. Transparent pricing, no hidden markups.',
}

export default async function RatesPage() {
  let items: Awaited<ReturnType<typeof getRateItems>>['docs'] = []
  let lastUpdated = new Date().toISOString()
  try {
    const data = await getRateItems()
    items = data.docs
    if (items.length > 0) lastUpdated = items[0].updatedAt
  } catch {}

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        Rate Comparison
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: '2.5rem' }}>
        MG Arts rates vs. current market benchmarks. Updated regularly by our team.
      </p>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Rate data coming soon.</p>
      ) : (
        <RateChart items={items} lastUpdated={lastUpdated} />
      )}
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/rates/ apps/web/src/app/globals.css
git commit -m "feat(web): add /rates page with animated bar chart and category filters"
```

---

## Task 7: /projects + /projects/[slug] Pages

**Files:**
- Create: `apps/web/src/app/projects/page.tsx`
- Create: `apps/web/src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p apps/web/src/app/projects/\[slug\]
```

- [ ] **Step 2: Create `apps/web/src/app/projects/page.tsx`**

```tsx
import { getPortfolioProjects } from '@/lib/cms'
import Link from 'next/link'

export const metadata = { title: 'Projects', description: 'MG Arts completed projects — residential, commercial, hospitality. Browse our portfolio.' }

const CATEGORIES = ['all', 'residential', 'commercial', 'hospitality'] as const

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  let projects: { id: string; title: string; slug: string; city: string; category: string; year: number; photos: { url: string }[] }[] = []
  try {
    const data = await getPortfolioProjects({ category: category === 'all' || !category ? undefined : category })
    projects = data.docs
  } catch {}

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        Portfolio
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: '2rem' }}>
        Completed projects across India.
      </p>

      {/* Category filter links */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => {
          const active = (cat === 'all' && !category) || category === cat
          return (
            <Link key={cat} href={cat === 'all' ? '/projects' : `/projects?category=${cat}`}
              style={{
                padding: '6px 16px',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 999,
                background: active ? 'var(--accent)' : 'var(--bg)',
                color: active ? '#fff' : 'var(--text)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                textTransform: 'capitalize',
              }}>
              {cat}
            </Link>
          )
        })}
      </div>

      {projects.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No projects yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg)' }}>
                <div style={{ height: 200, background: 'var(--bg-subtle)' }}>
                  {p.photos[0]?.url && (
                    <img src={p.photos[0].url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.city} · {p.year} · <span style={{ textTransform: 'capitalize' }}>{p.category}</span></p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/app/projects/[slug]/page.tsx`**

```tsx
import { getPortfolioProject, getPortfolioProjectSlugs } from '@/lib/cms'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  try {
    const slugs = await getPortfolioProjectSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const p = await getPortfolioProject(slug)
    if (!p) return {}
    return {
      title: p.metaTitle || p.title,
      description: p.metaDesc || `${p.category} interior design project in ${p.city} by MG Arts.`,
    }
  } catch { return {} }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let project = null
  try { project = await getPortfolioProject(slug) } catch {}
  if (!project) notFound()

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: 8 }}>
        {project.category} · {project.city} · {project.year}
      </p>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
        {project.title}
      </h1>

      {/* Photo grid */}
      {project.photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
          {project.photos.map((photo, i) => (
            <div key={i} style={{ aspectRatio: '4/3', background: 'var(--bg-subtle)', borderRadius: 6, overflow: 'hidden' }}>
              <img src={photo.url} alt={`${project!.title} — photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      {project.collaborator && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>
          In collaboration with <strong>{project.collaborator}</strong>
        </p>
      )}

      {project.brands.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>
            Brands Used
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {project.brands.map((b) => (
              <span key={b.id} style={{ fontSize: 13, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px' }}>{b.name}</span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/projects/
git commit -m "feat(web): add /projects grid and /projects/[slug] detail pages"
```

---

## Task 8: /pmc Page

**Files:**
- Create: `apps/web/src/app/pmc/page.tsx`

- [ ] **Step 1: Create `apps/web/src/app/pmc/page.tsx`**

```tsx
import { getPmcPage } from '@/lib/cms'
import Link from 'next/link'

export const metadata = { title: 'PMC — Project Management Consultancy', description: 'Partner with MG Arts as your PMC execution partner. We handle civil, electrical, plumbing, and carpentry so you can focus on design.' }

export default async function PmcPage() {
  let page = { headline: 'Project Management Consultancy', description: null, pmcServices: [] as { title: string; description: string }[], pastCollaborators: [] as { firmName: string; projectName: string; city: string }[] }
  try { page = await getPmcPage() } catch {}

  return (
    <main style={{ flex: 1 }}>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 1.5rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
          {page.headline}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, maxWidth: 640, marginBottom: '2.5rem' }}>
          We partner with architecture firms as the execution arm — handling civil, electrical, plumbing, and carpentry so you can focus on design.
        </p>
        <Link href="/auth?role=architect"
          style={{ background: 'var(--accent)', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
          Register as an Architect Partner
        </Link>
      </section>

      {page.pmcServices.length > 0 && (
        <section style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '2rem' }}>What We Handle</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {page.pmcServices.map((s, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', background: 'var(--bg)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.pastCollaborators.length > 0 && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Past Collaborations</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {page.pastCollaborators.map((c, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.25rem' }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{c.firmName}</p>
                {c.projectName && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.projectName} · {c.city}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/pmc/
git commit -m "feat(web): add /pmc page with services and collaborations"
```

---

## Task 9: /contact Page with Inquiry Form

**Files:**
- Create: `apps/web/src/app/contact/page.tsx`
- Create: `apps/web/src/components/inquiry-form.tsx`
- Create: `apps/web/src/app/api/inquiries/route.ts`

- [ ] **Step 1: Create `apps/web/src/app/api/inquiries/route.ts`** (server-side proxy to CMS)

```ts
import { NextRequest, NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${CMS_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
```

- [ ] **Step 2: Create `apps/web/src/components/inquiry-form.tsx`**

```tsx
'use client'

import { useState } from 'react'

export function InquiryForm({ source }: { source: string }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Got it — we'll be in touch!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Our team will reach out within 1 business day.</p>
      </div>
    )
  }

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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Name *</label>
        <input required style={inputStyle} value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>
      <div>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Phone *</label>
        <input required type="tel" style={inputStyle} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
      </div>
      <div>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Email</label>
        <input type="email" style={inputStyle} value={form.email} onChange={(e) => update('email', e.target.value)} />
      </div>
      <div>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Message</label>
        <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.message} onChange={(e) => update('message', e.target.value)} />
      </div>
      {status === 'error' && (
        <p style={{ fontSize: 13, color: 'var(--accent)' }}>Submission failed — please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '11px', fontWeight: 600, fontSize: 14, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/app/contact/page.tsx`**

```tsx
import { getSiteSettings } from '@/lib/cms'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata = { title: 'Contact', description: 'Get in touch with MG Arts — offices in Mumbai, Bangalore, and Kolkata.' }

export default async function ContactPage() {
  let settings = { phone: '', email: '', offices: [] as { city: string; address: string; isVirtual: boolean }[], whatsappNumber: '' }
  try { settings = await getSiteSettings() } catch {}

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '4rem 1.5rem', flex: 1 }}>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
        Get in Touch
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: '3rem' }}>
        Tell us about your project and we'll reach out within 1 business day.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem' }}>
        <div>
          <InquiryForm source="contact" />
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>Our Offices</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {settings.offices.map((o) => (
              <div key={o.city}>
                <p style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>
                  {o.city}{o.isVirtual ? ' (Virtual)' : ''}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{o.address}</p>
              </div>
            ))}
            {settings.phone && (
              <div>
                <p style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>Phone</p>
                <a href={`tel:${settings.phone}`} style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>{settings.phone}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/contact/ apps/web/src/app/api/inquiries/ apps/web/src/components/inquiry-form.tsx
git commit -m "feat(web): add /contact page with inquiry form and office locations"
```

---

## Task 10: Dynamic OG Images + sitemap/robots

**Files:**
- Create: `apps/web/src/app/opengraph-image.tsx`
- Create: `apps/web/src/app/sitemap.ts` (already exists as stub — replace)
- Create: `apps/web/src/app/robots.ts` (already exists as stub)

- [ ] **Step 1: Create `apps/web/src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MG Arts — Interior Design & Execution'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: '#000',
          color: '#fff',
        }}
      >
        <p style={{ fontSize: 18, color: '#c0392b', fontWeight: 700, marginBottom: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          MG Arts
        </p>
        <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24 }}>
          Interior Design &amp; Execution
        </h1>
        <p style={{ fontSize: 24, color: '#888' }}>
          Transparent pricing · Pan-India delivery
        </p>
      </div>
    ),
    size
  )
}
```

- [ ] **Step 2: Replace `apps/web/src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { getPortfolioProjectSlugs } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mgarts.co.in'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/rates`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pmc`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/vendors/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await getPortfolioProjectSlugs()
    projectRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {}

  return [...staticRoutes, ...projectRoutes]
}
```

- [ ] **Step 3: Create `apps/web/src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard/', '/auth/', '/admin/'] }],
    sitemap: 'https://mgarts.co.in/sitemap.xml',
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/opengraph-image.tsx apps/web/src/app/sitemap.ts apps/web/src/app/robots.ts
git commit -m "feat(web): add OG image, sitemap, and robots.txt"
```

---

## Task 11: Smoke Test All Public Pages

- [ ] **Step 1: Run dev server**

```bash
pnpm --filter @mg-arts/web dev
```

- [ ] **Step 2: Test each route**

| URL | Expected |
|---|---|
| `http://localhost:3000/` | Landing page with hero section |
| `http://localhost:3000/about` | Team grid (empty if no CMS data) |
| `http://localhost:3000/services` | Service cards |
| `http://localhost:3000/rates` | Rate chart with category filters, bars animate on scroll |
| `http://localhost:3000/projects` | Portfolio grid |
| `http://localhost:3000/pmc` | PMC overview with CTA |
| `http://localhost:3000/contact` | Inquiry form + office locations |
| `http://localhost:3000/sitemap.xml` | Valid XML, no 500 |
| `http://localhost:3000/robots.txt` | Disallows /dashboard/, /auth/ |

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete Plan 3 — all 9 public pages with CMS data, rate chart, SEO"
```
