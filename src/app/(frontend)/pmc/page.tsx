import Link from 'next/link'
import { getPmcPage } from '@/lib/cms'
import type { PmcPage } from '@/payload-types'

export const metadata = {
  title: 'PMC — Project Management Consultancy',
  description:
    'Partner with MG Arts as your PMC execution arm. We handle civil, electrical, plumbing, and carpentry so you can focus on design.',
}

const DEFAULT_SERVICES = [
  { title: 'Civil Execution', description: 'False ceilings, partitions, flooring — to specification, on schedule.' },
  { title: 'Electrical', description: 'Full wiring, DB setup, conduit — ISI-certified materials, certified workers.' },
  { title: 'Plumbing', description: 'GI & CPVC piping, sanitary fitting, drainage — leak-proof delivery.' },
  { title: 'Carpentry', description: 'Modular kitchens, wardrobes, furniture — site-measured, factory precision.' },
  { title: 'Project Coordination', description: 'Single point of contact, daily site updates, weekly progress reports.' },
  { title: 'Material Procurement', description: 'We source from authorized brand partners — no substitutions without approval.' },
]

export default async function PmcPage() {
  let page: PmcPage | null = null

  try {
    page = await getPmcPage()
  } catch {}

  const pmcServices =
    page?.services && page.services.length > 0 ? page.services : DEFAULT_SERVICES

  const pastCollaborations = page?.pastCollaborations ?? []

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-6 pt-16 pb-14 max-w-5xl mx-auto w-full">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-5">
          For Architect Firms
        </p>
        <h1 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.03em] text-foreground mb-6 max-w-2xl">
          You design. We execute.
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xl mb-8">
          MG Arts partners with architecture firms as the execution arm — handling civil,
          electrical, plumbing, and carpentry to your drawings. One contract, one team,
          zero coordination overhead for you.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/auth?role=architect"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-7 py-3 rounded-lg hover:bg-accent-hover transition-colors duration-200"
          >
            Register as an Architect Partner
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-border text-foreground font-semibold text-[14px] px-7 py-3 rounded-lg hover:border-foreground/30 transition-colors duration-200"
          >
            Send a Project Brief
          </Link>
        </div>
      </section>

      {/* What we handle */}
      <section className="bg-secondary border-y border-border px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-foreground mb-8">
            What we handle end-to-end
          </h2>
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {pmcServices.map((s, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-5 bg-background"
              >
                <h3 className="font-semibold text-[14px] text-foreground mb-2">{s.title}</h3>
                {s.description && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-foreground mb-8">
          How the partnership works
        </h2>
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[
            { step: '01', title: 'Register', text: 'Create an architect account. Pending approval — usually within 24 hours.' },
            { step: '02', title: 'Submit Brief', text: 'Share project drawings, scope, and timeline from your dashboard.' },
            { step: '03', title: 'Get BOQ', text: 'We prepare a detailed Bill of Quantities against your drawings.' },
            { step: '04', title: 'Execute', text: 'We execute on-site. You get daily updates and milestone reports.' },
          ].map(({ step, title, text }) => (
            <div key={step}>
              <p className="font-mono font-bold text-[13px] text-primary mb-3">{step}</p>
              <p className="font-semibold text-[14px] text-foreground mb-1.5">{title}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Past collaborations */}
      {pastCollaborations.length > 0 && (
        <section className="bg-secondary border-t border-border px-6 py-14">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-foreground mb-8">
              Past collaborations
            </h2>
            <div className="flex flex-wrap gap-3">
              {pastCollaborations.map((c, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg px-5 py-3 bg-background"
                >
                  <p className="font-semibold text-[14px] text-foreground">{c.architectFirm}</p>
                  {c.projectName && (
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {c.projectName}
                      {c.city ? ` · ${c.city}` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="border-t border-border px-6 py-14 text-center">
        <h2 className="font-sans font-extrabold text-[1.5rem] tracking-[-0.03em] text-foreground mb-2">
          Ready to partner?
        </h2>
        <p className="text-muted-foreground text-[14px] mb-7">
          Register your firm, submit a brief, and get a BOQ within 48 hours.
        </p>
        <Link
          href="/auth?role=architect"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-[14px] px-7 py-3 rounded-lg hover:bg-accent-hover transition-colors duration-200"
        >
          Register as Architect Partner
        </Link>
      </div>
    </div>
  )
}
