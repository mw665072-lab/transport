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
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
        {action}
        <form action={logout}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-navy-950"
          >
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
