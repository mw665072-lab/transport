"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import type { Job } from "@/lib/data/records";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ANY = "all";

/** The listing only receives the columns it renders, never the whole row. */
export type JobCard = Pick<
  Job,
  | "slug"
  | "title"
  | "department"
  | "location"
  | "employment_type"
  | "experience_level"
  | "summary"
  | "posted_at"
>;

const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort();

function postedLabel(value: string) {
  const date = new Date(value.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return null;
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

export function JobFilters({ jobs }: { jobs: JobCard[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ANY);
  const [location, setLocation] = useState(ANY);
  const [type, setType] = useState(ANY);

  const departments = useMemo(() => unique(jobs.map((j) => j.department)), [jobs]);
  const locations = useMemo(() => unique(jobs.map((j) => j.location)), [jobs]);
  const types = useMemo(() => unique(jobs.map((j) => j.employment_type)), [jobs]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (department !== ANY && job.department !== department) return false;
      if (location !== ANY && job.location !== location) return false;
      if (type !== ANY && job.employment_type !== type) return false;
      if (!needle) return true;
      return `${job.title} ${job.department} ${job.location} ${job.summary}`
        .toLowerCase()
        .includes(needle);
    });
  }, [jobs, query, department, location, type]);

  const activeCount =
    (query.trim() ? 1 : 0) +
    (department !== ANY ? 1 : 0) +
    (location !== ANY ? 1 : 0) +
    (type !== ANY ? 1 : 0);

  const reset = () => {
    setQuery("");
    setDepartment(ANY);
    setLocation(ANY);
    setType(ANY);
  };

  return (
    <div>
      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gold-600" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-navy-900">
            Filter openings
          </h2>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label htmlFor="job-search">Search</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-600"
                aria-hidden="true"
              />
              <Input
                id="job-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, keyword, or city"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="job-department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="job-department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="job-location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="job-location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All locations</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <Label htmlFor="job-type">Employment type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="job-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeCount > 0 && (
            <div className="flex items-end md:col-span-2 lg:col-span-3">
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                className="w-full sm:w-auto"
              >
                <X aria-hidden="true" />
                Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Polite region so the result count is announced as filters change. */}
      <p aria-live="polite" className="mt-6 text-sm font-semibold text-steel-600">
        {filtered.length === 0
          ? "No roles match these filters."
          : `Showing ${filtered.length} of ${jobs.length} open role${jobs.length > 1 ? "s" : ""}.`}
      </p>

      {filtered.length === 0 ? (
        <Card className="mt-4 p-8 text-center md:p-10">
          <Briefcase className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-bold text-navy-900">Nothing matches that search.</h3>
          <p className="section-intro mx-auto text-steel-600">
            Try a different keyword, or clear the filters to see every open role.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            className="mt-6 border-navy-900 text-navy-900"
          >
            Clear filters
          </Button>
        </Card>
      ) : (
        <ul className="mt-4 grid gap-4">
          {filtered.map((job) => {
            const posted = postedLabel(job.posted_at);
            return (
              <li key={job.slug}>
                <Card className="group relative h-full p-5 transition hover:border-gold-500 hover:shadow-lg md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-navy-900">
                        {/* The overlay makes the whole card clickable from one link. */}
                        <Link
                          href={`/career/${job.slug}`}
                          className="rounded-sm transition-colors after:absolute after:inset-0 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-steel-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold text-gold-600">
                        {job.employment_type}
                      </span>
                      {job.experience_level && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-steel-600">
                          {job.experience_level}
                        </span>
                      )}
                    </div>
                  </div>

                  {job.summary && (
                    <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-steel-600">
                      {job.summary}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="text-xs text-steel-600">{posted ?? ""}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600">
                      View role and apply
                    </span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
