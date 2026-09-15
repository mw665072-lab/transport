import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { getPost, getPosts } from "@/lib/server/site-data";
import { JsonLd } from "@/components/shared/json-ld";
import { COMPANY } from "@/lib/data/company";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? pageMetadata(post.title, post.excerpt, `/blog/${post.slug}`) : {};
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const others = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: COMPANY.legalName },
    publisher: {
      "@type": "Organization",
      name: COMPANY.legalName,
      logo: { "@type": "ImageObject", url: `${COMPANY.domain}/images/logo.png` },
    },
    mainEntityOfPage: `${COMPANY.domain}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        eyebrow={post.category || "Article"}
        title={post.title}
        description={post.excerpt}
      />

      <article className="section">
        <div className="container-site max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm text-steel-600">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>

          <div className="mt-8 space-y-6 text-lg leading-8 text-steel-600">
            {post.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link
            href="/blog"
            className="mt-12 inline-flex items-center gap-2 rounded-sm py-1.5 font-semibold text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All articles
          </Link>
        </div>
      </article>

      {others.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-site">
            <h2 className="section-title text-navy-900">More from {COMPANY.shortName}.</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <div className="group relative h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-gold-500 hover:shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-wide text-gold-600">
                      {p.category}
                    </span>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-navy-900">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="rounded-sm transition-colors after:absolute after:inset-0 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                      >
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel-600">{p.excerpt}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
