"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

const PHOTOS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
]

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
    <section className="w-full min-h-[100dvh] bg-black overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left: text content */}
      <motion.div
        className="flex flex-col justify-between px-8 lg:px-12 pt-20 pb-10 min-h-[100dvh]"
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
            className="flex gap-3 flex-wrap"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-primary text-white font-bold text-[13px] px-7 py-3.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all duration-200"
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

      {/* Right: 3-photo grid */}
      <div className="hidden lg:grid grid-rows-[1fr_auto] gap-1 h-[100dvh]">
        <div className="overflow-hidden">
          <motion.img
            src={PHOTOS[0]}
            alt="Interior project"
            className="w-full h-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease }}
          />
        </div>
        <div className="grid grid-cols-2 gap-1" style={{ height: "35%" }}>
          <div className="overflow-hidden">
            <motion.img
              src={PHOTOS[1]}
              alt="Interior project"
              className="w-full h-full object-cover"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.15 }}
            />
          </div>
          <div className="overflow-hidden">
            <motion.img
              src={PHOTOS[2]}
              alt="Interior project"
              className="w-full h-full object-cover"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.25 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
