import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { getServices } from "@/lib/server/services";
import { ServicesOverview } from "@/components/sections/services-overview";
import { Card } from "@/components/ui/card";
export function generateMetadata(): Metadata {
  return pageMetadata(
    "Road Freight Services",
    "Explore Zewar Transport box truck, hotshot, cargo van, Sprinter van, and road freight transportation services.",
    "/services",
  );
}
export const dynamic = "force-dynamic";

export default async function Services() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="The equipment and road services Zewar actually operates."
        description="No air freight, ocean freight, ports, warehousing claims, or fabricated logistics services—just practical road transportation built around vans, box trucks, and hotshot capacity."
      />
      <ServicesOverview services={services} />

      {/* Photography-led detail below the overview, for visitors who scroll. */}
      <section className="section bg-slate-50">
        <div className="container-site">
          <h2 className="section-title text-navy-900">Every service in detail.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <Card key={s.slug} className="flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image
                    src={s.image}
                    alt={`${s.name} road transportation`}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-bold text-navy-900">{s.name}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-steel-600">{s.short}</p>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-sm py-1.5 font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                  >
                    View service <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
