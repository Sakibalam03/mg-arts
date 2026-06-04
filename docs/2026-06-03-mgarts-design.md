# MG Arts Platform — Design Spec

**Date:** 2026-06-03
**Client:** MG Arts — Interior Design and Execution ("Turnkey Project Solution")
**Domain:** mgarts.co.in / cms.mgarts.co.in
**Prototype deadline:** July 1, 2026
**Launch deadline:** July 27, 2026

---

## 1. Overview

MG Arts needs a multi-tiered web platform that serves three distinct audiences:

1. **Direct clients** — homeowners and businesses looking for interior design execution
2. **Architect firms** — who engage MG Arts as a PMC (Project Management Consultancy) execution partner
3. **Local vendors** — contractors (plumbers, electricians, carpenters) who register to receive work in their city

The platform is also a lead-generation engine and a trust-building tool, with transparent rate comparison charts and a portfolio of completed projects as its primary conversion mechanisms.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Frontend + API | Next.js 16, App Router, `src/` folder |
| CMS + Admin panel | PayloadCMS 3.x |
| Database ORM | Drizzle (via `@payloadcms/db-postgres`) |
| Database | NeonDB (serverless Postgres) |
| Auth | BetterAuth + Payload community adapter |
| File storage | AWS S3 (presigned URL uploads) |
| Email | Resend + React Email templates |
| Hosting | Vercel (both apps, separate projects) |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui + HeroUI + MagicUI |
| Animations | Motion + MagicUI |
| Dark mode | next-themes |

**No Prisma.** Payload's `@payloadcms/db-postgres` adapter uses Drizzle internally and manages all migrations. One ORM, one migration system.

---

## 3. Monorepo Structure

```
mg-arts/
├── apps/
│   ├── web/          # Next.js 16 — mgarts.co.in
│   └── cms/          # PayloadCMS 3.x — cms.mgarts.co.in
├── packages/
│   ├── ui/           # Shared React components + design tokens
│   ├── types/        # Shared TypeScript types (generated from Payload)
│   └── email/        # React Email templates (sent via Resend)
├── turbo.json
└── package.json
```

- `apps/web` and `apps/cms` are deployed as separate Vercel projects
- Both connect to the same NeonDB instance via separate environment variables
- `packages/types` is auto-generated from Payload collection configs to keep web and cms in sync

---

## 4. Visual Design

- **Style:** Bold and data-driven — the rate comparison is the hero
- **Base:** White
- **Accent:** Red/orange (`#c0392b` range)
- **Typography:** Heavy weight for numbers and multipliers (3.5×, 2×), clean sans-serif for body
- **Language:** English only at launch

---

## 5. Site Map (apps/web)

### Public (no login required)

| Route | Description |
|---|---|
| `/` | Landing page — CMS block-based, fully editable via Payload Live Preview |
| `/about` | Company story, team, authorized brand logos |
| `/services` | CMS-editable — client can add/remove/reorder services at any time |
| `/rates` | Public graphical rate comparison — MG Arts vs market rates, multiplier metrics |
| `/projects` | Portfolio / case studies, filterable by category and city |
| `/projects/[slug]` | Project detail — photos, scope, brands used, outcome. SEO-optimised. |
| `/pmc` | PMC public overview — services, past architect collaborations, register CTA |
| `/vendors/register` | Vendor registration — dynamic form + license upload, no login needed |
| `/contact` | Inquiry form + all office locations (Mumbai, Bangalore, Kolkata) |

### Auth routes

| Route | Description |
|---|---|
| `/auth` | Single entry — email input + role selection (client / architect) |
| `/auth/verify` | 6-digit OTP entry — auto-redirects on success |
| `/auth/magic` | Magic link token validation — redirects to `/dashboard` |
| `/auth/error` | Expired link, invalid OTP, unknown account |

**No passwords.** Auth is magic link / OTP only via Resend + BetterAuth.

### Dashboard (login required, role-aware)

Single `/dashboard` URL. Middleware reads BetterAuth session role and renders role-appropriate sidebar, navigation, and content. Admin users skip `/dashboard` entirely and are redirected to `cms.mgarts.co.in/admin`.

| Route | Client sees | Architect sees |
|---|---|---|
| `/dashboard` | Active projects, recent activity | Active engagements, recent docs |
| `/dashboard/projects` | My projects + status | Joint projects with MG Arts |
| `/dashboard/projects/[id]` | Upload docs, download BOQs, status timeline | Shared drawings, measurements, reports |
| `/dashboard/resources` | — | BOQ templates, rate sheets |
| `/dashboard/inquiries` | Submitted inquiry history | — |
| `/dashboard/new` | — | Submit new PMC project brief |

### Technical / SEO

