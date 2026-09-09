import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Clock, MapPin, TrendingUp } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ApplicationForm } from "@/components/careers/application-form";
import { getJobBySlug, type Job } from "@/lib/server/db";
import { JsonLd } from "@/components/shared/json-ld";
import { COMPANY } from "@/lib/data/company";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job)
    return pageMetadata(
      "Role not found",
      "This opening is no longer listed.",
      `/career/${slug}`,
    );
  return pageMetadata(
    job.title,
    job.summary || `${job.title} at Zewar Transport LLC in ${job.location}.`,
    `/career/${job.slug}`,
  );
}

/** Stored as one item per line, so the admin panel needs no rich-text editor. */
function toList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function DetailList({ title, value }: { title: string; value: string }) {
  const items = toList(value);
  if (items.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-steel-600">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function jobPostingSchema(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.summary, job.responsibilities, job.requirements]
      .filter(Boolean)
      .join("\n\n"),
    datePosted: job.posted_at.replace(" ", "T") + "Z",
    employmentType: job.employment_type.toUpperCase().replace(/[^A-Z]/g, "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: COMPANY.legalName,
      sameAs: COMPANY.domain,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "US",
      },
    },
  };
}

export default async function JobDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || job.status !== "open") notFound();

  const meta = [
    { icon: Briefcase, label: "Department", value: job.department },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Clock, label: "Employment type", value: job.employment_type },
    ...(job.experience_level
      ? [{ icon: TrendingUp, label: "Experience", value: job.experience_level }]
      : []),
  ];

  return (
    <>
      <JsonLd data={jobPostingSchema(job)} />

      <section className="relative overflow-hidden bg-navy-950 pt-28 text-white md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,165,36,.18),transparent_30%)]" />
        <div className="container-site relative py-14 md:py-20">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 rounded-sm py-1.5 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All openings
          </Link>
          <h1 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight">
            {job.title}
          </h1>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {meta.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-sm font-semibold text-slate-200">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <div className="max-w-[70ch]">
            {job.summary && (
              <p className="text-base leading-relaxed text-steel-600">{job.summary}</p>
            )}
            <DetailList title="What you will do" value={job.responsibilities} />
            <DetailList title="What we are looking for" value={job.requirements} />
            <DetailList title="What we offer" value={job.benefits} />
          </div>

          <Card className="p-6 lg:sticky lg:top-28">
            <h2 className="text-lg font-bold text-navy-900">Apply for this role</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              The application takes a couple of minutes. A resume helps but is optional.
            </p>
            <a
              href="#apply"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-gold-500 px-5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Go to application
            </a>
          </Card>
        </div>
      </section>

      <section id="apply" className="section bg-slate-50 scroll-mt-24">
        <div className="container-site max-w-3xl">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-navy-900">Apply: {job.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              Fields marked with an asterisk are required.
            </p>
            <div className="mt-6">
              <ApplicationForm jobSlug={job.slug} jobTitle={job.title} />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
