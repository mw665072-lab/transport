import Link from "next/link";
import { ArrowRight, Briefcase, FileText, MapPin, Phone, Truck } from "lucide-react";
import { COMPANY } from "@/lib/data/company";

/**
 * Shortcut row for the actions people arrive wanting. Routes are fixed, so these
 * live in code rather than the database.
 */
const LINKS = [
  {
    href: "/freight-quote",
    icon: FileText,
    title: "Get a freight quote",
    description: "Share lane, timing, and freight details.",
  },
  {
    href: "/services",
    icon: Truck,
    title: "Browse services",
    description: "Box truck, van, hotshot, and expedited.",
  },
  {
    href: "/coverage-area",
    icon: MapPin,
    title: "Check coverage",
    description: "States and lanes we run today.",
  },
  {
    href: "/career",
    icon: Briefcase,
    title: "Open roles",
    description: "Driver, dispatch, and operations jobs.",
  },
  {
    href: "/owner-operator",
    icon: Truck,
    title: "Owner operators",
    description: "Run your own equipment with us.",
  },
  {
    href: COMPANY.phoneHref,
    icon: Phone,
    title: "Call dispatch",
    description: COMPANY.phone,
    external: true,
  },
] as const;

export function QuickLinks() {
  return (
    <section className="section bg-slate-50">
      <div className="container-site">
        <p className="eyebrow text-steel-600">Quick links</p>
        <h2 className="section-title text-navy-900">Start where you need to.</h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const content = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-navy-900 transition-colors group-hover:text-gold-600">
                    {link.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-steel-600">
                    {link.description}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-steel-600 transition group-hover:translate-x-0.5 group-hover:text-gold-600"
                  aria-hidden="true"
                />
              </>
            );
            const className =
              "group flex h-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold-500 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2";

            return (
              <li key={link.title}>
                {"external" in link && link.external ? (
                  <a href={link.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link href={link.href} className={className}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
