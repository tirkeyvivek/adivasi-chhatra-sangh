import { ExternalLink, Newspaper } from 'lucide-react'
import { news } from '../data/content'
import { PageHeader } from '../components/ui'

export default function News() {
  return (
    <>
      <PageHeader
        titleHi="समाचार"
        title="News & Press"
        subtitle="Coverage of the Sangh's activities in newspapers and news portals."
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <ol className="relative space-y-8 ml-3 border-l-2 border-forest-300 pl-6 sm:ml-0 sm:pl-8">
          {news.map((n) => (
            <li key={n.url} className="relative">
              <span className="absolute top-0.5 -left-[39px] flex sm:top-1 sm:-left-[47px] h-7 w-7 items-center justify-center rounded-full bg-forest-700 text-white ring-4 ring-clay">
                <Newspaper size={14} />
              </span>
              <p className="text-sm font-bold text-earth-500">{n.date}</p>
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-2 block rounded-2xl bg-white p-5 ring-1 sm:p-6 ring-forest-100 transition hover:ring-forest-400"
              >
                <h2 className="text-base font-bold text-forest-900 sm:text-lg group-hover:text-forest-700">{n.title}</h2>
                <p className="mt-3 flex items-center gap-2 text-sm text-forest-700">
                  Read on {n.source} <ExternalLink size={14} />
                </p>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
