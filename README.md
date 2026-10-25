# Adivasi Chhatra Sangh, Jharkhand — Website

Official website for **आदिवासी छात्र संघ, झारखण्ड** (Reg. No. 24/2015-16) — *"पढ़ेंगे और हक के लिए लड़ेंगे"*.

Built with React 19, Vite, Tailwind CSS v4 and React Router.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Editing content

All text (contact details, campaigns, news, leadership, districts) lives in
`src/data/content.js`. Items marked `TODO` need real details:

- `org.address`, `org.phone`, `org.email`
- `leaders[]` — add a `name` field to each office bearer

## Structure

```
public/acs_logo.jpeg      logo (also used as favicon)
src/components/           Navbar, Footer, shared UI (Button, PageHeader, Logo, Hills)
src/pages/                Home, About, Campaigns, News, Join, Contact, NotFound
src/index.css             Tailwind theme (forest green / sun yellow palette)
```

## Deploying

The site is a single-page app. When hosting on Netlify/Vercel/etc., add a rewrite of all
routes to `/index.html` so links like `/about` work on refresh.

The Join and Contact forms currently confirm on screen only — connect them to a backend,
Google Form, or a service such as Formspree to actually receive submissions.
