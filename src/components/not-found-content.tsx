"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

export function NotFoundContent() {
  const prefersReduced = useReducedMotion()

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: prefersReduced ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease, delay },
    },
  })

  return (
    <section className="relative flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center bg-black-pure px-6 py-20 overflow-hidden">

      {/* Ghost 404 watermark */}
      <div
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span className="font-sans font-black text-[clamp(12rem,35vw,26rem)] leading-none tracking-[-0.06em] text-white/[0.025]">
          404
        </span>
      </div>

      {/* Vertical center line */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[#111]"
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
      >
        <motion.span
          variants={fadeUp(0)}
          className="mb-7 inline-block text-[10px] font-bold tracking-[0.18em] uppercase text-primary"
        >
          Error 404
        </motion.span>

        <motion.h1
          variants={fadeUp(0.04)}
          className="font-sans font-black text-[clamp(2.75rem,9vw,5.5rem)] leading-[.9] tracking-[-0.04em] text-white mb-6"
        >
          Page not<br />found.
        </motion.h1>

        <motion.p
          variants={fadeUp(0.08)}
          className="text-[15px] text-[#555] leading-[1.7] max-w-[34ch] mb-10"
        >
          Whatever you were looking for has moved or no longer exists. Let&apos;s get you back on track.
        </motion.p>

        <motion.div
          variants={fadeUp(0.12)}
          className="flex gap-3 flex-wrap justify-center max-sm:flex-col max-sm:items-stretch"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold text-[13px] px-7 py-3.5 rounded-md hover:bg-accent-hover active:scale-[0.98] transition-all duration-200"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center border border-[#333] text-[#aaa] font-semibold text-[13px] px-7 py-3.5 rounded-md hover:border-[#555] hover:text-white active:scale-[0.98] transition-all duration-200"
          >
            View our Work
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom divider */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-[#111]"
        aria-hidden
      />
    </section>
  )
}
