# MG Arts — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Turborepo monorepo, scaffold apps/web (Next.js 16) and apps/cms (PayloadCMS 3.x) as separate deployable apps, configure the full UI system (Tailwind v4, shadcn, dark mode), and define all 12 Payload collections + 4 globals connected to NeonDB.

**Architecture:** Two separate Next.js apps in a Turborepo monorepo — `apps/cms` is a standalone PayloadCMS 3.x app (admin + REST API at `cms.mgarts.co.in`), `apps/web` is the public-facing Next.js 16 app that calls `apps/cms` via Payload's REST API. Three shared packages: `packages/ui` (components + tokens), `packages/types` (Payload-generated types), `packages/email` (React Email templates).

**Tech Stack:** pnpm workspaces, Turborepo 2.x, Next.js 16, PayloadCMS 3.x, `@payloadcms/db-postgres` (Drizzle), NeonDB, `@payloadcms/storage-s3`, Tailwind CSS v4, shadcn/ui (new-york style), next-themes, Vitest + React Testing Library, DM Sans + Geist Mono + Instrument Serif (Google Fonts).

---

## File Map

```
mg-arts/
├── package.json                          # pnpm workspaces root
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── .env.example
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── components.json               # shadcn config
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx            # Root layout + ThemeProvider
│   │       │   ├── globals.css           # Tailwind v4 + CSS design tokens
│   │       │   ├── page.tsx              # Placeholder homepage
│   │       │   ├── sitemap.ts            # Dynamic sitemap
│   │       │   └── robots.ts             # robots.txt
│   │       ├── components/
│   │       │   ├── providers.tsx         # ThemeProvider wrapper
│   │       │   ├── theme-toggle.tsx      # Dark/light toggle button
│   │       │   └── ui/                   # shadcn components (auto-generated)
│   │       └── lib/
│   │           └── cms.ts                # Payload REST API client
│   └── cms/
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── payload.config.ts             # PayloadCMS root config
│       └── src/
│           ├── app/
│           │   ├── layout.tsx
│           │   └── (payload)/
│           │       ├── admin/[[...segments]]/
│           │       │   ├── page.tsx
│           │       │   └── not-found.tsx
│           │       └── api/[...slug]/
│           │           └── route.ts
│           └── collections/
│               ├── Users.ts
│               ├── Projects.ts
│               ├── Documents.ts
│               ├── Inquiries.ts
│               ├── Vendors.ts
│               ├── VendorFieldSchema.ts
│               ├── RateItems.ts
│               ├── Notices.ts
│               ├── PortfolioProjects.ts
│               ├── Brands.ts
│               ├── ArchitectResources.ts
│               ├── Services.ts
│               └── globals/
│                   ├── LandingPage.ts
│                   ├── AboutPage.ts
│                   ├── PmcPage.ts
│                   └── SiteSettings.ts
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── skeleton.tsx
│   │       └── __tests__/
│   │           └── skeleton.test.tsx
│   ├── types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts                  # Re-exports from apps/cms payload-types.ts
│   └── email/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts                  # Placeholder — populated in Plan 6
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```

---

## Task 1: Initialize Turborepo Monorepo Root

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "mg-arts",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "^5.5.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 2: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 4: Create `.gitignore`**

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
dist/
.turbo/

# Environment
.env
.env.local
.env.production
.env*.local

# Payload
apps/cms/src/payload-types.ts

# Misc
.DS_Store
*.log
.superpowers/
```

- [ ] **Step 5: Create root `.env.example`**

```bash
# NeonDB (shared by both apps)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# PayloadCMS
PAYLOAD_SECRET=change-me-to-a-random-32-char-string
NEXT_PUBLIC_CMS_URL=http://localhost:3001

# AWS S3
S3_BUCKET=mg-arts-uploads
S3_REGION=ap-south-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Resend (used in Plan 6)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=noreply@mgarts.co.in

# BetterAuth (used in Plan 2)
BETTER_AUTH_SECRET=change-me-to-another-random-32-char-string
BETTER_AUTH_URL=http://localhost:3000
```

- [ ] **Step 6: Install root dependencies and verify**

```bash
pnpm install
```

Expected: `node_modules/` created at root, `turbo` available.

---

## Task 2: Scaffold apps/web (Next.js 16)

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tsconfig.json`

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "@mg-arts/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "@mg-arts/ui": "workspace:*",
    "@mg-arts/types": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create `apps/web/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@mg-arts/ui": ["../../packages/ui/src/index.ts"],
      "@mg-arts/types": ["../../packages/types/src/index.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `apps/web/next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@mg-arts/ui', '@mg-arts/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.S3_BUCKET
          ? `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION ?? 'ap-south-1'}.amazonaws.com`
          : '*.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 4: Install web dependencies**

