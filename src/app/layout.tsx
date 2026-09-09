import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { SiteChrome } from "@/components/layout/site-chrome";
import { COMPANY, NAICS_TRUCK_TRANSPORTATION } from "@/lib/data/company";
import { NAV, type NavItem } from "@/lib/data/nav";
import { getServices } from "@/lib/server/services";
import { getSocialLinks } from "@/lib/server/site-data";
import { COVERAGE } from "@/lib/data/coverage";
import { JsonLd } from "@/components/shared/json-ld";
import { BreadcrumbJsonLd } from "@/components/shared/breadcrumb-json-ld";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.domain),
  title: {
    default: "Zewar Transport LLC | Road Freight Transportation",
    template: "%s | Zewar Transport",
  },
  description: COMPANY.tagline,
};

// Zewar is a road freight carrier, not a household mover, so this is not a
// MovingCompany. LocalBusiness requires a postal address for rich results, so the
// type stays Organization until COMPANY.address is filled in.
const schema = {
  "@context": "https://schema.org",
  "@type": COMPANY.address ? "LocalBusiness" : "Organization",
  name: COMPANY.legalName,
  legalName: COMPANY.legalName,
  description: COMPANY.tagline,
  url: COMPANY.domain,
  logo: `${COMPANY.domain}/images/logo.png`,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  foundingDate: String(COMPANY.foundedYear),
  naics: NAICS_TRUCK_TRANSPORTATION,
  areaServed: COVERAGE.states.map((state) => ({ "@type": "State", name: state })),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "dispatch",
      telephone: COMPANY.phone,
      email: COMPANY.email,
      areaServed: "US",
      availableLanguage: "en",
    },
  ],
  ...(COMPANY.address ? { address: { "@type": "PostalAddress", ...COMPANY.address } } : {}),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The Services menu and the footer service list come from the database, so
  // editing a service in the admin panel updates every page's chrome at once.
  const services = await getServices();
  const social = await getSocialLinks();
  const nav: NavItem[] = NAV.map((item) =>
    item.label === "Services"
      ? {
          ...item,
          children: services.map((service) => ({
            label: service.navLabel,
            href: `/services/${service.slug}`,
            description: service.navDescription,
          })),
        }
      : item,
  );

  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <JsonLd data={schema} />
        <BreadcrumbJsonLd />
        <SiteChrome>
          <Header nav={nav} />
        </SiteChrome>
        <main id="main-content">{children}</main>
        <SiteChrome>
          <Footer services={services} social={social} />
          <MobileActionBar />
        </SiteChrome>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
