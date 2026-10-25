import { Eye, Target, UserRound } from 'lucide-react'
import { districts, leaders, org, symbolism } from '../data/content'
import { Logo, PageHeader, SectionHeading } from '../components/ui'

export default function About() {
  return (
    <>
      <PageHeader
        titleHi="हमारा परिचय"
        title="About the Sangh"
        subtitle="A students' movement born from the soil of Jharkhand, for the dignity and future of Adivasi society."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <Logo
          alt="Adivasi Chhatra Sangh logo"
          className="mx-auto aspect-square w-full max-w-60 shadow-2xl sm:max-w-sm ring-8 ring-forest-100"
        />
        <div className="space-y-4 text-base text-forest-900/85 sm:space-y-5 sm:text-lg">
          <h2 className="font-display text-[1.75rem] text-forest-900 sm:text-3xl">Who we are</h2>
          <p>
            <strong>{org.nameHi}, {org.stateHi}</strong> ({org.nameEn}, {org.stateEn}) is a
            registered organisation (Reg. No. {org.regNo}) of tribal students based in Ranchi. It
            brings together Adivasi students from colleges, universities and hostels across the
            state.
          </p>
          <p>
            Our motto — <em className="font-display text-forest-700">“{org.sloganHi}”</em> — sums up
            our belief: education is the foundation, and organised, democratic struggle is the way to
            protect the land, language, faith and constitutional rights of our people.
          </p>
          <p>
            From fee hikes in universities to the Sarna Dharma Code, from fair recruitment exams to
            the protection of the Fifth Schedule, the Sangh raises the voice of tribal students
            wherever it needs to be heard.
          </p>
        </div>
      </section>

      <section className="bg-forest-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-forest-100 sm:p-8">
            <Target className="text-forest-600" size={36} />
            <h3 className="mt-4 text-2xl font-bold text-forest-900">Our Mission</h3>
            <p className="font-display text-earth-500">हमारा उद्देश्य</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-forest-900/80">
              <li>Ensure access to affordable, quality education for every tribal student.</li>
              <li>Spread awareness of constitutional rights — Fifth Schedule, PESA, CNT/SPT Acts.</li>
              <li>Protect and promote tribal languages, Sarna faith and cultural heritage.</li>
              <li>Build strong, disciplined student units in every district.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-forest-100 sm:p-8">
            <Eye className="text-forest-600" size={36} />
            <h3 className="mt-4 text-2xl font-bold text-forest-900">Our Vision</h3>
            <p className="font-display text-earth-500">हमारी दृष्टि</p>
            <p className="mt-4 text-forest-900/80">
              An educated, aware and self-reliant Adivasi society that lives with dignity on its own
              land, speaks its own languages, follows its own faith, and takes its rightful place in
              shaping the future of Jharkhand and India.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="Our emblem" title="प्रतीक चिन्ह" />
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {symbolism.map((s) => (
            <div key={s.title} className="rounded-2xl border-l-4 border-sun-400 bg-white p-6 ring-1 ring-forest-100">
              <p className="font-display text-xl text-forest-700">{s.titleHi}</p>
              <h3 className="font-bold text-forest-900">{s.title}</h3>
              <p className="mt-2 text-forest-900/75">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="leaf-pattern bg-forest-800 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading light eyebrow="Leadership" title="केंद्रीय समिति" subtitle="Central committee of the Sangh." />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
            {leaders.map((l) => (
              <div key={l.role} className="rounded-2xl bg-white/5 p-4 text-center ring-1 sm:p-6 ring-white/10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-600 ring-4 sm:h-20 sm:w-20 ring-sun-400/60">
                  <UserRound className="size-7 sm:size-10" />
                </div>
                <p className="mt-3 text-sm font-bold sm:mt-4 sm:text-lg">{l.name ?? 'Name to be updated'}</p>
                <p className="text-sm text-sun-300 sm:text-base">{l.role}</p>
                <p className="font-display text-sm text-forest-200">{l.roleHi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Our presence"
          title="Across Jharkhand"
          subtitle="Building student units in all 24 districts of the state."
        />
        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {districts.map((d) => (
            <span key={d} className="rounded-full bg-forest-100 px-3 py-1.5 text-sm font-semibold sm:px-4 sm:py-2 sm:text-base text-forest-800">
              {d}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
