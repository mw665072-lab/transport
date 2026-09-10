import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  CARRIER_AUTHORITY_PUBLISHED,
  CARRIER_IDS,
  COMPANY,
  CREDENTIALS,
} from "@/lib/data/company";
import { SERVICES } from "@/lib/data/services";
import type { PublicCoverage, PublicEquipment } from "@/lib/server/fleet";
import { listStates, stateAbbreviation } from "@/lib/data/us-states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";

export function HomeHero({ states }: { states: string[] }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-16 text-white md:pt-20">
      <Image
        src="/images/hero-freight.jpg"
        alt="Zewar Transport freight shipping and commercial transport operations"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/45" />
      <div className="container-site relative flex min-h-[680px] items-center py-16 md:min-h-[640px]">
        <Reveal className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[.22em] text-gold-400">
            Road freight · box trucks · vans
          </p>
          <h1 className="text-[clamp(2.35rem,7vw,5.5rem)] font-bold leading-[.98] tracking-tight">
            Freight You Can Track. Delivery You Can Trust.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
            Reliable freight transportation across {listStates(states)}, and surrounding
            interstate regions using road-ready vans and box trucks.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/freight-quote">
                Get a Freight Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <a href={COMPANY.phoneHref}>
                Call Dispatch <Phone className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-slate-300">
            {[...CARRIER_IDS, `Operating since ${COMPANY.foundedYear}`].join(" · ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// Four tiles either way: the carrier identifiers lead once confirmed, otherwise
// the band falls back to claims that do not depend on unpublished FMCSA numbers.
const TRUST_TILES: readonly string[] = [
  ...CARRIER_IDS,
  "Insured & Compliant",
  `Operating since ${COMPANY.foundedYear}`,
  ...(CARRIER_AUTHORITY_PUBLISHED
    ? []
    : ["Registered U.S. LLC", "Regional & interstate coverage"]),
].slice(0, 4);

export function TrustBand() {
  return (
    <div className="bg-navy-900 text-white">
      <div className="container-site grid gap-0 divide-y divide-white/10 py-2 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
        {TRUST_TILES.map((x) => (
          <div
            key={x}
            className="flex min-h-14 items-center justify-center gap-2 px-4 text-center text-sm font-semibold"
          >
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            {x}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section className="section">
      <div className="container-site">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-steel-600">What we move</p>
              <h2 className="section-title text-navy-900">
                Road freight services built around real equipment.
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden shrink-0 rounded-sm py-1.5 font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 sm:block"
            >
              View all services
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Reveal key={s.slug}>
              <Card className="group h-full p-6 transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-500">
                  <Truck />
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy-900">{s.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">{s.short}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-sm py-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  Learn more{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CoverageSection({ coverage }: { coverage: PublicCoverage }) {
  return (
    <section className="section bg-slate-50">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow text-steel-600">Coverage area</p>
          <h2 className="section-title text-navy-900">Focused lanes. Clear service areas.</h2>
          <p className="section-intro text-steel-600">
            Current stated coverage includes four core states with surrounding interstate
            regions handled according to driver, lane, and equipment availability.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {coverage.states.map((s) => (
              <span
                key={s}
                className="rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-navy-950 shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-sm text-steel-600">
            <p className="font-semibold text-navy-900">Key Operating Lanes:</p>
            {coverage.lanes.map((lane) => (
              <div key={lane} className="flex items-center gap-2 text-xs md:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                <span>{lane}</span>
              </div>
            ))}
          </div>
          <Button asChild variant="navy" className="mt-7">
            <Link href="/coverage-area">
              View Full Coverage <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-navy-950 shadow-2xl transition hover:shadow-gold-500/10">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/us-coverage-map.jpg"
                alt={`Zewar Transport US freight routes and coverage map connecting ${listStates(coverage.states)}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="border-t border-white/10 bg-navy-950/90 px-5 py-3.5 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-500"></span>
                  </span>
                  <span className="text-white font-semibold">Active Transit Corridors</span>
                </div>
                <span className="font-bold text-gold-400">
                  {coverage.states.map(stateAbbreviation).join(" · ")} + Interstate
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function EquipmentSection({ equipment }: { equipment: PublicEquipment[] }) {
  return (
    <section className="section">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow text-steel-600">Equipment</p>
          <h2 className="section-title text-navy-900">
            Road-ready equipment for practical freight moves.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {equipment.map((e) => (
            <Reveal key={e.slug}>
              <Card className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={e.image}
                    alt={`${e.name} freight transportation vehicle`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-navy-950/80 px-3 py-1 text-[11px] font-bold tracking-wider text-gold-400 backdrop-blur-sm">
                    ROAD READY
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-navy-900 transition-colors group-hover:text-gold-600">
                    {e.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-600">{e.description}</p>
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <Link
                      href={`/equipment/${e.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-sm py-1.5 text-xs font-bold uppercase tracking-wider text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                    >
                      View Specs <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhySection() {
  const icons = [ShieldCheck, CalendarCheck, PackageCheck, Truck];
  return (
    <section className="section bg-navy-950 text-white">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-gold-400">Why Zewar</p>
              <h2 className="section-title text-white">
                Built around reliability and communication.
              </h2>
              <p className="section-intro max-w-xl text-base text-slate-200">
                From single-pallet urgent shipments to regional dedicated linehauls, Zewar pairs
                direct dispatch coordination with modern tracking across every mile.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {CREDENTIALS.map((item, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <Reveal key={item}>
                    <div className="h-full rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-gold-500/50 hover:bg-white/10">
                      <Icon className="h-6 w-6 text-gold-400" />
                      <h3 className="mt-3 text-base font-bold text-white">{item}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        Clear road-freight coordination focused on safe handling, professional
                        communication, and dependable execution.
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/logistics-network.jpg"
                  alt="Modern logistics technology & supply chain network"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-navy-950/85 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-950 font-bold">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Dispatch & Network Operations
                      </p>
                      <p className="text-xs text-slate-300">
                        Direct carrier coordination and load tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    ["01", "Request Quote", "Share origin, destination, timing, and freight details."],
    ["02", "We Dispatch", "Zewar reviews the lane and matches available equipment."],
    [
      "03",
      "Delivered On Time",
      "Dispatch coordinates the road move through final delivery communication.",
    ],
  ];
  return (
    <section className="section">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow text-steel-600">How it works</p>
          <h2 className="section-title text-navy-900">A simple path from quote to delivery.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Reveal key={s[0]}>
              <Card className="h-full p-6">
                <span className="text-4xl font-bold leading-none text-gold-600">{s[0]}</span>
                <h3 className="mt-4 text-xl font-bold text-navy-900">{s[1]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel-600">{s[2]}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OwnerBand() {
  return (
    <section className="band bg-navy-900 text-white">
      <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-gold-400">
            For owner operators
          </p>
          <h2 className="section-title-sm mt-2">Drive With Zewar.</h2>
          <p className="mt-3 text-slate-200">
            Tell us about your equipment, experience, and preferred lanes.
          </p>
        </div>
        <Button asChild>
          <Link href="/owner-operator">
            Apply / Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section bg-slate-50">
      <div className="container-site">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow text-steel-600">Ready to move freight?</p>
              <h2 className="section-title text-navy-900">
                Get the shipment details in front of dispatch.
              </h2>
              <p className="section-intro text-steel-600">
                Use the quote form for a structured request, or call dispatch if timing is
                urgent.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg">
                <Link href="/freight-quote">Start a Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-900 text-navy-900"
              >
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
