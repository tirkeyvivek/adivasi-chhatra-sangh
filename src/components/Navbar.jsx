import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { navLinks, org } from '../data/content'
import { Button, Logo } from './ui'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock page scroll and allow Escape to close while the mobile menu is open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-[15px] font-semibold transition-colors xl:px-4 ${
      isActive ? 'bg-forest-700 text-white' : 'text-forest-900 hover:bg-forest-100'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-forest-200/60 bg-clay/95 backdrop-blur">
      <div className="tribal-band" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Logo
            alt="Adivasi Chhatra Sangh logo"
            className="h-11 w-11 ring-2 ring-forest-600 sm:h-14 sm:w-14"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-base text-forest-800 sm:text-xl">
              {org.nameHi}, {org.stateHi}
            </p>
            <p className="truncate text-[11px] font-semibold tracking-wide text-forest-600 uppercase sm:text-xs">
              {org.nameEn}
              <span className="hidden min-[400px]:inline"> · {org.stateEn}</span>
            </p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-1 shrink-0 rounded-xl p-2.5 text-forest-800 hover:bg-forest-100 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Absolute (not fixed): backdrop-blur on the header makes it the containing block */}
      {open && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-full h-dvh bg-forest-950/50"
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-b-3xl border-t border-forest-200 bg-clay px-4 pt-3 pb-6 shadow-2xl sm:px-6"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-semibold ${
                        isActive ? 'bg-forest-700 text-white' : 'text-forest-900 active:bg-forest-100'
                      }`
                    }
                  >
                    {link.label}
                    <span className="font-display text-base font-normal opacity-75">{link.labelHi}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <Button to="/join" className="mt-4 w-full">
              Become a Member
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
