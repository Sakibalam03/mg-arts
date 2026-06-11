"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

const PHOTO = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85"

const STATS = [
  { value: "500+", label: "Projects" },
  { value: "10+", label: "Years Active" },
  { value: "3", label: "Cities" },
]

const ease = [0.22, 1, 0.36, 1] as const

interface HeroSectionProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref: string
}

export function HeroSection({ headline, subheadline, ctaText, ctaHref }: HeroSectionProps) {
  const prefersReduced = useReducedMotion()

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
  })

  return (
    <section className="relative w-full min-h-[100dvh] bg-black overflow-hidden flex flex-col justify-between">

      {/* Right-side photo — bleeds in from the right, gradient fade on left edge */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 hidden lg:block"
        style={{ width: "50%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease, delay: 0.3 }}
      >
        <img
          src={PHOTO}
          alt="Interior design project"
          className="w-full h-full object-cover"
        />
        {/* Gradient fades the left edge of the photo into black */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </motion.div>

      {/* Content — sits on the left, above the photo layer */}
      <motion.div
        className="relative z-10 flex flex-col justify-between min-h-[100dvh] px-8 lg:px-12 pt-20 pb-10 w-full lg:w-[54%]"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
      >
        <div>
          <motion.span
            variants={fadeUp(0)}
            className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase text-primary mb-7"
          >
            Interior Design &amp; Execution
          </motion.span>

          <motion.h1
            variants={fadeUp(0.04)}
            className="font-sans font-black text-[clamp(3.25rem,7vw,6.5rem)] leading-[.92] tracking-[-0.04em] text-white mb-6 whitespace-pre-line"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.08)}
            className="text-[15px] text-[#666] leading-[1.65] max-w-[38ch] mb-8"
          >
            {subheadline}
          </motion.p>

          <motion.div
            variants={fadeUp(0.12)}
            className="flex gap-3 flex-wrap max-sm:flex-col max-sm:items-stretch"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-primary text-white font-bold text-[13px] px-7 py-3.5 rounded-md hover:bg-accent-hover active:scale-[0.98] transition-all duration-200"
            >
              {ctaText}
            </Link>
            <Link
              href="/rates"
              className="inline-flex items-center justify-center border border-[#333] text-[#aaa] font-semibold text-[13px] px-7 py-3.5 rounded-md hover:border-[#555] hover:text-white active:scale-[0.98] transition-all duration-200"
            >
              View Rates
            </Link>
          </motion.div>
        </div>

        {/* Stats pinned to the bottom */}
        <motion.div
          variants={fadeUp(0.18)}
          className="flex gap-10 pt-8 border-t border-[#1a1a1a] max-sm:gap-6"
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="font-mono font-black text-[1.875rem] leading-none text-white">{value}</p>
              <p className="text-[10px] text-[#444] mt-1.5 uppercase tracking-[0.08em]">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