```bash
cd apps/web && pnpm install
```

---

## Task 3: Scaffold apps/cms (PayloadCMS 3.x)

**Files:**
- Create: `apps/cms/package.json`
- Create: `apps/cms/tsconfig.json`
- Create: `apps/cms/next.config.ts`
- Create: `apps/cms/src/app/layout.tsx`
- Create: `apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- Create: `apps/cms/src/app/(payload)/api/[...slug]/route.ts`

- [ ] **Step 1: Create `apps/cms/package.json`**

```json
{
  "name": "@mg-arts/cms",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "generate:types": "payload generate:types",
    "db:migrate": "payload migrate",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "payload": "^3.0.0",
    "@payloadcms/next": "^3.0.0",
    "@payloadcms/db-postgres": "^3.0.0",
    "@payloadcms/storage-s3": "^3.0.0",
    "@payloadcms/richtext-lexical": "^3.0.0",
    "@mg-arts/types": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create `apps/cms/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./payload.config.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "payload.config.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `apps/cms/next.config.ts`**

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default withPayload(nextConfig)
```

- [ ] **Step 4: Create `apps/cms/src/app/layout.tsx`**

```tsx
import React from 'react'

export const metadata = {
  title: 'MG Arts CMS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Create `apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx`**

```tsx
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export const generateMetadata = ({ params }: any) =>
  generatePageMetadata({ params, importMap })

export default function Page({ params, searchParams }: any) {
  return RootPage({ params, searchParams, importMap })
}
```

- [ ] **Step 6: Create `apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx`**

```tsx
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export default function NotFound() {
  return NotFoundPage({ importMap })
}
```

- [ ] **Step 7: Create `apps/cms/src/app/(payload)/api/[...slug]/route.ts`**

```ts
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import configPromise from '@payload-config'

export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const DELETE = REST_DELETE(configPromise)
export const PATCH = REST_PATCH(configPromise)
export const PUT = REST_PUT(configPromise)
export const OPTIONS = REST_OPTIONS(configPromise)
```

- [ ] **Step 8: Create `apps/cms/src/app/(payload)/importMap.ts`**

```ts
export const importMap = {}
```

- [ ] **Step 9: Install cms dependencies**

```bash
cd apps/cms && pnpm install
```

---

## Task 4: Create Shared Packages

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/skeleton.tsx`
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/index.ts`
- Create: `packages/email/package.json`
- Create: `packages/email/tsconfig.json`
- Create: `packages/email/src/index.ts`

- [ ] **Step 1: Create `packages/ui/package.json`**

```json
{
  "name": "@mg-arts/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Create `packages/ui/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `packages/ui/src/skeleton.tsx`**

```tsx
import React from 'react'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

export function SkeletonLine({ width = '100%', height = 12 }: { width?: string | number; height?: number }) {
  return <Skeleton style={{ width, height, borderRadius: 4, marginBottom: 8 }} />
}

export function SkeletonAvatar({ size = 36 }: { size?: number }) {
  return <Skeleton style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />
}

export function SkeletonBadge() {
  return <Skeleton style={{ height: 20, width: 70, borderRadius: 999 }} />
}
```

- [ ] **Step 4: Create `packages/ui/src/index.ts`**

```ts
export { Skeleton, SkeletonLine, SkeletonAvatar, SkeletonBadge } from './skeleton'
```

- [ ] **Step 5: Create `packages/types/package.json`**

```json
{
  "name": "@mg-arts/types",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 6: Create `packages/types/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["esnext"],
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 7: Create `packages/types/src/index.ts`** (placeholder — populated after Payload generates types)

```ts
// Auto-generated Payload types are copied here after running:
// pnpm --filter @mg-arts/cms generate:types
// Then exported from this package for use in apps/web

export type UserRole = 'client' | 'architect' | 'admin'

export type ProjectStatus = 'inquiry' | 'quoted' | 'active' | 'completed'

export type VendorStatus = 'pending' | 'approved' | 'rejected'

export type DocumentLabel = 'requirement' | 'quote' | 'boq' | 'drawing' | 'other'

export type DocumentVisibility = 'client' | 'architect' | 'admin' | 'all'

export type NoticeTargetRole = 'all' | 'client' | 'architect'
```

- [ ] **Step 8: Create `packages/email/package.json`**

```json
{
  "name": "@mg-arts/email",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@react-email/components": "^0.0.22",
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 9: Create `packages/email/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "esnext"],
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 10: Create `packages/email/src/index.ts`** (placeholder — populated in Plan 6)

```ts
// Email templates — implemented in Plan 6
export {}
```

- [ ] **Step 11: Install all package dependencies from root**

```bash
pnpm install
```

Expected: All workspaces resolved, `@mg-arts/ui`, `@mg-arts/types`, `@mg-arts/email` available as workspace packages.

---

## Task 4.5: Configure Vitest Across Workspaces

**Files:**
- Create: `vitest.workspace.ts` (root)
- Create: `apps/web/vitest.config.ts`
- Create: `apps/cms/vitest.config.ts`
- Create: `packages/ui/vitest.config.ts`
- Create: `packages/ui/src/__tests__/skeleton.test.tsx`
- Modify: `turbo.json` (add test task)

- [ ] **Step 1: Install Vitest and React Testing Library in root devDependencies**

```bash
pnpm add -D -w vitest @vitest/ui @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 2: Create root `vitest.workspace.ts`**

```ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'apps/web/vitest.config.ts',
  'apps/cms/vitest.config.ts',
  'packages/ui/vitest.config.ts',
])
```

- [ ] **Step 3: Create `apps/web/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'web',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      exclude: ['src/app/**', 'src/components/ui/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 4: Create `apps/web/src/test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Create `apps/cms/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'cms',
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 6: Create `packages/ui/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'ui',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../../apps/web/src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 7: Write the first failing test — Skeleton component**

Create `packages/ui/src/__tests__/skeleton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton, SkeletonLine, SkeletonAvatar, SkeletonBadge } from '../skeleton'

