import { campaigns } from '../data/content'
import { Button, PageHeader } from '../components/ui'

export default function Campaigns() {
  return (
    <>
      <PageHeader
        titleHi="हमारे अभियान"
        title="Campaigns & Struggles"
        subtitle="The issues we raise on campuses, on the streets and before the government."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {campaigns.map(({ icon: Icon, title, titleHi, text, tag }, i) => (
            <article
              key={title}
              className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm min-[480px]:flex-row min-[480px]:gap-5 sm:p-7 ring-1 ring-forest-100 transition hover:shadow-lg hover:shadow-forest-900/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 bg-forest-700 text-white">
                <Icon size={28} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-forest-400">0{i + 1}</span>
                  <span className="rounded-full bg-sun-300/40 px-3 py-0.5 text-xs font-bold text-earth-600">
                    {tag}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-forest-900">{title}</h2>
                <p className="font-display text-earth-500">{titleHi}</p>
                <p className="mt-3 text-forest-900/80">{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-forest-100 px-5 py-8 text-center sm:mt-14 sm:p-12">
          <h2 className="font-display text-2xl text-forest-900 sm:text-3xl">आवाज़ उठाइए, साथ आइए</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg text-forest-900/80">
            Facing an issue in your college, hostel or exam? Tell us — the Sangh stands with every
            Adivasi student.
          </p>
          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
            <Button to="/contact" variant="green">Report an Issue</Button>
            <Button to="/join">Join a Campaign</Button>
          </div>
        </div>
      </section>
    </>
  )
}
