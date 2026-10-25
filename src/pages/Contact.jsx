import { useState } from 'react'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { org, socials } from '../data/content'
import { Button, PageHeader } from '../components/ui'
import SocialLinks from '../components/SocialLinks'
import { submitForm } from '../submitForm'

const inputClass =
  'min-h-12 w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-base text-forest-950 outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-200'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitForm('contact', e.currentTarget)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const cards = [
    { icon: MapPin, title: 'Office', value: org.address },
    {
      icon: Phone,
      title: 'Phone',
      links: org.phones.map((phone) => ({ value: phone, href: `tel:${phone.replace(/\s/g, '')}` })),
    },
    { icon: Mail, title: 'Email', links: [{ value: org.email, href: `mailto:${org.email}` }] },
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
          {cards.map(({ icon: Icon, title, value, links }) => (
            <div key={title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 sm:p-6 ring-forest-100">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-white">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-forest-900">{title}</p>
                {links ? (
                  links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block text-forest-700 [overflow-wrap:anywhere] hover:underline"
                    >
                      {link.value}
                    </a>
                  ))
                ) : (
                  <p className="text-forest-900/80">{value}</p>
                )}
              </div>
            </div>
          ))}
          {socials.some((s) => s.url) && (
            <div className="rounded-2xl bg-white p-5 ring-1 sm:p-6 ring-forest-100">
              <p className="font-bold text-forest-900">Follow us</p>
              <SocialLinks
                className="mt-3"
                linkClassName="bg-forest-100 text-forest-700 hover:bg-forest-700 hover:text-white"
              />
            </div>
          )}
          <div className="overflow-hidden rounded-2xl ring-1 ring-forest-100">
            <iframe
              title="Office map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(org.address)}&output=embed`}
              className="h-56 w-full sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-forest-900/5 ring-1 ring-forest-100 sm:p-10">
          {status === 'sent' ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto text-forest-600" size={64} />
              <h2 className="mt-4 font-display text-3xl text-forest-900">धन्यवाद!</h2>
              <p className="mt-3 text-lg text-forest-900/80">Your message has been noted. We will get back to you soon.</p>
              <Button variant="green" className="mt-8" onClick={() => setStatus('idle')}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                <option>Other</option>
              </select>
              <textarea name="message" required rows={5} className={inputClass} placeholder="Your message *" />
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {status === 'error' && (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
                  Sorry, your message could not be sent. Please try again, or call {org.phones[0]}.
                </p>
              )}
              <Button variant="green" type="submit" disabled={status === 'sending'} className="disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