describe('Skeleton', () => {
  it('renders with skeleton class', () => {
    render(<Skeleton />)
    expect(document.querySelector('.skeleton')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Skeleton className="my-class" />)
    expect(document.querySelector('.skeleton.my-class')).toBeInTheDocument()
  })

  it('is hidden from assistive technology', () => {
    render(<Skeleton />)
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})

describe('SkeletonLine', () => {
  it('renders with custom width', () => {
    render(<SkeletonLine width="60%" />)
    const el = document.querySelector('.skeleton') as HTMLElement
    expect(el.style.width).toBe('60%')
  })
})

describe('SkeletonAvatar', () => {
  it('renders as a circle', () => {
    render(<SkeletonAvatar size={40} />)
    const el = document.querySelector('.skeleton') as HTMLElement
    expect(el.style.borderRadius).toBe('50%')
    expect(el.style.width).toBe('40px')
  })
})
```

- [ ] **Step 8: Run the test — verify it fails first (Skeleton not yet connected to DOM)**

```bash
pnpm --filter @mg-arts/ui test
```

Expected: Tests pass immediately because Skeleton is already implemented in Task 4. If they fail, the Skeleton component has a bug — fix it before proceeding.

- [ ] **Step 9: Add `test` task to `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

Also add to root `package.json` scripts:

```json
"test": "turbo test",
"test:watch": "turbo test:watch",
"test:ui": "vitest --ui"
```

And to each app's `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 10: Run all tests from root to verify workspace config**

```bash
pnpm test
```

Expected output:
```
@mg-arts/ui  ✓ skeleton.test.tsx (3 tests)
Test Files   1 passed (1)
Tests        3 passed (3)
```

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: add Vitest workspace config with React Testing Library across all packages"
```

---

## Task 5: Configure Tailwind v4 + Design Tokens

**Files:**
- Create: `apps/web/src/app/globals.css`
- Modify: `apps/web/package.json` (add tailwindcss)

- [ ] **Step 1: Add Tailwind v4 to apps/web**

```bash
cd apps/web && pnpm add tailwindcss@next @tailwindcss/postcss@next postcss
```

- [ ] **Step 2: Create `apps/web/postcss.config.mjs`**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

- [ ] **Step 3: Create `apps/web/src/app/globals.css`**

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900&family=Geist+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

@theme {
  /* Backgrounds — strict: white or black only */
  --color-bg: #ffffff;
  --color-bg-subtle: #f9f9f9;
  --color-bg-dark: #000000;
  --color-bg-subtle-dark: #0a0a0a;

  /* Borders */
  --color-border: #e5e5e5;
  --color-border-dark: #1a1a1a;

  /* Text */
  --color-text: #0a0a0a;
  --color-text-muted: #6b6b6b;
  --color-text-dark: #ffffff;
  --color-text-muted-dark: #555555;

  /* Accent */
  --color-accent: #c0392b;
  --color-accent-warm: #e05b2b;
  --color-accent-hover: #a0302a;

  /* Typography */
  --font-sans: 'DM Sans', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --font-serif: 'Instrument Serif', serif;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}

/* CSS custom properties for runtime theme switching */
:root {
  --bg: var(--color-bg);
  --bg-subtle: var(--color-bg-subtle);
  --border: var(--color-border);
  --text: var(--color-text);
  --text-muted: var(--color-text-muted);
  color-scheme: light;
}

.dark {
  --bg: var(--color-bg-dark);
  --bg-subtle: var(--color-bg-subtle-dark);
  --border: var(--color-border-dark);
  --text: var(--color-text-dark);
  --text-muted: var(--color-text-muted-dark);
  color-scheme: dark;
}

/* Smooth theme transitions */
*, *::before, *::after {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease;
}

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    color-mix(in srgb, var(--bg-subtle) 50%, white) 50%,
    var(--bg-subtle) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 4px;
}

.dark .skeleton {
  background: linear-gradient(
    90deg,
    #0a0a0a 25%,
    #141414 50%,
    #0a0a0a 75%
  );
  background-size: 800px 100%;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Task 6: Initialize shadcn/ui

**Files:**
- Create: `apps/web/components.json`
- Create: `apps/web/src/lib/utils.ts`
- Create: `apps/web/src/components/ui/button.tsx` (via shadcn CLI)

- [ ] **Step 1: Install shadcn dependencies**

```bash
cd apps/web && pnpm add class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-slot
```

- [ ] **Step 2: Create `apps/web/src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Create `apps/web/components.json`** (shadcn config)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **Step 4: Add core shadcn components via CLI**

```bash
cd apps/web && pnpm dlx shadcn@latest add button input label badge separator sheet dialog dropdown-menu table skeleton toast
```

Expected: Components created under `src/components/ui/`.

- [ ] **Step 5: Override shadcn Button to use accent color**

In `src/components/ui/button.tsx`, locate the `variants` definition and update the `default` variant:

```ts
default: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-xs',
```

---

## Task 7: Set Up next-themes Dark Mode

**Files:**
- Create: `apps/web/src/components/providers.tsx`
- Create: `apps/web/src/components/theme-toggle.tsx`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Install next-themes**

```bash
cd apps/web && pnpm add next-themes
```

- [ ] **Step 2: Create `apps/web/src/components/providers.tsx`**

```tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/components/theme-toggle.tsx`**

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
```

- [ ] **Step 4: Create `apps/web/src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Create placeholder `apps/web/src/app/page.tsx`**

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          MG Arts
        </h1>
        <ThemeToggle />
      </div>
      <p style={{ color: 'var(--text-muted)' }}>
        Foundation ready. Plans 2–6 to follow.
      </p>
    </main>
  )
}
```

- [ ] **Step 6: Verify dark mode works**

```bash
pnpm dev
```

Open `http://localhost:3000`. Toggle the theme button. Background must switch between `#ffffff` and `#000000`. No dark blues or greys.

