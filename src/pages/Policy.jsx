import { Mail, MapPin, Phone } from 'lucide-react'
import { org } from '../data/content'
import { PageHeader } from '../components/ui'

export default function Policy({ policy }) {
  return (
    <>
      <PageHeader titleHi={policy.titleHi} title={policy.title} />
      <section className="bg-clay px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-earth-500">Last updated: {policy.lastUpdated}</p>
          {policy.intro && <p className="mt-4 text-lg text-forest-900/85">{policy.intro}</p>}

          {policy.sections.map((s) => (
            <div key={s.heading} className="mt-9">
              <h2 className="font-display text-2xl text-forest-900">{s.heading}</h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i} className="mt-3 text-base leading-relaxed text-forest-900/85 sm:text-lg">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-forest-900/85 marker:text-earth-500 sm:text-lg">
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-forest-900/10">
            <h2 className="font-display text-2xl text-forest-900">Contact us</h2>
            <p className="mt-2 text-forest-900/85">
              {org.nameEn}, {org.stateEn} · Registration No. {org.regNo}
            </p>
            <ul className="mt-4 space-y-3 text-forest-900/85">
              <li className="flex gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-earth-500" />
                {org.address}
              </li>
              <li className="flex min-w-0 gap-3">
                <Mail size={20} className="mt-0.5 shrink-0 text-earth-500" />
                <a href={`mailto:${org.email}`} className="[overflow-wrap:anywhere] underline hover:text-forest-700">
                  {org.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={20} className="mt-0.5 shrink-0 text-earth-500" />
                <div>
                  {org.phones.map(({ number, name }) => (
                    <a
                      key={number}
                      href={`tel:${number.replace(/\s/g, '')}`}
                      className="block hover:text-forest-700"
                    >
                      {number}
                      {name && ` (${name})`}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
