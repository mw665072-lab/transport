# Zewar Transport LLC — Next.js Frontend

Production frontend built on static typed data, App Router, Tailwind CSS v4, shadcn-style Radix UI primitives, Framer Motion, and React Hook Form + Zod.

The contact flow is served by this app: a Next.js API route validates the submission, stores it in SQLite, and emails it through Resend. Submissions are reviewed at `/admin`. The site is therefore a **Node application, not a static export** — deploy it with `next start` (or a Node container), not by uploading a folder.

## Run

```bash
npm install
npm run dev
npm run build
npm test
npm run format
```

`next build` produces a server build. Marketing pages are still prerendered; only `/api/contact` and `/admin` are dynamic.

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

Validation schemas live in `src/lib/schemas/`. All three forms POST JSON to the URL in `NEXT_PUBLIC_FORM_ENDPOINT` via `src/lib/forms/submit.ts`.

All three forms now post to this app's own API. `NEXT_PUBLIC_FORM_ENDPOINT` is no longer used
and can be removed from the environment. Without it the forms report a delivery failure rather than reporting success for a submission that was never sent. The value is inlined at build time, so rebuild and redeploy after changing it. Any endpoint accepting a JSON POST works: Formspree, Web3Forms, Basin, or your own serverless function. Each submission carries `form`, `submittedAt`, `pageUrl`, and the form fields. If the endpoint returns JSON with `referenceId`, `reference`, or `id`, that value is shown to the user; otherwise a local reference is generated after delivery is confirmed.

In development only, add `?mockFail=1` to a form page URL to exercise the error state.

## Images

The provided logo asset is retained. The supplied image pack mostly depicted planes, ships, ports, and global freight, which conflicts with the client brief. Those visuals are intentionally excluded from live pages. Replace the current photos with verified real fleet photography later without changing component structure.

Static export disables the Next.js image optimizer, so whatever sits in `public/images/` ships at full size. Everything there has been re-encoded and the unused placeholder SVGs removed, taking the folder from about 6.3 MB to 1.8 MB. Re-compress any new photo before committing it. Browser icons are generated from the logo by the App Router file convention at `src/app/icon.png` and `src/app/apple-icon.png`.

## Structured data

The site emits `Organization` with the NAICS code for Truck Transportation, not `MovingCompany`. Fill in `ADDRESS` in `src/lib/data/company.ts` and the type upgrades to `LocalBusiness` automatically, in both the root layout and the service detail pages. Until then `Organization` is used deliberately, because `LocalBusiness` without a postal address fails Google rich-result validation.

## Site URL

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used by metadata, canonical tags, `sitemap.xml`, and `robots.txt`. Only absolute http(s) origins are accepted. A localhost value is ignored during a production build, so running `npm run build` locally cannot ship a sitemap full of localhost URLs.

## Client TODO

- Set `MC_NUMBER` and `DOT_NUMBER` in `src/lib/data/company.ts` once FMCSA authority is confirmed. They are `null` until then, and every place that displayed them now omits the section instead of printing a placeholder. Setting both makes them appear in the footer, home hero, trust band, quote sidebar, and Experience & Authority page automatically.
- Confirm `dispatch@zewartransport.com` is a live mailbox. It is now the published contact address in the footer, header, contact page, and structured data.
- Supply real fleet photography for box trucks, cargo vans, Sprinter vans, and hotshot equipment.
- Supply real social profile URLs before social icons are rendered.
- Confirm whether any partner-network air/ocean/customs services should exist at all. They are omitted by default.
- Have counsel review the drafted Privacy Policy and Terms of Use before launch, especially the liability, governing law, and carrier-liability sections. Update the effective date on both pages after review.

## Equipment specs

Payload and dimensions are not published as fixed figures. They vary by the unit assigned, and quoting a number the assigned vehicle cannot meet is a compliance and liability problem. The equipment page states that dispatch confirms them per shipment. If the client later wants published ranges, change the spec values in `src/lib/data/equipment.ts`.

## Contact form, email and admin panel

The contact form posts to `POST /api/contact`, which:

1. Revalidates the submission with the same Zod schema the browser uses, returning per-field messages on failure.
2. Rejects a filled honeypot, and silently discards anything submitted under 2.5 seconds after the form rendered.
3. Rate limits to 5 submissions per IP per hour, keyed on a salted hash so no raw IP is stored.
4. Writes the submission to SQLite **before** emailing, so a mail outage never loses a lead.
5. Sends the message through Resend, and flags the row when delivery fails.

Required environment variables are listed in `.env.example`. `RESEND_API_KEY`, `ADMIN_PASSWORD`, and the rest are server-only — none are `NEXT_PUBLIC_`, so they never reach the browser bundle.

### Admin panel

`/admin` lists submissions with counts by status, and lets you mark each one read, archived, or new. It is password protected with `ADMIN_PASSWORD`, guarded by a signed httpOnly session cookie that expires after 8 hours, excluded in `robots.txt`, and marked `noindex`. The marketing header and footer are hidden there.

Without `ADMIN_PASSWORD` set, the panel refuses to render rather than exposing data.

### Storage

All records live in **MongoDB**. Set `MONGODB_URI` (an Atlas connection string, or
`mongodb://127.0.0.1:27017` locally) and `MONGODB_DB`. Collections and indexes are created on
first use, so a fresh cluster needs no setup.

Documents keep a numeric `id` alongside Mongo's `_id`, because every admin URL and form uses it.
A `counters` collection issues those ids atomically.

Uploaded files are not in the database. Resumes go to `RESUME_UPLOAD_DIR` and shipping documents
to `DOCUMENT_UPLOAD_DIR`, with only the path stored. Those directories still need a persistent
volume even though the database is managed.

