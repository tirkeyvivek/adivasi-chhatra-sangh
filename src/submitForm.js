import { formsEndpoint } from './data/content'

// Sends a form to the Google Apps Script web app, which stores it in the Google Sheet.
// `form` is 'contact' or 'join' and picks the sheet tab (see google-apps-script/Code.gs).
export async function submitForm(form, formElement) {
  if (!formsEndpoint) throw new Error('Form endpoint is not configured')
  const body = new URLSearchParams(new FormData(formElement))
  body.set('form', form)
  const res = await fetch(formsEndpoint, { method: 'POST', body })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Submission failed')
}
