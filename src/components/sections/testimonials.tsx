import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/server/db";
import { Card } from "@/components/ui/card";

function Rating({ value }: { value: number }) {
  const stars = Math.min(5, Math.max(1, value));
  return (
    <p className="flex items-center gap-0.5">
      <span className="sr-only">{stars} out of 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < stars ? "h-4 w-4 fill-gold-500 text-gold-500" : "h-4 w-4 text-slate-300"
          }
        />
      ))}
    </p>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  // Nothing is invented: with no approved testimonials the section is omitted.
  if (items.length === 0) return null;

  return (
    <section className="section bg-slate-50">
      <div className="container-site">
        <p className="eyebrow text-steel-600">What shippers say</p>
        <h2 className="section-title text-navy-900">Feedback from the businesses we move.</h2>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="flex h-full flex-col p-6">
                <Quote className="h-8 w-8 shrink-0 text-gold-500" aria-hidden="true" />
                <blockquote className="mt-4 flex-1">
                  <p className="leading-relaxed text-steel-600">{item.quote}</p>
                </blockquote>
                <footer className="mt-6 border-t border-slate-100 pt-4">
                  <Rating value={item.rating} />
                  <p className="mt-2 font-bold text-navy-900">{item.author}</p>
                  {(item.role || item.company) && (
                    <p className="mt-0.5 text-sm text-steel-600">
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </footer>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
