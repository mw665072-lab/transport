import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Phone,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import {
  ABOUT_INTRO,
  ADDRESS_LINE,
  CARRIER_AUTHORITY_PUBLISHED,
  COMPANY,
  CREDENTIALS,
  MISSION,
} from "@/lib/data/company";
import { getCoverage } from "@/lib/server/fleet";
import { getEquipment } from "@/lib/server/fleet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function generateMetadata(): Metadata {
  return pageMetadata(
    `About ${COMPANY.legalName}`,
    `Learn about ${COMPANY.legalName}, its mission, operating history, fleet standards, and road-freight coordination focus.`,
    "/about",
  );
}

/**
 * Every claim here has to hold up against the rest of the site. Specific figures
 * the client has not confirmed (truck lengths, 24/7 cover, published FMCSA
 * numbers) are described the way the equipment and authority pages describe them.
 */
const transportPillars = [
  {
    icon: Truck,
    title: "Road-ready equipment",
    badge: "Equipment standards",
    description:
      "We run maintained box trucks, high-roof Sprinter vans, and cargo vans with securement gear for palletized and boxed commercial loads. Legal payload and usable dimensions are confirmed against your freight before dispatch.",
  },
  {
    icon: Headphones,
    title: "Direct dispatch coordination",
    badge: "One point of contact",
    description:
      "Every shipment is coordinated by our own dispatch team rather than a call centre. Shippers get pickup confirmation, en-route updates, and delivery confirmation from the same people.",
  },
  {
    icon: Route,
    title: "Point-to-point delivery",
    badge: "No cross-docking",
    description:
      "Freight travels on a dedicated vehicle from origin to destination. Removing terminal transfers reduces handling, and with it the chance of damage or delay.",
  },
  {
    icon: ShieldCheck,
    title: "Safety and compliance",
    badge: "Compliance focus",
    description:
      "Loads are planned around safe handling, pre-trip vehicle checks, and the federal rules that apply to motor carriers. Operating authority details are provided to shippers and brokers on request.",
  },
];

const buildStats = (coverage: { states: string[] }, equipment: { name: string }[]) => [
  {
    number: String(COMPANY.foundedYear),
    label: "Operating since",
    description: "Registered US road carrier providing regional and interstate freight",
  },
  {
    number: `${coverage.states.length}`,
    label: "Core states",
    description: coverage.states.join(", ") + ", plus surrounding interstate regions",
  },
  {
    number: String(equipment.length),
    label: "Equipment classes",
    description: equipment.map((e) => e.name).join(", "),
  },
  {
    number: "100%",
    label: "Dedicated shipments",
    description: "Direct point-to-point transport with no freight co-mingling",
  },
];

export const dynamic = "force-dynamic";

export default async function About() {
  const [coverage, equipment] = await Promise.all([getCoverage(), getEquipment()]);
  const companyStats = buildStats(coverage, equipment);
  return (
    <>
      <PageHero
        eyebrow="Company overview"
        title={`Professional road freight coordination since ${COMPANY.foundedYear}.`}
        description={ABOUT_INTRO}
      />

      {/* Mission, with the company's own credentials as supporting values. */}
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow text-steel-600">Our mission</p>
            <h2 className="section-title text-navy-900">
              Safe, on-time, professional transportation.
            </h2>
            <p className="section-intro text-steel-600">{MISSION}</p>

            <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-navy-900">
              What we hold ourselves to
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {CREDENTIALS.map((credential) => (
                <li key={credential}>
                  <Card className="flex h-full items-start gap-3.5 p-4 transition hover:border-gold-500/60">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-600">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-navy-900">
                      {credential}
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/logistics-network.jpg"
                  alt={`${COMPANY.shortName} dispatch and load coordination operations`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/15 bg-navy-950/85 p-4 text-white backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
                      <Truck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{COMPANY.legalName}</p>
                      <p className="text-xs text-slate-300">
                        {CARRIER_AUTHORITY_PUBLISHED
                          ? "USDOT and MC registered road freight carrier"
                          : "Registered US road freight carrier"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How the company operates. */}
      <section className="section border-y border-slate-200 bg-slate-50">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-steel-600">Transport standards</p>
            <h2 className="section-title text-navy-900">
              How {COMPANY.shortName} delivers on every load.
            </h2>
            <p className="section-intro text-steel-600">
              Our transportation model gives commercial shippers dependable, transparent
              capacity without broker runarounds or terminal transfers.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {transportPillars.map((pillar) => (
              <Reveal key={pillar.title}>
                <Card className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                      <pillar.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-steel-600">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-navy-900 transition-colors group-hover:text-gold-600">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-600">
                    {pillar.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Figures derived from the site's own data, so they cannot drift. */}
      <section className="section bg-navy-950 text-white">
        <div className="container-site">
          <p className="eyebrow text-gold-400">By the numbers</p>
          <h2 className="section-title text-white">
            Where {COMPANY.shortName} operates today.
          </h2>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat) => (
              <Reveal key={stat.label}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <p className="font-heading text-4xl font-extrabold leading-none text-gold-400">
                      {stat.number}
                    </p>
                    <p className="mt-3 text-base font-bold text-white">{stat.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {stat.description}
                    </p>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          {ADDRESS_LINE && (
            <p className="mt-10 text-sm text-slate-300">Head office: {ADDRESS_LINE}</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-site">
          <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 p-6 text-white shadow-xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_auto] lg:items-center">
              <div>
                <span className="inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-400">
                  Partner with {COMPANY.shortName}
                </span>
                <h2 className="section-title-sm mt-4 text-white">
                  Ready to move your next freight load?
                </h2>
                <p className="section-intro text-sm text-slate-300 md:text-base">
                  Submit shipment details online for a dispatch review, or call our direct line
                  to check equipment availability for your lanes.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button size="lg" asChild className="shadow-lg">
                  <Link href="/freight-quote">
                    Get a Freight Quote
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/80 text-white hover:bg-white/10"
                >
                  <a href={COMPANY.phoneHref}>
                    <Phone className="text-gold-400" aria-hidden="true" />
                    Call Dispatch
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