`scripts/migrate-sqlite-to-mongo.mjs` moves an existing `data/zewar.db` into MongoDB, keeping
ids and setting the counters to continue the sequence. It is safe to re-run.

### Business details

Address, phones, and emails come from the live site and live in `src/lib/data/company.ts`. Because the address is now filled in, the structured data automatically emits `LocalBusiness` rather than `Organization`.

## Careers and job applications

Openings live in the database, not in code. `/career` lists every open role with client-side
search plus department, location, and employment-type filters, and falls back to a deliberate
empty state when nothing is posted. Each role gets its own page at `/career/[slug]` carrying
`JobPosting` structured data, and `/career/apply` takes a general application.

Applications post to `POST /api/apply` as multipart form data. That route revalidates with the
same Zod schema the browser uses, rejects a filled honeypot, discards submissions made under
2.5 seconds, rate limits per hashed IP, and confirms the role is still open before accepting.

### Resume uploads

Resumes are accepted as PDF or Word up to 5 MB. Both the MIME type and the file extension are
checked. Files are written to `RESUME_UPLOAD_DIR` under a generated name with a whitelisted
extension, so a crafted filename cannot escape the directory or land as an executable. The
directory sits outside `public/`: resumes are only ever served through
`/api/admin/resume/[id]`, which requires an admin session and refuses any path that resolves
outside the upload directory.

### Managing jobs

`/admin/jobs` posts, edits, closes, reopens, and deletes roles. Responsibilities, requirements,
and benefits are entered one item per line, so no rich-text editor is needed. Closing a role
removes it from the public listing immediately and makes its detail page 404.
`/admin/applications` lists applicants with status tracking and a resume download link.

## Services are edited in the admin panel

Services live in the `services` table and drive four places at once: the Services menu, the
footer service list, the `/services` index, and each `/services/[slug]` page. Edit one in
`/admin/services` and all four update, because saving calls `revalidatePath("/", "layout")`.

Each service carries a menu label and menu description separate from its full name, so the
dropdown can stay short while the page heading stays complete. Typical loads are entered one
per line.

`src/lib/data/services.ts` remains as the seed and as a fallback: if the table is empty, or the
database cannot be read, the site renders those five services rather than an empty menu.

**Seed before building.** `next build` prerenders the shell, so the menu is captured at build
time. Run the seed first, then build:

```bash
node scripts/seed-services.mjs && npm run build
```

Edits made in the admin panel after a build revalidate correctly and need no rebuild.

## Service galleries (categories and items)

A service can carry a gallery of items, each with a category, title, description and image.
Distinct categories become filter tabs on the service page, alongside an automatic "all" tab.
Manage them in `/admin/services` with the **Gallery** button on any service.

`scripts/seed-warehousing.mjs` adds the Warehousing service with six starter items across three
categories. Those items are placeholders using images already in the project.

The live WordPress `/warehousing/` page could not be copied: its gallery was the Phlox theme's
demo portfolio, not company content. The images sit under `uploads/2018/07`, five years before
the company was founded, with filenames such as `sunglasses-and-striped-retro-hat` and
`white-bike-in-blue-interior`, categorised branding / marketing / photography. The structure was
rebuilt; the demo content was not carried over.

## Social links, testimonials, news and quick links

Four more areas are managed from the admin panel. Each one hides itself rather than showing an
empty shell or invented content.

**Social profiles** (`/admin/settings`). Paste a full URL per platform; the footer renders an
icon only for links that validate as absolute URLs, so a bare domain or a blank field simply
means no icon. Clearing a field removes it.

**Testimonials** (`/admin/testimonials`). Name, role, company, quote, star rating, display
order, and a live/hidden toggle. The homepage section is omitted entirely while no testimonial
is published. Nothing is seeded: inventing customer quotes would be fabricating reviews.

**News and updates** (`/admin/posts`). The `/blog` route is now a news listing backed by the
database, with category, published date, draft/live status, and per-article pages carrying
`Article` structured data. Paragraphs are separated by a blank line, so no rich-text editor is
needed. `scripts/seed-posts.mjs` moves the original typed article into the database;
`src/lib/data/blog.ts` stays as the fallback for a fresh install.

**Quick links.** A homepage shortcut row for quote, services, coverage, careers, owner operator,
and call dispatch. Routes are fixed, so these live in code rather than the database.

## Shipment tracking

`/track` looks a shipment up by reference. The endpoint is rate limited and returns the same
response for a wrong reference as for one that does not exist, so it cannot be used to discover
valid numbers. Only shipment facts come back: status, route, service and dates. The customer
name and internal note stay in the admin panel, so a guessed reference leaks no personal data.

Manage shipments in `/admin/shipments`: create one, give the customer its reference, then add
milestones as the load moves. Adding a milestone also updates the shipment's headline status,
so the tracking page always reflects the newest entry.

## Bill of lading and document uploads

`/documents` accepts a signed BOL, proof of delivery, or a photo of paperwork, as PDF, JPEG,
PNG or HEIC up to 10 MB. Both the MIME type and the extension are checked. Uploads go to
`DOCUMENT_UPLOAD_DIR`, outside `public/`, under a generated filename, and are served only
through the authenticated `/api/admin/document/[id]` route. Review them in `/admin/documents`.

Resumes and documents share one implementation in `src/lib/server/uploads.ts`.

## One intake path for every form

`src/lib/server/form-intake.ts` handles contact, freight quote and owner operator: revalidate
with the browser's own schema, reject a filled honeypot, discard anything submitted under 2.5
seconds, rate limit per hashed IP, store, then email. Forms with more fields than the shared
columns keep their full data in the submission's `payload` JSON. Job applications send a
notification through the same mailer.
