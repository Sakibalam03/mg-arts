# MG Arts Landing Page Redesign

**Date:** 2026-06-09
**Status:** Approved — ready for implementation

---

## Overview

Full redesign of `src/app/(frontend)/(landing)/page.tsx` (and supporting components) into a modern, elegant Editorial Luxury aesthetic. Dark-first, Framer Motion animated, Aceternity ParallaxScroll portfolio section, full dark/light mode support.

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Aesthetic | Editorial Luxury | Dark background, italic serif headlines, restrained crimson accents — high-end architecture magazine feel |
| Hero layout | Centered Editorial | Pure typography, no hero image — maximum typographic impact; images land in the parallax section below |
| Animation library | Framer Motion | Already installed (v12.40.0); native React/Next.js integration |
| Portfolio section | Aceternity `ParallaxScroll` | 3-column grid, opposite-scroll directions, interior design photo showcase |
| Image source | Payload CMS → MinIO | Unsplash interior placeholders for now; real client photos later |
| Mode | Dark-first | Dark is primary; light mode uses existing CSS variables (pure white `#ffffff`) |

---

## Page Structure

```
01  Navigation          — existing SiteNav, unchanged
02  Hero                — Centered Editorial
03  Stats Bar           — Count-up animation on scroll
04  Portfolio Parallax  — Aceternity ParallaxScroll (NEW)
05  Services            — Numbered cards 01–04, staggered reveal
06  Rate Teaser         — Animated bars (Framer Motion)
07  CTA                 — Centered serif, fade-in
```

---

## Section Designs

### 02 · Hero — Centered Editorial

Layout: full-width, centered, `py-28` vertical padding.

Elements (top to bottom):
- **Eyebrow** — `"MG Arts · Est. 2014 · Pan-India"` · 9px · crimson · `tracking-[0.2em]` · uppercase
- **Headline** — `"Interiors That Execute."` · `clamp(3rem, 7vw, 5.5rem)` · Instrument Serif italic · white · `letter-spacing: -0.03em`
- **Crimson rule** — `width: 36px; height: 1px; background: #c0392b` · centered · `my-5`
- **Subheading** — existing copy · 14px · muted-foreground · max-width 420px · centered
- **CTAs** — `"Get a Free Quote"` (crimson filled) + `"See Our Rates →"` (ghost border) · `gap-3` · centered
- **Stats row** — `500+ Projects · 10+ Years · 3 Cities` · `mt-8 pt-6 border-t border-border` · centered · monospace numbers
- **Decorative vertical rules** — `position: absolute; left: 80px / right: 80px` · gradient from transparent → `#1a1a1a` → transparent · subtle depth

Animation (Framer Motion, `staggerChildren: 0.1`, spring easing):
1. Eyebrow: `opacity 0→1, y 10→0`
2. Headline: line-by-line stagger, `opacity 0→1, y 20→0`
3. Crimson rule: `scaleX 0→1` (transform-origin: center)
4. Subheading: `opacity 0→1, y 10→0`
5. CTAs: `opacity 0→1, y 10→0`
6. Stats: `opacity 0→1` with count-up numbers via `useMotionValue`

### 03 · Stats Bar

Dark band (`bg-secondary` / dark: `bg-[#0a0a0a]`), `border-y border-border`.

Three cells separated by vertical dividers:
- `500+` Projects Delivered
- `10+` Years of Experience
- `3` Cities Active

Numbers: monospace, 32px, white. The `+` suffix in crimson.

Animation: `whileInView` count-up from 0 → final value over 1.2s ease-out. `once: true`.

### 04 · Portfolio Parallax (NEW — Aceternity)

**Component:** `ParallaxScroll` from `src/components/ui/parallax-scroll.tsx` (copied verbatim from Aceternity registry).

Section header:
- Italic serif headline: `"Work that speaks for itself."`
- Subtext: `"Selected interior projects — residential & commercial."`

Images: 9 URLs passed via `images` prop.
- **Now:** 9 Unsplash interior design image URLs (hardcoded)
- **Later:** fetched from Payload CMS `Media` collection (tagged `interior`)

Bottom edge: CSS gradient mask (`linear-gradient(to bottom, transparent, background)`) so the grid bleeds cleanly into the next section without a hard cutoff.

The component creates 3 columns:
- Column 1: `translateY: 0 → -200px` on container scroll
- Column 2: `translateY: 0 → +200px` on container scroll
- Column 3: `translateY: 0 → -200px` on container scroll

Container height: `h-[40rem]` (default from component).

### 05 · Services — "Everything under one roof"

Headline: `"Everything under one roof."` · Instrument Serif italic · `clamp(1.75rem, 4vw, 2.5rem)`
Subtext: existing copy.

4-column grid (`grid-cols-4`, `max-lg:grid-cols-2`, `max-sm:grid-cols-1`), `gap-4`.

