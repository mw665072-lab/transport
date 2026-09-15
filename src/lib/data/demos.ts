/**
 * Demo registry. One JSON profile per company lives in `src/demos/`, and the
 * active one is chosen at build/run time by the DEMO switch:
 *
 *   NEXT_PUBLIC_DEMO=acme npm run dev
 *
 * The selected profile drives BOTH the on-screen branding (via COMPANY in
 * company.ts) and the MongoDB database name (via mongo.ts), so a single codebase
 * serves any number of companies, each with its own isolated database.
 *
 * To add a company: drop `src/demos/<slug>.json` next to the others and register
 * it in the DEMOS map below.
 */
import zewar from "@/demos/zewar.json";
import acme from "@/demos/acme.json";

export type PostalAddress = {
  readonly streetAddress: string;
  readonly addressLocality: string;
  readonly addressRegion: string;
  readonly postalCode: string;
  readonly addressCountry: string;
};

export type DemoProfile = {
  readonly slug: string;
  /** MongoDB database name for this company. Must be unique per company. */
  readonly dbName: string;
  /**
   * Path to the company logo under /public (e.g. "/images/logo.png"), or null to
   * show the company name as a text wordmark instead. Each company supplies its
   * own logo; leave null until one is provided.
   */
  readonly logo: string | null;
  readonly legalName: string;
  readonly shortName: string;
  readonly tagline: string;
  readonly titleDescriptor: string;
  readonly foundedYear: number;
  readonly phone: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly emailCareers: string;
  readonly mcNumber: string | null;
  readonly dotNumber: string | null;
  readonly domain: string;
  readonly address: PostalAddress | null;
};

/** Every known company. Add a line here when you add a JSON profile. */
export const DEMOS = {
  zewar: zewar as DemoProfile,
  acme: acme as DemoProfile,
} as const;

export type DemoSlug = keyof typeof DEMOS;

/** Used when no DEMO is set, or an unknown one is set. */
export const DEFAULT_DEMO: DemoSlug = "zewar";

/**
 * The active demo slug. NEXT_PUBLIC_DEMO is readable in the browser bundle (so
 * branding is correct in client components); DEMO is the server/script fallback.
 */
export function activeDemoSlug(): DemoSlug {
  const raw = (process.env.NEXT_PUBLIC_DEMO ?? process.env.DEMO ?? "").trim();
  return (raw in DEMOS ? raw : DEFAULT_DEMO) as DemoSlug;
}

/** The active company profile. */
export function activeDemo(): DemoProfile {
  return DEMOS[activeDemoSlug()];
}
