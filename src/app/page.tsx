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

export const metadata: Metadata = pageMetadata(
  "Zewar Transport LLC | Road Freight Transportation",
  "Reliable box truck, cargo van, Sprinter van, hotshot, and road freight transportation across Zewar Transport's stated U.S. service areas.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustBand />
      <ServicesSection />
      <CoverageSection />
      <EquipmentSection />
      <WhySection />
      <HowItWorks />
      <OwnerBand />
      <FinalCta />
    </>
  );
}
