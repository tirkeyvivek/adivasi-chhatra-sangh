// Receives the website's Contact and Join forms and adds each submission as a row in this spreadsheet.
// Also serves the website's /admin page: login, listing submissions and changing their status.
// Paste into Extensions → Apps Script of the Google Sheet, then deploy as a Web app (see setup steps).

// Each website form writes to its own tab; the tab and its header row are created on first use
const FORMS = {
  contact: {
    tab: 'Contact',
    fields: ['name', 'phone', 'email', 'subject', 'message'],
    headers: ['Name', 'Mobile', 'Email', 'Subject', 'Message'],
    statuses: ['New', 'In progress', 'Resolved'],
  },
  join: {
    tab: 'Membership',
    fields: ['name', 'phone', 'email', 'district', 'address', 'college', 'course', 'message'],
    headers: ['Name', 'Mobile', 'Email', 'District', 'Address', 'College / Institution / Common', 'Course / Class', 'Why join'],
    statuses: ['New', 'Contacted', 'Approved', 'Rejected'],
  },
}

// An email goes here for every new submission. Set to '' to turn notifications off.
const NOTIFY_EMAIL = 'adivasichhatrasanghjh@gmail.com'

const STATUS_HEADER = 'Status'
const SESSION_HOURS = 8
const MAX_FAILED_LOGINS = 5
const LOCKOUT_SECONDS = 15 * 60
const ADMIN_ACTIONS = ['login', 'list', 'update']

function doPost(e) {
  const params = e.parameter
  if (ADMIN_ACTIONS.indexOf(params.action) >= 0) return reply(handleAdmin(params))

  const form = getForm(params.form)
  if (!form) return reply({ ok: false, error: 'Unknown form' })

  // Hidden "website" field is invisible to people; bots that fill it are dropped silently
  if (params.website) return reply({ ok: true })

  const values = form.fields.map((field) => clean(params[field]))
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = getSheet(form, true)
    // Place each value under its header, so tabs whose columns were added later still line up
    const row = [new Date()]
    form.headers.forEach((header, i) => {
      row[columnFor(sheet, header) - 1] = values[i]
    })
    row[statusColumn(sheet) - 1] = form.statuses[0]
    sheet.appendRow(Array.from(row, (cell) => (cell === undefined ? '' : cell)))
  } finally {
    lock.releaseLock()
  }

  // The row is already saved, so a failed email (e.g. daily quota reached) must not report failure,
  // otherwise the visitor retries and the submission is stored twice
  if (NOTIFY_EMAIL) {
    try {
      const lines = form.headers.map((header, i) => `${header}: ${values[i]}`)
      MailApp.sendEmail(NOTIFY_EMAIL, `New website ${form.tab} submission: ${values[0]}`, lines.join('\n'))
    } catch (err) {
      console.error(err)
    }
  }

  return reply({ ok: true })
}

// Opening the web app URL in a browser just confirms it is running
function doGet() {
  return reply({ ok: true, service: 'Adivasi Chhatra Sangh website forms' })
}

// ---------- Admin ----------

// Login is open; list and update need a valid session token
function handleAdmin(params) {
  try {
    if (params.action === 'login') return login(params.password)
    if (!verifyToken(params.token)) return { ok: false, error: 'unauthorized' }
    return params.action === 'list' ? listSubmissions() : updateStatus(params)
  } catch (err) {
    console.error(err)
    return { ok: false, error: 'server_error' }
  }
}

function login(password) {
  const props = PropertiesService.getScriptProperties()
  const hash = props.getProperty('ADMIN_HASH')
  const salt = props.getProperty('ADMIN_SALT')
  const secret = props.getProperty('TOKEN_SECRET')
  if (!hash || !salt || !secret) return { ok: false, error: 'password_not_set' }

  // Apps Script can't see the caller's IP, so failed attempts are counted globally.
  // The lock stops parallel guesses from slipping past the counter.
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const cache = CacheService.getScriptCache()
    const failures = Number(cache.get('failed_logins') || 0)
    if (failures >= MAX_FAILED_LOGINS) return { ok: false, error: 'locked' }

    if (!safeEqual(hashPassword(String(password || ''), salt), hash)) {
      cache.put('failed_logins', String(failures + 1), LOCKOUT_SECONDS)
      return { ok: false, error: failures + 1 >= MAX_FAILED_LOGINS ? 'locked' : 'wrong_password' }
    }
    cache.remove('failed_logins')
  } finally {
    lock.releaseLock()
  }
  return { ok: true, token: makeToken(secret) }
}

