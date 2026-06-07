import { getSiteSettings } from '@/lib/cms'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with MG Arts — offices in Mumbai, Bangalore, and Kolkata. Free quote within 48 hours.',
}

const CITY_LABELS: Record<string, string> = {
  mumbai: 'Mumbai',
  bangalore: 'Bangalore',
  kolkata: 'Kolkata',
}

export default async function ContactPage() {
  let phone = ''
  let email = ''
  let offices: { city: string; address: string; phone?: string | null; email?: string | null }[] =
    []

  try {
    const settings = await getSiteSettings()
    phone = settings.phone ?? ''
    email = settings.email ?? ''
    offices = settings.offices ?? []
  } catch {}

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 pt-16 pb-10 max-w-5xl mx-auto w-full">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-5">
          Get in Touch
        </p>
        <h1 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.03em] text-foreground mb-4">
          Start your project.
        </h1>
        <p className="text-muted-foreground text-[15px]">
          Tell us about your project and we'll put together a detailed quote within 48 hours —
          free site visit for projects above ₹5 lakhs.
        </p>
      </section>

      {/* Two-column content */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-[1fr,360px] gap-14 max-lg:grid-cols-1 max-lg:gap-10">
          {/* Form */}
          <div>
            <InquiryForm source="contact" />
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-8">
            {/* Phone & email */}
            {(phone || email) && (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">
                  Direct Contact
                </p>
                <div className="flex flex-col gap-2">
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="text-[14px] font-medium text-primary hover:underline"
                    >
                      {phone}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {email}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Offices */}
            {offices.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">
                  Offices
                </p>
                <div className="flex flex-col gap-6">
                  {offices.map((o) => (
                    <div key={o.city}>
                      <p className="font-semibold text-[13px] text-foreground mb-1">
                        {CITY_LABELS[o.city] ?? o.city}
                      </p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line">
                        {o.address}
                      </p>
                      {o.phone && (
                        <a
                          href={`tel:${o.phone}`}
                          className="text-[13px] text-primary mt-1 block"
                        >
                          {o.phone}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback offices when CMS has no data */
              <div>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">
                  Offices
                </p>
                <div className="flex flex-col gap-5">
                  {['Mumbai', 'Bangalore', 'Kolkata'].map((city) => (
                    <div key={city}>
                      <p className="font-semibold text-[13px] text-foreground">{city}</p>
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Address to be updated
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response commitment */}
            <div className="border border-border rounded-lg p-4 bg-secondary">
              <p className="font-semibold text-[13px] text-foreground mb-1">
                Quick turnaround
              </p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                We respond to all inquiries within 1 business day. For projects above ₹5 lakhs,
                a free site visit is included with the initial consultation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
