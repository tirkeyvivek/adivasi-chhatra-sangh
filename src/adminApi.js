import { formsEndpoint } from './data/content'

// Talks to the admin actions of the Google Apps Script (see google-apps-script/Code.gs).
// The session token only ever travels in the POST body, never in a URL.

const TOKEN_KEY = 'acs-admin-token'

// Error with a short code: not_configured, network, wrong_password, locked, password_not_set, unauthorized, ...
export class AdminError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function setToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Storage blocked (private mode etc.) — the session simply won't survive a reload
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

async function call(action, fields) {
  if (!formsEndpoint) throw new AdminError('not_configured')
  const body = new URLSearchParams({ ...fields, action })
  let data
  try {
    const res = await fetch(formsEndpoint, { method: 'POST', body })
    data = await res.json()
  } catch {
    throw new AdminError('network')
  }
  if (!data.ok) {
    if (data.error === 'unauthorized') clearToken()
    throw new AdminError(data.error || 'failed')
  }
  return data
}

export async function login(password) {
  const { token } = await call('login', { password })
  setToken(token)
}

export async function listSubmissions() {
  const { forms } = await call('list', { token: getToken() || '' })
  return forms
}

export function updateStatus(form, row, status, submittedAt) {
  return call('update', { token: getToken() || '', form, row: String(row), status, submittedAt })
}
