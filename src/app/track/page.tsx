import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { TrackForm } from "@/components/tracking/track-form";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Track a Shipment",
    "Enter your Zewar Transport reference number to see the current status and milestone history of your shipment.",
    "/track",
  );
}

export default function Track() {
  return (
    <>
      <PageHero
        eyebrow="Tracking"
        title="Where is my shipment?"
        description="Enter the reference number from your booking confirmation to see the current status and every recorded milestone."
      />
      <section className="section">
        <div className="container-site max-w-3xl">
          <TrackForm />
        </div>
      </section>
    </>
  );
}
