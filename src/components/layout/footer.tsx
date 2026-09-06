import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
import { SERVICES } from "@/lib/data/services";
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

export function Footer() {
  const cols = (
    <>
      <div>
        <h3 className="font-semibold text-white">Company</h3>
        <div className="mt-4 space-y-3">
          {companyLinks.map(([l, h]) => (
            <Link
              key={h}
              href={h}
              className="block text-sm text-slate-300 transition hover:text-gold-400"
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-white">Freight Services</h3>
        <div className="mt-4 space-y-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block text-sm text-slate-300 transition hover:text-gold-400"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-white">Contact & Dispatch</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <a
            href={COMPANY.phoneHref}
            className="flex items-center gap-2 transition hover:text-gold-400"
          >
            <Phone className="h-4 w-4 text-gold-500" />
            {COMPANY.phone}
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="flex items-center gap-2 transition hover:text-gold-400"
          >
            <Mail className="h-4 w-4 text-gold-500" />
            {COMPANY.email}
          </a>
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold-500" />
            {COMPANY.mcNumber} · {COMPANY.dotNumber}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <footer className="bg-navy-950 pb-20 text-white md:pb-0">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Zewar Transport LLC"
                width={210}
                height={140}
                className="h-16 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Zewar Transport LLC provides professional road freight transportation using
              vans, box trucks, and hotshot capacity for regional and interstate business
              shipments across its stated service areas.
            </p>
          </div>
          <div className="hidden grid-cols-3 gap-8 md:grid">{cols}</div>
          <div className="md:hidden">
            <Accordion type="multiple">
              <AccordionItem value="company">
                <AccordionTrigger className="text-white">Company</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {companyLinks.map(([l, h]) => (
                      <Link key={h} href={h} className="block text-slate-300">
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
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="block text-slate-300"
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
                    <a className="block" href={COMPANY.phoneHref}>
                      {COMPANY.phone}
                    </a>
                    <a className="block" href={`mailto:${COMPANY.email}`}>
                      {COMPANY.email}
                    </a>
                    <p>
                      {COMPANY.mcNumber} · {COMPANY.dotNumber}
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
            <Link href="/privacy-policy" className="hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-200">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-200">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
