// Receives the website's Contact and Join forms and adds each submission as a row in this spreadsheet.
// Also serves the website's /admin page: login, listing submissions and changing their status.
// Paste into Extensions → Apps Script of the Google Sheet, then deploy as a Web app (see setup steps).

// Each website form writes to its own tab; the tab and its header row are created on first use
const FORMS = {
  contact: {
    tab: 'Contact',
    fields: ['name', 'phone', 'email', 'subject', 'message', 'photos'],
    headers: ['Name', 'Mobile', 'Email', 'Subject', 'Message', 'Photos'],
    statuses: ['New', 'In progress', 'Resolved'],
    acceptsPhotos: true,
  },
  join: {
    tab: 'Membership',
    fields: [
      'name',
      'phone',
      'email',
      'district',
      'address',
      'college',
      'course',
      'message',
      'payment',
      'orderId',
      'receiptNo',
      'paymentRef',
    ],
    headers: [
      'Name',
      'Mobile',
      'Email',
      'District',
      'Address',
      'College / Institution / Common',
      'Course / Class',
      'Why join',
      'Payment',
      'Order ID',
      'Receipt No.',
      'Payment Ref',
    ],
    statuses: ['New', 'Contacted', 'Approved', 'Rejected'],
    takesFee: true,
  },
}

// Membership fee, collected through Cashfree. Payment is off until CASHFREE_APP_ID and CASHFREE_SECRET are set
// in Project Settings → Script properties; CASHFREE_MODE is 'sandbox' (default) or 'production'.
// The amount is fixed here, so nobody can change it from the browser.
const MEMBERSHIP_FEE = 21
// Printed on the receipt; change together with MEMBERSHIP_FEE
const MEMBERSHIP_FEE_WORDS = 'Twenty-one rupees only'
const CASHFREE_API_VERSION = '2026-01-01'
const CASHFREE_HOSTS = { sandbox: 'https://sandbox.cashfree.com', production: 'https://api.cashfree.com' }
// Unpaid orders close after this long; the visitor then has to fill the form again
const ORDER_HOURS = 24
const PAYMENT = { pending: 'Pending', paid: 'Paid', expired: 'Expired' }

// An email goes here for every new submission. Set to '' to turn notifications off.
const NOTIFY_EMAIL = 'adivasichhatrasanghjh@gmail.com'

// Shown at the top of the fee receipt emailed to members after they pay
const RECEIPT_ORG = {
  name: 'Adivasi Chhatra Sangh, Jharkhand',
  regNo: '24/2015-16',
  address: 'Karamtoli, Ranchi, Jharkhand – 834001',
  phone: '+91 94315 20796',
  email: 'adivasichhatrasanghjh@gmail.com',
}

const STATUS_HEADER = 'Status'
const SESSION_HOURS = 8
const MAX_FAILED_LOGINS = 5
const LOCKOUT_SECONDS = 15 * 60
const ADMIN_ACTIONS = ['login', 'list', 'update']

// Photos attached to Contact messages (sent as photo1..photo3, base64 JPEG) go to a private Drive folder
const UPLOAD_FOLDER_NAME = 'ACS Website Uploads'
const MAX_PHOTOS = 3
const MAX_PHOTO_BYTES = 3 * 1024 * 1024

function doPost(e) {
  const params = e.parameter
  if (ADMIN_ACTIONS.indexOf(params.action) >= 0) return reply(handleAdmin(params))
  if (params.action === 'checkPayment') return reply(checkPayment(params.orderId))

  const form = getForm(params.form)
  if (!form) return reply({ ok: false, error: 'Unknown form' })

  // Hidden "website" field is invisible to people; bots that fill it are dropped silently
  if (params.website) return reply({ ok: true })

  // The fee order is created before the row is saved, so if Cashfree fails nothing is stored and the visitor can retry
  let order = null
  if (form.takesFee && cashfreeConfig()) {
    try {
      order = createOrder(params)
    } catch (err) {
      console.error(err)
      return reply({ ok: false, error: err.message === 'invalid_phone' ? 'invalid_phone' : 'payment_unavailable' })
    }
  }

  // Photo links and payment details are always produced here, never taken from the request
  const input = Object.assign({}, params, {
    photos: form.acceptsPhotos ? savePhotos(params) : '',
    payment: order ? PAYMENT.pending : '',
    orderId: order ? order.orderId : '',
    receiptNo: '',
    paymentRef: '',
  })
  const values = form.fields.map((field) => clean(input[field]))
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

  // Applications that owe the fee are emailed once paid (see settleOrder)
  if (order) return reply({ ok: true, payment: { orderId: order.orderId, sessionId: order.sessionId, mode: order.mode } })
  notify(form, values)
  return reply({ ok: true })
}

