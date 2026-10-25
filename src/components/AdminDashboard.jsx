import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Download, Inbox, LoaderCircle, LogOut, Mail, Phone, RefreshCw, Search, TriangleAlert } from 'lucide-react'
import { org } from '../data/content'
import { Logo } from './ui'
import { listSubmissions, updateStatus } from '../adminApi'

const ISSUE_SUBJECT = 'Report an issue at college / hostel'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const SEARCH_FIELDS = ['name', 'phone', 'email', 'message', 'college', 'address']
// Shown in the card header rather than in the field list
const HEADER_FIELDS = ['name', 'phone', 'email']

const tabs = [
  { key: 'contact', label: 'Contact', filterField: 'subject', filterLabel: 'All subjects', empty: 'No messages yet.' },
  {
    key: 'join',
    label: 'Membership',
    filterField: 'district',
    filterLabel: 'All districts',
    empty: 'No membership applications yet.',
  },
]

const statusStyles = {
  New: 'bg-sun-300/40 text-earth-600 ring-sun-400/70',
  'In progress': 'bg-sky-50 text-sky-800 ring-sky-200',
  Contacted: 'bg-sky-50 text-sky-800 ring-sky-200',
  Resolved: 'bg-forest-50 text-forest-700 ring-forest-200',
  Approved: 'bg-forest-50 text-forest-700 ring-forest-200',
  Rejected: 'bg-red-50 text-red-700 ring-red-200',
}

const errorText = {
  network: 'Could not reach the server. Check your internet connection and try again.',
  not_configured: 'The forms endpoint is not configured yet (formsEndpoint in src/data/content.js).',
  row_changed: 'This entry has moved in the Google Sheet since the page loaded. Refresh and try again.',
}

const selectClass =
  'min-h-11 w-full min-w-0 rounded-xl border border-forest-200 bg-white px-3 py-2 text-base text-forest-950 outline-none transition focus:border-forest-500 focus:ring-4 focus:ring-forest-200'

// Adds a parsed date to each row and sorts newest first
function normalize(forms) {
  const result = {}
  for (const { key } of tabs) {
    const form = forms[key] || { fields: [], headers: [], statuses: [], rows: [] }
    const rows = form.rows.map((row) => {
      const date = new Date(row.submittedAt)
      return { ...row, date: Number.isNaN(date.getTime()) ? null : date }
    })
    rows.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0) || b.id - a.id)
    result[key] = { ...form, rows }
  }
  return result
}

function formatDate(row) {
  return row.date ? row.date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : row.submittedAt || '—'
}

function matchesSearch(row, query) {
  if (!query) return true
  if (SEARCH_FIELDS.some((field) => (row.values[field] || '').toLowerCase().includes(query))) return true
  // "9431520796" should also find "+91 94315 20796"
  const digits = /^[\d\s+-]+$/.test(query) ? query.replace(/\D/g, '') : ''
  return digits.length > 2 && (row.values.phone || '').replace(/\D/g, '').includes(digits)
}