Each card:
- Large muted number `01`–`04` (28px monospace, `text-[#1a1a1a]` dark / `text-[#e5e5e5]` light)
- Service title (13px, semibold, white/foreground)
- Description (12px, muted-foreground)
- `border border-border rounded-lg p-6`
- Hover: crimson `2px` left border via `group-hover` + `transition-all`

Animation: `whileInView` staggered — each card `delay: index * 0.05s`, `opacity 0→1, y 20→0`. `once: true`.

### 06 · Rate Teaser

Dark full-bleed section (`bg-black-pure`, `border-y border-[#1a1a1a]`). Keeps existing structure, replaces CSS `rate-bar` animation with Framer Motion.

Header:
- Eyebrow: "Transparent Pricing" · crimson · uppercase
- Headline: `"Our rates vs. the market."` · Instrument Serif italic · white
- Subtext: "No hidden markups. No padding. Competitive by design." · muted

Rate rows (existing data: False Ceiling, Electrical Point):
- MG Arts price + market strikethrough
- Cost-effectiveness multiplier (`{multiplier}× more cost-effective`) with crimson gradient text
- **Animated bars:** `motion.div` with `initial={{ width: 0 }}` → `whileInView={{ width: '${pct}%' }}` · `transition={{ duration: 0.8, ease: 'easeOut' }}` · `once: true`

CTA link: "View Full Rate Chart →"

### 07 · CTA

Centered section, `py-24`.

- Serif italic note: `"Free site visit for projects above ₹5 lakhs."` · muted
- Headline: CMS `ctaHeading` or `"Ready to start your project?"` · Instrument Serif italic · `clamp(1.75rem, 4vw, 2.75rem)`
- CTAs: "Book a Free Consultation" (filled) + "Send a message" (ghost)

Animation: `whileInView`, `opacity 0→1, y 20→0`, `once: true`.

---

## Component Architecture

All sections become **client components** (need Framer Motion). The page remains a server component that fetches CMS data and passes it as props.

```
src/app/(frontend)/(landing)/page.tsx          — server component, data fetching (unchanged structure)
src/components/landing/hero-section.tsx     — "use client", Framer Motion
src/components/landing/stats-section.tsx    — "use client", count-up
src/components/landing/portfolio-parallax.tsx — "use client", wraps ParallaxScroll
src/components/landing/services-section.tsx — "use client", staggered grid
src/components/landing/rate-teaser.tsx      — "use client", animated bars
src/components/landing/cta-section.tsx      — "use client", fade-in
src/components/ui/parallax-scroll.tsx       — Aceternity component (new file)
```

Props flow: `page.tsx` fetches from CMS, passes typed props down to each section component.

---

## Animation System

All scroll animations use `whileInView` with `once: true` — no replay on scroll-up.
Viewport threshold: `amount: 0.2` (triggers when 20% of section is visible).

**Reduced motion:** Wrap all `motion` variants with `useReducedMotion()`. If true, skip transforms — only fade opacity.

```tsx
const prefersReduced = useReducedMotion()
const variants = {
  hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
  visible: { opacity: 1, y: 0 },
}
```

---

## Dark / Light Mode

The existing CSS variable system handles everything. No new tokens needed.

| Layer | Dark (default) | Light |
|-------|---------------|-------|
| Page background | `#000000` | `#ffffff` (existing token — no change) |
| Hero background | `#000000` | `#ffffff` |
| Card background | `#0a0a0a` | `#f9f9f9` (existing `--secondary`) |
| Foreground | `#ffffff` | `#0a0a0a` |
| Muted foreground | `#555555` | `#6b6b6b` |
| Border | `#1a1a1a` | `#e5e5e5` |
| Primary (crimson) | `#c0392b` | `#c0392b` (unchanged) |

---

## Unsplash Placeholder Images

9 images used in `PortfolioParallax` until real client photos are available:

```ts
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800',
  'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800',
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800',
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
]
```

When real images are available, `PortfolioParallax` will fetch from Payload `Media` collection via `getLandingPage()` or a dedicated `getPortfolioImages()` helper.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/app/(frontend)/(landing)/page.tsx` | Modify — replace inline JSX with imported section components |
| `src/components/landing/hero-section.tsx` | Create |
| `src/components/landing/stats-section.tsx` | Create |
| `src/components/landing/portfolio-parallax.tsx` | Create |
| `src/components/landing/services-section.tsx` | Create |
| `src/components/landing/rate-teaser.tsx` | Create |
| `src/components/landing/cta-section.tsx` | Create |
| `src/components/ui/parallax-scroll.tsx` | Create (Aceternity source) |

No new dependencies required. `framer-motion` v12 already installed.

---

## Out of Scope

- Nav redesign (existing `SiteNav` / `Header` unchanged)
- Footer redesign (existing `SiteFooter` unchanged)
- Other pages (about, contact, rates, projects)
- CMS schema changes
- Real image fetching from Payload (placeholder only for now)
