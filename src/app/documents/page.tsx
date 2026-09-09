import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { DocumentForm } from "@/components/forms/document-form";
import { Card } from "@/components/ui/card";
import { COMPANY } from "@/lib/data/company";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Send a Document",
    "Upload a bill of lading, proof of delivery, or other paperwork for a Zewar Transport load.",
    "/documents",
  );
}

export default function Documents() {
  return (
    <>
      <PageHero
        eyebrow="Paperwork"
        title="Send us a bill of lading."
        description="Upload a signed BOL, proof of delivery, or any other paperwork for a load. Attach it here and dispatch will match it to the shipment."
      />
      <section className="section">
        <div className="container-site grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-navy-900">Upload a document</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              Fields marked with an asterisk are required.
            </p>
            <div className="mt-6">
              <DocumentForm />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-navy-900">What to send</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-steel-600">
              {[
                "Signed bill of lading",
                "Proof of delivery",
                "Packing list or weight ticket",
                "Photos of damage or a discrepancy",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-steel-600">
              Include the load reference so we can match it quickly. Urgent? Call dispatch on{" "}
              <a
                href={COMPANY.phoneHref}
                className="inline-block rounded-sm py-1 font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
              >
                {COMPANY.phone}
              </a>
              .
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
