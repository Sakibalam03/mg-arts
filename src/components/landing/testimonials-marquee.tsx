const ROW_1 = [
  { quote: "Delivered on time, exactly on budget. The single point of contact made everything smooth.", name: "Rahul Sharma", city: "Homeowner, Bengaluru", avatar: "https://i.pravatar.cc/52?img=11" },
  { quote: "Transparent pricing with no surprises after the estimate. Highly recommend for commercial fit-outs.", name: "Priya Menon", city: "Business Owner, Mumbai", avatar: "https://i.pravatar.cc/52?img=25" },
  { quote: "Civil, electrical, plumbing all done by one team. Saved weeks of coordination.", name: "Anil Kapoor", city: "Homeowner, Hyderabad", avatar: "https://i.pravatar.cc/52?img=32" },
  { quote: "Best decision we made. One manager, one number to call, one invoice at the end.", name: "Deepa Nair", city: "Villa Owner, Bengaluru", avatar: "https://i.pravatar.cc/52?img=44" },
]

const ROW_2 = [
  { quote: "Rates are genuinely lower than the market. I verified three quotes before choosing MG Arts.", name: "Suresh Iyer", city: "Apartment Owner, Chennai", avatar: "https://i.pravatar.cc/52?img=51" },
  { quote: "Snag-free handover on day one. The team did a walkthrough and fixed two small things on the spot.", name: "Neha Joshi", city: "3BHK Owner, Pune", avatar: "https://i.pravatar.cc/52?img=60" },
  { quote: "The carpentry quality rivals anything from dedicated furniture studios.", name: "Vikram Bhat", city: "Homeowner, Bengaluru", avatar: "https://i.pravatar.cc/52?img=17" },
  { quote: "Daily updates from the site manager kept us informed without us having to chase anyone.", name: "Anjali Singh", city: "Office Owner, Hyderabad", avatar: "https://i.pravatar.cc/52?img=38" },
]

function TestimonialCard({ quote, name, city, avatar }: (typeof ROW_1)[0]) {
  return (
    <div className="flex-shrink-0 w-[280px] bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-5 flex flex-col gap-3">
      <p className="text-[12px] text-[#999] leading-[1.65] italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-2.5">
        <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
        <div>
          <p className="text-[10px] font-bold text-[#555]">{name}</p>
          <p className="text-[9px] text-[#333]">{city}</p>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: typeof ROW_1
  direction: "left" | "right"
  duration: number
}) {
  const doubled = [...items, ...items]
  const animClass = direction === "left" ? "marquee-left" : "marquee-right"

  return (
    <div className="overflow-hidden">
      <div className={`flex gap-3 ${animClass}`} style={{ animationDuration: `${duration}s` }}>
        {doubled.map((item, i) => (
          <TestimonialCard key={i} {...item} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsMarquee() {
  return (
    <section className="bg-[#050505] border-t border-[#111] py-20 max-sm:py-12 overflow-hidden">
      <div className="px-6 lg:px-10 mb-8">
        <h2 className="font-sans font-black text-[clamp(1.75rem,3.5vw,2.25rem)] tracking-[-0.03em] text-white">
          What Clients Say
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow items={ROW_1} direction="left" duration={32} />
        <MarqueeRow items={ROW_2} direction="right" duration={28} />
      </div>

      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left  { animation: scroll-left  linear infinite; }
        .marquee-right { animation: scroll-right linear infinite; }
        .marquee-left:hover,
        .marquee-right:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-left, .marquee-right { animation: none; }
        }
      `}</style>
    </section>
  )
}