// The row is already saved when this runs, so a failed email (e.g. daily quota reached) must not report failure,
// otherwise the visitor retries and the submission is stored twice
function notify(form, values) {
  if (!NOTIFY_EMAIL) return
  try {
    const lines = form.headers.map((header, i) => `${header}: ${values[i]}`)
    MailApp.sendEmail(NOTIFY_EMAIL, `New website ${form.tab} submission: ${values[0]}`, lines.join('\n'))
  } catch (err) {
    console.error(err)
  }
}

// Opening the web app URL in a browser just confirms it is running
function doGet() {
  return reply({ ok: true, service: 'Adivasi Chhatra Sangh website forms' })
}

// ---------- Membership fee (Cashfree) ----------

function cashfreeConfig() {
  const props = PropertiesService.getScriptProperties()
  const appId = props.getProperty('CASHFREE_APP_ID')
  const secret = props.getProperty('CASHFREE_SECRET')
  if (!appId || !secret) return null
  return { appId, secret, mode: props.getProperty('CASHFREE_MODE') === 'production' ? 'production' : 'sandbox' }
}

function cashfree(method, path, body) {
  const config = cashfreeConfig()
  const options = {
    method,
    muteHttpExceptions: true,
    headers: { 'x-client-id': config.appId, 'x-client-secret': config.secret, 'x-api-version': CASHFREE_API_VERSION },
  }
  if (body) {
    options.contentType = 'application/json'
    options.payload = JSON.stringify(body)
  }
  const res = UrlFetchApp.fetch(`${CASHFREE_HOSTS[config.mode]}/pg${path}`, options)
  if (res.getResponseCode() !== 200) throw new Error(`Cashfree ${res.getResponseCode()}: ${res.getContentText()}`)
  return JSON.parse(res.getContentText())
}

