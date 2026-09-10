import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { getEquipment, getEquipmentItem } from "@/lib/server/fleet";
import { SPEC_NOTE } from "@/lib/data/equipment";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipmentItem(slug);
  return item
    ? pageMetadata(item.name, item.description, `/equipment/${item.slug}`)
    : pageMetadata("Equipment", "This vehicle is no longer listed.", `/equipment/${slug}`);
}

export default async function EquipmentDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getEquipmentItem(slug);
  if (!item) notFound();
  const others = (await getEquipment()).filter((e) => e.slug !== slug);
  const paragraphs = item.body
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero eyebrow="Equipment" title={item.name} description={item.description} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-slate-50">
        <ol className="container-site flex flex-wrap items-center gap-1.5 py-3 text-sm text-steel-600">
          <li>
            <Link
              href="/"
              className="rounded-sm py-1 font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li>
            <Link
              href="/equipment"
              className="rounded-sm py-1 font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Equipment
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <li aria-current="page" className="min-w-0 py-1">
            {item.name}
          </li>
        </ol>
      </nav>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div className="max-w-[70ch]">
            {/* Admins write the description with blank lines between paragraphs, so
                each block gets its own <p> rather than collapsing into one. */}
            {paragraphs.length > 0 && (
              <div className="space-y-5">
                {paragraphs.map((para) => (
                  <p key={para.slice(0, 40)} className="text-base leading-8 text-steel-600">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {item.specs.length > 0 && (
              <>
                <h2
                  className={
                    paragraphs.length > 0
                      ? "mt-10 text-2xl font-bold text-navy-900"
                      : "text-2xl font-bold text-navy-900"
                  }
                >
                  Specifications
                </h2>
                <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                  {item.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-[.8fr_1.2fr] gap-4 py-3 text-sm"
                    >
                      <dt className="font-semibold text-navy-900">{spec.label}</dt>
                      <dd className="text-steel-600">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {item.typicalUses.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold text-navy-900">Typical uses</h2>
                <ul className="mt-5 grid gap-3">
                  {item.typicalUses.map((use) => (
                    <li key={use} className="flex gap-3 text-steel-600">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                        aria-hidden="true"
                      />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-8 rounded-xl bg-slate-50 p-5 text-sm leading-relaxed text-steel-600">
              {SPEC_NOTE}
            </p>

            <Button asChild size="lg" className="mt-8">
              <Link href="/freight-quote">
                Get a quote for this equipment
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width:1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            {others.length > 0 && (
              <nav aria-labelledby="other-equipment" className="mt-6">
                <h2
                  id="other-equipment"
                  className="text-sm font-bold uppercase tracking-wide text-navy-900"
                >
                  Other equipment
                </h2>
                <ul className="mt-3 grid gap-2">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/equipment/${other.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 transition hover:border-gold-500 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600">
                            {other.name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-steel-600">
                            {other.description}
                          </span>
                        </span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-steel-600 transition group-hover:translate-x-0.5 group-hover:text-gold-600"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/equipment"
                  className="mt-4 inline-flex items-center gap-2 rounded-sm py-1.5 text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  All equipment
                </Link>
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
