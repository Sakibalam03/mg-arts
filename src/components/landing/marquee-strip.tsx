"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion"

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

const SPEED = 42 // px/s

export function MarqueeStrip() {
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  const halfW = useRef(0)
  const paused = useRef(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (ref.current) halfW.current = ref.current.scrollWidth / 2
  }, [])

  useAnimationFrame((_, delta) => {
    if (prefersReduced || paused.current || !halfW.current) return
    const next = x.get() - (delta / 1000) * SPEED
    x.set(next <= -halfW.current ? next + halfW.current : next)
  })

  return (
    <div
      className="overflow-hidden border-y border-[#111] bg-[#050505] py-3.5"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
    >
      <motion.div
        ref={ref}
        className="flex gap-10 whitespace-nowrap w-max"
        style={{ x }}
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
      </motion.div>
    </div>
  )
}
