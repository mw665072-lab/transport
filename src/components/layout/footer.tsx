import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, Phone, ShieldCheck, Youtube } from "lucide-react";
import { CARRIER_AUTHORITY_PUBLISHED, CARRIER_IDS, COMPANY } from "@/lib/data/company";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const companyLinks = [
  ["About Us", "/about"],
  ["Coverage Area", "/coverage-area"],
  ["Equipment & Fleet", "/equipment"],
  ["Experience & Authority", "/experience-authority"],
  ["Careers", "/career"],
] as const;

/** Icon per social key; an unmapped key is skipped rather than guessed at. */
const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  social_facebook: Facebook,
  social_linkedin: Linkedin,
  social_instagram: Instagram,
  social_youtube: Youtube,
};

export function Footer({
  services,
  social = [],
}: {
  services: readonly { slug: string; name: string }[];
  social?: readonly { key: string; label: string; url: string }[];
}) {
  const cols = (
    <>
      <div className="min-w-0">
        <h3 className="font-semibold text-white">Company</h3>
        <div className="mt-4 space-y-3">
          {companyLinks.map(([l, h]) => (
            <Link
              key={h}
              href={h}
              className="block py-1 text-sm text-slate-300 transition hover:text-gold-400"
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-white">Freight Services</h3>
        <div className="mt-4 space-y-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block py-1 text-sm text-slate-300 transition hover:text-gold-400"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-white">Contact & Dispatch</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <a
            href={COMPANY.phoneHref}
            className="flex items-center gap-2 py-1 transition hover:text-gold-400"
          >
            <Phone className="h-4 w-4 text-gold-500" />
            {COMPANY.phone}
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="flex items-start gap-2 py-1 transition hover:text-gold-400"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            <span className="break-all">{COMPANY.email}</span>
          </a>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            <span>
              {CARRIER_AUTHORITY_PUBLISHED
                ? CARRIER_IDS.join(" · ")
                : "Operating authority verified on request"}
            </span>
          </p>
        </div>
      </div>
    </>
  );

  return (
    <footer className="bg-navy-950 pb-20 text-white md:pb-0">
      <div className="container-site py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Zewar Transport LLC"
                width={256}
                height={256}
                className="h-16 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Zewar Transport LLC provides professional road freight transportation using vans,
              box trucks, and hotshot capacity for regional and interstate business shipments
              across its stated service areas.
            </p>

            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {social.map((link) => {
                  const Icon = SOCIAL_ICONS[link.key];
                  if (!Icon) return null;
                  return (
                    <li key={link.key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-gold-500 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">{link.label} (opens in a new tab)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="hidden grid-cols-3 gap-8 lg:grid">{cols}</div>
          <div className="lg:hidden">
            <Accordion type="multiple">
              <AccordionItem value="company">
                <AccordionTrigger className="text-white">Company</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {companyLinks.map(([l, h]) => (
                      <Link key={h} href={h} className="block py-1 text-slate-300">
                        {l}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="services">
                <AccordionTrigger className="text-white">Services</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="block py-1 text-slate-300"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contact">
                <AccordionTrigger className="text-white">Contact</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-slate-300">
                    <a className="block py-1" href={COMPANY.phoneHref}>
                      {COMPANY.phone}
                    </a>
                    <a className="block break-all py-1" href={`mailto:${COMPANY.email}`}>
                      {COMPANY.email}
                    </a>
                    <p>
                      {CARRIER_AUTHORITY_PUBLISHED
                        ? CARRIER_IDS.join(" · ")
                        : "Operating authority verified on request"}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="inline-block py-1 hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-block py-1 hover:text-slate-200">
              Terms
            </Link>
            <a href="/sitemap.xml" className="inline-block py-1 hover:text-slate-200">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