| File | Description |
|---|---|
| `src/app/sitemap.ts` | Dynamic XML sitemap — static routes + all `/projects/[slug]` fetched from Payload. Auto-updates on publish. |
| `src/app/robots.ts` | Disallows `/dashboard/*`, `/auth/*`, `/admin`. Points to sitemap. |
| `src/app/opengraph-image.tsx` | Dynamic OG images per page via Next.js ImageResponse |

---

## 6. Authentication

- **Provider:** BetterAuth with PayloadCMS community adapter
- **Method:** Magic link OR 6-digit OTP — user chooses at `/auth`
- **Flow (new user):** Enter email + select role (client / architect) → account created → Resend delivers OTP/link → verify → redirect to `/dashboard`
- **Flow (returning user):** Enter email → role resolved from DB, no selection needed → Resend delivers OTP/link → verify → redirect to `/dashboard`
- **Roles:** `client` | `architect` | `admin`
- **Architect approval:** Architects who register are set `approved: false` by default. MG Arts approves from Payload admin. Unapproved architects see a "pending approval" screen at `/dashboard`.
- **Session:** BetterAuth session cookie, handled by Next.js middleware for route protection

---

## 7. Payload CMS Data Model

### Collections

#### `users`
BetterAuth-managed. Fields: `id`, `name`, `email`, `phone`, `role` (enum: client | architect | admin), `firmName` (architect only), `approved` (boolean, architect approval gate).

#### `projects` (dashboard — not public portfolio)
Links clients to MG Arts engagements. **Projects are created by MG Arts admin** in the Payload panel after an inquiry is received and a client account exists — clients cannot self-create projects. Fields: `id`, `title`, `client` → users, `architect` → users (optional), `status` (enum: inquiry | quoted | active | completed), `city`, `documents` → documents[], `notes` (richText, admin-only).

#### `documents`
S3-backed file uploads. Fields: `id`, `project` → projects, `uploadedBy` → users, `fileUrl` (S3 key), `fileType`, `label` (enum: requirement | quote | boq | drawing | other), `visibleTo` (enum: client | architect | admin | all). `visibleTo` is set by the uploader's role at upload time: clients default to `client`, architects to `architect`, admin can set any value and can edit `visibleTo` post-upload from the Payload admin panel.

#### `inquiries`
Lead capture from all public forms. Fields: `id`, `name`, `phone`, `email`, `message`, `source` (enum: contact | landing | rates | pmc), `user` → users (optional, if logged in), `status` (enum: new | contacted | converted).

#### `vendors`
Contractor registrations. Fields: `id`, `name`, `phone`, `email`, `tradeType` (enum: plumber | electrician | carpenter | civil | other), `city`, `licenseFile` (S3 key), `extraFields` (JSON — dynamic attributes), `status` (enum: pending | approved | rejected).

#### `vendorFieldSchema`
Dynamic form builder for the vendor registration form. Fields: `id`, `label`, `fieldKey` (JSON key in `extraFields`), `fieldType` (enum: text | number | select | file), `options` (text[], for select type), `required` (boolean), `order` (number), `active` (boolean show/hide toggle).

#### `rateItems`
Rate chart line items. Fields: `id`, `category` (enum: civil | electrical | plumbing | carpentry), `serviceLabel`, `unit` (sqft | running ft | point etc.), `mgArtsRate` (number), `marketRate` (number), `withMaterial` (boolean), `order` (number).

#### `notices`
Site banner + email blast. Fields: `id`, `title`, `body` (richText), `active` (boolean, controls banner visibility), `sendEmail` (boolean, triggers Resend blast on publish), `sentAt` (datetime), `targetRole` (enum: all | client | architect).

#### `portfolioProjects` (public case studies)
Fields: `id`, `title`, `slug` (auto-generated, unique), `city`, `category` (enum: residential | commercial | hospitality), `year`, `photos` (S3 keys[]), `brands` → brands[], `description` (richText, SEO content), `collaborator` (text), `metaTitle`, `metaDesc`.

#### `brands`
Authorized brand logos. Fields: `id`, `name`, `logo` (S3 key), `authLetter` (S3 key), `visible` (boolean toggle), `order`.

#### `architectResources`
Gated resources for architect dashboard. Fields: `id`, `title`, `type` (enum: boq-template | rate-sheet | guideline), `fileUrl` (S3 key), `active`, `order`.

#### `services`
CMS-editable `/services` page. Fields: `id`, `title`, `description` (richText), `icon` (S3 key, optional), `withMaterial` (boolean), `active`, `order`.

### Globals (single-instance, Payload Live Preview)

