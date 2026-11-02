import { formsEndpoint } from './data/content'

// Membership fee payment through Cashfree. Orders are created and checked by the Apps Script
// (see google-apps-script/Code.gs); this file only opens Cashfree's popup and asks for the result.

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js'

let sdk = null

function loadSdk() {
  sdk ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SDK_URL
    script.onload = () => resolve(window.Cashfree)
    script.onerror = () => {
      sdk = null // allow a retry, e.g. after the connection comes back
      script.remove()
      reject(new Error('Could not load Cashfree'))
    }
    document.head.appendChild(script)
  })
  return sdk
}

// Opens the payment popup and resolves when it closes, whether or not the payment went through,
// so always confirm with checkPayment afterwards. Some in-app browsers can't show the popup;
// Cashfree then leaves the page and later returns to /join?order_id=…
export async function openCheckout({ sessionId, mode }) {
  const Cashfree = await loadSdk()
  return Cashfree({ mode }).checkout({ paymentSessionId: sessionId, redirectTarget: '_modal' })
}

// Resolves to { paid, expired, name, district, sessionId, mode }; sessionId is set while the order can still be paid
export async function checkPayment(orderId) {
  const body = new URLSearchParams({ action: 'checkPayment', orderId })
  const res = await fetch(formsEndpoint, { method: 'POST', body })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Payment check failed')
  return data
}