---

## Task 8: Configure PayloadCMS with NeonDB

**Files:**
- Create: `apps/cms/payload.config.ts`
- Create: `apps/cms/.env.local` (from root `.env.example`)

- [ ] **Step 1: Copy environment file for apps/cms**

```bash
cp .env.example apps/cms/.env.local
cp .env.example apps/web/.env.local
```

Fill in real values for `DATABASE_URL`, `PAYLOAD_SECRET`, `S3_*` from your NeonDB and AWS consoles.

- [ ] **Step 2: Create `apps/cms/payload.config.ts`**

```ts
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './src/collections/Users'
import { Projects } from './src/collections/Projects'
import { Documents } from './src/collections/Documents'
import { Inquiries } from './src/collections/Inquiries'
import { Vendors } from './src/collections/Vendors'
import { VendorFieldSchema } from './src/collections/VendorFieldSchema'
import { RateItems } from './src/collections/RateItems'
import { Notices } from './src/collections/Notices'
import { PortfolioProjects } from './src/collections/PortfolioProjects'
import { Brands } from './src/collections/Brands'
import { ArchitectResources } from './src/collections/ArchitectResources'
import { Services } from './src/collections/Services'
import { LandingPage } from './src/collections/globals/LandingPage'
import { AboutPage } from './src/collections/globals/AboutPage'
import { PmcPage } from './src/collections/globals/PmcPage'
import { SiteSettings } from './src/collections/globals/SiteSettings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— MG Arts CMS',
    },
  },
  collections: [
    Users,
    Projects,
    Documents,
    Inquiries,
    Vendors,
    VendorFieldSchema,
    RateItems,
    Notices,
    PortfolioProjects,
    Brands,
    ArchitectResources,
    Services,
  ],
  globals: [LandingPage, AboutPage, PmcPage, SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        region: process.env.S3_REGION ?? 'ap-south-1',
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(__dirname, 'src/payload-types.ts'),
  },
  cors: [process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'],
})
```

