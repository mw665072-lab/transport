import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import {
  AUTHORITY_ON_REQUEST,
  CARRIER_AUTHORITY_PUBLISHED,
  COMPANY,
  CREDENTIALS,
} from "@/lib/data/company";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Experience & Authority",
    `Review ${COMPANY.shortName} company status, operating history, compliance focus, and how to verify operating authority before tendering freight.`,
    "/experience-authority",
  );
}

export default function Experience() {
  return (
    <>
      <PageHero
        eyebrow="Trust & authority"
        title="Verify our authority before you tender freight."
        description={`${COMPANY.shortName} publishes only confirmed compliance information. Anything still being verified is shared directly by dispatch rather than displayed unverified.`}
      />
      <section className="section">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <Card className="p-7">
            <ShieldCheck className="h-8 w-8 text-gold-500" />
            <h2 className="mt-4 text-2xl font-bold">Carrier identifiers</h2>
            {CARRIER_AUTHORITY_PUBLISHED ? (
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-sm text-steel-600">MC number</dt>
                  <dd className="font-bold">{COMPANY.mcNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm text-steel-600">USDOT number</dt>
                  <dd className="font-bold">{COMPANY.dotNumber}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-5 leading-relaxed text-steel-600">{AUTHORITY_ON_REQUEST}</p>
            )}
            <p className="mt-5 text-sm leading-relaxed text-steel-600">
              Certificates of insurance are issued per shipment or per contract and are sent
              directly to the shipper or broker of record on request.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">Request compliance documents</Link>
              </Button>
              <Button asChild variant="outline" className="border-navy-900 text-navy-900">
                <a href={COMPANY.phoneHref}>Call dispatch</a>
              </Button>
            </div>
          </Card>
          <div className="grid gap-4">
            {CREDENTIALS.map((c) => (
              <Card key={c} className="p-5 font-semibold">
                {c}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
