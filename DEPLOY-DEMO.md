# Deploying a demo to a shareable link (Vercel)

Each company gets its **own Vercel project** pointing at the **same GitHub repo**,
differing only by the `NEXT_PUBLIC_DEMO` value. All projects share one MongoDB Atlas
cluster; each writes to its own database (the demo's `dbName`).

`NEXT_PUBLIC_DEMO` is inlined at **build time**, so one project = one company.

---

## One-time setup

1. **Push the repo to GitHub** (private is fine).
2. **Atlas → Network Access**: add `0.0.0.0/0` (allow from anywhere) so Vercel's
   servers can reach the cluster. Without this, the deployed site cannot connect.
3. Make sure the Atlas user in `MONGODB_URI` can read/write.

## Per company (repeat for each demo)

### 1. Prepare + seed the database (from your own machine)

Seeding runs from your laptop against Atlas — not from Vercel.

```bash
DEMO=bravo npm run seed        # creates the "bravo" database, stamped with its name
```

### 2. Create the Vercel project

- Vercel → **Add New → Project** → import the same GitHub repo.
- Framework preset: **Next.js** (auto-detected). No build-command changes needed.

### 3. Set the project's Environment Variables

| Variable | Value | Notes |
| -------- | ----- | ----- |
| `NEXT_PUBLIC_DEMO` | `bravo` | picks the company **and** its database |
| `MONGODB_URI` | `mongodb+srv://…` | the shared Atlas string |
| `MONGODB_DB` | *(leave empty)* | the demo sets the db name |
| `ADMIN_PASSWORD` | a password | for `/admin` |
| `IP_HASH_SALT` | any long random string | |
| `RESEND_API_KEY` | *(optional)* | only if the contact email should send |
| `CONTACT_FROM_EMAIL` | *(optional)* | a Resend-verified address |
| `RESUME_UPLOAD_DIR` | `/tmp/resumes` | see uploads note below |
| `DOCUMENT_UPLOAD_DIR` | `/tmp/documents` | see uploads note below |

### 4. Deploy

Vercel builds and gives a URL like `bravo.vercel.app`. Send that link to the company.
For a custom domain, add it under the project's **Domains** tab.

### 5. (Optional) Log in to `/admin`

Use `ADMIN_PASSWORD`. From there the company can see submissions and edit services,
jobs, posts, shipments, etc. — all stored in that demo's own database.

---

## Uploads note (important for demos)

The résumé (careers) and document (BOL/POD) forms write files to disk. Vercel's
serverless filesystem is **read-only except `/tmp`, and `/tmp` is temporary**, so:

- Point the two `*_UPLOAD_DIR` vars at `/tmp/...` (above) so uploads **don't error**
  during a demo.
- Files placed there are **ephemeral** — fine for showing the flow, but they won't
  persist. For a production site that must keep uploads, switch these to object
  storage (S3 / Vercel Blob) later. Everything else (contact, quote, tracking,
  admin content) is in MongoDB and persists normally.

## Adding another company later

Repeat "Per company". A new company also needs its `src/demos/<slug>.json` +
registration in `src/lib/data/demos.ts` (see SETUP-NEW-COMPANY.md) before step 1.

## Never deploy / commit

- `.env.local` and `data/` are git-ignored — keep it that way. Real credentials and
  the previous company's uploads must not travel with the repo.