---

## Task 9: Define Users, Projects, Documents, Inquiries Collections

**Files:**
- Create: `apps/cms/src/collections/Users.ts`
- Create: `apps/cms/src/collections/Projects.ts`
- Create: `apps/cms/src/collections/Documents.ts`
- Create: `apps/cms/src/collections/Inquiries.ts`

- [ ] **Step 1: Create `apps/cms/src/collections/Users.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'approved'],
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Architect', value: 'architect' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'firmName',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.role === 'architect',
        description: 'Architecture firm name',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Architects must be approved before accessing the PMC dashboard',
      },
    },
  ],
}
```

- [ ] **Step 2: Create `apps/cms/src/collections/Projects.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'city', 'updatedAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return {
        or: [
          { client: { equals: req.user.id } },
          { architect: { equals: req.user.id } },
        ],
      }
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: { role: { equals: 'client' } },
    },
    {
      name: 'architect',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: { role: { equals: 'architect' } },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'inquiry',
      options: [
        { label: 'Inquiry', value: 'inquiry' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'city', type: 'text', required: true },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        condition: (_, __, { user }) => user?.role === 'admin',
        description: 'Internal notes — visible to admin only',
      },
    },
  ],
}
```

- [ ] **Step 3: Create `apps/cms/src/collections/Documents.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'project', 'uploadedBy', 'visibleTo', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      // Client sees visibleTo:'all' OR visibleTo:'client'
      // Architect sees visibleTo:'all' OR visibleTo:'architect'
      // Project-level filtering is enforced in apps/web at the API call layer
      return {
        or: [
          { visibleTo: { equals: 'all' } },
          { visibleTo: { equals: req.user.role } },
        ],
      }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    { name: 'fileUrl', type: 'text', required: true, admin: { description: 'S3 object key' } },
    { name: 'fileType', type: 'text', required: true, admin: { description: 'e.g. pdf, dwg, jpg' } },
    { name: 'fileName', type: 'text', required: true },
    {
      name: 'label',
      type: 'select',
      required: true,
      defaultValue: 'requirement',
      options: [
        { label: 'Requirement', value: 'requirement' },
        { label: 'Quote', value: 'quote' },
        { label: 'BOQ', value: 'boq' },
        { label: 'Drawing', value: 'drawing' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'visibleTo',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Architect', value: 'architect' },
        { label: 'Admin Only', value: 'admin' },
        { label: 'All Parties', value: 'all' },
      ],
    },
  ],
}
```

- [ ] **Step 4: Create `apps/cms/src/collections/Inquiries.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'source', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { user: { equals: req.user.id } }
    },
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      options: [
        { label: 'Contact Page', value: 'contact' },
        { label: 'Landing Page', value: 'landing' },
        { label: 'Rates Page', value: 'rates' },
        { label: 'PMC Page', value: 'pmc' },
      ],
    },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Converted', value: 'converted' },
      ],
    },
  ],
}
```

---

## Task 10: Define Vendors, VendorFieldSchema, RateItems, Notices Collections

**Files:**
- Create: `apps/cms/src/collections/Vendors.ts`
- Create: `apps/cms/src/collections/VendorFieldSchema.ts`
- Create: `apps/cms/src/collections/RateItems.ts`
- Create: `apps/cms/src/collections/Notices.ts`

