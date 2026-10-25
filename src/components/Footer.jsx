import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { navLinks, org } from '../data/content'
import { Logo } from './ui'
import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <footer className="leaf-pattern bg-forest-950 text-forest-100">
      <div className="tribal-band" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-16 w-16 ring-2 ring-sun-400" />
            <div>
              <p className="font-display text-xl text-white">{org.nameHi}</p>
              <p className="text-sm text-forest-300">
                {org.nameEn}, {org.stateEn}
              </p>
            </div>
          </div>
          <p className="mt-5 font-display text-lg text-sun-300">“{org.sloganHi}”</p>
          <p className="mt-1 text-sm text-forest-300">Registration No. {org.regNo}</p>
          <SocialLinks
            className="mt-5"
            linkClassName="bg-white/10 text-forest-100 ring-1 ring-white/15 hover:bg-sun-400 hover:text-forest-950"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-sun-400 uppercase">Quick Links</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="inline-block py-1 text-forest-200 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-sun-400 uppercase">Reach Us</h3>
          <ul className="mt-4 space-y-3 text-forest-200">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-sun-400" />
              {org.address}
            </li>
            <li className="flex gap-3">
              <Phone size={20} className="shrink-0 text-sun-400" />
              <div>
                {org.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="block hover:text-white">
                    {phone}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex min-w-0 gap-3">
              <Mail size={20} className="shrink-0 text-sun-400" />
              <a href={`mailto:${org.email}`} className="[overflow-wrap:anywhere] hover:text-white">
                {org.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-forest-400">
        © {new Date().getFullYear()} {org.nameEn}, {org.stateEn}. Jai Johar! जय जोहार!
      </div>
    </footer>
  )
}
