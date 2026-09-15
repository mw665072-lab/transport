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
import { COMPANY, SITE_TITLE } from "@/lib/data/company";
import { QuickLinks } from "@/components/sections/quick-links";
import { Testimonials } from "@/components/sections/testimonials";
import { getTestimonials } from "@/lib/server/site-data";
import { getCoverage, getEquipment } from "@/lib/server/fleet";
import { getServices } from "@/lib/server/services";

export const metadata: Metadata = pageMetadata(
  SITE_TITLE,
  `Reliable box truck, cargo van, Sprinter van, hotshot, and road freight transportation across ${COMPANY.shortName}'s stated U.S. service areas.`,
  "/",
);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [testimonials, coverage, equipment, services] = await Promise.all([
    getTestimonials(),
    getCoverage(),
    getEquipment(),
    getServices(),
  ]);
  return (
    <>
      <HomeHero states={coverage.states} />
      <TrustBand />
      <ServicesSection services={services} />
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
