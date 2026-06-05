import Link from "next/link";
import { getAllLenses, getAllModules } from "@/lib/config-db";
import { AdminConfigEditor } from "@/components/AdminConfigEditor";
import { isSupabaseConfigured } from "@/lib/supabase";

type Props = { searchParams: Promise<{ secret?: string }> };

export default async function AdminConfigPage({ searchParams }: Props) {
  const { secret } = await searchParams;
  const adminSecret = process.env.ADMIN_SECRET;
  const authorized = adminSecret && secret === adminSecret;

  let lenses: Awaited<ReturnType<typeof getAllLenses>> = [];
  let modules: Awaited<ReturnType<typeof getAllModules>> = [];

  if (authorized && isSupabaseConfigured()) {
    try {
      lenses = await getAllLenses();
      modules = await getAllModules();
    } catch {
      /* tables may not exist until migration + seed */
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href={`/admin/preview?secret=${secret}`} className="font-sans text-sm underline">
        ← Admin home
      </Link>
      <h1 className="mt-4 font-display text-3xl">Edit all lenses & modules</h1>
      {!authorized ? (
        <p className="mt-4 font-sans text-[var(--muted)]">
          Add <code>?secret=YOUR_ADMIN_SECRET</code>
        </p>
      ) : (
        <div className="mt-8">
          <AdminConfigEditor secret={secret!} lenses={lenses} modules={modules} />
        </div>
      )}
    </div>
  );
}
