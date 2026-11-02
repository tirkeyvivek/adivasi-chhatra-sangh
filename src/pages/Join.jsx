import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'
import { districts, membershipFee, org } from '../data/content'
import { Button, PageHeader } from '../components/ui'
import { submitForm } from '../submitForm'
import { checkPayment, openCheckout } from '../payment'

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

const submitErrors = {
  invalid_phone: 'Please enter a valid 10 digit mobile number.',
  payment_unavailable: `Online payment is not working right now. Please try again in a few minutes, or call ${org.phones[0].number}.`,
}

export default function Join() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(null) // { name, district, paid }
  const [status, setStatus] = useState('idle') // idle | sending | error | paying | checking | unpaid | expired
  const [error, setError] = useState('')
  const [applicant, setApplicant] = useState(null) // { name, district } while the fee is being paid
  const [order, setOrder] = useState(null) // { orderId, sessionId, mode }; sessionId is set while it can be paid

  // Cashfree sends people back here with ?order_id=… when it can't use the popup (some in-app browsers)
  useEffect(() => {
    const orderId = searchParams.get('order_id')
    if (!orderId) return
    setSearchParams({}, { replace: true })
    setOrder({ orderId })
    confirm(orderId)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    const who = { name: fields.name, district: fields.district }
    setStatus('sending')
    try {
      const data = await submitForm('join', form, { returnUrl: `${window.location.origin}/join` })
      if (data.payment) {
        setApplicant(who)
        await pay(data.payment)
      } else {
        setSubmitted(who)
        setStatus('idle')
      }
    } catch (err) {
      setError(submitErrors[err.message] || '')
      setStatus('error')
    }
  }

  async function pay(nextOrder) {
    setOrder(nextOrder)
    setStatus('paying')
    try {
      await openCheckout(nextOrder)
    } catch {
      // Popup didn't load; the check below shows the "Pay" button again
    }
    await confirm(nextOrder.orderId)
  }

  // The website never decides on its own that a payment went through; the Apps Script asks Cashfree
  async function confirm(orderId) {
    setStatus('checking')
    try {
      const result = await checkPayment(orderId)
      const who = { name: result.name, district: result.district }
      if (result.paid) {
        setSubmitted({ ...who, paid: true })
        setStatus('idle')
        return
      }
      if (result.name) setApplicant(who)
      setOrder({ orderId, sessionId: result.sessionId, mode: result.mode })
      setStatus(result.expired ? 'expired' : 'unpaid')
    } catch {
      // Keep the current order so "Pay" or "Check again" can be tried once the connection is back
      setStatus('unpaid')
    }
  }

  function reset() {
    setSubmitted(null)
    setApplicant(null)
    setOrder(null)
    setStatus('idle')
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
            <p className="font-display text-xl text-sun-300">“{org.sloganHi}”</p>
            <p className="mt-2">Membership is open to tribal students studying in schools, colleges and universities.</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-forest-900/5 ring-1 ring-forest-100 sm:p-10">
          {submitted ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto text-forest-600" size={64} />
              <h2 className="mt-4 font-display text-3xl text-forest-900">
                जय जोहार{submitted.name && `, ${submitted.name}`}!
              </h2>
              {submitted.paid && (
                <p className="mt-3 font-semibold text-forest-700">
                  Your membership fee of ₹{membershipFee} has been received. If you gave an email address, the
                  receipt has been sent there.
                </p>
              )}
              <p className="mt-3 text-lg text-forest-900/80">
                Thank you for your interest. A member of the {submitted.district || 'district'} unit will contact you
                soon.
              </p>
              <Button variant="green" className="mt-8" onClick={reset}>
                Submit another
              </Button>
            </div>
          ) : status === 'paying' || status === 'checking' ? (
            <div className="py-14 text-center" role="status">
              <LoaderCircle className="mx-auto animate-spin text-forest-600" size={48} />
              <p className="mt-4 text-lg text-forest-900/80">
                {status === 'paying'
                  ? 'Complete the payment in the Cashfree window…'
                  : 'Checking your payment…'}
              </p>
            </div>
          ) : status === 'unpaid' || status === 'expired' ? (
            <div className="py-10 text-center">
              <CircleAlert className="mx-auto text-earth-500" size={56} />
              <h2 className="mt-4 text-2xl font-bold text-forest-900">
                {status === 'expired' ? 'Payment time is over' : 'Payment not completed'}
              </h2>
              <p className="mt-3 text-lg text-forest-900/80">
                {status === 'expired'
                  ? `The time to pay the ₹${membershipFee} fee for this application has passed. Please fill the form again.`
                  : `Your application${applicant?.name ? `, ${applicant.name},` : ''} is saved, but the ₹${membershipFee} membership fee has not been paid yet.`}
              </p>
              {status === 'unpaid' && (
                <p className="mt-2 text-forest-900/70">
                  If money was deducted from your account, it can take a few minutes to show here. Use “Check
                  again”.
                </p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {status === 'expired' ? (
                  <Button variant="green" onClick={reset}>
                    Fill the form again
                  </Button>
                ) : (
                  <>
                    {order?.sessionId && (
                      <Button variant="green" onClick={() => pay(order)}>
                        Pay ₹{membershipFee}
                      </Button>
                    )}
                    <Button variant="greenOutline" onClick={() => confirm(order.orderId)}>
                      Check again
                    </Button>
                  </>
                )}
              </div>
              <p className="mt-6 text-sm text-forest-900/60">
                Need help? Call {org.phones[0].number}
                {order?.orderId && ` and mention reference ${order.orderId.slice(-12)}`}.
              </p>
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
              <Field label="Email (for your fee receipt)">
                <input name="email" type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" />
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
              <p className="rounded-xl bg-sun-300/30 p-4 text-forest-900 ring-1 ring-sun-400/60 sm:col-span-2">
                Membership fee: <strong>₹{membershipFee}</strong>, paid online by UPI, card or net banking after you
                submit. The fee is non-refundable. See the{' '}
                <Link to="/refund-policy" className="font-semibold text-forest-700 underline">
                  refund policy
                </Link>{' '}
                and{' '}
                <Link to="/terms" className="font-semibold text-forest-700 underline">
                  terms
                </Link>
                .
              </p>
              {status === 'error' && (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200 sm:col-span-2">
                  {error ||
                    `Sorry, your application could not be sent. Please try again, or call ${org.phones[0].number}.`}
                </p>
              )}
              <div className="sm:col-span-2">
                <Button
                  variant="green"
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full disabled:opacity-60 sm:w-auto"
                >
                  {status === 'sending' ? 'Submitting…' : `Submit & Pay ₹${membershipFee}`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
