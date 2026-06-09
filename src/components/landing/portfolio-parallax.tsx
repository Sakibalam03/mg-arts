"use client"

import { ParallaxScroll } from "@/components/ui/parallax-scroll"

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
  "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800",
  "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
]

interface PortfolioParallaxProps {
  images?: string[]
}

export function PortfolioParallax({ images }: PortfolioParallaxProps) {
  const imageList = images && images.length > 0 ? images : PLACEHOLDER_IMAGES

  return (
    <section className="border-t border-border">
      <ParallaxScroll
        images={imageList}
        title="Work that speaks for itself."
        subtitle="Selected interior projects, residential and commercial."
      />
    </section>
  )
}
