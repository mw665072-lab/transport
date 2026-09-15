"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FileText,
  Files,
  Inbox,
  Layers,
  MapPin,
  Menu,
  MessageSquareQuote,
  Newspaper,
  PackageSearch,
  Settings,
  Truck,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { COMPANY } from "@/lib/data/company";

/**
 * Grouped so the panel reads as sections rather than one long list. Order runs
 * from the work that arrives daily to the settings touched rarely.
 */
const GROUPS = [
  {
    label: "Inbox",
    links: [
      { href: "/admin", label: "Submissions", icon: Inbox, exact: true },
      { href: "/admin/applications", label: "Applications", icon: Briefcase },
      { href: "/admin/documents", label: "Documents", icon: Files },
    ],
  },
  {
    label: "Operations",
    links: [{ href: "/admin/shipments", label: "Shipments", icon: PackageSearch }],
  },
  {
    label: "Website",
    links: [
      { href: "/admin/services", label: "Services", icon: Layers },
      { href: "/admin/equipment", label: "Equipment", icon: Truck },
      { href: "/admin/coverage", label: "Coverage", icon: MapPin },
      { href: "/admin/jobs", label: "Jobs", icon: FileText },
      { href: "/admin/posts", label: "News", icon: Newspaper },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="grid gap-6">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">
            {group.label}
          </p>
          <ul className="mt-2 grid gap-1">
            {group.links.map((link) => {
              const active = isActive(pathname, link.href, "exact" in link && link.exact);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
                      active
                        ? "bg-gold-500 text-navy-950"
                        : "text-slate-300 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
      >
        {COMPANY.logo && (
          <Image
            src={COMPANY.logo}
            alt=""
            width={256}
            height={256}
            className="h-9 w-9 shrink-0 object-contain"
          />
        )}
        <span className="min-w-0">
          <span className="block text-sm font-bold text-white">{COMPANY.shortName}</span>
          <span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-gold-400">
            Admin
          </span>
        </span>
      </Link>

      <div className="mt-8 flex-1 overflow-y-auto">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
      >
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
        View website
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever navigation happens.
  useEffect(() => setOpen(false), [pathname]);

  // Lock background scroll only while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop: a permanent column beside the content. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] overflow-y-auto bg-navy-950 p-5 lg:block">
        <SidebarBody />
      </aside>

      {/* Mobile: a bar with a button that opens the same list as a drawer. */}
      <div className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-white/10 bg-navy-950 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-drawer"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Open admin menu</span>
        </button>
        <span className="text-sm font-bold text-white">{COMPANY.shortName} Admin</span>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy-950/60"
            aria-label="Close admin menu"
          />
          <div
            id="admin-drawer"
            className="relative flex h-full w-[min(280px,85vw)] flex-col overflow-y-auto bg-navy-950 p-5"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close admin menu</span>
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
