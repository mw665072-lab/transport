import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Route, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { getCoverage } from "@/lib/server/fleet";
import { listStates, stateAbbreviation } from "@/lib/data/us-states";
import { COVERAGE } from "@/lib/data/coverage";
import { COMPANY } from "@/lib/data/company";
import { pageMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const { states } = await getCoverage();
  return pageMetadata(
    "Freight Coverage Area",
    `See ${COMPANY.shortName}'s stated ${listStates(states)}, and surrounding interstate road-freight coverage.`,
    "/coverage-area",
  );
}

export const dynamic = "force-dynamic";

export default async function Coverage() {
  const coverage = await getCoverage();
  return (
    <>
      <PageHero
        eyebrow="Coverage Area"
        title="Core service areas with dedicated interstate corridors."
        description={`${coverage.states.join(", ")}. ${COVERAGE.note}. Final lane acceptance depends on equipment and driver availability.`}
      />
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-navy-950 shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/us-coverage-map.jpg"
                alt={`${COMPANY.shortName} US interstate coverage and route map`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="border-t border-white/10 bg-navy-950/95 px-6 py-4 text-white">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-gold-400">
                  <span className="h-2 w-2 rounded-full bg-gold-400 animate-ping" />
                  Live Interstate Route Network
                </span>
                <span className="text-slate-300">
                  {coverage.states.map(stateAbbreviation).join(" · ")}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow text-steel-600">Operating footprint</p>
            <h2 className="section-title text-navy-900 mt-2">States served</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {coverage.states.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 font-semibold text-navy-900 shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/10 text-gold-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-xl font-bold text-navy-900">Primary Regional Corridors</h3>
            <div className="mt-4 space-y-2.5 text-steel-600">
              {coverage.lanes.map((lane) => (
                <div key={lane} className="flex items-center gap-2.5 text-sm">
                  <Route className="h-4 w-4 shrink-0 text-gold-500" />
                  <span>{lane}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/freight-quote">
                  Check Your Lane <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
