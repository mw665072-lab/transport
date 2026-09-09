import Link from "next/link";
import { ArrowRight, Boxes, Package, Route, Truck, Zap } from "lucide-react";
import type { PublicService } from "@/lib/server/services";
import { COMPANY } from "@/lib/data/company";
import { Card } from "@/components/ui/card";

/**
 * Numbered overview of every service, mirroring the layout on the current live
 * site. Icons reuse the same mapping as the header menu so a service is
 * recognisable in either place; anything unmapped falls back to the truck.
 */
const ICONS: Record<string, typeof Truck> = {
  "box-truck-transportation": Truck,
  "hotshot-services": Zap,
  "cargo-van-delivery": Package,
  "sprinter-van-transportation": Route,
  "freight-transportation": Boxes,
  "expedited-same-day-delivery": Zap,
};

export function ServicesOverview({ services }: { services: PublicService[] }) {
  // Derived from the founding year so the claim can never drift out of date.
  const years = Math.max(1, new Date().getFullYear() - COMPANY.foundedYear);

  return (
    <section className="section">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow text-steel-600">What we move</p>
            <h2 className="section-title text-navy-900">
              Having more than {years} years of experience.
            </h2>
          </div>
          <p className="section-intro text-steel-600 lg:mt-0 lg:pt-4">
            Our goal is to deliver dependable transportation services to brokers, shippers, and
            business partners while maintaining high standards of safety, efficiency, and
            customer satisfaction.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = ICONS[service.slug] ?? Truck;
            return (
              <li key={service.slug}>
                <Card className="group relative flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-gold-500 text-gold-600 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-heading text-4xl font-bold leading-none text-gold-600 after:mt-1.5 after:block after:h-0.5 after:w-7 after:bg-gold-500"
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold leading-snug text-navy-900">
                    {/* Overlay makes the whole card one target without nesting links. */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="rounded-sm transition-colors after:absolute after:inset-0 group-hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                    >
                      {service.name}
                    </Link>
                  </h3>

                  {service.short && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-600">
                      {service.short}
                    </p>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600">
                    View service
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
