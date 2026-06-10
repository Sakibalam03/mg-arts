"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

interface RateItem {
  label: string
  mgArtsRate: number
  marketRate: number
  unit: string
}

interface RateTeaserProps {
  rates: RateItem[]
}

const ease = [0.22, 1, 0.36, 1] as const

export function RateTeaser({ rates }: RateTeaserProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="bg-black-pure border-t border-[#111] px-6 lg:px-10 py-20 max-sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 mb-12">
          <h2 className="font-sans font-black text-[clamp(1.75rem,3.5vw,2.25rem)] tracking-[-0.03em] text-white">
            Our rates vs. the market.
          </h2>
          <p className="text-[14px] text-[#555] leading-relaxed self-end">
            No hidden markups. No padding. We publish our rates because we are confident they are the best in the market.
          </p>
        </div>

        {/* Rate cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {rates.map(({ label, mgArtsRate, marketRate, unit }, i) => {
            const savings = Math.round(((marketRate - mgArtsRate) / marketRate) * 100)

            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className="border border-[#1a1a1a] rounded-lg p-6 bg-[#050505]"
              >
                <p className="text-[10px] font-bold text-[#555] tracking-[0.1em] uppercase mb-5">
                  {label}
                </p>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <p className="text-[10px] font-bold text-primary tracking-[0.08em] uppercase mb-2">
                      MG Arts
                    </p>
                    <p className="font-mono font-black text-[2.5rem] leading-none text-white">
                      &#x20B9;{mgArtsRate.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-[#444] mt-1">per {unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#333] tracking-[0.08em] uppercase mb-2">
                      Market
                    </p>
                    <p className="font-mono font-black text-[2.5rem] leading-none text-[#2a2a2a] line-through">
                      &#x20B9;{marketRate.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-[#333] mt-1">per {unit}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="font-mono font-bold text-[11px] text-primary">
                    {savings}% less than market
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <Link
          href="/rates"
          className="inline-flex items-center justify-center border border-[#222] text-[#aaa] font-semibold text-[13px] px-6 py-3 rounded-md hover:border-[#444] hover:text-white active:scale-[0.98] transition-all duration-200"
        >
          View full rate chart
        </Link>
      </div>
    </section>
  )
}