- [ ] **Step 1: Create `apps/cms/src/collections/Vendors.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tradeType', 'city', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'tradeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Plumber', value: 'plumber' },
        { label: 'Electrician', value: 'electrician' },
        { label: 'Carpenter', value: 'carpenter' },
        { label: 'Civil Contractor', value: 'civil' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'city', type: 'text', required: true },
    { name: 'licenseFile', type: 'text', admin: { description: 'S3 key for uploaded license document' } },
    {
      name: 'extraFields',
      type: 'json',
      admin: { description: 'Dynamic attributes defined in VendorFieldSchema' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create `apps/cms/src/collections/VendorFieldSchema.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const VendorFieldSchema: CollectionConfig = {
  slug: 'vendor-field-schema',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'fieldType', 'required', 'active', 'order'],
    description: 'Define extra fields for the vendor registration form. Drag to reorder.',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'label', type: 'text', required: true, admin: { description: 'Shown on the registration form' } },
    { name: 'fieldKey', type: 'text', required: true, unique: true, admin: { description: 'JSON key stored in vendor.extraFields' } },
    {
      name: 'fieldType',
      type: 'select',
      required: true,
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Select (dropdown)', value: 'select' },
        { label: 'File upload', value: 'file' },
      ],
    },
    {
      name: 'options',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData?.fieldType === 'select' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Lower = shown first' } },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide from form without deleting' } },
  ],
}
```

- [ ] **Step 3: Create `apps/cms/src/collections/RateItems.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const RateItems: CollectionConfig = {
  slug: 'rate-items',
  admin: {
    useAsTitle: 'serviceLabel',
    defaultColumns: ['serviceLabel', 'category', 'mgArtsRate', 'marketRate', 'withMaterial'],
    description: 'Rate comparison chart data. Both MG Arts and market rates managed here.',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Civil', value: 'civil' },
        { label: 'Electrical', value: 'electrical' },
        { label: 'Plumbing', value: 'plumbing' },
        { label: 'Carpentry', value: 'carpentry' },
      ],
    },
    { name: 'serviceLabel', type: 'text', required: true, admin: { description: 'e.g. "False Ceiling — Gypsum Board (per sqft)"' } },
    { name: 'unit', type: 'text', required: true, admin: { description: 'e.g. sqft, running ft, point, unit' } },
    { name: 'mgArtsRate', type: 'number', required: true, admin: { description: 'MG Arts rate in ₹' } },
    { name: 'marketRate', type: 'number', required: true, admin: { description: 'Current market benchmark rate in ₹' } },
    { name: 'withMaterial', type: 'checkbox', defaultValue: true, admin: { description: 'Check if this rate includes materials' } },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 4: Create `apps/cms/src/collections/Notices.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Notices: CollectionConfig = {
  slug: 'notices',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'targetRole', 'sentAt', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (doc.sendEmail && !doc.sentAt && (operation === 'create' || operation === 'update')) {
          // Email blast hook — implemented in Plan 6
          // Sets sentAt to prevent duplicate sends
          console.log('[Notices] Email blast queued for notice:', doc.id)
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText', required: true },
    { name: 'active', type: 'checkbox', defaultValue: false, admin: { description: 'Shows banner on all public pages when checked' } },
    { name: 'sendEmail', type: 'checkbox', defaultValue: false, admin: { description: 'Send email blast to registered users on publish (once only)' } },
    { name: 'sentAt', type: 'date', admin: { description: 'Auto-stamped on first send to prevent duplicates', readOnly: true } },
    {
      name: 'targetRole',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All registered users', value: 'all' },
        { label: 'Clients only', value: 'client' },
        { label: 'Architects only', value: 'architect' },
      ],
    },
  ],
}
```

---

## Task 11: Define PortfolioProjects, Brands, ArchitectResources, Services Collections

**Files:**
- Create: `apps/cms/src/collections/PortfolioProjects.ts`
- Create: `apps/cms/src/collections/Brands.ts`
- Create: `apps/cms/src/collections/ArchitectResources.ts`
- Create: `apps/cms/src/collections/Services.ts`

- [ ] **Step 1: Create `apps/cms/src/collections/PortfolioProjects.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'category', 'year', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug — auto-generated from title, can be edited' },
    },
    { name: 'city', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Hospitality', value: 'hospitality' },
      ],
    },
    { name: 'year', type: 'number', required: true },
    {
      name: 'photos',
      type: 'array',
      fields: [{ name: 'url', type: 'text', required: true, admin: { description: 'S3 key or public URL' } }],
    },
    { name: 'brands', type: 'relationship', relationTo: 'brands', hasMany: true },
    { name: 'description', type: 'richText', required: true },
    { name: 'collaborator', type: 'text', admin: { description: 'e.g. "Design Core"' } },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDesc', type: 'textarea' },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.slug && data.title) {
          data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
        return data
      },
    ],
  },
}
```

