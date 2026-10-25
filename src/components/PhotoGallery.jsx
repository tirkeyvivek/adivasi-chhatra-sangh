import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Expand, X } from 'lucide-react'

const spans = {
  feature: 'col-span-2 row-span-2',
  tall: 'row-span-2',
}

// Bento photo grid: shows `preview` tiles until expanded, opens any photo in a full-screen lightbox
export default function PhotoGallery({ photos, preview }) {
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState(null)
  const gridRef = useRef(null)
  const shown = expanded ? photos : photos.slice(0, preview)

  const collapse = () => {
    setExpanded(false)
    gridRef.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-flow-dense auto-rows-[8.5rem] grid-cols-2 gap-2 min-[400px]:auto-rows-[10rem] sm:auto-rows-[12rem] sm:gap-3 md:auto-rows-[9.5rem] md:grid-cols-4 lg:auto-rows-[13rem]"
      >
        {shown.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setActive(i)}
            aria-haspopup="dialog"
            className={`group relative overflow-hidden rounded-2xl bg-forest-950 ring-1 ring-white/10 focus-visible:ring-4 focus-visible:ring-sun-400 focus-visible:outline-none ${spans[p.span] ?? ''}`}
          >
            <img
              src={`${p.src}-sm.webp`}
              srcSet={`${p.src}-sm.webp 640w, ${p.src}-lg.webp ${p.w}w`}
              sizes={p.span === 'feature' ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
              width={p.w}
              height={p.h}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent p-3 text-left opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="line-clamp-2 text-sm font-semibold text-white">{p.alt}</span>
              <Expand size={16} className="ml-auto shrink-0 self-end text-sun-300" />
            </span>
          </button>
        ))}
      </div>

      {photos.length > preview && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={expanded ? collapse : () => setExpanded(true)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white/10"
          >
            {expanded ? (
              <>
                Show fewer <ChevronUp size={18} />
              </>
            ) : (
              <>
                View all {photos.length} photos <ChevronDown size={18} />
              </>
            )}
          </button>
        </div>
      )}

      <Lightbox photos={shown} index={active} onIndex={setActive} onClose={() => setActive(null)} />
    </>
  )
}

function Lightbox({ photos, index, onIndex, onClose }) {
  const dialogRef = useRef(null)
  const touchX = useRef(null)
  const open = index !== null
  const count = photos.length
  const photo = open ? photos[index] : null

  const go = (step) => onIndex((index + step + count) % count)

  // Native modal dialog gives focus trapping, Escape and focus return; page scroll is locked by hand
  useEffect(() => {
    const dialog = dialogRef.current
    if (!open) return
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = ''
    }
  }, [open])

  // Warm the cache for the neighbouring photos so arrowing through feels instant
  useEffect(() => {
    if (!open) return
    for (const step of [1, -1]) new Image().src = `${photos[(index + step + count) % count].src}-lg.webp`
  }, [open, index, photos, count])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-white backdrop:bg-forest-950/95"
    >
      {photo && (
        <div
          className="flex h-full flex-col"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
            <p className="text-sm font-semibold text-forest-100" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-3 sm:px-20"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <img
              key={photo.src}
              src={`${photo.src}-lg.webp`}
              width={photo.w}
              height={photo.h}
              alt={photo.alt}
              className="h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 backdrop-blur transition hover:bg-forest-800 sm:left-5 sm:h-12 sm:w-12"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 backdrop-blur transition hover:bg-forest-800 sm:right-5 sm:h-12 sm:w-12"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="mx-auto max-w-3xl px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-base text-forest-50 sm:text-lg">
            {photo.alt}
          </p>
        </div>
      )}
    </dialog>
  )
}
