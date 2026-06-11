"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

const SPECS = [
  { key: "Area", value: "4,200 sq ft" },
  { key: "Duration", value: "11 weeks" },
  { key: "Scope", value: "Civil, Electrical, Carpentry" },
  { key: "Location", value: "Bengaluru" },
  { key: "Status", value: "Delivered, snag-free" },
]

const ease = [0.22, 1, 0.36, 1] as const

export function FeaturedProject() {
  const prefersReduced = useReducedMotion()

  const inView = (delay = 0) => ({
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease, delay } },
  })

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 border-t border-[#111] bg-black-pure">
      {/* Image */}
      <motion.div
        className="aspect-[4/3] lg:aspect-auto lg:min-h-[500px] overflow-hidden"
        initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease }}
      >
        <img
          src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1000&q=85"
          alt="Whitefield Villa interior"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex flex-col justify-between px-8 lg:px-12 py-12 lg:py-16 border-t lg:border-t-0 lg:border-l border-[#111]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <div>
          <motion.span variants={inView(0)} className="inline-block text-[10px] font-bold tracking-[0.16em] uppercase text-primary mb-4">
            Featured Project
          </motion.span>
          <motion.h2
            variants={inView(0.04)}
            className="font-sans font-black text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-white mb-4"
          >
            Whitefield Villa,<br />Bengaluru
          </motion.h2>
          <motion.p variants={inView(0.08)} className="text-[14px] text-[#666] leading-[1.7] max-w-[360px]">
            Complete civil, electrical, and carpentry for a 4,200 sq ft independent villa. Delivered 3 weeks ahead of schedule with zero pending snags at handover.
          </motion.p>

          {/* Spec table */}
          <motion.div variants={inView(0.12)} className="mt-8 border-t border-[#111]">
            {SPECS.map(({ key, value }) => (
              <div
                key={key}
                className="flex justify-between items-baseline py-3 border-b border-[#0d0d0d]"
              >
                <span className="text-[10px] text-[#444] uppercase tracking-[0.08em]">{key}</span>
                <span className="text-[12px] font-semibold text-[#ccc]">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={inView(0.16)}>
          <Link
            href="/work"
            className="inline-flex items-center justify-center self-start mt-8 border border-[#222] text-[#aaa] font-semibold text-[13px] px-6 py-3 rounded-md hover:border-[#444] hover:text-white active:scale-[0.98] transition-all duration-200"
          >
            View Case Study
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
