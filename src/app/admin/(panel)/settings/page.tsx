import type { Metadata } from "next";
import { getSettings } from "@/lib/server/db";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { SocialForm } from "@/app/admin/(panel)/settings/social-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminSettings() {
  const values = await getSettings();

  return (
    <>
      <AdminPageHeader title="Settings" description="Site-wide configuration." />

      <div className="mt-8 max-w-3xl">
        <SocialForm values={values} />
      </div>
    </>
  );
}
