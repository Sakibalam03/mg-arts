"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

interface CtaSectionProps {
  heading: string
  buttonText: string
  buttonHref: string
}

const ease = [0.22, 1, 0.36, 1] as const

export function CtaSection({ heading, buttonText, buttonHref }: CtaSectionProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="bg-black-pure border-t border-[#111] px-6 lg:px-10 py-24 max-sm:py-14">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-20 items-end"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease }}
      >
        <div>
          <p className="text-[13px] text-[#444] mb-3">
            Free site visit for projects above &#x20B9;5 lakhs.
          </p>
          <h2 className="font-sans font-black text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.04em] leading-[1] text-white">
            {heading}
          </h2>
        </div>

        <div className="flex flex-col gap-3 items-start lg:items-end">
          <Link
            href={buttonHref}
            className="inline-flex items-center justify-center bg-primary text-white font-bold text-[13px] px-7 py-3.5 rounded-md hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
          >
            {buttonText}
          </Link>
          <Link
            href="/contact"
            className="text-[13px] text-[#444] hover:text-[#888] transition-colors duration-200 whitespace-nowrap"
          >
            Or send a message
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