// Returns the order id plus the session id the website hands to Cashfree's payment popup
function createOrder(params) {
  // Cashfree needs a 10 digit mobile; accept +91 / spaces typed in front of it
  const phone = String(params.phone || '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
  if (!/^\d{10}$/.test(phone)) throw new Error('invalid_phone')

  const orderId = `ACS-${Utilities.getUuid()}`
  const expires = new Date(Date.now() + ORDER_HOURS * 60 * 60 * 1000)
  const customer = { customer_id: `M${phone}`, customer_phone: phone }
  const name = String(params.name || '').trim()
  if (name.length >= 3) customer.customer_name = name.slice(0, 100)
  const email = String(params.email || '').trim()
  if (validEmail(email) && email.length <= 100) customer.customer_email = email

  const body = {
    order_id: orderId,
    order_amount: MEMBERSHIP_FEE,
    order_currency: 'INR',
    customer_details: customer,
    order_note: 'Membership fee',
    order_expiry_time: Utilities.formatDate(expires, 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm:ssXXX"),
  }
  // Where Cashfree sends people back when it can't use the popup (some in-app browsers)
  const returnUrl = String(params.returnUrl || '')
  if (/^https:\/\/[^\s?#]+$/.test(returnUrl)) body.order_meta = { return_url: `${returnUrl}?order_id=${orderId}` }

  const order = cashfree('post', '/orders', body)
  return { orderId, sessionId: order.payment_session_id, mode: cashfreeConfig().mode }
}

// Called by the website after the payment popup closes, and when Cashfree sends someone back to /join
function checkPayment(orderId) {
  if (!/^ACS-[0-9a-f-]{36}$/.test(String(orderId || ''))) return { ok: false, error: 'invalid_order' }
  if (!cashfreeConfig()) return { ok: false, error: 'payment_unavailable' }
  try {
    return Object.assign({ ok: true }, settleOrder(orderId))
  } catch (err) {
    console.error(err)
    return { ok: false, error: 'server_error' }
  }
}

// Asks Cashfree for the order's status and records it in the Payment column.
// When the row first turns Paid it gets a receipt number, and the notification and receipt emails go out once.
function settleOrder(orderId) {
  const order = cashfree('get', `/orders/${orderId}`)
  const paid = order.order_status === 'PAID'
  const expired = order.order_status === 'EXPIRED' || order.order_status === 'TERMINATED'
  // Payment details for the receipt; if Cashfree can't give them now, the row is still marked Paid
  let payment = null
  if (paid) {
    try {
      payment = successfulPayment(orderId)
    } catch (err) {
      console.error(err)
    }
  }
  const form = FORMS.join
  const index = (field) => form.fields.indexOf(field)
  let values = null
  let justPaid = false

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const sheet = getSheet(form, false)
    const row = sheet ? findOrderRow(sheet, orderId) : 0
    if (row) {
      values = rowValues(sheet, form, row)
      const next = paid ? PAYMENT.paid : expired ? PAYMENT.expired : values[index('payment')]
      if (next !== values[index('payment')]) {
        const updates = { payment: next }
        if (paid) {
          updates.receiptNo = nextReceiptNo()
          updates.paymentRef = payment ? paymentRef(payment) : ''
        }
        Object.keys(updates).forEach((field) => {
          sheet.getRange(row, columnFor(sheet, form.headers[index(field)])).setValue(updates[field])
          values[index(field)] = updates[field]
        })
        justPaid = paid
      }
    }
  } finally {
    lock.releaseLock()
  }
  if (justPaid) {
    notify(form, values)
    // A failed receipt (no email given, quota reached) must not undo the payment; resend it from the Sheet menu
    try {
      sendReceipt(values, payment)
    } catch (err) {
      console.error(err)
    }
  }

  const field = (name) => (values ? values[index(name)] : '')
  return {
    paid,
    expired,
    name: field('name'),
    district: field('district'),
    // Lets the website reopen the popup for an order that is still open
    sessionId: paid || expired ? '' : order.payment_session_id,
    mode: cashfreeConfig().mode,
  }
}

// Runs every 15 minutes once installPaymentCheck has been run. Catches payments whose browser closed before
// the website could confirm them, and marks orders Expired once Cashfree closes them.
function checkPendingPayments() {
  if (!cashfreeConfig()) return
  const form = FORMS.join
  const sheet = getSheet(form, false)
  if (!sheet || sheet.getLastRow() < 2) return
  const paymentCol = columnFor(sheet, 'Payment')
  const orderCol = columnFor(sheet, 'Order ID')
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
  data.forEach((cells) => {
    if (cells[paymentCol - 1] !== PAYMENT.pending || !cells[orderCol - 1]) return
    try {
      settleOrder(String(cells[orderCol - 1]))
    } catch (err) {
      console.error(err)
    }
  })
}

// Run once from the Apps Script editor after adding the Cashfree keys: grants the permission to call Cashfree
// and schedules checkPendingPayments. Running it again replaces the schedule rather than adding a second one.
function installPaymentCheck() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === 'checkPendingPayments')
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger))
  ScriptApp.newTrigger('checkPendingPayments').timeBased().everyMinutes(15).create()
  checkPendingPayments()
}

// ---------- Fee receipt ----------

const PAYMENT_MODES = {
  upi: 'UPI',
  credit_card: 'Credit card',
  debit_card: 'Debit card',
  net_banking: 'Net banking',
  wallet: 'Wallet',
  prepaid_card: 'Prepaid card',
}

// The successful payment of an order, or null
function successfulPayment(orderId) {
  const payments = cashfree('get', `/orders/${orderId}/payments`)
  return payments.find((p) => p.payment_status === 'SUCCESS') || null
}

