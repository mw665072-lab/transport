# Zewar Transport LLC — Next.js Frontend

Production-oriented frontend rebuild based on the supplied client brief. It uses static typed data, App Router, Tailwind CSS v4, shadcn-style Radix UI primitives, Framer Motion, React Hook Form + Zod, and a mock submit contract. No backend, database, CMS, authentication, email sending, or API route is included.

## Run

```bash
npm install
npm run dev
npm run build
npm test
```

The project is configured with `output: "export"`; the production build emits a static `out/` folder.

## Data structure

All client/content data is under `src/lib/data/`:
- `company.ts` — company identity, mission, credentials
- `services.ts` — the five real transportation services and detail copy
- `coverage.ts` — stated coverage states and example lanes
- `equipment.ts` — fleet types and unverified-spec TODOs
- `nav.ts` — rebuilt navigation
- `faq.ts` — freight quote FAQ
- `blog.ts` — optional static educational content

## Forms

- `/freight-quote` — 3-step quote form
- `/contact` — contact form
- `/owner-operator` — driver/owner-operator interest form

Validation schemas live in `src/lib/schemas/`. The only Phase 2 integration point is `src/lib/forms/submit.ts`. Add `?mockFail=1` to a form page URL to demonstrate the error state.

## Images

The provided logo asset is retained. The supplied image pack mostly depicted planes, ships, ports, and global freight, which conflicts with the client brief. Those visuals are intentionally excluded from live pages. The project includes custom truck/van SVG illustrations as safe branded placeholders. Replace them with verified real fleet photography later without changing component structure.

## Client TODO

- Replace `MC-XXXXXXX` with the real MC number.
- Replace `USDOT-XXXXXXX` with the real USDOT number.
- Supply verified insurance certificate details.
- Supply real fleet photography for box trucks, cargo vans, Sprinter vans, and hotshot equipment.
- Replace the Gmail address with the preferred business/dispatch email.
- Supply real social profile URLs before social icons are rendered.
- Confirm whether any partner-network air/ocean/customs services should exist at all. They are omitted by default.
- Have counsel provide final Privacy Policy and Terms.

## Phase 2 TODO

Replace the body of **only** `src/lib/forms/submit.ts` with the real server action/API integration while preserving its function signature and return shape. The form components and Zod schemas should not need to change.
