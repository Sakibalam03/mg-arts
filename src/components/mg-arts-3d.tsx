'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

export default function MgArts3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gradientStyles, setGradientStyle] = useState<CSSProperties>({
    '--mouse-x': 0,
    '--mouse-y': 0,
  } as CSSProperties)

  useEffect(() => {
    let intersectionObserver: IntersectionObserver
    let scheduled = false

    const updatePos = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { left, top } = containerRef.current.getBoundingClientRect()
      setGradientStyle({
        '--mouse-x': e.clientX - left,
        '--mouse-y': e.clientY - top,
      } as CSSProperties)
      scheduled = false
    }

    const onMouseMove = (e: MouseEvent) => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => updatePos(e))
    }

    if (containerRef.current) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener('mousemove', onMouseMove)
          } else {
            window.removeEventListener('mousemove', onMouseMove)
          }
        })
      })
      intersectionObserver.observe(containerRef.current)
    }

    return () => {
      intersectionObserver?.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative pt-16 -mb-[14.5rem] sm:-mb-[10rem]"
    >
      <div
        className="relative w-full"
        style={{
          background: 'black',
          aspectRatio: '1600 / 436',
          maskImage: "url('/images/mg-arts-mask.svg')",
          maskSize: 'cover',
          maskRepeat: 'no-repeat',
          imageRendering: 'crisp-edges',
        }}
      >
        {/* grain texture */}
        <div
          className="absolute inset-0 z-[5]"
          style={{ background: "url('/images/noise.png') repeat" }}
        />
        {/* mouse-tracked glow */}
        <div
          className="absolute rounded-full"
          style={{
            ...gradientStyles,
            width: '70rem',
            height: '70rem',
            filter: 'blur(100px)',
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.2), rgba(255,255,255,0.1), rgba(255,255,255,0))',
            transform: `translate3d(
              calc(var(--mouse-x, -100%) * 1px - 35rem),
              calc(var(--mouse-y, -100%) * 1px - 35rem),
              0px
            )`,
          }}
        />
      </div>
    </div>
  )
}
