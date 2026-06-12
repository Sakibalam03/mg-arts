import Link from 'next/link'
import { getServices } from '@/lib/cms'
import type { Service } from '@/payload-types'

export const metadata = {
  title: 'Services',
  description:
    'Interior design and execution services from MG Arts - civil, electrical, plumbing, carpentry and more.',
}

const DEFAULT_SERVICES: Pick<Service, 'id' | 'title' | 'withMaterial'>[] = [
  { id: 1, title: 'False Ceiling', withMaterial: true },
  { id: 2, title: 'Partition Walls', withMaterial: true },
  { id: 3, title: 'Flooring', withMaterial: true },
  { id: 4, title: 'Electrical Wiring', withMaterial: false },
  { id: 5, title: 'DB & Switchboard Setup', withMaterial: true },
  { id: 6, title: 'Light & Fan Points', withMaterial: false },
  { id: 7, title: 'Plumbing — GI & CPVC', withMaterial: false },
  { id: 8, title: 'Sanitary Fitting', withMaterial: true },
  { id: 9, title: 'Drainage Laying', withMaterial: false },
  { id: 10, title: 'Modular Kitchen', withMaterial: true },
  { id: 11, title: 'Wardrobes', withMaterial: true },
  { id: 12, title: 'Custom Furniture', withMaterial: true },
]

const CATEGORIES = [
  { label: 'Civil & Finishing', ids: [1, 2, 3] },
  { label: 'Electrical', ids: [4, 5, 6] },
  { label: 'Plumbing', ids: [7, 8, 9] },
  { label: 'Carpentry', ids: [10, 11, 12] },
]

export default async function ServicesPage() {
  let services: Pick<Service, 'id' | 'title' | 'withMaterial'>[] = []

  try {
    const data = await getServices()
    services = data
  } catch {}

  const items = services.length > 0 ? services : DEFAULT_SERVICES

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 max-sm:px-4 pt-16 max-sm:pt-10 pb-10 max-w-5xl mx-auto w-full">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-5">
          What We Do
        </p>
        <h1 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.03em] text-foreground mb-4">
          Full-scope execution.
        </h1>
        <p className="text-muted-foreground text-[15px] max-w-lg">
          Every trade under one contract — civil, electrical, plumbing, carpentry. No coordination
          overhead, no mismatched timelines.
        </p>
      </section>

      {/* Service grid grouped by category */}
      <section className="px-6 max-sm:px-4 pb-20 max-sm:pb-12 max-w-5xl mx-auto w-full">
        {services.length > 0 ? (
          /* CMS-driven: flat grid */
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {items.map((s) => (
              <ServiceCard key={s.id} title={s.title} withMaterial={s.withMaterial ?? false} />
            ))}
          </div>
        ) : (
          /* Hardcoded fallback: grouped by category */
          <div className="flex flex-col gap-12">
            {CATEGORIES.map(({ label, ids }) => {
              const categoryItems = items.filter((s) => ids.includes(s.id))
              return (
                <div key={label}>
                  <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">
                    {label}
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
                    {categoryItems.map((s) => (
                      <ServiceCard key={s.id} title={s.title} withMaterial={s.withMaterial ?? false} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="border-t border-border bg-secondary px-6 py-14 text-center">
        <h2 className="font-sans font-extrabold text-[1.5rem] tracking-[-0.03em] text-foreground mb-2">
          Need a custom scope?
        </h2>
        <p className="text-muted-foreground text-[14px] mb-7">
          Tell us about your project — we'll put together a detailed quote within 48 hours.
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

function ServiceCard({ title, withMaterial }: { title: string; withMaterial: boolean }) {
  return (
    <div className="border border-border rounded-lg p-5 bg-background flex justify-between items-start gap-3">
      <p className="font-medium text-[14px] text-foreground">{title}</p>
      <span className="shrink-0 text-[11px] font-medium border border-border rounded-full px-2.5 py-1 text-muted-foreground whitespace-nowrap">
        {withMaterial ? 'With material' : 'Labour only'}
      </span>
    </div>
  )
}
