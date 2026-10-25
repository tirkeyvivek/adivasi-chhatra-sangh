import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const INTERVAL = 5000

// Cross-fading photo carousel: auto-advances, pauses on hover/focus, supports swipe and arrows
export default function PhotoSlider({ photos, label }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const count = photos.length

  const go = (step) => setIndex((i) => (i + step + count) % count)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, count])

  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <div
      className="relative w-full max-w-xl"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-sun-400/25 sm:-inset-4" />
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest-950 shadow-2xl ring-8 ring-white/15">
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={`${p.src}-1200.webp`}
            srcSet={`${p.src}-640.webp 640w, ${p.src}-1200.webp 1200w`}
            sizes="(min-width: 1024px) 36rem, 100vw"
            alt={p.alt}
            aria-hidden={i !== index}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ objectPosition: p.position }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-forest-950/70 to-transparent" />

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/50 text-white backdrop-blur transition hover:bg-forest-950/75"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/50 text-white backdrop-blur transition hover:bg-forest-950/75"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? 'w-7 bg-sun-400' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
