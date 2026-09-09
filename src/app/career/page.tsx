import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, HeartHandshake, Route, ShieldCheck, Truck, Wrench } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobFilters, type JobCard } from "@/components/careers/job-filters";
import { listJobs } from "@/lib/server/db";
import { COMPANY } from "@/lib/data/company";

// Openings are edited in the admin panel, so this page is never cached.
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Careers",
    "Open driver, dispatch, and operations roles at Zewar Transport LLC, plus how to register your interest when nothing matches.",
    "/career",
  );
}

/** Grounded in how the company already describes itself; no invented benefits. */
const WORKING_HERE = [
  {
    icon: Route,
    title: "Defined lanes",
    description:
      "Work runs across California, Texas, Nevada, and Virginia plus surrounding interstate regions, so routes are predictable rather than open-ended.",
  },
  {
    icon: Truck,
    title: "Road-ready equipment",
    description:
      "Cargo vans, Sprinter vans, box trucks, and hotshot capacity are maintained for regional and interstate operations.",
  },
  {
    icon: HeartHandshake,
    title: "Direct dispatch",
    description:
      "Drivers deal with our own dispatch team rather than a call centre, so pickup details and changes come from one place.",
  },
  {
    icon: ShieldCheck,
    title: "Safety and compliance focus",
    description:
      "Safe handling, pre-trip checks, and compliance are part of how loads are planned, not an afterthought.",
  },
];

export default async function Career() {
  const jobs = await listJobs();
  const cards: JobCard[] = jobs.map(
    ({
      slug,
      title,
      department,
      location,
      employment_type,
      experience_level,
      summary,
      posted_at,
    }) => ({
      slug,
      title,
      department,
      location,
      employment_type,
      experience_level,
      summary,
      posted_at,
    }),
  );

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Drive and dispatch with Zewar Transport."
        description="We hire drivers, owner operators, and operations staff as lanes and volume grow. Every open role is listed below with what it involves and where it runs."
      />

      <section className="section">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-steel-600">Open roles</p>
              <h2 className="section-title text-navy-900">
                {jobs.length > 0
                  ? `${jobs.length} open position${jobs.length > 1 ? "s" : ""}.`
                  : "Current openings."}
              </h2>
            </div>
          </div>

          <div className="mt-10">
            {cards.length > 0 ? (
              <JobFilters jobs={cards} />
            ) : (
              /* Deliberate empty state: the page never claims vacancies it does not have. */
              <Card className="p-8 text-center md:p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                  <Briefcase className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-navy-900">
                  No openings are posted right now.
                </h3>
                <p className="section-intro mx-auto text-steel-600">
                  Openings change with lanes and volume. Register your interest and we will
                  contact you when something matching your experience opens up.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/career/apply">Register your interest</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-navy-900 text-navy-900"
                  >
                    <Link href="/owner-operator">Owner operator form</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-site">
          <p className="eyebrow text-steel-600">Working here</p>
          <h2 className="section-title text-navy-900">What the work actually looks like.</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {WORKING_HERE.map((item) => (
              <Card key={item.title} className="h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex h-full flex-col p-6 md:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-navy-900">Owner operators</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">
                Running your own equipment? Share your CDL class, equipment type, experience,
                and preferred lanes on the owner operator form.
              </p>
              <Button asChild className="mt-6 w-full sm:w-fit">
                <Link href="/owner-operator">Owner operator form</Link>
              </Button>
            </Card>

            <Card className="flex h-full flex-col p-6 md:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-navy-900">Nothing that fits?</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">
                Send a general application with your resume and we will keep it on file, or
                email the team directly at {COMPANY.emailCareers}.
              </p>
              <Button asChild variant="navy" className="mt-6 w-full sm:w-fit">
                <Link href="/career/apply">Register your interest</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
