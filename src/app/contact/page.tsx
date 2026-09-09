import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/forms/contact-form";
import { ADDRESS_LINE, COMPANY, MAP_QUERY, OFFICE_HOURS } from "@/lib/data/company";
import { Card } from "@/components/ui/card";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Contact Zewar Transport",
    `Contact Zewar Transport LLC about new shipments, existing loads, partnerships, or careers. Call ${COMPANY.phone} or send a message to dispatch.`,
    "/contact",
  );
}

const linkStyles =
  "rounded-sm font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2";

/** Embed URL is built from the address, so it follows any address change. */
const mapEmbed = ADDRESS_LINE
  ? `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_LINE)}&output=embed`
  : null;

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk with Zewar Transport."
        description="Send shipment, partnership, career, or general enquiries to dispatch. We reply within 2 business hours during operating hours."
      />

      <section className="section">
        <div className="container-site">
          {/* Direct contact routes come first: research on carrier sites shows
              shippers reach for the phone before a form on urgent freight. */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="flex h-full flex-col p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-navy-900">Call dispatch</h2>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                Fastest route for urgent pickups and active loads.
              </p>
              <a href={COMPANY.phoneHref} className={`${linkStyles} mt-auto pt-4 text-base`}>
                {COMPANY.phone}
              </a>
            </Card>

            <Card className="flex h-full flex-col p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-navy-900">Email us</h2>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                Quotes and general enquiries, or careers and driver applications.
              </p>
              {/* py-1 lifts these to a 28px target; they are only 20px as bare text. */}
              <div className="mt-auto flex flex-col pt-3">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className={`${linkStyles} break-all py-1 text-sm`}
                >
                  {COMPANY.email}
                </a>
                <a
                  href={`mailto:${COMPANY.emailCareers}`}
                  className={`${linkStyles} break-all py-1 text-sm`}
                >
                  {COMPANY.emailCareers}
                </a>
              </div>
            </Card>

            <Card className="flex h-full flex-col p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-navy-900">Office</h2>
              <address className="mt-2 text-sm not-italic leading-relaxed text-steel-600">
                {COMPANY.legalName}
                <br />
                {ADDRESS_LINE}
              </address>
              {MAP_QUERY && (
                <a
                  href={MAP_QUERY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkStyles} mt-auto pt-4 text-sm`}
                >
                  Open in Google Maps
                </a>
              )}
            </Card>
          </div>

          {/* Form and supporting detail share one row so the eye lands on the
              form first on desktop while hours stay visible beside it. */}
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-navy-900">Send a message</h2>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                Fields marked with an asterisk are required.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-navy-900">Operating hours</h2>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  {OFFICE_HOURS.map((entry) => (
                    <div key={entry.days}>
                      <dt className="font-semibold text-navy-900">{entry.days}</dt>
                      <dd className="mt-0.5 text-steel-600">{entry.hours}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <Card className="bg-navy-950 p-6 text-white">
                <h2 className="text-lg font-bold">Shipping something now?</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  The freight quote form captures lane, timing, and freight details in one pass,
                  so dispatch can price it without a follow-up email.
                </p>
                <a
                  href="/freight-quote"
                  className="mt-4 inline-flex rounded-sm py-1.5 text-sm font-semibold text-gold-400 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                >
                  Start a freight quote
                </a>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {mapEmbed && (
        <section className="pb-16 md:pb-24">
          <div className="container-site">
            <h2 className="sr-only">Office location map</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <iframe
                title={`Map showing ${COMPANY.legalName} at ${ADDRESS_LINE}`}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 md:h-[420px]"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
