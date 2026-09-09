import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export const PAGE_SIZE = 10;

/** Clamps a page number from a query string to a valid range. */
export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: current,
    totalPages,
    total: items.length,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + size, items.length),
  };
}

export function parsePage(value?: string): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function href(basePath: string, params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  basePath,
  params = {},
  page,
  totalPages,
  from,
  to,
  total,
  label,
}: {
  basePath: string;
  params?: Record<string, string | undefined>;
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  label: string;
}) {
  if (total === 0) return null;

  // A window of at most five page numbers keeps the control usable on mobile.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  const linkStyles =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2";

  return (
    <nav
      aria-label={`${label} pagination`}
      className="mt-8 flex flex-wrap items-center justify-between gap-4"
    >
      <p className="text-sm text-steel-600">
        Showing {from} to {to} of {total} {label}
      </p>

      {totalPages > 1 && (
        <ul className="flex flex-wrap items-center gap-2">
          <li>
            {page > 1 ? (
              <Link href={href(basePath, params, page - 1)} className={linkStyles}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </Link>
            ) : (
              <span
                className={cn(linkStyles, "cursor-not-allowed opacity-40")}
                aria-disabled="true"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </span>
            )}
          </li>

          {pages.map((n) => (
            <li key={n}>
              <Link
                href={href(basePath, params, n)}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  linkStyles,
                  n === page && "border-navy-900 bg-navy-900 text-white hover:border-navy-900",
                )}
              >
                {n}
                <span className="sr-only"> page</span>
              </Link>
            </li>
          ))}

          <li>
            {page < totalPages ? (
              <Link href={href(basePath, params, page + 1)} className={linkStyles}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </Link>
            ) : (
              <span
                className={cn(linkStyles, "cursor-not-allowed opacity-40")}
                aria-disabled="true"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </span>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
