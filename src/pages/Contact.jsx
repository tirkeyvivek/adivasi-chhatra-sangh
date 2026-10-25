import { useState } from 'react'
import { CheckCircle2, ImagePlus, LoaderCircle, Mail, MapPin, Phone, X } from 'lucide-react'
import { org, socials } from '../data/content'
import { Button, PageHeader } from '../components/ui'
import SocialLinks from '../components/SocialLinks'
import { compressPhoto, submitForm } from '../submitForm'

const inputClass =
  'min-h-12 w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-base text-forest-950 outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-200'

const ISSUE_SUBJECT = 'Report an issue at college / hostel'
const MAX_PHOTOS = 3

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [subject, setSubject] = useState('General enquiry')
  const [photos, setPhotos] = useState([]) // compressed JPEG data URLs
  const [photoBusy, setPhotoBusy] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const isIssue = subject === ISSUE_SUBJECT

  async function addPhotos(e) {
    const files = [...e.target.files].slice(0, MAX_PHOTOS - photos.length)
    e.target.value = ''
    if (!files.length) return
    setPhotoBusy(true)
    setPhotoError('')
    const added = []
    for (const file of files) {
      try {
        added.push(await compressPhoto(file))
      } catch {
        setPhotoError(`Couldn't read "${file.name}". Please choose a JPG or PNG photo.`)
      }
    }
    setPhotos((current) => [...current, ...added].slice(0, MAX_PHOTOS))
    setPhotoBusy(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    // Photos only go with issue reports; the data URL prefix is dropped, leaving base64 JPEG
    const extra = isIssue ? Object.fromEntries(photos.map((p, i) => [`photo${i + 1}`, p.split(',')[1]])) : {}
    try {
      await submitForm('contact', e.currentTarget, extra)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setSubject('General enquiry')
    setPhotos([])
    setPhotoError('')
  }

  const cards = [
    { icon: MapPin, title: 'Office', value: org.address },
    {
      icon: Phone,
      title: 'Phone',
      links: org.phones.map(({ number, name }) => ({
        value: name ? `${number} (${name})` : number,
        href: `tel:${number.replace(/\s/g, '')}`,
      })),
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
              <Button variant="green" className="mt-8" onClick={reset}>
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
              <select
                name="subject"
                className={inputClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>General enquiry</option>
                <option>{ISSUE_SUBJECT}</option>
                <option>Start a unit</option>
                <option>Media / Press</option>
                <option>Other</option>
              </select>
              <textarea name="message" required rows={5} className={inputClass} placeholder="Your message *" />
              {isIssue && (
                <div>
                  <p className="text-sm font-semibold text-forest-900">
                    Photos <span className="font-normal text-forest-800/70">(optional, up to {MAX_PHOTOS})</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {photos.map((src, i) => (
                      <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl ring-1 ring-forest-200">
                        <img src={src} alt={`Attached photo ${i + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos((current) => current.filter((_, j) => j !== i))}
                          aria-label={`Remove photo ${i + 1}`}
                          className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-forest-950/70 text-white hover:bg-forest-950"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {photos.length < MAX_PHOTOS && (
                      <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-forest-300 text-sm font-semibold text-forest-700 transition focus-within:ring-4 focus-within:ring-forest-200 hover:border-forest-500 hover:bg-forest-50">
                        {photoBusy ? <LoaderCircle size={24} className="animate-spin" /> : <ImagePlus size={24} />}
                        {photoBusy ? 'Adding…' : 'Add photo'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={photoBusy}
                          onChange={addPhotos}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                  {photoError && <p className="mt-2 text-sm text-red-700">{photoError}</p>}
                  <p className="mt-2 text-sm text-forest-800/70">Photos are seen only by the Sangh's office bearers.</p>
                </div>
              )}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {status === 'error' && (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
                  Sorry, your message could not be sent. Please try again, or call {org.phones[0].number}.
                </p>
              )}
              <Button
                variant="green"
                type="submit"
                disabled={status === 'sending' || photoBusy}
                className="disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
