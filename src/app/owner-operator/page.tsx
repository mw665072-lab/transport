import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { OwnerOperatorForm } from "@/components/forms/owner-operator-form";
import { Card } from "@/components/ui/card";
export function generateMetadata(): Metadata {
  return pageMetadata(
    "For Owner Operators",
    "Share your driver and equipment details with Zewar Transport for owner-operator opportunities.",
    "/owner-operator",
  );
}
export default function OwnerOperator() {
  return (
    <>
      <PageHero
        eyebrow="Owner operators"
        title="Drive with Zewar."
        description="Tell Zewar about your equipment, experience, preferred lanes, and availability. Submitting the form is an expression of interest, not a guarantee of work."
      />
      <section className="section">
        <div className="container-site grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="p-6 md:p-8">
            <OwnerOperatorForm />
          </Card>
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold">What Zewar reviews</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                Equipment match, licensing information, experience, preferred lanes,
                availability, and current operational needs.
              </p>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-bold">No fabricated guarantees</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                This frontend does not promise fixed load volume, rates, income, or immediate
                onboarding. Those details must come from Zewar directly.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
