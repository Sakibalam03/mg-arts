const ITEMS = [
  { text: "Civil & Structural", highlight: true },
  { text: "Electrical Works", highlight: false },
  { text: "Plumbing", highlight: true },
  { text: "Carpentry", highlight: false },
  { text: "False Ceilings", highlight: true },
  { text: "Modular Kitchens", highlight: false },
  { text: "Pan-India Delivery", highlight: true },
  { text: "Transparent Pricing", highlight: false },
]

const DOUBLED = [...ITEMS, ...ITEMS]

export function MarqueeStrip() {
  return (
    <div className="relative overflow-hidden border-y border-[#111] bg-[#050505] py-3.5">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{ animation: "marquee-scroll 28s linear infinite" }}
      >
        {DOUBLED.map(({ text, highlight }, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-3.5 text-[10px] font-bold tracking-[0.14em] uppercase flex-shrink-0 ${
              highlight ? "text-[#777]" : "text-[#333]"
            }`}
          >
            {text}
            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="marquee-scroll"] { animation: none; }
        }
      `}</style>
    </div>
  )
}
