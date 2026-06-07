import { getAboutPage } from '@/lib/cms'
import type { Media } from '@/payload-types'

export const metadata = {
  title: 'About',
  description: 'The story behind MG Arts — team, mission, and execution philosophy.',
}

function photoUrl(photo: number | Media | null | undefined): string | null {
  if (!photo || typeof photo === 'number') return null
  return photo.url ?? null
}

export default async function AboutPage() {
  let teamMembers: { name: string; role: string; photo?: number | Media | null; bio?: string | null; id?: string | null }[] = []

  try {
    const page = await getAboutPage()
    teamMembers = page.teamMembers ?? []
  } catch {}

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-6 pt-16 pb-14 max-w-5xl mx-auto w-full">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-5">
          Our Story
        </p>
        <h1 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.03em] text-foreground mb-6">
          Built to execute, not just design.
        </h1>
        <div className="max-w-2xl space-y-4">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            MG Arts started with a simple observation: interior design execution in India is broken.
            Multiple contractors, no single accountability, markups at every handoff. We built a
            turnkey model — civil, electrical, plumbing, and carpentry under one team — so our
            clients deal with one partner for the entire project.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Our rates are public and updated regularly. We partner with architect firms as a PMC
            execution arm — you design, we build to specification. Offices in Mumbai, Bangalore, and
            Kolkata, with projects across India.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <div className="border-y border-border bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 max-sm:grid-cols-1">
          {[
            { label: 'One Partner', text: 'Civil, electrical, plumbing, carpentry — one team, one contract, one point of accountability.' },
            { label: 'Transparent Rates', text: 'All rates are published publicly. No hidden markups, no padding. Our pricing updates as material costs change.' },
            { label: 'PMC Ready', text: 'Architect firms engage us directly as the execution arm. We work to your drawings and specifications.' },
          ].map(({ label, text }) => (
            <div key={label}>
              <h3 className="font-semibold text-[14px] text-foreground mb-2 tracking-tight">{label}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="px-6 py-16 max-w-5xl mx-auto w-full">
          <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-foreground mb-8">
            Our Team
          </h2>
          <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
            {teamMembers.map((member, i) => {
              const url = photoUrl(member.photo ?? null)
              const initials = member.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
              return (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-secondary border border-border mx-auto mb-3 overflow-hidden flex items-center justify-center">
                    {url ? (
                      <img src={url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono font-bold text-[13px] text-muted-foreground">
                        {initials}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-[13px] text-foreground">{member.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{member.role}</p>
                  {member.bio && (
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{member.bio}</p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Cities */}
      <section className="bg-secondary border-t border-border px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-foreground mb-8">
            Where we operate
          </h2>
          <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
            {[
              { city: 'Mumbai', note: 'Primary operations hub' },
              { city: 'Bangalore', note: 'South India projects' },
              { city: 'Kolkata', note: 'East India projects' },
            ].map(({ city, note }) => (
              <div key={city} className="border border-border rounded-lg p-5 bg-background">
                <p className="font-semibold text-[15px] text-foreground">{city}</p>
                <p className="text-[12px] text-muted-foreground mt-1">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
