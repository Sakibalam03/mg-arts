import { getLandingPage, getActiveNotice } from '@/lib/cms'
import type { LandingPage } from '@/payload-types'
import { HeroSection } from '@/components/landing/hero-section'
import { MarqueeStrip } from '@/components/landing/marquee-strip'
import { PortfolioFeatured } from '@/components/landing/portfolio-featured'
import { FeaturedProject } from '@/components/landing/featured-project'
import { ServicesSection } from '@/components/landing/services-section'
import { ProcessSection } from '@/components/landing/process-section'
import { RateTeaser } from '@/components/landing/rate-teaser'
import { TestimonialsMarquee } from '@/components/landing/testimonials-marquee'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'

export const metadata = {
  title: 'MG Arts - Interior Design & Execution',
  description:
    'Turnkey interior design. Civil, electrical, plumbing, carpentry. Transparent pricing, Pan-India delivery.',
}

const DEFAULT_VALUE_PROPS = [
  {
    title: 'Civil & Structural',
    description: 'False ceilings, partition walls, flooring. Executed to drawing and supervised on-site.',
  },
  {
    title: 'Electrical',
    description: 'Full conduit wiring, DB setup, and light points using ISI-certified materials throughout.',
  },
  {
    title: 'Plumbing',
    description: 'GI and CPVC piping, sanitary fitting, and drainage with a full leak-proof guarantee.',
  },
  {
    title: 'Carpentry',
    description: 'Modular kitchens, wardrobes, and custom furniture. Site-measured and precision-built.',
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
    heroBlock?.blockType === 'hero' ? heroBlock.heading : 'Interiors\nThat Execute.'

  const subheadline =
    heroBlock?.blockType === 'hero'
      ? (heroBlock.subheading ?? '')
      : 'Civil, electrical, plumbing, and carpentry under one roof at transparent, market-beating rates.'

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
    ctaBlock?.blockType === 'cta' ? ctaBlock.heading : 'Ready to start\nyour project?'
  const ctaButtonText =
    ctaBlock?.blockType === 'cta'
      ? (ctaBlock.buttonText ?? 'Schedule a Site Visit')
      : 'Schedule a Site Visit'
  const ctaButtonHref =
    ctaBlock?.blockType === 'cta' ? (ctaBlock.buttonLink ?? '/contact') : '/contact'

  return (
    <div className="flex flex-col bg-black-pure">
      {noticeTitle && (
        <div className="bg-primary text-white py-2.5 px-4 text-center text-[12px] font-semibold tracking-wide">
          {noticeTitle}
        </div>
      )}

      <HeroSection
        headline={headline}
        subheadline={subheadline}
        ctaText={ctaText}
        ctaHref={ctaHref}
      />

      <MarqueeStrip />

      <PortfolioFeatured />

      <FeaturedProject />

      <ServicesSection items={valueProps} />

      <ProcessSection />

      <RateTeaser rates={SAMPLE_RATES} />

      <TestimonialsMarquee />

      <FaqSection />

      <CtaSection
        heading={ctaHeading}
        buttonText={ctaButtonText}
        buttonHref={ctaButtonHref}
      />
    </div>
  )
}
