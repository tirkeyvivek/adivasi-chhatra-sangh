import { formsEndpoint } from './data/content'

// Sends a form to the Google Apps Script web app, which stores it in the Google Sheet.
// `form` is 'contact' or 'join' and picks the sheet tab (see google-apps-script/Code.gs).
// `extra` adds fields that aren't form inputs, e.g. photo1..photo3.
export async function submitForm(form, formElement, extra = {}) {
  if (!formsEndpoint) throw new Error('Form endpoint is not configured')
  const body = new URLSearchParams(new FormData(formElement))
  body.set('form', form)
  Object.entries(extra).forEach(([key, value]) => body.set(key, value))
  const res = await fetch(formsEndpoint, { method: 'POST', body })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Submission failed')
}

const PHOTO_MAX_SIDE = 1600

// Shrinks a picked image to a JPEG data URL (longest side 1600px) so phone photos upload quickly.
// Rejects if the browser can't read the file (e.g. HEIC on some desktop browsers).
export function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')
      // White behind transparent PNGs, since JPEG has no transparency
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unreadable image'))
    }
    img.src = url
  })
}