- [ ] **Step 2: Create `apps/cms/src/collections/Brands.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'visible', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'text', required: true, admin: { description: 'S3 key for brand logo image' } },
    { name: 'authLetter', type: 'text', admin: { description: 'S3 key for authorization letter PDF' } },
    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide from site without deleting' } },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 3: Create `apps/cms/src/collections/ArchitectResources.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const ArchitectResources: CollectionConfig = {
  slug: 'architect-resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'active', 'order'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin' || req.user.role === 'architect'
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'BOQ Template', value: 'boq-template' },
        { label: 'Rate Sheet', value: 'rate-sheet' },
        { label: 'Guideline', value: 'guideline' },
      ],
    },
    { name: 'fileUrl', type: 'text', required: true, admin: { description: 'S3 key for the resource file' } },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 4: Create `apps/cms/src/collections/Services.ts`**

```ts
import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'withMaterial', 'active', 'order'],
    description: 'CMS-editable /services page. Add, remove, or reorder at any time.',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText', required: true },
    { name: 'icon', type: 'text', admin: { description: 'S3 key for optional service icon' } },
    { name: 'withMaterial', type: 'checkbox', defaultValue: true },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

---

## Task 12: Define the 4 Globals

**Files:**
- Create: `apps/cms/src/collections/globals/LandingPage.ts`
- Create: `apps/cms/src/collections/globals/AboutPage.ts`
- Create: `apps/cms/src/collections/globals/PmcPage.ts`
- Create: `apps/cms/src/collections/globals/SiteSettings.ts`

- [ ] **Step 1: Create `apps/cms/src/collections/globals/LandingPage.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  admin: { description: 'Block-based landing page — reorder, add, or remove sections freely.' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'hero',
          fields: [
            { name: 'headline', type: 'text', required: true },
            { name: 'subheadline', type: 'text' },
            { name: 'ctaLabel', type: 'text', defaultValue: 'Get a Free Quote' },
            { name: 'ctaHref', type: 'text', defaultValue: '/contact' },
          ],
        },
        {
          slug: 'value-props',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
          ],
        },
        {
          slug: 'rate-teaser',
          fields: [
            { name: 'headline', type: 'text', defaultValue: 'Transparent Pricing' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          slug: 'cta-banner',
          fields: [
            { name: 'headline', type: 'text', required: true },
            { name: 'ctaLabel', type: 'text' },
            { name: 'ctaHref', type: 'text' },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create `apps/cms/src/collections/globals/AboutPage.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'headline', type: 'text', defaultValue: 'About MG Arts' },
    { name: 'story', type: 'richText' },
    {
      name: 'teamMembers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'photo', type: 'text', admin: { description: 'S3 key' } },
      ],
    },
  ],
}
```

- [ ] **Step 3: Create `apps/cms/src/collections/globals/PmcPage.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const PmcPage: GlobalConfig = {
  slug: 'pmc-page',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'headline', type: 'text', defaultValue: 'Project Management Consultancy' },
    { name: 'description', type: 'richText' },
    {
      name: 'pmcServices',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'pastCollaborators',
      type: 'array',
      admin: { description: 'Architect firms MG Arts has worked with' },
      fields: [
        { name: 'firmName', type: 'text', required: true },
        { name: 'projectName', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'logo', type: 'text', admin: { description: 'S3 key (optional)' } },
      ],
    },
  ],
}
```

- [ ] **Step 4: Create `apps/cms/src/collections/globals/SiteSettings.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { description: 'Global site info — contact details, office addresses, social links.' },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'MG Arts' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'offices',
      type: 'array',
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
        { name: 'isVirtual', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'instagramUrl', type: 'text' },
    { name: 'linkedinUrl', type: 'text' },
    { name: 'whatsappNumber', type: 'text' },
  ],
}
```

---

## Task 13: CMS API Client + SEO Files in apps/web

**Files:**
- Create: `apps/web/src/lib/cms.ts`
- Create: `apps/web/src/app/sitemap.ts`
- Create: `apps/web/src/app/robots.ts`

- [ ] **Step 1: Create `apps/web/src/lib/cms.ts`**

```ts
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

async function fetchFromCMS<T>(
  endpoint: string,
  params: Record<string, string> = {},
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(`${CMS_URL}/api/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`CMS fetch failed: ${endpoint} — ${res.status}`)
  return res.json()
}

export async function getPortfolioProjectSlugs(): Promise<string[]> {
  const data = await fetchFromCMS<{ docs: { slug: string }[] }>('portfolio-projects', {
    limit: '1000',
    select: 'slug',
  })
  return data.docs.map((d) => d.slug)
}

export async function getSiteSettings() {
  return fetchFromCMS<{ siteName: string; phone: string; email: string }>('globals/site-settings')
}

export async function getActiveNotice() {
  const data = await fetchFromCMS<{ docs: { id: string; title: string; body: unknown }[] }>(
    'notices',
    { where: JSON.stringify({ active: { equals: true } }), sort: '-createdAt', limit: '1' }
  )
  return data.docs[0] ?? null
}
```

- [ ] **Step 2: Create `apps/web/src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { getPortfolioProjectSlugs } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mgarts.co.in'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/rates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pmc`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/vendors/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await getPortfolioProjectSlugs()
    projectRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // CMS unavailable during build — skip dynamic routes
  }

  return [...staticRoutes, ...projectRoutes]
}
```

- [ ] **Step 3: Create `apps/web/src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/auth/', '/admin/'],
      },
    ],
    sitemap: 'https://mgarts.co.in/sitemap.xml',
  }
}
```

---

## Task 14: Run Migrations + Generate Types + Smoke Test

- [ ] **Step 1: Start apps/cms in dev and run initial Payload migration**

```bash
pnpm --filter @mg-arts/cms dev
```

On first start, Payload will push the schema to NeonDB automatically via Drizzle. Wait for: `Payload CMS is now running on http://localhost:3001/admin`.

