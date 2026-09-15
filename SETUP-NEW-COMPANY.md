# Running the site for many companies (demo switch)

One codebase serves any number of transport / logistics companies. A single switch —
`NEXT_PUBLIC_DEMO` — selects **both** the on-screen branding **and** a separate
MongoDB database, so no two companies ever share data.

```bash
npm run dev                          # default: generic "TransLogix" template, database "demo"
NEXT_PUBLIC_DEMO=zewar npm run dev    # Zewar Transport, database "zewar"
NEXT_PUBLIC_DEMO=acme  npm run dev    # Acme Logistics,  database "acme"
```

The default demo (`src/demos/demo.json`) is a neutral generic transport company, so a
fresh copy of this template is never branded as a specific client. Each client just
adds their own profile and points `NEXT_PUBLIC_DEMO` at it.

> **Local dev caveat:** `NEXT_PUBLIC_DEMO` is baked into the build, and all
> `next dev` runs in one folder share the same `.next` cache. So run **one** demo at
> a time locally — starting a second demo from the same folder makes both show the
> last-compiled company. In production this never happens: each company is its own
> deployment with its own build (see DEPLOY-DEMO.md).

---

## How it fits together

| Piece | Role |
| ----- | ---- |
| `src/demos/<slug>.json` | One company profile: name, phone, email, address, domain, and its **`dbName`**. |
| `src/lib/data/demos.ts` | Registers every profile and picks the active one from `NEXT_PUBLIC_DEMO` / `DEMO`. |
| `src/lib/data/company.ts` | Builds `COMPANY` (used across the whole site) from the active profile. |
| `src/lib/server/mongo.ts` | Uses the active profile's `dbName`, so the database follows the company. |
| `scripts/*.mjs` | Seed scripts read the same profile, so they seed the right database with the right name. |

Databases live in **one shared Atlas cluster**, separated by name (`zewar`, `acme`, …).
MongoDB creates a database the first time something is written to it, so seeding a
demo is what brings its database into existence.

## Add a new company (3 steps)

1. **Create the profile** — copy an existing one:

   ```bash
   cp src/demos/acme.json src/demos/bravo.json
   ```

   Edit `src/demos/bravo.json`: `slug`, `dbName` (unique!), `legalName`, `shortName`,
   `tagline`, `titleDescriptor`, `foundedYear`, `phone`, `phoneHref`, `email`,
   `emailCareers`, `domain`, and `address` (or `null`). Leave `mcNumber` / `dotNumber`
   `null` until the real FMCSA numbers are confirmed.

   **Logo** — set `"logo"` to an image path under `/public` (e.g.
   `"/images/bravo-logo.png"`, after dropping the file in `public/images/`), or leave
   it `null`. When `null`, the header/footer show the company **name as text** instead
   of another company's logo — so a company with no logo yet still looks correct.

2. **Register it** in `src/lib/data/demos.ts`:

   ```ts
   import bravo from "@/demos/bravo.json";
   export const DEMOS = { zewar, acme, bravo } as const; // add here
   ```

3. **Seed its database** (creates the `bravo` database, stamped with its name):

   ```bash
   DEMO=bravo npm run seed
   ```

That's it — `NEXT_PUBLIC_DEMO=bravo npm run dev` now runs the site as that company
against its own database.

## Seeding

`npm run seed` (i.e. `node scripts/seed-demo.mjs`) runs every seed step for the
active demo into that demo's database:

```bash
DEMO=zewar npm run seed
DEMO=acme  npm run seed
node scripts/seed-demo.mjs bravo    # slug as an argument also works
```

Individual steps still work too, e.g. `DEMO=acme node scripts/seed-services.mjs`.
If a database is empty, the site still renders built-in fallback content, so seeding
is recommended (for editable admin content) but not required to launch.

## Environment (`.env.local`, copy from `.env.example`)

Shared by all demos except `NEXT_PUBLIC_DEMO`:

```bash
NEXT_PUBLIC_DEMO=zewar                # the active company
MONGODB_URI=mongodb+srv://...         # one cluster for all demos
# MONGODB_DB=                         # leave unset — the demo drives the db name
RESEND_API_KEY=...
ADMIN_PASSWORD=...
IP_HASH_SALT=...
```

`NEXT_PUBLIC_SITE_URL` is optional; when unset each demo uses its own `domain`.

## Deploying multiple companies

Deploy the same repo once per company, each with its own `NEXT_PUBLIC_DEMO` (and its
own domain). Because `NEXT_PUBLIC_DEMO` is inlined at build time, give each deployment
its own build with that value set.

## Verify

```bash
npx tsc --noEmit   # types
npm test           # unit tests
npm run build      # production build
```

---

## Do NOT ship these between companies

- **`data/`** — the previous company's SQLite file, uploaded resumes and documents.
  Git-ignored; if you copy the folder manually (zip), delete `data/` first.
- **`.env.local`** — real credentials. Git-ignored; never copy it across.

Prefer `git clone` when handing the project on, so ignored files stay behind.
