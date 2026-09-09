// Carrier identifiers are published only once the real FMCSA-issued values are
// confirmed. Leave them null until then: every part of the site that displays
// operating authority checks CARRIER_AUTHORITY_PUBLISHED and omits the section
// rather than rendering a placeholder to shippers and brokers.
const MC_NUMBER: string | null = null;
const DOT_NUMBER: string | null = null;

export type PostalAddress = {
  readonly streetAddress: string;
  readonly addressLocality: string;
  readonly addressRegion: string;
  readonly postalCode: string;
  readonly addressCountry: string;
};

type CompanyProfile = {
  readonly legalName: string;
  readonly shortName: string;
  readonly tagline: string;
  readonly foundedYear: number;
  readonly phone: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly emailCareers: string;
  readonly mcNumber: string | null;
  readonly dotNumber: string | null;
  readonly address: PostalAddress | null;
  readonly domain: string;
};

// Physical business address. Structured data is emitted as LocalBusiness once this
// is filled in, and as Organization until then. Organization has no address
// requirement, so search engines are not handed an incomplete LocalBusiness.
const ADDRESS: PostalAddress | null = {
  streetAddress: "5721 Tavenner Mill Drive, Unit 303",
  addressLocality: "Woodbridge",
  addressRegion: "VA",
  postalCode: "22193",
  addressCountry: "US",
};

// The canonical origin. NEXT_PUBLIC_SITE_URL is inlined at build time, so a bad
// value ends up in sitemap.xml, robots.txt, and every canonical tag. Only absolute
// http(s) origins are accepted, and a localhost origin is ignored in production
// builds so a local `next build` cannot ship a sitemap full of localhost URLs.
const FALLBACK_ORIGIN = "https://zewartransport.com";

function resolveOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured || !/^https?:\/\//.test(configured)) return FALLBACK_ORIGIN;

  const origin = configured.replace(/\/+$/, "");
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(origin);
  if (isLocal && process.env.NODE_ENV === "production") return FALLBACK_ORIGIN;

  return origin;
}

const SITE_ORIGIN = resolveOrigin();

export const COMPANY: CompanyProfile = {
  legalName: "Zewar Transport LLC",
  shortName: "Zewar Transport",
  tagline: "Reliable freight transportation across the United States",
  foundedYear: 2023,
  phone: "+1 916 841-8948",
  phoneHref: "tel:+19168418948",
  email: "sam@zewartransport.com",
  emailCareers: "hr@zewartransport.com",
  mcNumber: MC_NUMBER,
  dotNumber: DOT_NUMBER,
  address: ADDRESS,
  domain: SITE_ORIGIN,
};

/** True only when both FMCSA identifiers hold real, confirmed values. */
export const CARRIER_AUTHORITY_PUBLISHED = Boolean(COMPANY.mcNumber && COMPANY.dotNumber);

/** The identifiers that are safe to display, in order. Empty until confirmed. */
export const CARRIER_IDS: readonly string[] = [COMPANY.mcNumber, COMPANY.dotNumber].filter(
  (value): value is string => Boolean(value),
);

/** Single-line address for display and for the mailto/maps links. */
export const ADDRESS_LINE = ADDRESS
  ? `${ADDRESS.streetAddress}, ${ADDRESS.addressLocality}, ${ADDRESS.addressRegion} ${ADDRESS.postalCode}`
  : null;

/** Google Maps link built from the address rather than a hardcoded URL. */
export const MAP_QUERY = ADDRESS_LINE
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${COMPANY.legalName}, ${ADDRESS_LINE}`)}`
  : null;

export const OFFICE_HOURS = [
  { days: "Monday to Friday", hours: "8:00 AM to 6:00 PM ET" },
  { days: "Saturday", hours: "9:00 AM to 2:00 PM ET" },
  { days: "Sunday", hours: "Dispatch on call for active loads" },
] as const;

export const AUTHORITY_ON_REQUEST =
  "Operating authority details are provided directly to shippers and brokers on request. Contact dispatch to verify before tendering freight.";

export const MISSION =
  "Our mission is to provide safe, on-time, and professional transportation services while ensuring complete customer satisfaction and long-term business partnerships.";
export const ABOUT_INTRO =
  "Zewar Transport LLC is a reliable transportation company providing freight and logistics solutions across the United States. We specialize in safe, on-time delivery using professional drivers and well-maintained equipment.";
export const CREDENTIALS = [
  "Registered LLC in the United States",
  "Active transportation operations since 2023",
  "Focus on safety, compliance, and reliable freight handling",
  "Professional dispatch and driver coordination",
] as const;

/** North American Industry Classification code for Truck Transportation. */
export const NAICS_TRUCK_TRANSPORTATION = "484";