- [ ] **Step 2: Generate Payload TypeScript types**

In a second terminal:
```bash
pnpm --filter @mg-arts/cms generate:types
```

Expected: `apps/cms/src/payload-types.ts` created with types for all 12 collections + 4 globals.

- [ ] **Step 3: Start apps/web in dev**

```bash
pnpm --filter @mg-arts/web dev
```

Expected: `http://localhost:3000` shows the placeholder page. Theme toggle switches between pure white and pure black backgrounds.

- [ ] **Step 4: Verify CMS admin**

Open `http://localhost:3001/admin`. Create the first admin user. Verify all 12 collections appear in the sidebar. Verify all 4 globals appear under Globals.

- [ ] **Step 5: Smoke test sitemap**

```bash
curl http://localhost:3000/sitemap.xml
```

Expected: Valid XML with all static routes. No 500 errors even if CMS is unreachable (try/catch in `sitemap.ts`).

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Turborepo monorepo with Next.js 16, PayloadCMS 3.x, Tailwind v4, shadcn, dark mode, all collections + globals"
```

---

## Task 15: Vercel Deployment Config

**Files:**
- Create: `apps/web/vercel.json`
- Create: `apps/cms/vercel.json`

- [ ] **Step 1: Create `apps/web/vercel.json`**

```json
{
  "buildCommand": "cd ../.. && pnpm build --filter @mg-arts/web",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Create `apps/cms/vercel.json`**

```json
{
  "buildCommand": "cd ../.. && pnpm build --filter @mg-arts/cms",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nextjs"
}
```

- [ ] **Step 3: Configure Vercel projects**

In Vercel dashboard:
1. Create project `mg-arts-web` → Root Directory: `apps/web` → add all `.env.example` vars
2. Create project `mg-arts-cms` → Root Directory: `apps/cms` → add all `.env.example` vars
3. Both projects share the same `DATABASE_URL` (NeonDB), `S3_*` vars, and `RESEND_API_KEY`
4. Set `NEXT_PUBLIC_CMS_URL=https://cms.mgarts.co.in` in `mg-arts-web`

- [ ] **Step 4: Commit**

```bash
git add apps/web/vercel.json apps/cms/vercel.json
git commit -m "chore: add Vercel deployment config for both apps"
```

---

## What's Next

Plan 1 produces: A running monorepo with both apps deployable to Vercel, the full design system in place, all Payload collections + globals defined on NeonDB, and the CMS admin accessible at `cms.mgarts.co.in/admin`.

**Remaining plans (each independent once Plan 1 + 2 are done):**

| Plan | Key deliverable |
|---|---|
| Plan 2 — Auth | BetterAuth magic link/OTP, `/auth` flow, middleware, dashboard shell |
| Plan 3 — Public Site | All 9 public pages, rate chart with NumberTicker + bar animations, SEO metadata |
| Plan 4 — Dashboards | Client + architect role-aware dashboard, S3 document upload/download |
| Plan 5 — Vendor Registration | Dynamic form from VendorFieldSchema, S3 license upload, approval emails |
| Plan 6 — Email + Notices | All 8 Resend templates, notice banner, email blast on Notices publish |
