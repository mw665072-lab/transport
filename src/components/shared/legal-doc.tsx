import { PageHero } from "@/components/shared/page-hero";

export type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export function LegalDoc({
  title,
  description,
  effectiveDate,
  sections,
}: {
  title: string;
  description: string;
  effectiveDate: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={description} />
      <section className="section">
        <div className="container-site max-w-3xl">
          <p className="text-sm font-semibold text-steel-600">Effective {effectiveDate}</p>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-bold text-navy-900">{section.heading}</h2>
                <div className="mt-3 space-y-4 leading-relaxed text-steel-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-steel-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
