"use client";

import { usePathname } from "next/navigation";

/**
 * The admin panel is an internal tool, not a marketing page, so the site header,
 * footer, and mobile action bar are hidden there.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
