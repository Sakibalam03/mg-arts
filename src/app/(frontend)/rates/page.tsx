import Link from 'next/link'
import { getRateItems } from '@/lib/cms'
import { RateChart } from './rate-chart'

export const metadata = {
  title: 'Rates',
  description:
    'MG Arts vs market rates — civil, electrical, plumbing, carpentry. Transparent pricing, no hidden markups.',
}

export default async function RatesPage() {
  let items: Awaited<ReturnType<typeof getRateItems>> = []
  let lastUpdated = new Date().toISOString()

  try {
    items = await getRateItems()
    if (items.length > 0) lastUpdated = items[0].updatedAt
  } catch {}

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 max-sm:px-4 pt-16 max-sm:pt-10 pb-10 max-w-5xl mx-auto w-full">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-5">
          Transparent Pricing
        </p>
        <h1 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.03em] text-foreground mb-4">
          Our rates vs. the market.
        </h1>
        <p className="text-muted-foreground text-[15px] max-w-xl mb-6">
          Every line item we charge is shown here alongside the current market benchmark. No hidden
          markups — we update these regularly as material costs change.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-6 py-2.5 rounded-lg hover:bg-accent-hover transition-colors duration-200"
          >
            Get a Quote
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center border border-border text-foreground font-semibold text-[14px] px-6 py-2.5 rounded-lg hover:border-foreground/30 transition-colors duration-200"
          >
            See All Services
          </Link>
        </div>
      </section>

      {/* Chart */}
      <section className="px-6 max-sm:px-4 pb-20 max-sm:pb-12 max-w-5xl mx-auto w-full">
        {items.length === 0 ? (
          <div className="border border-border rounded-lg p-10 text-center text-muted-foreground text-[14px]">
            Rate data coming soon — check back shortly.
          </div>
        ) : (
          <RateChart items={items} lastUpdated={lastUpdated} />
        )}
      </section>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-secondary px-6 py-14 text-center">
        <h2 className="font-sans font-extrabold text-[1.5rem] tracking-[-0.03em] text-foreground mb-2">
          Ready to compare for your project?
        </h2>
        <p className="text-muted-foreground text-[14px] mb-7 max-w-md mx-auto">
          Share your scope and we'll send a detailed quote within 48 hours — no site visit needed
          for the initial estimate.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-7 py-3 rounded-lg hover:bg-accent-hover transition-colors duration-200"
        >
          Get a Free Quote
        </Link>
      </div>
    </div>
  )
}
