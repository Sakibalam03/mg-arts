# BetterAuth via payload-auth Plugin — Design Spec

**Date:** 2026-06-06
**Status:** Approved

---

## Goal

Replace Payload CMS's native authentication with BetterAuth via the `payload-auth` plugin. Users authenticate via 6-digit email OTP (delivered by Resend) or Google OAuth. The Payload admin panel (`/cms`) uses the same BetterAuth session. Frontend dashboard routes (`/dashboard/*`) are protected by Next.js middleware.

---

## Architecture

Single auth system — `payload-auth` plugin added to `payload.config.ts`. It uses Payload's existing NeonDB connection (Drizzle/Postgres) to create BetterAuth tables alongside Payload tables. No second database, no sync hooks.

```
payload.config.ts
  └── betterAuthPlugin({
        emailOTP  → Resend (6-digit, 10-min expiry)
        Google OAuth
        additionalFields: role, firmName, phone, approved
      })
          ├── Creates: user, session, account, verification tables in NeonDB
          └── Replaces Payload's native Users collection
```

**Request routing:**
```
/api/auth/[...all]/route.ts  ← BetterAuth catch-all (OTP send/verify, OAuth callbacks)
/cms/admin                   ← Payload admin (BetterAuth session, UI unchanged for now)
/dashboard/*                 ← Gated by Next.js middleware
/auth/*                      ← Public auth pages
```

---

## Auth Flows

### OTP Flow
1. User visits `/auth`, enters email
2. Click "Send OTP" → BetterAuth sends 6-digit code via Resend
3. User visits `/auth/verify`, enters code
4. On success → redirect to `/dashboard` (or `?next=` param if set)
5. New users are automatically created with `role: client`

### Google OAuth Flow
1. User clicks "Continue with Google" on `/auth`
2. Google OAuth redirect → BetterAuth callback
3. New user created with `role: client` → redirect `/dashboard`
4. Returning user → redirect `/dashboard` directly

### Role Assignment
- All new users get `role: client` automatically — no self-selection
- `architect` and `admin` roles are only assignable by an admin via the Payload CMS (`/cms`)
- No onboarding page needed

---

## Pages

### `/auth` — Entry
- "Continue with Google" button (full width)
- Divider
- Email input
- "Send OTP" button
- On submit: calls `authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })`

### `/auth/verify` — OTP Entry
- Shows masked email address
- 6-box OTP input (auto-advance on digit entry)
- "Verify" button
- "Resend code" link with 30-second cooldown
- Inline error on wrong code (no page reload)
- On success: redirects to `?next` param or `/dashboard`

---

## Middleware

File: `src/middleware.ts`

```
/dashboard/*
  → no session   → redirect /auth?next=<path>
  → session      → allow

/auth/*
  → session      → redirect /dashboard
  → no session   → allow

/cms/*, /api/*, everything else
  → allow (no middleware interference)
```

Session is read from the BetterAuth signed cookie — no DB call in middleware.

---

## Schema

### BetterAuth Tables (auto-created in NeonDB)

| Table | Purpose |
|---|---|
| `user` | Core user record — email, name, image + custom fields |
| `session` | Active sessions with expiry |
| `account` | Linked OAuth accounts (Google) |
| `verification` | OTP codes and tokens |

### Custom Fields (via `additionalFields` in `auth.ts`)

| Field | Type | Default | Notes |
|---|---|---|---|
| `role` | `select` | `client` | `client` \| `architect` \| `admin` |
| `firmName` | `text` | `null` | Architects only |
| `phone` | `text` | `null` | Optional |
| `approved` | `boolean` | `false` | Admin approves architects in `/cms` |

### `Users.ts` Collection
- Removed: `auth: true`, all field definitions
- Kept: `admin.useAsTitle`, `admin.defaultColumns`
- payload-auth plugin builds the full collection — `Users.ts` only provides display config

---

## Files Added / Changed

```
src/
├── lib/
│   ├── auth.ts                              # BetterAuth server instance
│   └── auth-client.ts                       # React client (useSession, signIn, signOut)
├── app/
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts                 # BetterAuth catch-all handler
│   └── (frontend)/
│       ├── auth/
│       │   ├── page.tsx                     # Email input + Google button
│       │   └── verify/
│       │       └── page.tsx                 # OTP entry
│       └── dashboard/
│           ├── layout.tsx                   # Protected shell (placeholder)
│           └── page.tsx                     # Dashboard home (placeholder)
├── middleware.ts                            # Route protection
└── collections/
    └── Users.ts                             # Stripped to display config only
payload.config.ts                            # + betterAuthPlugin(), remove auth:true
```

---

## Environment Variables

```bash
# BetterAuth
BETTER_AUTH_SECRET=          # random 32-char string (generate: openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend (already in env.example)
RESEND_API_KEY=
RESEND_FROM=noreply@mgarts.co.in
```

---

## Dependencies

```bash
pnpm add payload-auth better-auth resend
```

- `payload-auth` — latest v1.9.4
- `better-auth` — peer dep, >=1.4.0
- `resend` — email delivery

---

## Out of Scope

- Customising the Payload admin login UI (kept as-is for now)
- 2FA / passkey (can be added later as BetterAuth plugins)
- Email templates for OTP (plain Resend API call, styled templates in Plan 6)
- Dashboard page content (populated in Plan 4)
