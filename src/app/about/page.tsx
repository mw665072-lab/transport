import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { ABOUT_INTRO, COMPANY, CREDENTIALS, MISSION } from "@/lib/data/company";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import {
  ShieldCheck,
  Truck,
  Clock,
  MapPin,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Route,
  PackageCheck,
  Phone,
} from "lucide-react";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "About Zewar Transport LLC",
    "Learn about Zewar Transport LLC, its mission, operating history, fleet standards, and road-freight coordination focus.",
    "/about"
  );
}

const transportPillars = [
  {
    icon: Truck,
    title: "Dedicated Road-Ready Equipment",
    badge: "Equipment Standards",
    description:
      "We operate clean, well-maintained commercial 26ft box trucks, high-roof Sprinter vans, and express cargo vans equipped with securement gear for palletized and boxed commercial loads.",
  },
  {
    icon: Headphones,
    title: "Direct Dispatch & Live Tracking",
    badge: "24/7 Coordination",
    description:
      "Every shipment is coordinated directly by our dispatch team. Shippers receive timely milestone updates from pickup check-in to en-route check-ins and final delivery sign-off.",
  },
  {
    icon: Route,
    title: "Point-to-Point Direct Delivery",
    badge: "Zero Cross-Docking",
    description:
      "Your cargo travels on a dedicated vehicle directly from shipper origin to recipient dock. Eliminating intermediary warehouses minimizes handling and significantly reduces transit risk.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Carrier Compliance",
    badge: "FMCSA Compliant",
    description:
      "Operating with active USDOT and MC carrier authorities, Zewar strictly adheres to Federal Motor Carrier Safety Administration (FMCSA) standards, pre-trip vehicle checks, and safe driving protocols.",
  },
];

const companyStats = [
  {
    number: "2023",
    label: "Operating Since",
    description: "Registered US road carrier providing reliable regional freight",
  },
  {
    number: "4+",
    label: "Core States & Interstate",
    description: "Dedicated lanes across California, Texas, Nevada, and Virginia",
  },
  {
    number: "3",
    label: "Fleet Equipment Classes",
    description: "26ft Box Trucks, High-Roof Sprinters, and Express Cargo Vans",
  },
  {
    number: "100%",
    label: "Dedicated Shipments",
    description: "Direct point-to-point transport with no freight co-mingling",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Company Overview"
        title="Professional road freight coordination since 2023."
        description={ABOUT_INTRO}
      />

      {/* Mission & Overview Section */}
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow text-steel-600">Our mission</p>
            <h2 className="section-title text-navy-900 mt-2">
              Safe, on-time, professional transportation.
            </h2>
            <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-steel-600">
              {MISSION}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CREDENTIALS.map((c) => (
                <Card
                  key={c}
                  className="flex items-start gap-3.5 p-4 shadow-sm border border-slate-200 transition hover:border-gold-500/60"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-navy-900 leading-snug">{c}</p>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/logistics-network.jpg"
                  alt="Zewar Transport logistics operations and tracking network"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/15 bg-navy-950/85 p-4 text-white backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-950 font-bold">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Zewar Transport LLC</p>
                      <p className="text-xs text-slate-300">
                        USDOT & MC registered road freight carrier
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEW: Transport Standards & Capabilities Section */}
      <section className="section bg-slate-50 border-y border-slate-200">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-steel-600">Transport Standards</p>
            <h2 className="section-title text-navy-900 mt-2">
              How Zewar delivers operational excellence on every load.
            </h2>
            <p className="mt-4 text-steel-600 leading-relaxed">
              We built our transportation model to give commercial shippers dependable,
              transparent capacity without the complications of freight broker runarounds or
              terminal transfers.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {transportPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title}>
                  <Card className="group h-full p-7 transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-steel-600">
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-steel-600">
                      {pillar.description}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Operational Stats Section */}
      <section className="section bg-navy-950 text-white">
        <div className="container-site">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat) => (
              <Reveal key={stat.label}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10">
                  <p className="text-4xl font-extrabold text-gold-400 font-heading">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-base font-bold text-white">{stat.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {stat.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-site">
          <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 p-8 text-white shadow-xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_auto] lg:items-center">
              <div>
                <span className="inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold text-gold-400 uppercase tracking-wider">
                  Partner With Zewar
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Ready to move your next freight load?
                </h2>
                <p className="mt-3 max-w-2xl text-slate-300 text-sm leading-relaxed md:text-base">
                  Submit shipment details online for rapid dispatch evaluation or call our
                  direct line to check equipment availability for your lanes.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="font-semibold shadow-lg">
                  <Link href="/freight-quote">
                    Get a Freight Quote <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/80 text-white hover:bg-white/10"
                >
                  <a href={COMPANY.phoneHref}>
                    <Phone className="mr-1.5 h-4 w-4 text-gold-400" />
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
