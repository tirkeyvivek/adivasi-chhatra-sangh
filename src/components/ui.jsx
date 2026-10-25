import { Link } from 'react-router'
import { org } from '../data/content'

export function SectionHeading({ eyebrow, title, subtitle, light = false, center = true }) {
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p
          className={`text-sm font-bold tracking-[0.2em] uppercase ${
            light ? 'text-sun-300' : 'text-earth-500'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 font-display text-[1.75rem] leading-snug sm:text-4xl ${light ? 'text-white' : 'text-forest-900'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base sm:mt-4 sm:text-lg ${light ? 'text-forest-100' : 'text-forest-800/80'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function PageHeader({ titleHi, title, subtitle }) {
  return (
    <section className="leaf-pattern relative overflow-hidden bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-white">
      <Hills className="absolute inset-x-0 bottom-0 text-clay" />
      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-20 text-center sm:px-6 sm:pt-16 sm:pb-24">
        <p className="font-display text-lg text-sun-300 sm:text-xl">{titleHi}</p>
        <h1 className="mt-2 text-3xl font-extrabold min-[400px]:text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-base text-forest-100 sm:mt-4 sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}

export function Button({ to, href, variant = 'primary', children, className = '', ...props }) {
  const styles = {
    primary: 'bg-sun-400 text-forest-950 hover:bg-sun-300 shadow-lg shadow-sun-500/20',
    green: 'bg-forest-700 text-white hover:bg-forest-800',
    outline: 'border-2 border-white/70 text-white hover:bg-white/10',
  }
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition ${styles[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} className={cls} {...props}>{children}</a>
  return <button className={cls} {...props}>{children}</button>
}

// Layered hills silhouette used at the bottom of green banners
export function Hills({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`h-10 w-full sm:h-20 lg:h-24 ${className}`}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        opacity="0.25"
        d="M0 80 L120 50 L260 85 L420 30 L560 75 L720 40 L880 80 L1040 35 L1200 70 L1320 45 L1440 75 V120 H0 Z"
      />
      <path
        fill="currentColor"
        d="M0 100 C180 70 300 110 480 90 C660 70 780 110 960 92 C1140 74 1280 108 1440 88 V120 H0 Z"
      />
    </svg>
  )
}

// The source JPEG has a thin frame at its edges, so it is zoomed slightly inside a circular crop
export function Logo({ className = '', alt = '' }) {
  return (
    <span className={`inline-block shrink-0 overflow-hidden rounded-full bg-white ${className}`}>
      <img src={org.logo} alt={alt} className="h-full w-full scale-[1.08] object-cover" />
    </span>
  )
}
