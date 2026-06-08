import Link from 'next/link'
import { getLandingPage, getActiveNotice } from '@/lib/cms'
import type { LandingPage } from '@/payload-types'

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

const STATS = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '3', label: 'Cities' },
  { value: '10+', label: 'Years of Experience' },
]

const SAMPLE_RATES = [
  { label: 'False Ceiling', mgArtsRate: 55, marketRate: 110, unit: 'sq ft' },
  { label: 'Electrical Point', mgArtsRate: 750, marketRate: 1400, unit: 'point' },
]

export default async function HomePage() {
  let page: LandingPage | null = null
  let noticeTitle: string | null = null

  try {
    page = await getLandingPage()
  } catch {}

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
      : 'Interiors That Execute.\nNot Just Design.'

  const subheadline =
    heroBlock?.blockType === 'hero'
      ? (heroBlock.subheading ?? null)
      : 'Turnkey execution — civil, electrical, plumbing, carpentry — at transparent, market-beating rates. One partner for the entire project.'

  const heroCta = {
    text: heroBlock?.blockType === 'hero' ? (heroBlock.ctaText ?? 'Get a Free Quote') : 'Get a Free Quote',
    href: heroBlock?.blockType === 'hero' ? (heroBlock.ctaLink ?? '/contact') : '/contact',
  }

  const valueProps =
    valuePropsBlock?.blockType === 'value-props' && (valuePropsBlock.items?.length ?? 0) > 0
      ? (valuePropsBlock.items ?? []).map((item) => ({
          title: item.title,
          description: item.description ?? '',
        }))
      : DEFAULT_VALUE_PROPS

  const ctaHeading =
    ctaBlock?.blockType === 'cta' ? ctaBlock.heading : 'Ready to start your project?'

  const ctaButton = {
    text:
      ctaBlock?.blockType === 'cta'
        ? (ctaBlock.buttonText ?? 'Book a Free Consultation')
        : 'Book a Free Consultation',
    href:
      ctaBlock?.blockType === 'cta'
        ? (ctaBlock.buttonLink ?? '/contact')
        : '/contact',
  }

  return (
    <div className="flex flex-col">
      {/* Notice Banner */}
      {noticeTitle && (
        <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-[13px] font-medium">
          {noticeTitle}
        </div>
      )}

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="px-6 max-sm:px-4 pt-20 pb-24 max-lg:pt-14 max-lg:pb-16 max-sm:pt-10 max-sm:pb-12 max-w-6xl mx-auto w-full">
        <div className="max-w-[680px]">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-6">
            Interior Design & Execution
          </p>
          <h1 className="font-sans font-extrabold text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground mb-6 whitespace-pre-line">
            {headline}
          </h1>
          <p className="text-[1.0625rem] max-sm:text-[15px] text-muted-foreground leading-relaxed max-w-[500px] mb-9">
            {subheadline}
          </p>
          <div className="flex gap-3 flex-wrap max-sm:flex-col">
            <Link
              href={heroCta.href}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-7 py-3 rounded-lg hover:bg-accent-hover transition-colors duration-200 max-sm:w-full"
            >
              {heroCta.text}
            </Link>
            <Link
              href="/rates"
              className="inline-flex items-center justify-center border border-border text-foreground font-semibold text-[14px] px-7 py-3 rounded-lg hover:border-foreground/30 transition-colors duration-200 max-sm:w-full"
            >
              See Our Rates →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-secondary">
        <div className="max-w-6xl mx-auto px-6 max-sm:px-4 py-10 grid grid-cols-3 max-sm:grid-cols-1 divide-x divide-border max-sm:divide-x-0 max-sm:divide-y">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="text-center px-8 max-sm:px-0 max-sm:py-6"
            >
              <p className="font-mono font-bold text-[2.25rem] leading-none text-foreground">
                {value}
              </p>
              <p className="text-muted-foreground text-[13px] mt-2 font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── What We Do ──────────────────────────────────────────────────── */}
      <section className="px-6 max-sm:px-4 py-20 max-lg:py-14 max-sm:py-12 max-w-6xl mx-auto w-full">
        <h2 className="font-sans font-extrabold text-[clamp(1.5rem,4vw,2.25rem)] tracking-[-0.03em] text-foreground mb-2">
          Everything under one roof.
        </h2>
        <p className="text-muted-foreground text-[15px] mb-10">
          One partner for civil, electrical, plumbing, and carpentry — zero coordination overhead.
        </p>
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {valueProps.map(({ title, description }) => (
            <div
              key={title}
              className="border border-border rounded-lg p-6 bg-background hover:border-foreground/20 transition-colors duration-200"
            >
              <h3 className="font-semibold text-[14px] text-foreground mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rate Teaser ─────────────────────────────────────────────────── */}
      <section className="bg-black-pure border-y border-[#1a1a1a] py-20 max-sm:py-12 px-6 max-sm:px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-3">
            Transparent Pricing
          </p>
          <h2 className="font-sans font-extrabold text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.03em] text-white mb-3">
            Our rates vs. the market.
          </h2>
          <p className="text-[#555] text-[15px] mb-10">
            No hidden markups. No padding. Competitive by design.
          </p>

          <div className="flex flex-col gap-4 mb-10">
            {SAMPLE_RATES.map(({ label, mgArtsRate, marketRate, unit }) => {
              const maxRate = Math.max(mgArtsRate, marketRate)
              const mgWidth = Math.round((mgArtsRate / maxRate) * 100)
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
                        ₹{mgArtsRate.toLocaleString('en-IN')}
                      </p>
                      <p className="font-mono text-[13px] text-[#555] line-through mt-0.5">
                        ₹{marketRate.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <p
                    className="font-mono font-bold text-[15px] mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #c0392b, #e05b2b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
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
                        <div
                          className="h-full bg-primary rounded-full rate-bar"
                          style={{ '--bar-width': `${mgWidth}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#555] w-14 shrink-0">Market</span>
                      <div className="flex-1 h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2a2a2a] rounded-full rate-bar"
                          style={{ '--bar-width': '100%' } as React.CSSProperties}
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

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="px-6 max-sm:px-4 py-24 max-lg:py-16 max-sm:py-12 max-w-6xl mx-auto w-full text-center">
        <p className="font-serif italic text-muted-foreground text-[1.0625rem] mb-4">
          Free site visit for projects above ₹5 lakhs.
        </p>
        <h2 className="font-sans font-extrabold text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] text-foreground mb-8">
          {ctaHeading}
        </h2>
        <div className="flex gap-3 justify-center flex-wrap max-sm:flex-col max-sm:items-stretch">
          <Link
            href={ctaButton.href}
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-8 py-3.5 rounded-lg hover:bg-accent-hover transition-colors duration-200"
          >
            {ctaButton.text}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-border text-muted-foreground font-semibold text-[14px] px-8 py-3.5 rounded-lg hover:text-foreground hover:border-foreground/30 transition-colors duration-200"
          >
            Send a message
          </Link>
        </div>
      </section>
    </div>
  )
}
