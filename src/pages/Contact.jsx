import { useState } from 'react'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { org } from '../data/content'
import { Button, PageHeader } from '../components/ui'

const inputClass =
  'min-h-12 w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-base text-forest-950 outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-200'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const cards = [
    { icon: MapPin, title: 'Office', value: org.address },
    { icon: Phone, title: 'Phone', value: org.phone, href: `tel:${org.phone.replace(/\s/g, '')}` },
    { icon: Mail, title: 'Email', value: org.email, href: `mailto:${org.email}` },
  ]

  return (
    <>
      <PageHeader
        titleHi="संपर्क करें"
        title="Contact Us"
        subtitle="Have a question, an issue to report, or want to start a unit in your college? Write to us."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 sm:space-y-5">
          {cards.map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 sm:p-6 ring-forest-100">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-white">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-forest-900">{title}</p>
                {href ? (
                  <a href={href} className="text-forest-700 [overflow-wrap:anywhere] hover:underline">{value}</a>
                ) : (
                  <p className="text-forest-900/80">{value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="overflow-hidden rounded-2xl ring-1 ring-forest-100">
            <iframe
              title="Ranchi map"
              src="https://www.google.com/maps?q=Karamtoli,Ranchi,Jharkhand&output=embed"
              className="h-56 w-full sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-forest-900/5 ring-1 ring-forest-100 sm:p-10">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto text-forest-600" size={64} />
              <h2 className="mt-4 font-display text-3xl text-forest-900">धन्यवाद!</h2>
              <p className="mt-3 text-lg text-forest-900/80">Your message has been noted. We will get back to you soon.</p>
              <Button variant="green" className="mt-8" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            // No backend yet: the form only confirms on screen
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="space-y-4 sm:space-y-5"
            >
              <div>
                <h2 className="text-2xl font-bold text-forest-900">Send a Message</h2>
                <p className="font-display text-earth-500">संदेश भेजें</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <input name="name" required className={inputClass} placeholder="Your name *" />
                <input name="phone" type="tel" className={inputClass} placeholder="Mobile number" />
              </div>
              <input name="email" type="email" required className={inputClass} placeholder="Email address *" />
              <select name="subject" className={inputClass} defaultValue="General enquiry">
                <option>General enquiry</option>
                <option>Report an issue at college / hostel</option>
                <option>Start a unit</option>
                <option>Media / Press</option>
              </select>
              <textarea name="message" required rows={5} className={inputClass} placeholder="Your message *" />
              <Button variant="green" type="submit">Send Message</Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
