import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { ABOUT_INTRO, CREDENTIALS, MISSION } from "@/lib/data/company";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";
import { ShieldCheck, Truck } from "lucide-react";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "About Zewar Transport LLC",
    "Learn about Zewar Transport LLC, its mission, operating history, and road-freight coordination focus.",
    "/about"
  );
}

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Professional road freight coordination since 2023."
        description={ABOUT_INTRO}
      />
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Our mission</p>
            <h2 className="section-title">Safe, on-time, professional transportation.</h2>
            <p className="mt-5 max-w-[65ch] leading-relaxed text-steel-600">{MISSION}</p>
            <div className="mt-8 grid gap-4">
              {CREDENTIALS.map((c) => (
                <Card key={c} className="flex items-center gap-4 p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-navy-900">{c}</p>
                </Card>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/logistics-network.jpg"
                  alt="Zewar Transport logistics operations and tracking network"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
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
    </>
  );
}
