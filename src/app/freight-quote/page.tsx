import type { Metadata } from "next";
import { Phone, ShieldCheck, Truck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { FreightQuoteForm } from "@/components/forms/freight-quote-form";
import {
  AUTHORITY_ON_REQUEST,
  CARRIER_AUTHORITY_PUBLISHED,
  CARRIER_IDS,
  COMPANY,
} from "@/lib/data/company";
import { getCoverage, getEquipment } from "@/lib/server/fleet";
import { Card } from "@/components/ui/card";
import { buildFreightFaq } from "@/lib/data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/shared/json-ld";
export function generateMetadata(): Metadata {
  return pageMetadata(
    "Get a Freight Quote",
    "Request a Zewar Transport road freight quote for box truck, cargo van, Sprinter van, hotshot, or freight service.",
    "/freight-quote",
  );
}
export const dynamic = "force-dynamic";

export default async function Quote() {
  const [coverage, equipment] = await Promise.all([getCoverage(), getEquipment()]);
  const faq = buildFreightFaq(
    coverage.states,
    equipment.map((e) => e.name),
  );
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.answer },
    })),
  };
  return (
    <>
      <JsonLd data={faqSchema} />
      <PageHero
        eyebrow="Primary quote page"
        title="Get a Freight Quote"
        description="Share your shipment details. Response target: within 2 business hours."
      />
      <section className="section">
        <div className="container-site grid gap-8 lg:grid-cols-[3fr_2fr]">
          <Card className="p-6 md:p-8">
            <FreightQuoteForm />
          </Card>
          <aside>
            <div className="space-y-4 lg:sticky lg:top-28">
              <Card className="p-6">
                <Phone className="h-6 w-6 text-gold-500" />
                <h2 className="mt-3 text-xl font-bold">Prefer to call dispatch?</h2>
                <a className="mt-2 block font-semibold" href={COMPANY.phoneHref}>
                  {COMPANY.phone}
                </a>
              </Card>
              <Card className="p-6">
                <ShieldCheck className="h-6 w-6 text-gold-500" />
                <h2 className="mt-3 text-xl font-bold">Trust & coverage</h2>
                <p className="mt-2 text-sm leading-relaxed text-steel-600">
                  {coverage.states.join(" · ")}
                </p>
                <p className="mt-3 text-sm font-semibold">
                  {CARRIER_AUTHORITY_PUBLISHED ? CARRIER_IDS.join(" · ") : AUTHORITY_ON_REQUEST}
                </p>
              </Card>
              <Card className="p-6">
                <Truck className="h-6 w-6 text-gold-500" />
                <h2 className="mt-3 text-xl font-bold">Equipment</h2>
                <p className="mt-2 text-sm text-steel-600">
                  {equipment.map((e) => e.name).join(" · ")}
                </p>
              </Card>
            </div>
          </aside>
        </div>
      </section>
      <section className="section bg-slate-50">
        <div className="container-site max-w-4xl">
          <h2 className="section-title">Freight quote FAQ</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faq.map((x, i) => (
              <AccordionItem key={x.question} value={`q${i}`}>
                <AccordionTrigger>{x.question}</AccordionTrigger>
                <AccordionContent>{x.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
