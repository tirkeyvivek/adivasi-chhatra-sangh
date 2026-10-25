import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-7xl font-extrabold text-forest-300">404</p>
      <h1 className="mt-4 font-display text-3xl text-forest-900">पृष्ठ नहीं मिला</h1>
      <p className="mt-2 text-lg text-forest-900/75">The page you are looking for does not exist.</p>
      <Button to="/" variant="green" className="mt-8">Back to Home</Button>
    </section>
  )
}
