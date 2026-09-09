import Link from "next/link";
import { Phone } from "lucide-react";
import { COMPANY } from "@/lib/data/company";
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_30px_rgba(5,15,44,.12)] md:hidden">
      <a
        href={COMPANY.phoneHref}
        className="flex min-h-12 items-center justify-center gap-2 rounded-lg font-semibold text-navy-900"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <Link
        href="/freight-quote"
        className="flex min-h-12 items-center justify-center rounded-lg bg-gold-500 px-4 font-semibold text-navy-950"
      >
        Get a Quote
      </Link>
    </div>
  );
}
