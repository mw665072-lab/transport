import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { getService, getServices, getServiceItems } from "@/lib/server/services";
import { COVERAGE } from "@/lib/data/coverage";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { ItemGallery } from "@/components/services/item-gallery";
import { COMPANY, NAICS_TRUCK_TRANSPORTATION } from "@/lib/data/company";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  return s ? pageMetadata(s.name, s.short, `/services/${s.slug}`) : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) notFound();
  const others = (await getServices()).filter((service) => service.slug !== slug);
  const items = (await getServiceItems(slug)).map(
    ({ id, category, title, description, image }) => ({
      id,
      category,
      title,
      description,
      image,
    }),
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    provider: {
      "@type": COMPANY.address ? "LocalBusiness" : "Organization",
      name: COMPANY.legalName,
      url: COMPANY.domain,
      telephone: COMPANY.phone,
      naics: NAICS_TRUCK_TRANSPORTATION,
    },
    areaServed: COVERAGE.states.map((state) => ({ "@type": "State", name: state })),
    description: s.short,
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: COMPANY.domain },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${COMPANY.domain}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: s.name,
        item: `${COMPANY.domain}/services/${s.slug}`,
      },
    ],
  };
  return (
    <>
      <JsonLd data={[schema, crumbs]} />
      <PageHero eyebrow="Road freight service" title={s.name} description={s.short} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-slate-50">
        <ol className="container-site flex flex-wrap items-center gap-1.5 py-3 text-sm text-steel-600">
          <li>
            <Link
              href="/"
              className="rounded-sm py-1 font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li>
            <Link
              href="/services"
              className="rounded-sm py-1 font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Services
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li aria-current="page" className="min-w-0 py-1">
            {s.name}
          </li>
        </ol>
      </nav>
      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h2 className="text-3xl font-bold text-navy-900">Service overview</h2>
            <p className="mt-5 max-w-[70ch] leading-8 text-steel-600">{s.body}</p>
            <h2 className="mt-10 text-2xl font-bold text-navy-900">Typical load types</h2>
            <ul className="mt-5 space-y-3">
              {s.typicalLoads.map((x) => (
                <li key={x} className="flex gap-3 text-steel-600">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-relaxed text-steel-600">
              <strong className="text-navy-900">Turnaround:</strong> {s.turnaround}
            </p>
            <Button asChild className="mt-7">
              <Link href="/freight-quote">Request a Quote</Link>
            </Button>
          </div>
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-50">
              <Image
                src={s.image}
                alt={`${s.name} road transportation`}
                fill
                sizes="(max-width:1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            {/* Every service links to every other one, so a visitor who lands
                here from search can see the full range without going back. */}
            {others.length > 0 && (
              <nav aria-labelledby="other-services" className="mt-6">
                <h2
                  id="other-services"
                  className="text-sm font-bold uppercase tracking-wide text-navy-900"
                >
                  Other services
                </h2>
                <ul className="mt-3 grid gap-2">
                  {others.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 transition hover:border-gold-500 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600">
                            {service.name}
                          </span>
                          {service.navDescription && (
                            <span className="mt-0.5 block text-xs leading-snug text-steel-600">
                              {service.navDescription}
                            </span>
                          )}
                        </span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-steel-600 transition group-hover:translate-x-0.5 group-hover:text-gold-600"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-2 rounded-sm py-1.5 text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  View all services
                </Link>
              </nav>
            )}
          </div>
        </div>
      </section>

      <ItemGallery items={items} heading={`Inside ${s.name}`} />
    </>
  );
}
