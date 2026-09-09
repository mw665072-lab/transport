import { logout } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

/** One header for every panel page, so the title and sign-out never drift. */
export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel-600">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {action}
        <form action={logout}>
          <Button type="submit" variant="outline" className="border-navy-900 text-navy-900">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
