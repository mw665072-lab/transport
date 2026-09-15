import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ApplicationForm } from "@/components/careers/application-form";
import { COMPANY } from "@/lib/data/company";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Register your interest",
    `Send a general application to ${COMPANY.legalName} and we will contact you when a matching role opens.`,
    "/career/apply",
  );
}

export default function GeneralApplication() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Register your interest."
        description="No matching opening right now? Send your details and resume, and we will get in touch when a suitable role comes up."
      />
      <section className="section">
        <div className="container-site max-w-3xl">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 rounded-sm py-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to careers
          </Link>
          <Card className="mt-6 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-navy-900">General application</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              Fields marked with an asterisk are required.
            </p>
            <div className="mt-6">
              <ApplicationForm />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
