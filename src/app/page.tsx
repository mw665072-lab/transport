import type { Metadata } from "next";
import {
  CoverageSection,
  EquipmentSection,
  FinalCta,
  HomeHero,
  HowItWorks,
  OwnerBand,
  ServicesSection,
  TrustBand,
  WhySection,
} from "@/components/sections/home";
import { pageMetadata } from "@/lib/metadata";
import { QuickLinks } from "@/components/sections/quick-links";
import { Testimonials } from "@/components/sections/testimonials";
import { getTestimonials } from "@/lib/server/site-data";
import { getCoverage, getEquipment } from "@/lib/server/fleet";

export const metadata: Metadata = pageMetadata(
  "Zewar Transport LLC | Road Freight Transportation",
  "Reliable box truck, cargo van, Sprinter van, hotshot, and road freight transportation across Zewar Transport's stated U.S. service areas.",
  "/",
);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [testimonials, coverage, equipment] = await Promise.all([
    getTestimonials(),
    getCoverage(),
    getEquipment(),
  ]);
  return (
    <>
      <HomeHero states={coverage.states} />
      <TrustBand />
      <ServicesSection />
      <CoverageSection coverage={coverage} />
      <EquipmentSection equipment={equipment} />
      <WhySection />
      <HowItWorks />
      <Testimonials items={testimonials} />
      <QuickLinks />
      <OwnerBand />
      <FinalCta />
    </>
  );
}
