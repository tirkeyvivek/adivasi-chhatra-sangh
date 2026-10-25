import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import { org } from '../data/content'
import { Button, Logo } from '../components/ui'
import AdminDashboard from '../components/AdminDashboard'
import { clearToken, getToken, login } from '../adminApi'

const loginErrors = {
  wrong_password: 'Incorrect password. Please try again.',
  locked: 'Too many failed attempts. Login is locked for 15 minutes — please wait and try again.',
  password_not_set:
    'No admin password has been set yet. In the Google Sheet, open the menu ACS Admin → Set admin password.',
  not_configured: 'The forms endpoint is not configured yet (formsEndpoint in src/data/content.js).',
  network: 'Could not reach the server. Check your internet connection and try again.',
}

// Admin area: login screen, then the submissions dashboard. Lazy-loaded from App.jsx.
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    document.title = `Admin | ${org.nameEn}`
    // Keep the admin page out of search results
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => {
      document.title = previousTitle
      robots.remove()
    }
  }, [])

  function handleLogout() {
    clearToken()
    setNotice('')
    setLoggedIn(false)
  }

  function handleExpired() {
    clearToken()
    setNotice('Your session has expired. Please log in again.')
    setLoggedIn(false)
  }

  if (loggedIn) return <AdminDashboard onLogout={handleLogout} onExpired={handleExpired} />
  return (
    <LoginScreen
      notice={notice}
      onLogin={() => {
        setNotice('')
        setLoggedIn(true)
      }}
    />
  )
}

function LoginScreen({ notice, onLogin }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await login(password)
      onLogin()
    } catch (err) {
      setError(loginErrors[err.code] || 'Login failed. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div className="leaf-pattern flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-forest-950/30 sm:p-10">
          <div className="flex items-center gap-3">
            <Logo className="h-14 w-14 ring-2 ring-forest-100" />
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight text-earth-500">{org.nameHi}</p>
              <h1 className="text-2xl font-extrabold text-forest-900">Admin Login</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {notice && !error && (
              <p role="status" className="rounded-xl bg-sun-300/30 p-4 text-earth-600 ring-1 ring-sun-400/50">
                {notice}
              </p>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-forest-900">Password</span>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-forest-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  autoComplete="current-password"
                  className="min-h-12 w-full rounded-xl border border-forest-200 bg-white py-3 pr-12 pl-11 text-base text-forest-950 outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-200"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-forest-600 hover:bg-forest-50"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
                {error}
              </p>
            )}
            <Button
              variant="green"
              type="submit"
              disabled={status === 'sending' || !password}
              className="w-full disabled:opacity-60"
            >
              {status === 'sending' ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
        </div>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-100 hover:text-white"
        >
          <ArrowLeft size={18} /> Back to website
        </Link>
      </div>
    </div>
  )
}