// Quotes every cell, and stops cells starting with = + - @ being run as formulas in Excel/Sheets
function csvCell(value) {
  let text = String(value ?? '')
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export default function AdminDashboard({ onLogout, onExpired }) {
  const [forms, setForms] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [tab, setTab] = useState('contact')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fieldFilter, setFieldFilter] = useState('')
  const [saving, setSaving] = useState({})
  const [rowErrors, setRowErrors] = useState({})

  async function load() {
    setLoading(true)
    setLoadError('')
    try {
      setForms(normalize(await listSubmissions()))
      setUpdatedAt(new Date())
      setRowErrors({})
    } catch (err) {
      if (err.code === 'unauthorized') return onExpired()
      setLoadError(errorText[err.code] || 'Could not load submissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const tabInfo = tabs.find((t) => t.key === tab)
  const current = forms?.[tab]

  const stats = useMemo(() => {
    if (!forms) return null
    const since = Date.now() - WEEK_MS
    const all = [...forms.contact.rows, ...forms.join.rows]
    return {
      messages: forms.contact.rows.length,
      openIssues: forms.contact.rows.filter((r) => r.values.subject === ISSUE_SUBJECT && r.status !== 'Resolved')
        .length,
      newApplications: forms.join.rows.filter((r) => r.status === 'New').length,
      lastWeek: all.filter((r) => r.date && r.date.getTime() >= since).length,
    }
  }, [forms])

  const filterOptions = useMemo(() => {
    if (!current) return []
    const values = new Set(current.rows.map((r) => r.values[tabInfo.filterField]).filter(Boolean))
    return [...values].sort((a, b) => a.localeCompare(b))
  }, [current, tabInfo])

  const visible = useMemo(() => {
    if (!current) return []
    const query = search.trim().toLowerCase()
    return current.rows.filter(
      (row) =>
        (!statusFilter || row.status === statusFilter) &&
        (!fieldFilter || row.values[tabInfo.filterField] === fieldFilter) &&
        matchesSearch(row, query)
    )
  }, [current, tabInfo, search, statusFilter, fieldFilter])

  const filtersActive = Boolean(search.trim() || statusFilter || fieldFilter)

  function switchTab(key) {
    setTab(key)
    setStatusFilter('')
    setFieldFilter('')
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('')
    setFieldFilter('')
  }

  function setRowStatus(formKey, id, status) {
    setForms((f) => ({
      ...f,
      [formKey]: { ...f[formKey], rows: f[formKey].rows.map((r) => (r.id === id ? { ...r, status } : r)) },
    }))
  }

  // Optimistic: show the new status at once, put the old one back if saving fails
  async function changeStatus(formKey, row, status) {
    const key = `${formKey}-${row.id}`
    setRowStatus(formKey, row.id, status)
    setRowErrors((e) => ({ ...e, [key]: '' }))
    setSaving((s) => ({ ...s, [key]: true }))
    try {
      await updateStatus(formKey, row.id, status, row.submittedAt)
    } catch (err) {
      if (err.code === 'unauthorized') return onExpired()
      setRowStatus(formKey, row.id, row.status)
      setRowErrors((e) => ({ ...e, [key]: errorText[err.code] || 'Could not save the status. Please try again.' }))
    } finally {
      setSaving((s) => ({ ...s, [key]: false }))
    }
  }

  function exportCsv() {
    const header = ['Submitted at', ...current.headers, 'Status']
    const lines = visible.map((row) => [formatDate(row), ...current.fields.map((f) => row.values[f]), row.status])
    // Byte-order mark so Excel reads the Hindi text as UTF-8
    const csv = '\uFEFF' + [header, ...lines].map((cells) => cells.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `acs-${tabInfo.label.toLowerCase()}-${new Date().toLocaleDateString('en-CA')}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="min-h-screen bg-clay">
      <header className="bg-forest-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <Logo className="h-10 w-10" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-bold">ACS Admin</p>
              <p className="truncate font-display text-sm text-sun-300">{org.nameHi}</p>
            </div>
          </Link>
          <button
            onClick={onLogout}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-bold hover:bg-white/10"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-forest-900 sm:text-3xl">Submissions</h1>
            <p className="text-sm text-forest-800/70">
              {updatedAt
                ? `Updated ${updatedAt.toLocaleTimeString('en-IN', { timeStyle: 'short' })}`
                : 'From the website’s Contact and Join forms'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-forest-800 ring-1 ring-forest-200 hover:bg-forest-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={exportCsv}
              disabled={!current || visible.length === 0}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-700 px-4 py-2 font-bold text-white hover:bg-forest-800 disabled:opacity-50"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
            <p className="min-w-0 flex-1">{loadError}</p>
            <button onClick={load} className="font-bold underline">
              Try again
            </button>
          </div>
        )}

        {!forms && loading && <LoadingCards />}

        {forms && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <Tile label="Total messages" value={stats.messages} />
              <Tile label="Open issues" value={stats.openIssues} alert={stats.openIssues > 0} />
              <Tile label="New applications" value={stats.newApplications} />
              <Tile label="Last 7 days" value={stats.lastWeek} />
            </div>

            <div className="mt-8 flex gap-2 border-b border-forest-200" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => switchTab(t.key)}
                  className={`-mb-px inline-flex items-center gap-2 border-b-[3px] px-3 py-2.5 font-bold transition sm:px-4 ${
                    tab === t.key
                      ? 'border-sun-500 text-forest-900'
                      : 'border-transparent text-forest-800/60 hover:text-forest-900'
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      tab === t.key ? 'bg-forest-700 text-white' : 'bg-forest-100 text-forest-700'
                    }`}
                  >
                    {forms[t.key].rows.length}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-forest-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={tab === 'contact' ? 'Search name, phone, email, message' : 'Search name, phone, email, college'}
                  className={`${selectClass} pl-10`}
                />
              </label>
              <div className="grid grid-cols-2 gap-3 sm:contents">
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`${selectClass} sm:w-44`}
                >
                  <option value="">All statuses</option>
                  {current.statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <select
                  aria-label={tab === 'contact' ? 'Filter by subject' : 'Filter by district'}
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                  className={`${selectClass} sm:w-56`}
                >
                  <option value="">{tabInfo.filterLabel}</option>
                  {filterOptions.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-forest-800/70">
              <p>
                Showing {visible.length} of {current.rows.length}
              </p>
              {filtersActive && (
                <button onClick={clearFilters} className="font-bold text-forest-700 hover:underline">
                  Clear filters
                </button>
              )}
            </div>

            {visible.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-forest-100">
                <Inbox className="mx-auto text-forest-300" size={44} />
                <p className="mt-3 font-semibold text-forest-900">
                  {current.rows.length === 0 ? tabInfo.empty : 'No entries match these filters.'}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {visible.map((row) => {
                  const key = `${tab}-${row.id}`
                  return (
                    <EntryCard
                      key={key}
                      form={current}
                      row={row}
                      saving={saving[key]}
                      error={rowErrors[key]}
                      onStatusChange={(status) => changeStatus(tab, row, status)}
                    />
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function Tile({ label, value, alert = false }) {
  return (
    <div
      className={`rounded-2xl p-4 ring-1 sm:p-5 ${alert ? 'bg-red-50 ring-red-200' : 'bg-white ring-forest-100'}`}
    >
      <p className={`text-sm font-semibold ${alert ? 'text-red-800' : 'text-forest-800/70'}`}>{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${alert ? 'text-red-700' : 'text-forest-900'}`}>{value}</p>
    </div>
  )
}

function EntryCard({ form, row, saving, error, onStatusChange }) {
  const { name, phone, email, subject } = row.values
  const isIssue = subject === ISSUE_SUBJECT
  const details = form.fields
    .map((field, i) => ({ field, label: form.headers[i], value: row.values[field] }))
    .filter(({ field }) => !HEADER_FIELDS.includes(field))

  return (
    <article
      className={`rounded-2xl bg-white p-4 ring-1 sm:p-5 ${
        isIssue && row.status !== 'Resolved' ? 'border-l-4 border-red-500 ring-red-200' : 'ring-forest-100'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-forest-800/70">{formatDate(row)}</p>
          <h3 className="text-lg font-bold text-forest-900 [overflow-wrap:anywhere]">{name || '(no name)'}</h3>
          {isIssue && (
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">
              <TriangleAlert size={14} /> Report an issue
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saving && <LoaderCircle size={16} className="animate-spin text-forest-500" aria-label="Saving" />}
          <select
            aria-label="Status"
            value={row.status}
            disabled={saving}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`min-h-10 cursor-pointer rounded-full border-0 px-3 py-1.5 text-sm font-bold ring-1 outline-none focus:ring-4 disabled:opacity-70 ${
              statusStyles[row.status] || 'bg-white text-forest-900 ring-forest-200'
            }`}
          >
            {/* Keep an unexpected value typed into the sheet visible instead of silently showing another */}
            {!form.statuses.includes(row.status) && <option>{row.status}</option>}
            {form.statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {(phone || email) && (
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:underline"
            >
              <Phone size={15} /> {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-forest-700 [overflow-wrap:anywhere] hover:underline"
            >
              <Mail size={15} className="shrink-0" /> {email}
            </a>
          )}
        </div>
      )}

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {details.map(({ field, label, value }) => (
          <div key={field} className={field === 'message' ? 'sm:col-span-2' : ''}>
            <dt className="text-xs font-bold tracking-wide text-earth-500 uppercase">{label}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-forest-950 [overflow-wrap:anywhere]">{value || '—'}</dd>
          </div>
        ))}
      </dl>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
          {error}
        </p>
      )}
    </article>
  )
}

function LoadingCards() {
  return (
    <div className="mt-6 space-y-4" aria-label="Loading submissions">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-forest-100" />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-2xl bg-white ring-1 ring-forest-100" />
      ))}
    </div>
  )
}
