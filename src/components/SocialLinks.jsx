import { socials } from '../data/content'

// lucide-react no longer ships brand icons, so these are drawn inline (24×24 grid)
const icons = {
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </g>
  ),
  Facebook: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
    />
  ),
  YouTube: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </g>
  ),
  X: (
    <path
      fill="currentColor"
      transform="translate(2 2) scale(0.8333)"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  ),
}

export default function SocialLinks({ className = '', linkClassName = '' }) {
  const active = socials.filter((s) => s.url)
  if (!active.length) return null
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {active.map((s) => (
        <li key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${s.name} (opens in a new tab)`}
            title={s.name}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${linkClassName}`}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              {icons[s.name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
