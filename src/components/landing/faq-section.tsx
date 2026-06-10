"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const FAQS = [
  {
    q: "Do you handle all trades or subcontract?",
    a: "We handle civil, electrical, plumbing, and carpentry in-house. No subcontracting. One team, one manager, one point of accountability for the entire project.",
  },
  {
    q: "How do you price projects?",
    a: "Line-item estimates for every project. You see each work item, material, and rate before approving. No lump-sum surprises after the work starts.",
  },
  {
    q: "What cities do you operate in?",
    a: "Currently active in Bengaluru, Mumbai, and Hyderabad. Pan-India projects are taken on a case-by-case basis. Contact us to discuss.",
  },
  {
    q: "How long does a typical project take?",
    a: "A 2BHK full interior typically takes 6 to 8 weeks for complete execution. The timeline is confirmed in the estimate before work begins.",
  },
  {
    q: "Is the site visit really free?",
    a: "Yes, for projects above Rs. 5 lakhs. We visit the site, assess scope, and give you a preliminary estimate at no charge and no obligation.",
  },
  {
    q: "What warranty do you offer?",
    a: "All work comes with a one-year workmanship warranty. Plumbing has a separate leak-proof guarantee. Materials carry manufacturer warranties.",
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const prefersReduced = useReducedMotion()

  return (
    <section className="bg-black-pure border-t border-[#111] px-6 lg:px-10 py-20 max-sm:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
        {/* Left */}
        <div className="lg:pt-1">
          <h2 className="font-sans font-black text-[clamp(1.75rem,3.5vw,2.25rem)] leading-[1.08] tracking-[-0.03em] text-white mb-3">
            Common Questions
          </h2>
          <p className="text-[14px] text-[#555] leading-relaxed">
            What most clients ask before starting a project with us.
          </p>
        </div>

        {/* Accordion */}
        <div>
          {FAQS.map(({ q, a }, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="border-b border-[#111]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center gap-4 py-5 text-left"
                >
                  <span className={`text-[14px] font-semibold transition-colors duration-150 ${isOpen ? "text-white" : "text-[#ccc]"}`}>
                    {q}
                  </span>
                  <span
                    className={`text-primary text-[18px] font-bold flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReduced ? 0 : 0.28, ease }}
                      className="overflow-hidden"
                    >
                      <p className="text-[13px] text-[#666] leading-[1.7] pb-5 max-w-[540px]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
