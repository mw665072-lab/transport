import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { FLEET_DESCRIPTION, SPEC_NOTE } from "@/lib/data/equipment";
import { getEquipment } from "@/lib/server/fleet";
import { listStates } from "@/lib/data/us-states";
import { COMPANY } from "@/lib/data/company";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const equipment = await getEquipment();
  return pageMetadata(
    "Equipment & Fleet",
    `See the ${listStates(equipment.map((e) => e.name))} used for ${COMPANY.shortName} road freight operations.`,
    "/equipment",
  );
}

export default async function Equipment() {
  const equipment = await getEquipment();

  return (
    <>
      <PageHero
        eyebrow="Equipment"
        title="Road-ready vans and box trucks."
        description={FLEET_DESCRIPTION}
      />
      <section className="section">
        <div className="container-site">
          <ul className="grid gap-6 lg:grid-cols-3">
            {equipment.map((item) => (
              <li key={item.slug}>
                <Card className="group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width:1024px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-2xl font-bold text-navy-900">
                      {/* One link covers the card, so the grid has no duplicate targets. */}
                      <Link
                        href={`/equipment/${item.slug}`}
                        className="rounded-sm transition-colors after:absolute after:inset-0 group-hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                      >
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-600">
                      {item.description}
                    </p>

                    {item.specs.length > 0 && (
                      <dl className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
                        {item.specs.slice(0, 3).map((spec) => (
                          <div
                            key={spec.label}
                            className="grid grid-cols-[.8fr_1.2fr] gap-4 py-2.5 text-xs"
                          >
                            <dt className="font-semibold text-navy-900">{spec.label}</dt>
                            <dd className="text-steel-600">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-900 transition-colors group-hover:text-gold-600">
                      View specs
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-steel-600">{SPEC_NOTE}</p>
        </div>
      </section>
    </>
  );
}
