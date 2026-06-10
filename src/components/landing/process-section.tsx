"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const STEPS = [
  {
    num: "01",
    name: "Site Visit",
    time: "Day 1",
    title: "Site Visit & Brief",
    body: "We visit the site, understand your requirements, document scope, and give you a preliminary estimate. No obligations.",
    tag: "Free for projects above Rs. 5 lakhs",
  },
  {
    num: "02",
    name: "Design & Quote",
    time: "Week 1",
    title: "Design & Estimate",
    body: "Detailed drawings, material specifications, and a line-item estimate. You see every rate before approving. No lump-sum surprises.",
    tag: null,
  },
  {
    num: "03",
    name: "Execution",
    time: "Weeks 2-8",
    title: "Execution",
    body: "All trades coordinated by a single project manager. Daily site updates. ISI-certified materials. On-schedule delivery.",
    tag: null,
  },
  {
    num: "04",
    name: "Handover",
    time: "Final day",
    title: "Handover & Support",
    body: "Snag-free walkthrough with the client. Full documentation package. Post-handover support for 90 days.",
    tag: null,
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function ProcessSection() {
  const [active, setActive] = useState(0)
  const prefersReduced = useReducedMotion()

  return (
    <section className="bg-[#050505] border-t border-[#111] px-6 lg:px-10 py-20 max-sm:py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-sans font-black text-[clamp(1.75rem,3.5vw,2.25rem)] tracking-[-0.03em] text-white mb-2">
          How We Work
        </h2>
        <p className="text-[14px] text-[#555] mb-12">
          Four steps from first call to final handover.
        </p>

        {/* Timeline nodes */}
        <div className="relative flex">
          {/* Connecting line */}
          <div className="absolute top-[17px] left-[17px] right-[17px] h-px bg-[#1a1a1a] pointer-events-none" />

          {STEPS.map((step, i) => (
            <button
              key={step.num}
              onClick={() => setActive(i)}
              className="flex-1 flex flex-col items-center gap-3 relative z-10 group"
              aria-label={step.name}
            >
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-200 ${
                  i === active
                    ? "border-primary bg-[#120404] text-primary"
                    : "border-[#1a1a1a] bg-[#050505] text-[#333] group-hover:border-[#333] group-hover:text-[#555]"
                }`}
              >
                {step.num}
              </div>
              <span className={`text-[11px] font-semibold text-center ${i === active ? "text-[#ccc]" : "text-[#444]"}`}>
                {step.name}
              </span>
              <span className={`text-[9px] ${i === active ? "text-primary" : "text-[#2a2a2a]"}`}>
                {step.time}
              </span>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="mt-8 rounded-lg border border-[#1a1a1a] bg-[#0d0d0d] p-6 min-h-[110px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-primary mb-2">
                Step {STEPS[active].num}: {STEPS[active].title}
              </p>
              <p className="text-[14px] text-[#aaa] leading-[1.65]">{STEPS[active].body}</p>
              {STEPS[active].tag && (
                <span className="inline-block mt-3 border border-[#2a0f0f] text-primary text-[11px] px-3 py-1 rounded-full">
                  {STEPS[active].tag}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