| Global | Content |
|---|---|
| `landingPage` | Block-based: hero, value props, rate teaser section, CTA blocks. Client reorders freely. |
| `aboutPage` | Company story, team members array, brand logos section. |
| `pmcPage` | PMC public overview — services list, past architect collaborations array. |
| `siteSettings` | Site name, phone, email, office addresses (Mumbai / Bangalore / Kolkata), social links. |

---

## 8. Rate Charts

- **Visibility:** Fully public — no login required
- **Display:** Graphical comparison between MG Arts rate and market rate per line item
- **Metrics:** Multiplier callouts (e.g. "3.5× more cost-effective than market")
- **Management:** Both `mgArtsRate` and `marketRate` entered and updated by the client via Payload admin
- **Grouping:** Filterable by category (civil, electrical, plumbing, carpentry) and by `withMaterial` toggle
- **Last updated:** Displayed on the page, sourced from the most recent `rateItems` update timestamp

---

## 9. Vendor Registration Flow

1. Vendor visits `/vendors/register` (no login needed)
2. Form renders base fields (name, phone, email, trade type, city, license upload) + any active `vendorFieldSchema` entries in order
3. On submit: file uploaded to S3, record created in `vendors` with `status: pending`
4. Resend sends confirmation email to vendor
5. Resend sends notification email to MG Arts admin
6. Admin approves or rejects from Payload admin panel
7. Resend sends approval/rejection email to vendor
8. Approved vendors are searchable internally by city and trade type

---

## 10. File Storage (AWS S3)

- **Payload media** (portfolio photos, brand logos, resource files): uploaded via Payload's built-in S3 adapter (`@payloadcms/storage-s3`)
- **Client/architect documents** (requirements, drawings, BOQs): uploaded via presigned URLs — browser uploads directly to S3, URL stored in `documents.fileUrl`
- **Vendor licenses**: uploaded via presigned URL on vendor registration form
- **Max file size:** No hard limit enforced at app layer — S3 handles large files (CAD drawings, DWG, DXF up to 100MB+)
- **Access control:** Private bucket. All downloads served via time-limited presigned GET URLs generated server-side

---

## 11. Email Notifications (Resend + React Email)

All templates live in `packages/email/`.

| Trigger | Recipients | Template |
|---|---|---|
| New inquiry submitted | MG Arts admin | `inquiry-notification` |
| Vendor registers | Vendor (confirmation) + admin (notification) | `vendor-confirmation`, `vendor-admin-alert` |
| Vendor approved | Vendor | `vendor-approved` |
| Vendor rejected | Vendor | `vendor-rejected` |
| New project created | Client | `project-created` |
| Document uploaded | Relevant party (by `visibleTo`) | `document-uploaded` |
| Notice published with `sendEmail: true` | All users or by `targetRole` | `notice-broadcast` |
| OTP / magic link | User | `otp`, `magic-link` |

---

## 12. Site-wide Notices

- Admin creates a notice in Payload with `active: true` → a banner appears on all public pages
- If `sendEmail: true` on publish → Resend blast sent to all users matching `targetRole`
- `sentAt` is stamped on first send to prevent duplicate blasts on re-save
- Multiple notices can be active simultaneously; most recent is shown in the banner

---

## 13. SEO Strategy

- Dynamic `sitemap.ts` auto-includes all published `portfolioProjects` slugs
- `robots.ts` blocks all authenticated routes from crawlers
- `opengraph-image.tsx` generates per-page OG images
- Each `portfolioProject` has `metaTitle` and `metaDesc` fields managed in Payload
- `/rates` page is a primary organic SEO target — transparent pricing is rare in this market
- `/projects/[slug]` pages are SEO content targeting city + service keywords (e.g. "false ceiling contractor Mumbai")

---

## 14. Deployment

| App | Vercel Project | Domain |
|---|---|---|
| `apps/web` | mg-arts-web | mgarts.co.in |
| `apps/cms` | mg-arts-cms | cms.mgarts.co.in |

Both projects share the same NeonDB connection string via Vercel environment variables. S3 bucket and Resend API key are also set as environment variables on both projects.

---

## 15. UI Design System

### Design Direction — "Precision Craft"
Bold and data-driven. The rate comparison is the hero. Numbers are the personality. Inspired by Cloudflare's dashboard: crisp, high-contrast, zero decorative noise. Every pixel either communicates data or creates breathing room.

### UI Library Stack

| Package | Role |
|---|---|
| `tailwindcss@v4` | Utility styling — CSS-first config, no `tailwind.config.js` |
| `shadcn/ui` | Base components (forms, dialogs, dropdowns, tables) — restyled to spec |
| `@heroui/react` | Rich interactive components (date pickers, complex selects, modals) |
| `magicui` | NumberTicker, BorderBeam, Shimmer, AnimatedBeam for high-impact moments |
| `motion` | FadeIn stagger, page transitions, bar chart animations |
| `next-themes` | Flash-free dark/light mode toggle |

