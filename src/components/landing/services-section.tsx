"use client"

import { motion, useReducedMotion } from "framer-motion"

interface ServiceItem {
  title: string
  description: string
}

interface ServicesSectionProps {
  items: ServiceItem[]
}

const ease = [0.22, 1, 0.36, 1] as const

export function ServicesSection({ items }: ServicesSectionProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="bg-black-pure border-t border-[#111] px-6 lg:px-10 py-20 max-sm:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
        {/* Left */}
        <div className="lg:pt-1">
          <h2 className="font-sans font-black text-[clamp(1.75rem,3.5vw,2.25rem)] leading-[1.08] tracking-[-0.03em] text-white mb-3">
            Everything under one roof.
          </h2>
          <p className="text-[14px] text-[#555] leading-relaxed">
            One partner, one manager, zero coordination overhead between trades.
          </p>
        </div>

        {/* Right: rows */}
        <div className="divide-y divide-[#111]">
          {items.map(({ title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease, delay: i * 0.05 }}
              className="group relative grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-10 py-6"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
              <h3 className="font-semibold text-[14px] text-[#e0e0e0] tracking-tight">{title}</h3>
              <p className="text-[13px] text-[#555] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
