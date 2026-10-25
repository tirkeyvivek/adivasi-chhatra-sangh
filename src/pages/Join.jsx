import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { districts, org } from '../data/content'
import { Button, PageHeader } from '../components/ui'
import { submitForm } from '../submitForm'

const inputClass =
  'min-h-12 w-full rounded-xl border border-forest-200 bg-white px-4 py-3 text-base text-forest-950 outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-200'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest-900">{label}</span>
      {children}
    </label>
  )
}

const benefits = [
  'Be part of a statewide network of Adivasi students',
  'Get guidance on scholarships, admissions and exams',
  'Take part in campaigns, seminars and cultural programmes',
  'Lead a unit in your college, hostel or district',
]

export default function Join() {
  const [submitted, setSubmitted] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | error

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      await submitForm('join', form)
      setSubmitted(Object.fromEntries(new FormData(form)))
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        titleHi="सदस्य बनें"
        title="Join the Sangh"
        subtitle="Become a member and help build a stronger, educated and united Adivasi society."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="font-display text-[1.75rem] text-forest-900 sm:text-3xl">क्यों जुड़ें?</h2>
          <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 text-base text-forest-900/85 sm:text-lg">
                <CheckCircle2 className="mt-1 shrink-0 text-forest-600" size={22} />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-forest-800 p-5 sm:mt-8 sm:p-6 text-forest-50">
            <p className="font-display text-xl text-sun-300">“पढ़ेंगे और हक के लिए लड़ेंगे”</p>
            <p className="mt-2">Membership is open to tribal students studying in schools, colleges and universities.</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-forest-900/5 ring-1 ring-forest-100 sm:p-10">
          {submitted ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto text-forest-600" size={64} />
              <h2 className="mt-4 font-display text-3xl text-forest-900">जय जोहार, {submitted.name}!</h2>
              <p className="mt-3 text-lg text-forest-900/80">
                Thank you for your interest. A member of the {submitted.district} unit will contact you soon.
              </p>
              <Button variant="green" className="mt-8" onClick={() => setSubmitted(null)}>
                Submit another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="sm:col-span-2">
                <h2 className="text-2xl font-bold text-forest-900">Membership Form</h2>
                <p className="font-display text-earth-500">सदस्यता आवेदन</p>
              </div>
              <Field label="Full Name *">
                <input name="name" required className={inputClass} placeholder="Your name" />
              </Field>
              <Field label="Mobile Number *">
                <input
                  name="phone"
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  title="10 digit mobile number"
                  className={inputClass}
                  placeholder="10 digit number"
                />
              </Field>
              <Field label="Email">
                <input name="email" type="email" className={inputClass} placeholder="you@example.com" />
              </Field>
              <Field label="District *">
                <select name="district" required className={`${inputClass} h-12 py-0`} defaultValue="">
                  <option value="" disabled>Select district</option>
                  {districts.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                  <option>Outside Jharkhand</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address">
                  <textarea
                    name="address"
                    rows={2}
                    autoComplete="street-address"
                    className={inputClass}
                    placeholder="Village / town, block, PIN code"
                  />
                </Field>
              </div>
              <Field label="College / Institution / Common *">
                <input name="college" required className={inputClass} placeholder="Name of institution" />
              </Field>
              <Field label="Course / Class">
                <input name="course" className={inputClass} placeholder="e.g. B.A. 2nd year" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Why do you want to join?">
                  <textarea name="message" rows={4} className={inputClass} placeholder="Tell us a little about yourself" />
                </Field>
              </div>
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {status === 'error' && (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200 sm:col-span-2">
                  Sorry, your application could not be sent. Please try again, or call {org.phones[0].number}.
                </p>
              )}
              <div className="sm:col-span-2">
                <Button
                  variant="green"
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full disabled:opacity-60 sm:w-auto"
                >
                  {status === 'sending' ? 'Submitting…' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