### Color System — Strict Rule

**Backgrounds are `#ffffff` (light) or `#000000` (dark) only. No dark blues, no slates, no `#1e293b`, no grey washes.**

```css
:root {
  --bg:              #ffffff;
  --bg-subtle:       #f9f9f9;   /* cards, table rows */
  --border:          #e5e5e5;
  --text:            #0a0a0a;
  --text-muted:      #6b6b6b;
  --accent:          #c0392b;   /* crimson */
  --accent-warm:     #e05b2b;   /* ember */
  --accent-gradient: linear-gradient(135deg, #c0392b 0%, #e05b2b 100%);
}

.dark {
  --bg:              #000000;
  --bg-subtle:       #0a0a0a;
  --border:          #1a1a1a;
  --text:            #ffffff;
  --text-muted:      #555555;
}
```

### Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / Headlines | DM Sans | 800, tight tracking (-0.03em) | Page titles, section headers |
| Body | DM Sans | 400 / 500 | All UI text, descriptions |
| Data / Numbers | Geist Mono | 700 | Rate values, multipliers, stats, OTP input |
| Editorial accent | Instrument Serif italic | 400 | Testimonials, pull quotes on public pages |

Never use Inter, Roboto, Arial, or system-ui as a visible typeface.

### The Hero Component — Rate Comparison Card

The most important UI element on the site. Rules:
- Rate values in Geist Mono, large (28px+)
- Market rate shown struck-through and faded
- Multiplier (e.g. 3.5×) is the visual star — gradient fill, 36px+, impossible to miss
- Bar chart below shows the ratio, fills via CSS animation on enter
- `NumberTicker` (MagicUI) animates the multiplier from 0 → final value on scroll enter
- Works in both light and dark modes (dark card uses `#000` bg + `#1a1a1a` border)

### Skeleton Loaders

Every data-loaded component has a shape-matched skeleton — not generic grey bars. Rules:
- Skeletons mirror the exact layout of the content they replace (same columns, same avatar position, same badge shape)
- Shimmer animation: horizontal sweep left-to-right at 1.4s ease-in-out
- Applied to: rate cards, dashboard project rows, vendor table, document list, portfolio grid, notification list
- No spinners anywhere in the app — skeletons only

### Dark Mode

- Managed by `next-themes` with `attribute="class"` strategy — no flash on load
- Toggle in the site header (sun/moon icon, shadcn `Switch`)
- `200ms` CSS transition on `background-color`, `color`, `border-color` for smooth crossfade
- Dark mode uses pure `#000000` background — same accent color (`#c0392b`) works on both modes
- All shadcn components inherit the CSS variable system — no per-component dark overrides needed

### Dashboard Shell (Cloudflare-inspired)

- Left sidebar: `#000` background, `#1a1a1a` borders, `10px` uppercase section labels in `#333`
- Active nav item: left `2px` accent border, full-width `#0a0a0a` highlight
- Stats: large Geist Mono numbers on `#0a0a0a` cards with `#1a1a1a` borders
- Multiplier stat uses the full `--accent-gradient` text fill

### Animation Strategy

| Moment | Technique | Library |
|---|---|---|
| Rate multiplier on scroll | NumberTicker 0 → X over 800ms ease-out | MagicUI |
| Rate bar chart fill | CSS `@keyframes` width 0 → final, 600ms | CSS only |
| Dashboard cards enter | FadeIn stagger, 60ms delay per item | Motion |
| CTA section border | BorderBeam animated border glow | MagicUI |
| All loading states | Shape-matched shimmer skeletons | Custom CSS |
| Dark/light toggle | 200ms CSS transition on color vars | next-themes |
| Page transitions | Fade + slight translateY, 150ms | Motion |

### Component Conventions

- **Buttons:** Primary = `--accent` fill, white text. Ghost = transparent + `--border`. No rounded-full on desktop.
- **Badges:** Pill shape (`border-radius: 999px`), always paired with a 5px dot indicator for status badges.
- **Inputs:** 1px `--border`, focus ring = `--accent` at 8% opacity. Font-family `Geist Mono` for OTP/code inputs only.
- **Tables:** Cloudflare-style — `10px` uppercase column headers, `1px` row dividers, hover row highlight `--bg-subtle`.
- **Cards:** Same background as page (`--bg`), `1px solid --border`, `6px` border-radius. No drop shadows on cards — borders only.

---

## 16. Out of Scope (Future Phase)

- Payment integration (deposit / invoice collection)
- Regional language support (Hindi, Kannada, Bengali)
- Mobile app
- Dedicated city landing pages for local SEO
