"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const PROJECTS = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85",
    title: "Prestige Towers, Bengaluru",
    subtitle: "Full turnkey · Civil, electrical, plumbing, carpentry · 2,400 sq ft · 2024",
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85",
    title: "Whitefield Villa, Bengaluru",
    subtitle: "Civil + carpentry · 4,200 sq ft · 11 weeks · 2024",
  },
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85",
    title: "JP Nagar Office, Bengaluru",
    subtitle: "Commercial fit-out · Electrical + false ceiling · 1,800 sq ft · 2023",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85",
    title: "Hiranandani Apartment, Mumbai",
    subtitle: "Full interior · Civil, electrical, plumbing, carpentry · 1,600 sq ft · 2023",
  },
]

const THUMB_SRCS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=70",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&q=70",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=70",
]

export function PortfolioFeatured() {
  const [active, setActive] = useState(0)
  const prefersReduced = useReducedMotion()

  const project = PROJECTS[active]

  return (
    <section className="bg-black-pure border-t border-[#111] px-6 lg:px-10 py-20 max-sm:py-12">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-7 max-w-none">
        <h2 className="font-sans font-black text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.03em] text-white">
          Selected Work
        </h2>
        <Link
          href="/work"
          className="text-[11px] text-[#555] border-b border-[#222] pb-0.5 hover:text-white hover:border-[#555] transition-colors duration-200"
        >
          View all projects
        </Link>
      </div>

      {/* Featured image */}
      <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-[#0d0d0d] mb-2.5">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: prefersReduced ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-sm:p-4">
          <span className="inline-block bg-primary text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-[0.08em] uppercase mb-2.5">
            Featured
          </span>
          <p className="font-sans font-bold text-[1.125rem] text-white tracking-[-0.02em]">
            {project.title}
          </p>
          <p className="text-[11px] text-[#aaa] mt-1">{project.subtitle}</p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2.5">
        {PROJECTS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-[4/3] rounded-md overflow-hidden bg-[#0d0d0d] transition-all duration-200 ${
              i === active
                ? "ring-2 ring-primary ring-offset-1 ring-offset-black"
                : "opacity-50 hover:opacity-75"
            }`}
            aria-label={p.title}
          >
            <img
              src={THUMB_SRCS[i]}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
