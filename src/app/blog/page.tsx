import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { getPosts } from "@/lib/server/site-data";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "News & Insights",
    "Company updates, new lanes, equipment news, and practical road freight guidance from Zewar Transport.",
    "/blog",
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default async function Blog() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="News & insights"
        title="Company updates and practical freight guidance."
        description="New lanes, equipment news, and guidance based on the services Zewar Transport actually operates."
      />

      <section className="section">
        <div className="container-site">
          {posts.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="font-semibold text-navy-900">No updates published yet.</p>
              <p className="mt-2 text-sm text-steel-600">
                Company news and guidance articles will appear here.
              </p>
            </Card>
          ) : (
            <>
              <p className="text-sm font-semibold text-steel-600">
                {posts.length} article{posts.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Card className="group relative flex h-full flex-col p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        {p.category && (
                          <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-600">
                            {p.category}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs text-steel-600">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                          <time dateTime={p.date}>{formatDate(p.date)}</time>
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold leading-snug text-navy-900">
                        {/* One link covers the card, so the list has no duplicate targets. */}
                        <Link
                          href={`/blog/${p.slug}`}
                          className="rounded-sm transition-colors after:absolute after:inset-0 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                        >
                          {p.title}
                        </Link>
                      </h2>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-600">
                        {p.excerpt}
                      </p>
                      <span className="mt-5 text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600">
                        Read article
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
