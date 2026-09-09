import { redirect } from "next/navigation";
import { adminConfigured, isAuthenticated } from "@/lib/server/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const dynamic = "force-dynamic";

/**
 * Shell for every signed-in admin page. The auth check lives here so no page can
 * be added later that forgets it; the login page sits outside this group and so
 * renders without the sidebar.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!adminConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        <h1 className="text-2xl font-bold text-navy-900">Admin panel not configured</h1>
        <p className="mt-4 leading-relaxed text-steel-600">
          Set <code className="rounded bg-slate-100 px-1.5 py-0.5">ADMIN_PASSWORD</code> in the
          environment and restart the server to enable the panel.
        </p>
      </div>
    );
  }

  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:pl-[260px]">
        <main className="mx-auto w-full max-w-[80rem] px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
