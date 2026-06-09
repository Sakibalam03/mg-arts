import Link from "next/link"

const SPECS = [
  { key: "Area", value: "4,200 sq ft" },
  { key: "Duration", value: "11 weeks" },
  { key: "Scope", value: "Civil, Electrical, Carpentry" },
  { key: "Location", value: "Bengaluru" },
  { key: "Status", value: "Delivered, snag-free" },
]

export function FeaturedProject() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 border-t border-[#111] bg-black-pure">
      {/* Image */}
      <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1000&q=85"
          alt="Whitefield Villa interior"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between px-8 lg:px-12 py-12 lg:py-16 border-t lg:border-t-0 lg:border-l border-[#111]">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-[0.16em] uppercase text-primary mb-4">
            Featured Project
          </span>
          <h2 className="font-sans font-black text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-white mb-4">
            Whitefield Villa,<br />Bengaluru
          </h2>
          <p className="text-[14px] text-[#666] leading-[1.7] max-w-[360px]">
            Complete civil, electrical, and carpentry for a 4,200 sq ft independent villa. Delivered 3 weeks ahead of schedule with zero pending snags at handover.
          </p>

          {/* Spec table */}
          <div className="mt-8 border-t border-[#111]">
            {SPECS.map(({ key, value }) => (
              <div
                key={key}
                className="flex justify-between items-baseline py-3 border-b border-[#0d0d0d]"
              >
                <span className="text-[10px] text-[#444] uppercase tracking-[0.08em]">{key}</span>
                <span className="text-[12px] font-semibold text-[#ccc]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/work"
          className="inline-flex items-center justify-center self-start mt-8 border border-[#222] text-[#aaa] font-semibold text-[13px] px-6 py-3 rounded-md hover:border-[#444] hover:text-white active:scale-[0.98] transition-all duration-200"
        >
          View Case Study
        </Link>
      </div>
    </section>
  )
}