function paymentMode(payment) {
  const group = String(payment.payment_group || '')
  return PAYMENT_MODES[group] || (group.indexOf('upi') === 0 ? 'UPI' : group.replace(/_/g, ' '))
}

// One line for the Payment Ref column, enough to find the payment in the Cashfree dashboard or a bank statement
function paymentRef(payment) {
  return [paymentMode(payment), payment.bank_reference && `Bank ref ${payment.bank_reference}`, `Cashfree ${payment.cf_payment_id}`]
    .filter(Boolean)
    .join(', ')
}

// Receipt numbers run per financial year (April–March): ACS/2026-27/0001. Call while holding the script lock.
function nextReceiptNo() {
  const now = new Date()
  const year = Number(Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy'))
  const month = Number(Utilities.formatDate(now, 'Asia/Kolkata', 'M'))
  const start = month >= 4 ? year : year - 1
  const fy = `${start}-${String(start + 1).slice(-2)}`
  const props = PropertiesService.getScriptProperties()
  const key = `RECEIPT_SEQ_${fy}`
  const seq = Number(props.getProperty(key) || 0) + 1
  props.setProperty(key, String(seq))
  return `ACS/${fy}/${String(seq).padStart(4, '0')}`
}

// Emails the receipt (in the message and as a PDF) to the member. `values` are in form.headers order.
// Throws if it can't be sent; skips quietly when the member gave no email address.
function sendReceipt(values, payment) {
  const form = FORMS.join
  const field = (name) => values[form.fields.indexOf(name)]
  const email = field('email')
  if (!validEmail(email)) return false

  const paidAt = payment && payment.payment_completion_time ? new Date(payment.payment_completion_time) : new Date()
  const receipt = {
    receiptNo: field('receiptNo'),
    date: Utilities.formatDate(paidAt, 'Asia/Kolkata', 'd MMM yyyy, h:mm a'),
    name: field('name'),
    phone: field('phone'),
    email,
    district: field('district'),
    college: field('college'),
    orderId: field('orderId'),
    mode: payment ? paymentMode(payment) : '',
    bankRef: payment ? String(payment.bank_reference || '') : '',
    cashfreeId: payment ? String(payment.cf_payment_id || '') : '',
  }
  const html = receiptHtml(receipt)
  const pdf = Utilities.newBlob(html, MimeType.HTML, 'receipt.html')
    .getAs(MimeType.PDF)
    .setName(`Receipt ${receipt.receiptNo.replace(/\//g, '-')}.pdf`)
  const intro =
    `<p style="font-family:Arial,sans-serif;font-size:15px;color:#14281d">Jai Johar ${escapeHtml(receipt.name)},</p>` +
    `<p style="font-family:Arial,sans-serif;font-size:15px;color:#14281d">Thank you for joining ${escapeHtml(RECEIPT_ORG.name)}. ` +
    'We have received your membership fee. Your receipt is below and attached as a PDF.</p>'

  MailApp.sendEmail({
    to: email,
    subject: `Membership fee receipt ${receipt.receiptNo} – ${RECEIPT_ORG.name}`,
    body: `Jai Johar ${receipt.name},\n\nWe have received your membership fee of Rs. ${MEMBERSHIP_FEE}. Receipt No. ${receipt.receiptNo}. The receipt is attached as a PDF.\n\n${RECEIPT_ORG.name}\n${RECEIPT_ORG.phone}`,
    htmlBody: intro + html,
    attachments: [pdf],
    name: RECEIPT_ORG.name,
    replyTo: RECEIPT_ORG.email,
  })
  return true
}

// Inline styles and tables only, so it looks the same in Gmail, other mail apps and the PDF.
// "Rs." rather than the rupee sign, which the PDF converter's fonts may not have.
function receiptHtml(r) {
  const line = (label, value) =>
    value
      ? `<tr><td style="padding:5px 0;color:#5b6b60;width:42%;vertical-align:top">${label}</td>` +
        `<td style="padding:5px 0;color:#14281d;font-weight:bold">${escapeHtml(value)}</td></tr>`
      : ''
  const table = (rows) => `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>`
  const heading = (text) =>
    `<div style="margin:20px 0 6px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#8a5a2b;text-transform:uppercase">${text}</div>`
  const amount = `Rs. ${MEMBERSHIP_FEE.toFixed(2)}`

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:16px auto;border:1px solid #cfe0d4;border-radius:8px;overflow:hidden">
  <div style="background:#1f5136;color:#ffffff;padding:20px 24px">
    <div style="font-size:20px;font-weight:bold">${escapeHtml(RECEIPT_ORG.name)}</div>
    <div style="font-size:12px;margin-top:4px;color:#d7e8dc">Reg. No. ${escapeHtml(RECEIPT_ORG.regNo)} &nbsp;|&nbsp; ${escapeHtml(RECEIPT_ORG.address)}</div>
    <div style="font-size:12px;color:#d7e8dc">${escapeHtml(RECEIPT_ORG.phone)} &nbsp;|&nbsp; ${escapeHtml(RECEIPT_ORG.email)}</div>
  </div>
  <div style="padding:20px 24px">
    <div style="font-size:18px;font-weight:bold;color:#1f5136">Membership Fee Receipt</div>
    ${table(line('Receipt No.', r.receiptNo) + line('Date', r.date))}
    ${heading('Received from')}
    ${table(line('Name', r.name) + line('Mobile', r.phone) + line('Email', r.email) + line('District', r.district) + line('College / Institution', r.college))}
    ${heading('Details')}
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="background:#eef5f0"><td style="padding:8px">Description</td><td style="padding:8px;text-align:right">Amount</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e3ece6">Membership fee (one-time)</td><td style="padding:8px;text-align:right;border-bottom:1px solid #e3ece6">${amount}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Total paid</td><td style="padding:8px;text-align:right;font-weight:bold">${amount}</td></tr>
    </table>
    <div style="font-size:13px;color:#5b6b60;margin-top:4px">Amount in words: ${MEMBERSHIP_FEE_WORDS}</div>
    ${heading('Payment')}
    ${table(line('Paid by', r.mode) + line('Bank reference (UTR)', r.bankRef) + line('Cashfree payment ID', r.cashfreeId) + line('Order ID', r.orderId))}
    <p style="font-size:12px;color:#5b6b60;margin-top:20px;line-height:1.5">The membership fee is non-refundable, as set out in the Refund &amp; Cancellation Policy on our website. This is a computer-generated receipt and does not need a signature.</p>
  </div>
</div>`
}

// Run from the Apps Script editor to see the receipt: emails a sample to NOTIFY_EMAIL (uses no receipt number)
function previewReceipt() {
  const sample = {
    name: 'Sample Member',
    phone: '9999999999',
    email: NOTIFY_EMAIL,
    district: 'Ranchi',
    college: 'Ranchi University',
    orderId: 'ACS-sample-order',
    receiptNo: 'ACS/SAMPLE/0000',
  }
  const payment = {
    payment_group: 'upi',
    bank_reference: '123456789012',
    cf_payment_id: '5114910000000',
    payment_completion_time: new Date().toISOString(),
  }
  sendReceipt(FORMS.join.fields.map((field) => sample[field] || ''), payment)
}

// Run from the Apps Script editor to check the Cashfree keys: creates an order (not saved to the sheet)
// and prints it, or shows Cashfree's error message in the execution log
function testCashfree() {
  if (!cashfreeConfig()) throw new Error('CASHFREE_APP_ID / CASHFREE_SECRET are not set in Script properties')
  console.log(createOrder({ name: 'Test order', phone: '9999999999' }))
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
  SpreadsheetApp.getUi()
    .createMenu('ACS Admin')
    .addItem('Set admin password', 'setAdminPassword')
    .addItem('Resend fee receipt for selected row', 'resendReceipt')
    .addToUi()
}

// For a member who didn't get the receipt (no email given at the time, typo, mail quota reached):
// fix the Email cell if needed, click any cell in their row, then use this menu item
function resendReceipt() {
  const ui = SpreadsheetApp.getUi()
  const form = FORMS.join
  const sheet = SpreadsheetApp.getActiveSheet()
  const row = sheet.getActiveRange().getRow()
  if (sheet.getName() !== form.tab || row < 2) {
    ui.alert(`Click a member's row in the ${form.tab} tab first.`)
    return
  }
  const values = rowValues(sheet, form, row)
  const field = (name) => values[form.fields.indexOf(name)]
  if (field('payment') !== PAYMENT.paid || !field('receiptNo')) {
    ui.alert('This row has no paid membership fee, so there is no receipt to send.')
    return
  }
  if (!validEmail(field('email'))) {
    ui.alert('This row has no valid email address. Type it in the Email column, then try again.')
    return
  }
  sendReceipt(values, cashfreeConfig() ? successfulPayment(field('orderId')) : null)
  ui.alert(`Receipt ${field('receiptNo')} sent to ${field('email')}.`)
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

// ---------- Photo uploads ----------

// Saves photo1..photoN as JPEG files and returns their Drive links, one per line.
// Files stay private to the Drive owner; anything that isn't a JPEG or is too large is skipped.
function savePhotos(params) {
  const links = []
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH.mm.ss')
  const who = String(params.name || 'unknown').replace(/[\\/:*?"<>|\r\n]/g, '').trim().slice(0, 40)
  for (let i = 1; i <= MAX_PHOTOS; i++) {
    const data = params[`photo${i}`]
    if (!data) continue
    let bytes
    try {
      bytes = Utilities.base64Decode(data)
    } catch (err) {
      continue
    }
    // Apps Script bytes are signed, so mask before checking the JPEG start marker FF D8
    const isJpeg = bytes.length > 2 && (bytes[0] & 0xff) === 0xff && (bytes[1] & 0xff) === 0xd8
    if (!isJpeg || bytes.length > MAX_PHOTO_BYTES) continue
    const file = uploadFolder().createFile(Utilities.newBlob(bytes, 'image/jpeg', `${stamp} ${who} ${i}.jpg`))
    links.push(file.getUrl())
  }
  return links.join('\n')
}

// The upload folder is created on first use and remembered by id, so renaming or moving it is fine
function uploadFolder() {
  const props = PropertiesService.getScriptProperties()
  const id = props.getProperty('UPLOAD_FOLDER_ID')
  if (id) {
    try {
      const folder = DriveApp.getFolderById(id)
      if (!folder.isTrashed()) return folder
    } catch (err) {
      // Folder was deleted; make a new one below
    }
  }
  const folder = DriveApp.createFolder(UPLOAD_FOLDER_NAME)
  props.setProperty('UPLOAD_FOLDER_ID', folder.getId())
  return folder
}

// Run once from the Apps Script editor after pasting this code: grants the Drive permission and creates the folder
function authorize() {
  console.log(`Photo uploads go to: ${uploadFolder().getUrl()}`)
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

// Sheet row number holding this order id, or 0
function findOrderRow(sheet, orderId) {
  if (sheet.getLastRow() < 2) return 0
  const ids = sheet.getRange(2, columnFor(sheet, 'Order ID'), sheet.getLastRow() - 1, 1).getValues()
  const index = ids.findIndex(([id]) => id === orderId)
  return index < 0 ? 0 : index + 2
}

// A row's values in the order of form.headers; a column the tab doesn't have reads as empty
function rowValues(sheet, form, row) {
  const width = sheet.getLastColumn()
  const sheetHeaders = sheet.getRange(1, 1, 1, width).getValues()[0].map((h) => String(h).trim())
  const cells = sheet.getRange(row, 1, 1, width).getValues()[0]
  return form.headers.map((header) => {
    const index = sheetHeaders.indexOf(header)
    return index >= 0 ? cellText(cells[index]) : ''
  })
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

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// Caps length, and stops text starting with = + - @ from being run as a spreadsheet formula
function clean(value) {
  const text = String(value || '').trim().slice(0, 5000)
  return /^[=+\-@]/.test(text) ? `'${text}` : text
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
