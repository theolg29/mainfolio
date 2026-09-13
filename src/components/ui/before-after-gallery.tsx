import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface GalleryItem {
  title: string
  before: string
  after: string
}

interface BeforeAfterGalleryProps {
  items: GalleryItem[]
  className?: string
  /** Marquee speed in pixels per second. */
  speed?: number
}

export function BeforeAfterGallery({
  items,
  className,
  speed = 40,
}: BeforeAfterGalleryProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const afterRowRef = useRef<HTMLDivElement>(null)
  const beforeRowRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)

  // Doubled so the marquee can loop seamlessly once it has scrolled
  // past exactly one copy of the list.
  const loopedItems = [...items, ...items]

  // The handle follows the pointer as soon as it's anywhere over the
  // container — no need to press/grab it first.
  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, ratio)))
  }, [])

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateFromClientX(e.clientX)
  }

  useEffect(() => {
    const measure = () => {
      const node = afterRowRef.current
      if (node) halfWidthRef.current = node.scrollWidth / 2
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [items])

  useEffect(() => {
    let raf = 0
    let last = performance.now()

    // Both rows get the exact same transform string every frame — driven
    // from a single source of truth instead of two separate CSS animations,
    // so they can never drift out of sync with each other.
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const half = halfWidthRef.current

      if (half > 0) {
        offsetRef.current = (offsetRef.current + speed * dt) % half
        const transform = `translateX(-${offsetRef.current}px)`
        if (afterRowRef.current) afterRowRef.current.style.transform = transform
        if (beforeRowRef.current) beforeRowRef.current.style.transform = transform
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  return (
    <div
      ref={containerRef}
      className={cn("ba-gallery", className)}
      onPointerMove={handlePointerMove}
    >
      <div ref={afterRowRef} className="ba-gallery-row ba-gallery-row-after">
        {loopedItems.map((item, i) => (
          <div
            className="ba-gallery-card showcase-image-frame"
            key={`${item.title}-after-${i}`}
          >
            <img
              src={item.after}
              alt={`${item.title} — après`}
              className="ba-gallery-image"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div
        className="ba-gallery-before-mask"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div ref={beforeRowRef} className="ba-gallery-row ba-gallery-row-before">
          {loopedItems.map((item, i) => (
            <div
              className="ba-gallery-card showcase-image-frame"
              key={`${item.title}-before-${i}`}
            >
              <img
                src={item.before}
                alt={`${item.title} — avant`}
                className="ba-gallery-image"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="ba-gallery-handle" style={{ left: `${position}%` }}>
        <div className="ba-gallery-handle-line" />
        <div className="ba-gallery-handle-grip">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2L1 7L5 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 2L13 7L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
