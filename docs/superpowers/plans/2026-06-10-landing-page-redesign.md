# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the MG Arts landing page (`/`) with an Editorial Luxury aesthetic — dark-first, Instrument Serif italic headlines, Framer Motion scroll animations, and an Aceternity ParallaxScroll interior photo showcase.

**Architecture:** Each page section becomes its own `"use client"` component under `src/components/landing/`. The page route (`page.tsx`) stays a server component that fetches CMS data and passes typed props down. The Aceternity `ParallaxScroll` primitive lives in `src/components/ui/` and is wrapped by the portfolio section component.

**Tech Stack:** Next.js 15, Framer Motion v12 (`framer-motion` + `motion/react` both available), Tailwind CSS v4, Instrument Serif italic (loaded in layout), Aceternity ParallaxScroll

---

## Design Refinement Note

The spec listed a standalone **Stats Bar** section (#03). Since the Centered Editorial hero already includes inline stats, a second stats section directly below would be redundant and visually awkward. **The Stats Bar is dropped.** Final page order:

```
01  Nav               — unchanged (SiteNav)
02  Hero              — Centered Editorial + Framer Motion entrance
03  Portfolio Parallax — Aceternity ParallaxScroll, 9 interior images
04  Services          — numbered cards 01–04, staggered reveal
05  Rate Teaser       — Framer Motion animated bars
06  CTA               — serif, fade-in on scroll
```

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/ui/parallax-scroll.tsx` | **Create** | Aceternity primitive (bug-fixed) |
| `src/components/landing/hero-section.tsx` | **Create** | Centered Editorial hero, staggered entrance |
| `src/components/landing/portfolio-parallax.tsx` | **Create** | Section wrapper around ParallaxScroll |
| `src/components/landing/services-section.tsx` | **Create** | 4-card numbered grid, staggered whileInView |
| `src/components/landing/rate-teaser.tsx` | **Create** | Animated rate comparison bars |
| `src/components/landing/cta-section.tsx` | **Create** | Final CTA, whileInView fade |
| `src/app/(frontend)/(landing)/page.tsx` | **Modify** | Replace inline JSX with section components |
| `src/app/(frontend)/styles.css` | **Modify** | Remove obsolete `.rate-bar` CSS animation |

---

## Task 1: ParallaxScroll primitive

**Files:**
- Create: `src/components/ui/parallax-scroll.tsx`

- [ ] **Step 1: Create the component**

  The original Aceternity source has a bug — it assigns the same `ref` to both the outer scrollable div and the inner grid div, causing the inner assignment to overwrite and break scroll tracking. Fix: only assign `ref={gridRef}` to the outer div.

  Create `src/components/ui/parallax-scroll.tsx`:

  ```tsx
  "use client";
  import { useScroll, useTransform, motion } from "framer-motion";
  import { useRef } from "react";
  import { cn } from "@/lib/utils";

  export function ParallaxScroll({
    images,
    className,
  }: {
    images: string[];
    className?: string;
  }) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef,
      offset: ["start start", "end start"],
    });

    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

    const third = Math.ceil(images.length / 3);
    const firstPart = images.slice(0, third);
    const secondPart = images.slice(third, 2 * third);
    const thirdPart = images.slice(2 * third);

    return (
      <div
        className={cn("h-[40rem] items-start overflow-y-auto w-full", className)}
        ref={gridRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10">
          <div className="grid gap-10">
            {firstPart.map((el, idx) => (
              <motion.div style={{ y: translateFirst }} key={"grid-1-" + idx}>
                <img
                  src={el}
                  className="h-80 w-full object-cover object-center rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                  alt="Interior design project"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {secondPart.map((el, idx) => (
              <motion.div style={{ y: translateSecond }} key={"grid-2-" + idx}>
                <img
                  src={el}
                  className="h-80 w-full object-cover object-center rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                  alt="Interior design project"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid gap-10">
            {thirdPart.map((el, idx) => (
              <motion.div style={{ y: translateThird }} key={"grid-3-" + idx}>
                <img
                  src={el}
                  className="h-80 w-full object-cover object-center rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                  alt="Interior design project"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors related to `parallax-scroll.tsx`.

---

## Task 2: HeroSection — Centered Editorial

**Files:**
- Create: `src/components/landing/hero-section.tsx`

- [ ] **Step 1: Create `src/components/landing/hero-section.tsx`**

  ```tsx
  "use client"

  import Link from "next/link"
  import { motion, useReducedMotion } from "framer-motion"

  interface HeroSectionProps {
    headline: string
    subheadline: string
    ctaText: string
    ctaHref: string
  }

  const STATS = [
    { value: "500+", label: "Projects Delivered" },
    { value: "10+", label: "Years of Experience" },
    { value: "3", label: "Cities Active" },
  ]

  export function HeroSection({ headline, subheadline, ctaText, ctaHref }: HeroSectionProps) {
    const prefersReduced = useReducedMotion()

    const container = {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
      },
    }

    const item = {
      hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      },
    }

    const rule = {
      hidden: { scaleX: 0, opacity: 0 },
      visible: {
        scaleX: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    }

    return (
      <section className="relative w-full overflow-hidden px-6 max-sm:px-4 pt-24 pb-20 max-lg:pt-16 max-lg:pb-14 max-sm:pt-12 max-sm:pb-10">
        {/* Decorative vertical rules — desktop only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-20 w-px bg-gradient-to-b from-transparent via-border to-transparent max-lg:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-20 w-px bg-gradient-to-b from-transparent via-border to-transparent max-lg:hidden"
        />

        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-6"
          >
            MG Arts · Est. 2014 · Pan-India
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-serif italic font-normal text-[clamp(3rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.03em] text-foreground whitespace-pre-line"
          >
            {headline}
          </motion.h1>

          {/* Crimson rule */}
          <motion.div
            variants={rule}
            style={{ originX: "50%" }}
            className="w-9 h-px bg-primary mx-auto mt-5 mb-5"
          />

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-[1rem] max-sm:text-[15px] text-muted-foreground leading-relaxed max-w-[420px] mx-auto mb-9"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex gap-3 justify-center flex-wrap max-sm:flex-col max-sm:items-stretch"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-8 py-3.5 rounded-lg hover:bg-accent-hover transition-colors duration-200"
            >
              {ctaText}
            </Link>
            <Link
              href="/rates"
              className="inline-flex items-center justify-center border border-border text-foreground font-semibold text-[14px] px-8 py-3.5 rounded-lg hover:border-foreground/30 transition-colors duration-200"
            >
              See Our Rates →
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="flex justify-center gap-10 max-sm:gap-6 mt-10 pt-8 border-t border-border"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-mono font-bold text-[1.5rem] leading-none text-foreground">
                  {value}
                </p>
                <p className="text-muted-foreground text-[11px] mt-1.5 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    )
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

---

## Task 3: PortfolioParallax section

**Files:**
- Create: `src/components/landing/portfolio-parallax.tsx`

- [ ] **Step 1: Create `src/components/landing/portfolio-parallax.tsx`**

  ```tsx
  "use client"

  import { ParallaxScroll } from "@/components/ui/parallax-scroll"

  const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
    "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800",
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800",
    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
  ]

  interface PortfolioParallaxProps {
    images?: string[]
  }

  export function PortfolioParallax({ images }: PortfolioParallaxProps) {
    const imageList = images && images.length > 0 ? images : PLACEHOLDER_IMAGES

    return (
      <section className="py-16 max-sm:py-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 max-sm:px-4 mb-10">
          <h2 className="font-serif italic font-normal text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
            Work that speaks<br className="max-sm:hidden" /> for itself.
          </h2>
          <p className="text-muted-foreground text-[15px]">
            Selected interior projects — residential &amp; commercial.
          </p>
        </div>
        <div className="relative">
          <ParallaxScroll images={imageList} />
          {/* Fade bottom edge into page background */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background" />
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

---

## Task 4: ServicesSection — numbered cards

**Files:**
- Create: `src/components/landing/services-section.tsx`

- [ ] **Step 1: Create `src/components/landing/services-section.tsx`**

  ```tsx
  "use client"

  import { motion, useReducedMotion } from "framer-motion"

  interface ServiceItem {
    title: string
    description: string
  }

  interface ServicesSectionProps {
    items: ServiceItem[]
  }

  export function ServicesSection({ items }: ServicesSectionProps) {
    const prefersReduced = useReducedMotion()

    return (
      <section className="px-6 max-sm:px-4 py-20 max-lg:py-14 max-sm:py-12 max-w-6xl mx-auto w-full">
        <h2 className="font-serif italic font-normal text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
          Everything under one roof.
        </h2>
        <p className="text-muted-foreground text-[15px] mb-10">
          One partner for civil, electrical, plumbing, and carpentry — zero coordination overhead.
        </p>
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {items.map(({ title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.06,
              }}
              className="group relative border border-border rounded-lg p-6 bg-background hover:border-foreground/20 transition-colors duration-200 overflow-hidden"
            >
              {/* Crimson left accent on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
              <p className="font-mono font-bold text-[28px] leading-none text-border mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-semibold text-[14px] text-foreground mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

---

## Task 5: RateTeaser — animated bars + remove old CSS

**Files:**
- Create: `src/components/landing/rate-teaser.tsx`
- Modify: `src/app/(frontend)/styles.css` (remove `.rate-bar` block)

- [ ] **Step 1: Remove the obsolete `.rate-bar` CSS animation from `styles.css`**

  In `src/app/(frontend)/styles.css`, delete these lines (currently at the bottom of the file):

  ```css
  /* ─── Rate Bar Animation ─────────────────────────────────────────────────── */

  @keyframes bar-fill {
    from { width: 0; }
    to   { width: var(--bar-width, 100%); }
  }

  .rate-bar {
    animation: bar-fill 600ms ease-out forwards;
  }
  ```

- [ ] **Step 2: Create `src/components/landing/rate-teaser.tsx`**

  ```tsx
  "use client"

  import Link from "next/link"
  import { motion, useReducedMotion } from "framer-motion"

  interface RateItem {
    label: string
    mgArtsRate: number
    marketRate: number
    unit: string
  }

  interface RateTeaserProps {
    rates: RateItem[]
  }

  export function RateTeaser({ rates }: RateTeaserProps) {
    const prefersReduced = useReducedMotion()

    return (
      <section className="bg-black-pure border-y border-[#1a1a1a] py-20 max-sm:py-12 px-6 max-sm:px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-3">
            Transparent Pricing
          </p>
          <h2 className="font-serif italic font-normal text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-white mb-3">
            Our rates vs. the market.
          </h2>
          <p className="text-[#555] text-[15px] mb-10">
            No hidden markups. No padding. Competitive by design.
          </p>

          <div className="flex flex-col gap-4 mb-10">
            {rates.map(({ label, mgArtsRate, marketRate, unit }) => {
              const maxRate = Math.max(mgArtsRate, marketRate)
              const mgPct = Math.round((mgArtsRate / maxRate) * 100)
              const multiplier = (marketRate / mgArtsRate).toFixed(1)

              return (
                <div key={label} className="border border-[#1a1a1a] rounded-lg p-5">
                  <div className="flex justify-between items-start mb-3 gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-medium text-[14px] mb-0.5">{label}</p>
                      <p className="text-[#555] text-[12px]">per {unit}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-[22px] text-white leading-none">
                        ₹{mgArtsRate.toLocaleString("en-IN")}
                      </p>
                      <p className="font-mono text-[13px] text-[#555] line-through mt-0.5">
                        ₹{marketRate.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <p
                    className="font-mono font-bold text-[15px] mb-4"
                    style={{
                      background: "linear-gradient(135deg, #c0392b, #e05b2b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {multiplier}× more cost-effective
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-primary w-14 shrink-0 font-semibold">
                        MG Arts
                      </span>
                      <div className="flex-1 h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${mgPct}%` }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={
                            prefersReduced
                              ? { duration: 0 }
                              : { duration: 0.8, ease: "easeOut" }
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#555] w-14 shrink-0">Market</span>
                      <div className="flex-1 h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#2a2a2a] rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={
                            prefersReduced
                              ? { duration: 0 }
                              : { duration: 0.8, ease: "easeOut", delay: 0.1 }
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Link
            href="/rates"
            className="inline-flex items-center justify-center border border-[#333] text-white font-semibold text-[14px] px-6 py-3 rounded-lg hover:border-[#555] transition-colors duration-200 max-sm:w-full max-sm:justify-center"
          >
            View Full Rate Chart →
          </Link>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

---

## Task 6: CtaSection — fade-in

**Files:**
- Create: `src/components/landing/cta-section.tsx`

- [ ] **Step 1: Create `src/components/landing/cta-section.tsx`**

  ```tsx
  "use client"

  import Link from "next/link"
  import { motion, useReducedMotion } from "framer-motion"

  interface CtaSectionProps {
    heading: string
    buttonText: string
    buttonHref: string
  }

  export function CtaSection({ heading, buttonText, buttonHref }: CtaSectionProps) {
    const prefersReduced = useReducedMotion()

    return (
      <motion.section
        className="px-6 max-sm:px-4 py-24 max-lg:py-16 max-sm:py-12 max-w-6xl mx-auto w-full text-center"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-serif italic text-muted-foreground text-[1.0625rem] mb-4">
          Free site visit for projects above ₹5 lakhs.
        </p>
        <h2 className="font-serif italic font-normal text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] text-foreground mb-8">
          {heading}
        </h2>
        <div className="flex gap-3 justify-center flex-wrap max-sm:flex-col max-sm:items-stretch">
          <Link
            href={buttonHref}
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-8 py-3.5 rounded-lg hover:bg-accent-hover transition-colors duration-200"
          >
            {buttonText}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-border text-muted-foreground font-semibold text-[14px] px-8 py-3.5 rounded-lg hover:text-foreground hover:border-foreground/30 transition-colors duration-200"
          >
            Send a message
          </Link>
        </div>
      </motion.section>
    )
  }
  ```

- [ ] **Step 2: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

---

## Task 7: Wire up page.tsx

**Files:**
- Modify: `src/app/(frontend)/(landing)/page.tsx`

- [ ] **Step 1: Replace `page.tsx` with the new composition**

  Replace the entire file content:

  ```tsx
  import { getLandingPage, getActiveNotice } from '@/lib/cms'
  import type { LandingPage } from '@/payload-types'
  import { HeroSection } from '@/components/landing/hero-section'
  import { PortfolioParallax } from '@/components/landing/portfolio-parallax'
  import { ServicesSection } from '@/components/landing/services-section'
  import { RateTeaser } from '@/components/landing/rate-teaser'
  import { CtaSection } from '@/components/landing/cta-section'

  export const metadata = {
    title: 'MG Arts - Interior Design & Execution',
    description:
      'Turnkey interior design. Civil, electrical, plumbing, carpentry. Transparent pricing, Pan-India delivery.',
  }

  const DEFAULT_VALUE_PROPS = [
    {
      title: 'Civil & Structural',
      description: 'False ceilings, partition walls, flooring — executed to drawing, supervised on-site.',
    },
    {
      title: 'Electrical',
      description: 'Full conduit wiring, DB setup, light & power points — ISI-certified materials only.',
    },
    {
      title: 'Plumbing',
      description: 'GI & CPVC piping, sanitary fitting, drainage laying — leak-proof guarantee.',
    },
    {
      title: 'Carpentry',
      description: 'Modular kitchens, wardrobes, custom furniture — site-measured, precision-built.',
    },
  ]

  const SAMPLE_RATES = [
    { label: 'False Ceiling', mgArtsRate: 55, marketRate: 110, unit: 'sq ft' },
    { label: 'Electrical Point', mgArtsRate: 750, marketRate: 1400, unit: 'point' },
  ]

  export default async function HomePage() {
    let page: LandingPage | null = null
    let noticeTitle: string | null = null

    try { page = await getLandingPage() } catch {}
    try {
      const notice = await getActiveNotice()
      noticeTitle = notice?.title ?? null
    } catch {}

    const heroBlock = page?.blocks?.find((b) => b.blockType === 'hero')
    const valuePropsBlock = page?.blocks?.find((b) => b.blockType === 'value-props')
    const ctaBlock = page?.blocks?.find((b) => b.blockType === 'cta')

    const headline =
      heroBlock?.blockType === 'hero'
        ? heroBlock.heading
        : 'Interiors That Execute.'

    const subheadline =
      heroBlock?.blockType === 'hero'
        ? (heroBlock.subheading ?? '')
        : 'Turnkey execution — civil, electrical, plumbing, carpentry — at transparent, market-beating rates. One partner for the entire project.'

    const ctaText =
      heroBlock?.blockType === 'hero' ? (heroBlock.ctaText ?? 'Get a Free Quote') : 'Get a Free Quote'
    const ctaHref =
      heroBlock?.blockType === 'hero' ? (heroBlock.ctaLink ?? '/contact') : '/contact'

    const valueProps =
      valuePropsBlock?.blockType === 'value-props' && (valuePropsBlock.items?.length ?? 0) > 0
        ? (valuePropsBlock.items ?? []).map((item) => ({
            title: item.title,
            description: item.description ?? '',
          }))
        : DEFAULT_VALUE_PROPS

    const ctaHeading =
      ctaBlock?.blockType === 'cta' ? ctaBlock.heading : 'Ready to start your project?'
    const ctaButtonText =
      ctaBlock?.blockType === 'cta'
        ? (ctaBlock.buttonText ?? 'Book a Free Consultation')
        : 'Book a Free Consultation'
    const ctaButtonHref =
      ctaBlock?.blockType === 'cta' ? (ctaBlock.buttonLink ?? '/contact') : '/contact'

    return (
      <div className="flex flex-col">
        {/* Notice Banner */}
        {noticeTitle && (
          <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-[13px] font-medium">
            {noticeTitle}
          </div>
        )}

        <HeroSection
          headline={headline}
          subheadline={subheadline}
          ctaText={ctaText}
          ctaHref={ctaHref}
        />

        <PortfolioParallax />

        <ServicesSection items={valueProps} />

        <RateTeaser rates={SAMPLE_RATES} />

        <CtaSection
          heading={ctaHeading}
          buttonText={ctaButtonText}
          buttonHref={ctaButtonHref}
        />
      </div>
    )
  }
  ```

- [ ] **Step 2: Full type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors across any of the new or modified files.

---

## Task 8: Visual verification

- [ ] **Step 1: Start the dev server**

  ```bash
  npm run dev
  ```

  Open `http://localhost:3000` in the browser.

- [ ] **Step 2: Verify Hero section**

  - Page loads with dark background
  - Eyebrow text `"MG Arts · Est. 2014 · Pan-India"` visible in crimson, small caps
  - Italic serif headline animates in (staggered, spring ease) — eyebrow first, then headline, then crimson rule, then subheadline, then CTAs, then stats
  - Crimson horizontal rule grows from center
  - Stats row (`500+`, `10+`, `3`) visible below the CTAs with a top border separator
  - Vertical rule lines visible on desktop at left/right edges of hero

- [ ] **Step 3: Verify Portfolio Parallax section**

  - Section appears below hero with a top border
  - Italic serif heading `"Work that speaks for itself."` visible
  - 9 interior images load from Unsplash (may take a moment — no broken image icons)
  - Scrolling inside the parallax container moves columns in opposite directions (cols 1 & 3 up, col 2 down)
  - Bottom of the section fades into page background via gradient mask

- [ ] **Step 4: Verify Services section**

  - Cards appear with numbered labels `01`–`04`
  - Scroll down to trigger `whileInView` — cards stagger in left-to-right
  - Hovering a card reveals a crimson left-border accent line
  - Grid is 4-col on desktop, 2-col on tablet, 1-col on mobile

- [ ] **Step 5: Verify Rate Teaser**

  - Dark (`#000`) full-bleed section with border top/bottom
  - Italic serif headline `"Our rates vs. the market."`
  - Scroll to section — both MG Arts and Market bars animate from 0 to their widths
  - Crimson gradient text on the multiplier (`2.0× more cost-effective`)
  - No `rate-bar` CSS animation class exists on any element (confirm in DevTools)

- [ ] **Step 6: Verify CTA section**

  - Italic serif heading fades in on scroll
  - Both buttons render correctly, crimson primary + ghost border
  - Mobile: buttons stack vertically

- [ ] **Step 7: Toggle light mode**

  - Click the theme toggle in the footer
  - All sections adapt correctly using CSS variable tokens — no hardcoded dark colours leaking into light mode (the Rate Teaser intentionally stays dark as it uses `bg-black-pure`)

- [ ] **Step 8: Check reduced motion**

  In macOS System Settings → Accessibility → Display → Reduce Motion, enable it. Reload the page.
  - Hero elements should appear instantly without transform — only opacity fades
  - Rate bars should appear at full width immediately

- [ ] **Step 9: Run lint**

  ```bash
  npm run lint
  ```

  Expected: no errors.