// Both tabs with every row; the sheet row number is the id used by update
function listSubmissions() {
  const forms = {}
  Object.keys(FORMS).forEach((key) => {
    const form = FORMS[key]
    const result = { tab: form.tab, fields: form.fields, headers: form.headers, statuses: form.statuses, rows: [] }
    forms[key] = result

    const sheet = getSheet(form, false)
    if (!sheet || sheet.getLastRow() < 2) return
    const width = sheet.getLastColumn()
    const data = sheet.getRange(1, 1, sheet.getLastRow(), width).getValues()
    const sheetHeaders = data[0].map((h) => String(h).trim())
    // Find columns by header name; a column the tab doesn't have yet reads as empty
    const cols = form.headers.map((header) => sheetHeaders.indexOf(header))
    const statusIndex = sheetHeaders.indexOf(STATUS_HEADER)

    for (let r = 1; r < data.length; r++) {
      const cells = data[r]
      if (cells.every((cell) => cell === '' || cell === null)) continue
      const values = {}
      form.fields.forEach((field, i) => {
        values[field] = cols[i] >= 0 ? cellText(cells[cols[i]]) : ''
      })
      result.rows.push({
        id: r + 1,
        submittedAt: cellText(cells[0]),
        status: (statusIndex >= 0 && cellText(cells[statusIndex])) || form.statuses[0],
        values,
      })
    }
  })
  return { ok: true, forms }
}

function updateStatus(params) {
  const form = getForm(params.form)
  if (!form) return { ok: false, error: 'Unknown form' }
  if (form.statuses.indexOf(params.status) < 0) return { ok: false, error: 'Invalid status' }
  if (!/^\d+$/.test(String(params.row || ''))) return { ok: false, error: 'Invalid row' }
  const row = Number(params.row)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = getSheet(form, false)
    if (!sheet || row < 2 || row > sheet.getLastRow()) return { ok: false, error: 'Invalid row' }
    // If rows were deleted/sorted in the sheet since the page loaded, the row number may point elsewhere
    if (params.submittedAt && cellText(sheet.getRange(row, 1).getValue()) !== params.submittedAt) {
      return { ok: false, error: 'row_changed' }
    }
    sheet.getRange(row, statusColumn(sheet)).setValue(params.status)
  } finally {
    lock.releaseLock()
  }
  return { ok: true }
}

// ---------- Admin password (set from the Sheet menu, never stored in code) ----------

function onOpen() {
  SpreadsheetApp.getUi().createMenu('ACS Admin').addItem('Set admin password', 'setAdminPassword').addToUi()
}

function setAdminPassword() {
  const ui = SpreadsheetApp.getUi()
  const response = ui.prompt(
    'Set admin password',
    'New password for the website admin page (at least 10 characters).\nSaving it logs out everyone who is currently logged in.',
    ui.ButtonSet.OK_CANCEL
  )
  if (response.getSelectedButton() !== ui.Button.OK) return
  const password = response.getResponseText()
  if (password.length < 10) {
    ui.alert('The password must be at least 10 characters. Nothing was changed.')
    return
  }

  const salt = Utilities.getUuid() + Utilities.getUuid()
  PropertiesService.getScriptProperties().setProperties({
    ADMIN_SALT: salt,
    ADMIN_HASH: hashPassword(password, salt),
    // A fresh signing secret invalidates every token issued before
    TOKEN_SECRET: [Utilities.getUuid(), Utilities.getUuid(), Utilities.getUuid(), Utilities.getUuid()].join(''),
  })
  CacheService.getScriptCache().remove('failed_logins')
  ui.alert('Admin password saved. Use it to log in at /admin on the website.')
}

// ---------- Helpers ----------

function getForm(key) {
  return Object.prototype.hasOwnProperty.call(FORMS, key) ? FORMS[key] : null
}

function getSheet(form, create) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(form.tab)
  if (!sheet && create) {
    const headers = ['Submitted at', ...form.headers, STATUS_HEADER]
    sheet = spreadsheet.insertSheet(form.tab)
    sheet.appendRow(headers)
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

// 1-based column of a header; adds the header at the end for tabs created before that column existed
function columnFor(sheet, header) {
  const width = Math.max(sheet.getLastColumn(), 1)
  const headers = sheet.getRange(1, 1, 1, width).getValues()[0].map((h) => String(h).trim())
  const index = headers.indexOf(header)
  if (index >= 0) return index + 1
  const col = sheet.getLastColumn() + 1
  sheet.getRange(1, col).setValue(header).setFontWeight('bold')
  return col
}

function statusColumn(sheet) {
  return columnFor(sheet, STATUS_HEADER)
}

function cellText(value) {
  if (value instanceof Date) return value.toISOString()
  return value === null || value === undefined ? '' : String(value)
}

function hashPassword(password, salt) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password, Utilities.Charset.UTF_8)
  return Utilities.base64Encode(digest)
}

// Token = base64url({exp}) + '.' + base64url(HMAC-SHA256 of that payload)
function makeToken(secret) {
  const payload = Utilities.base64EncodeWebSafe(
    JSON.stringify({ exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000 }),
    Utilities.Charset.UTF_8
  )
  return `${payload}.${sign(payload, secret)}`
}

function verifyToken(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TOKEN_SECRET')
  if (!secret || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2 || !safeEqual(sign(parts[0], secret), parts[1])) return false
  try {
    const json = Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString()
    const exp = JSON.parse(json).exp
    return typeof exp === 'number' && exp > Date.now()
  } catch (err) {
    return false
  }
}

function sign(payload, secret) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(payload, secret))
}

// Compares every character so the time taken doesn't reveal how much matched
function safeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// Caps length, and stops text starting with = + - @ from being run as a spreadsheet formula
function clean(value) {
  const text = String(value || '').trim().slice(0, 5000)
  return /^[=+\-@]/.test(text) ? `'${text}` : text
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
