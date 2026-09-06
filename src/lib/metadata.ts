import type { Metadata } from "next";
import { COMPANY } from "@/lib/data/company";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, COMPANY.domain).toString();
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: COMPANY.legalName, type: "website", images: [{ url: "/opengraph-image" }] }, twitter: { card: "summary_large_image", title, description } };
}
