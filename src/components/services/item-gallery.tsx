"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ServiceItem } from "@/lib/data/records";
import { cn } from "@/lib/cn";

const ALL = "all";

/** Only the fields the gallery renders; database ids stay on the server. */
export type GalleryItem = Pick<
  ServiceItem,
  "id" | "category" | "title" | "description" | "image"
>;

export function ItemGallery({ items, heading }: { items: GalleryItem[]; heading: string }) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items],
  );
  const filtered = useMemo(
    () => (active === ALL ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  if (items.length === 0) return null;

  const tabs = [ALL, ...categories];

  return (
    <section className="section bg-slate-50">
      <div className="container-site">
        <h2 className="section-title text-navy-900">{heading}</h2>

        {categories.length > 0 && (
          <div
            role="tablist"
            aria-label="Filter by category"
            className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-5"
          >
            {tabs.map((tab) => {
              const selected = active === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(tab)}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
                    selected
                      ? "bg-gold-500 text-navy-950"
                      : "bg-white text-steel-600 hover:text-navy-900",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        <p aria-live="polite" className="mt-5 text-sm font-semibold text-steel-600">
          Showing {filtered.length} of {items.length}
        </p>

        <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <figure className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-gold-500 hover:shadow-lg">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={item.image || "/images/hero-freight.jpg"}
                    alt={item.title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-5">
                  <h3 className="text-lg font-bold text-navy-900">{item.title}</h3>
                  {item.category && (
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gold-600">
                      {item.category}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-steel-600">
                      {item.description}
                    </p>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
