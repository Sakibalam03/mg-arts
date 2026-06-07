'use client'

import { useEffect, useRef, useState } from 'react'
import type { RateItem } from '@/payload-types'

const CATEGORIES = ['civil', 'electrical', 'plumbing', 'carpentry'] as const
type Category = (typeof CATEGORIES)[number]

export function RateChart({
  items,
  lastUpdated,
}: {
  items: RateItem[]
  lastUpdated: string
}) {
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')
  const [animated, setAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const filtered =
    activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory)
  const maxRate = Math.max(...items.map((i) => i.marketRate), 1)

  const lastUpdatedLabel = (() => {
    try {
      return new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return lastUpdated
    }
  })()

  return (
    <div ref={containerRef}>
      {/* Category filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(['all', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={[
              'px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors duration-150 capitalize',
              activeCategory === cat
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-background border-border text-foreground hover:border-foreground/30',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-[14px]">No items in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((item) => {
            const multiplier = item.marketRate > 0 ? item.marketRate / item.mgArtsRate : 1
            const mgWidth = Math.round((item.mgArtsRate / maxRate) * 100)
            const mktWidth = Math.round((item.marketRate / maxRate) * 100)

            return (
              <div
                key={item.id}
                className="border border-border rounded-lg p-5 bg-background"
              >
                {/* Header row */}
                <div className="flex justify-between items-start gap-4 mb-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-[14px] text-foreground mb-0.5">
                      {item.serviceLabel}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      per {item.unit} ·{' '}
                      {item.withMaterial ? 'incl. material' : 'labour only'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[22px] text-foreground leading-none">
                      ₹{item.mgArtsRate.toLocaleString('en-IN')}
                    </p>
                    <p className="font-mono text-[13px] text-muted-foreground line-through mt-0.5">
                      ₹{item.marketRate.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Multiplier badge */}
                {multiplier >= 1.1 && (
                  <p
                    className="font-mono font-bold text-[15px] mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #c0392b, #e05b2b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {multiplier.toFixed(1)}× more cost-effective
                  </p>
                )}

                {/* Bar chart */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-primary w-14 shrink-0 font-semibold">
                      MG Arts
                    </span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-primary rounded-full ${animated ? 'rate-bar' : ''}`}
                        style={
                          animated
                            ? ({ '--bar-width': `${mgWidth}%` } as React.CSSProperties)
                            : { width: 0 }
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground w-14 shrink-0">
                      Market
                    </span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-muted-foreground/40 rounded-full ${animated ? 'rate-bar' : ''}`}
                        style={
                          animated
                            ? ({
                                '--bar-width': `${mktWidth}%`,
                                animationDelay: '80ms',
                              } as React.CSSProperties)
                            : { width: 0 }
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-[12px] text-muted-foreground mt-6">
        Last updated: {lastUpdatedLabel}
      </p>
    </div>
  )
}
