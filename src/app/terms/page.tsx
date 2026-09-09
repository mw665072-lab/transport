// Drafted terms describing how this website may be used and what it does and does
// not commit us to. Have counsel review before launch, particularly the liability,
// governing law, and carrier-liability sections.
import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/shared/legal-doc";
import { COMPANY } from "@/lib/data/company";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata(
    "Terms of Use",
    `The terms that apply when you use the ${COMPANY.legalName} website and submit a quote, contact, or driver request.`,
    "/terms",
  );
}

const SECTIONS: readonly LegalSection[] = [
  {
    heading: "Agreement",
    paragraphs: [
      `These terms apply when you use this website, which is operated by ${COMPANY.legalName}. By using the site or submitting a form, you agree to them. If you do not agree, please do not use the site.`,
    ],
  },
  {
    heading: "Quotes are not contracts",
    paragraphs: [
      "Submitting a freight quote request does not book a shipment and does not create a transportation contract. It is a request for pricing and availability.",
      "A shipment is booked only when we confirm it in writing after reviewing your freight details. Rates, transit estimates, and equipment availability quoted before that confirmation are estimates based on the information you gave us, and they may change if the actual freight, timing, access conditions, or route differ.",
    ],
  },
  {
    heading: "Transportation services",
    paragraphs: [
      "Transportation we actually perform is governed by the bill of lading, rate confirmation, or written transportation agreement covering that shipment, together with the federal and state law that applies to motor carriers. Those documents control if anything in them conflicts with this website.",
      "Cargo liability is governed by those shipment documents and applicable law, not by this website. Coverage limits, exclusions, and claim procedures are set out there.",
    ],
  },
  {
    heading: "Accuracy of the information you give us",
    paragraphs: [
      "You are responsible for describing your freight accurately, including weight, dimensions, piece count, commodity, hazardous characteristics, and any special handling or appointment requirements. Inaccurate information can make a load unsafe, illegal, or impossible to complete, and it may change the rate or cause a shipment to be refused at pickup.",
      "You confirm that you have the right to tender the freight you describe and that it is legal to transport.",
    ],
  },
  {
    heading: "Site content",
    paragraphs: [
      "We work to keep this website accurate, but content here is general information about our services. Service descriptions, coverage areas, equipment listings, and response-time targets describe what we typically do. They are not guarantees for a specific shipment.",
      "Equipment capacity varies by the unit assigned to your load. We confirm legal payload and usable dimensions during quoting rather than publishing a single figure that may not apply to your shipment.",
      "We may change, suspend, or remove any part of this site at any time without notice.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: ["When using this site, you agree not to do any of the following."],
    bullets: [
      "Submit false, misleading, or fraudulent information through any form.",
      "Use the site or its contact details to send unsolicited commercial messages.",
      "Attempt to gain unauthorized access to the site, its hosting, or any connected system.",
      "Scrape, copy, or republish site content for a competing commercial purpose.",
      "Interfere with the operation of the site or the network it runs on.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      `The name ${COMPANY.legalName}, our logo, and the text, layout, and images on this site belong to us or to our licensors. You may view and print pages for your own business use in evaluating or arranging transportation with us. Any other reuse requires our written permission.`,
    ],
  },
  {
    heading: "Third-party links",
    paragraphs: [
      "This site may link to websites we do not control. We provide those links for convenience and are not responsible for their content, their accuracy, or how they handle your information.",
    ],
  },
  {
    heading: "Disclaimer",
    paragraphs: [
      "This website is provided as is. To the fullest extent the law allows, we disclaim all warranties about the site itself, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the site will be uninterrupted, error free, or free of harmful components.",
      "This disclaimer applies to the website. It does not limit our obligations as a motor carrier under the shipment documents and law described above.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the fullest extent the law allows, we are not liable for indirect, incidental, special, or consequential damages arising from your use of this website, including lost profits or lost business, even if we were advised such damages were possible.",
      "Nothing in this section limits liability that cannot be limited under applicable law, and nothing here reduces our cargo liability under the bill of lading, the transportation agreement, or the federal and state law governing a shipment we accept.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the State of California, without regard to its conflict of laws rules. Disputes about this website will be brought in the state or federal courts located in California, and you agree to their jurisdiction. Claims involving interstate transportation remain subject to the federal law that governs them.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "We may update these terms as our services change. The effective date at the top of this page shows when the current version took effect, and continuing to use the site after an update means you accept it.",
      `Questions about these terms can go to ${COMPANY.email} or ${COMPANY.phone}.`,
    ],
  },
];

export default function Terms() {
  return (
    <LegalDoc
      title="Terms of Use"
      description={`The terms that apply when you use the ${COMPANY.shortName} website.`}
      effectiveDate="September 9, 2026"
      sections={SECTIONS}
    />
  );
}
