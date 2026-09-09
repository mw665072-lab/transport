// Drafted policy describing the site's actual data practices. Have counsel review
// it before launch, and revisit it whenever form handling, analytics, or third-party
// processors change.
import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/shared/legal-doc";
import { COMPANY } from "@/lib/data/company";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Privacy Policy",
    `How ${COMPANY.legalName} collects, uses, shares, and retains the information you submit through this website.`,
    "/privacy-policy",
  );
}

const SECTIONS: readonly LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${COMPANY.legalName} is a road freight transportation company operating in the United States. This policy explains what happens to the information you provide through this website, and it applies to this website only. It does not cover information you give us by phone, by email, or under a separate transportation agreement.`,
      `You can reach us about privacy at ${COMPANY.email} or ${COMPANY.phone}.`,
    ],
  },
  {
    heading: "Information we collect",
    paragraphs: [
      "We collect only the information you choose to type into one of our forms. We do not require an account, and we do not ask for payment details on this website.",
    ],
    bullets: [
      "Freight quote form: pickup and delivery city and state, requested pickup date, service type, commodity, weight and dimensions when you provide them, shipment notes, and your name, company, email, and phone number.",
      "Contact form: your name, email, optional phone number, subject, and message.",
      "Owner operator form: your name, email, phone number, CDL class, years of experience, equipment type, optional MC number, preferred lanes, and availability.",
      "Technical information your browser sends automatically to whoever hosts this site, such as your IP address and the pages you request. We use this only to keep the site running and secure.",
    ],
  },
  {
    heading: "Why we use it",
    paragraphs: [
      "We use what you submit to respond to you and to run our transportation business. Specifically, we use it to prepare and send freight quotes, to arrange and dispatch shipments, to answer questions you send us, to evaluate driver and owner operator interest, and to keep records required for our operations and compliance obligations.",
      "We do not sell your information. We do not share it with third parties for their own marketing. We do not use it to build advertising profiles.",
    ],
  },
  {
    heading: "How your submission reaches us",
    paragraphs: [
      "Form submissions are transmitted over an encrypted connection to the service that delivers them to our dispatch team. That provider processes the submission on our behalf and is not permitted to use it for any other purpose.",
      "Please do not send sensitive personal information through these forms. That includes government identification numbers, driver license images, financial account details, and medical information. If we need any of that for a driver or carrier onboarding, we will ask for it through a separate secure channel.",
    ],
  },
  {
    heading: "Who else may see it",
    paragraphs: [
      "We share your information only when there is a reason tied to your request or to our legal obligations.",
    ],
    bullets: [
      "Service providers who host this website and deliver our form submissions and email.",
      "Carriers, drivers, brokers, or shippers directly involved in moving your shipment, and only the details needed to move it.",
      "Insurers, auditors, or legal advisors when a claim, audit, or dispute requires it.",
      "Government or regulatory authorities when the law requires disclosure.",
      "A successor entity if our business is sold or reorganized, under the same commitments described here.",
    ],
  },
  {
    heading: "Cookies and analytics",
    paragraphs: [
      "This website does not set advertising or tracking cookies, and it does not run third-party analytics. Your browser may store standard technical data needed to load the pages. If we add analytics later, we will update this policy and describe what is collected before turning it on.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep quote requests and shipment records for as long as needed to serve you and to satisfy the record-keeping periods that apply to motor carriers, then we delete or archive them. We keep general contact messages only as long as needed to resolve the matter. We keep driver and owner operator submissions while your interest is active, and we will remove them sooner if you ask.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "We use encrypted transport for form submissions and limit access to the people who need it to do their work. No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we take reasonable steps to protect what you send us.",
    ],
  },
  {
    heading: "Your choices and rights",
    paragraphs: [
      `You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Write to ${COMPANY.email} and we will respond within the time the applicable law allows. We may need to confirm your identity before we act, and we may need to keep some records where the law requires it.`,
      "California residents have specific rights under the California Consumer Privacy Act, including the right to know, the right to delete, the right to correct, and the right not to be discriminated against for exercising those rights. We do not sell or share personal information as those terms are defined in that law.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "This website is meant for business use and is not directed to children under 13. We do not knowingly collect information from children. If you believe a child has sent us information, contact us and we will delete it.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy as our operations or our service providers change. When we do, we will change the effective date at the top of this page. Material changes will be described on this page rather than made silently.",
    ],
  },
];

export default function Privacy() {
  return (
    <LegalDoc
      title="Privacy Policy"
      description={`How ${COMPANY.legalName} handles the information you submit through this website.`}
      effectiveDate="September 9, 2026"
      sections={SECTIONS}
    />
  );
}
