import { Link } from 'react-router'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  campaigns,
  galleryPhotos,
  galleryPreview,
  heroPhotos,
  news,
  org,
  pillars,
  stats,
  symbolism,
} from '../data/content'
import { Button, Hills, SectionHeading } from '../components/ui'
import PhotoGallery from '../components/PhotoGallery'
import PhotoSlider from '../components/PhotoSlider'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="leaf-pattern relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-700 to-forest-800 text-white">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sun-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-24 sm:px-6 sm:pt-14 sm:pb-28 lg:grid-cols-2 lg:gap-12 lg:pt-20 lg:pb-36">
          <div>
            <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-sun-300 ring-1 ring-white/20">
              जय जोहार · Reg. No. {org.regNo}
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight min-[400px]:text-5xl sm:mt-6 sm:text-6xl">
              {org.nameHi}
              <span className="block text-sun-300">{org.stateHi}</span>
            </h1>
            <p className="mt-5 font-display text-xl text-forest-50 min-[400px]:text-2xl sm:mt-6 sm:text-3xl">“{org.sloganHi}”</p>
            <p className="mt-2 text-base text-forest-200 italic sm:text-lg">{org.sloganEn}</p>
            <p className="mt-5 max-w-xl text-base text-forest-100 sm:mt-6 sm:text-lg">
              A registered organisation of tribal students working for education, identity and the
              constitutional rights of Adivasi society in Jharkhand.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <Button to="/join">
                Become a Member <ArrowRight size={18} />
              </Button>
              <Button to="/about" variant="outline">
                Know More
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <PhotoSlider photos={heroPhotos} label="Photos from the Sangh's programmes" />
          </div>
        </div>
        <Hills className="absolute inset-x-0 bottom-0 text-clay" />
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl sm:-mt-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-3xl bg-white px-4 py-6 sm:p-6 shadow-xl shadow-forest-900/10 ring-1 ring-forest-100 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-forest-700 min-[400px]:text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-forest-800/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="What we stand for"
          title="शिक्षा, पहचान और अधिकार"
          subtitle="Our work rests on four pillars — rooted in the forests, hills and heritage of Jharkhand."
        />
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, titleHi, text }) => (
            <div
              key={title}
              className="group rounded-3xl bg-white p-6 ring-1 sm:p-7 ring-forest-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/10"
            >
              <div className="inline-flex rounded-2xl bg-forest-100 p-3 text-forest-700 transition group-hover:bg-forest-700 group-hover:text-white">
                <Icon size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-forest-900">{title}</h3>
              <p className="font-display text-earth-500">{titleHi}</p>
              <p className="mt-3 text-forest-800/80">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logo symbolism */}
      <section className="leaf-pattern bg-forest-800 py-14 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div>
            <SectionHeading
              light
              center={false}
              eyebrow="Our emblem"
              title="हमारे प्रतीक का अर्थ"
              subtitle="Every element of the Sangh's emblem carries a message from our ancestors to our students."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {symbolism.map((s) => (
              <div key={s.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
                <p className="font-display text-xl text-sun-300">{s.titleHi}</p>
                <h3 className="font-bold">{s.title}</h3>
                <p className="mt-2 text-forest-100">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns preview */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <SectionHeading center={false} eyebrow="Our struggles" title="Current Campaigns" />
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 font-bold text-forest-700 hover:text-forest-900"
          >
            View all campaigns <ArrowRight size={18} />
          </Link>
        </div>
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:mt-10 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {campaigns.slice(0, 3).map(({ icon: Icon, title, titleHi, text, tag }) => (
            <article
              key={title}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border-t-4 border-forest-600 bg-white p-6 shadow-sm sm:w-[60%] sm:p-7 md:w-auto ring-1 ring-forest-100"
            >
              <div className="flex items-center justify-between">
                <Icon className="text-forest-600" size={30} />
                <span className="rounded-full bg-sun-300/40 px-3 py-1 text-xs font-bold text-earth-600">
                  {tag}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-forest-900">{title}</h3>
              <p className="font-display text-earth-500">{titleHi}</p>
              <p className="mt-3 text-forest-800/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="leaf-pattern bg-forest-900 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            light
            eyebrow="Photo gallery"
            title="संघर्ष की झलकियाँ"
            subtitle="Rallies, sit-ins, signature campaigns and celebrations — moments from the Sangh's work across Jharkhand."
          />
          <div className="mt-10 sm:mt-12">
            <PhotoGallery photos={galleryPhotos} preview={galleryPreview} />
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-forest-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="In the news" title="Latest Updates" />
          <div className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:mt-10 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
            {news.slice(0, 3).map((n) => (
              <a
                key={n.url}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="group flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-white p-6 ring-1 sm:w-[60%] md:w-auto ring-forest-100 transition hover:ring-forest-400"
              >
                <p className="text-sm font-bold text-earth-500">{n.date}</p>
                <h3 className="mt-2 flex-1 text-lg font-bold text-forest-900 group-hover:text-forest-700">
                  {n.title}
                </h3>
                <p className="mt-4 flex items-center gap-2 text-sm text-forest-700">
                  {n.source} <ExternalLink size={14} />
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="leaf-pattern relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-700 to-forest-900 px-5 py-10 sm:rounded-[2rem] sm:px-16 sm:py-14 text-center text-white">
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sun-400/20 blur-3xl" />
          <h2 className="relative font-display text-2xl sm:text-4xl">संगठन से जुड़ें, समाज को मज़बूत करें</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-base text-forest-100 sm:text-lg">
            Join Adivasi students across Jharkhand who are studying hard and standing up for their
            community. Every college, every hostel, every district needs your voice.
          </p>
          <div className="relative mt-8 grid gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
            <Button to="/join">Join the Sangh</Button>
            <Button to="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
