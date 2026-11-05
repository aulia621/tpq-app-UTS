import type { Metadata } from "next";
import { AnimatedItem, AnimatedList } from "@/components/ui/AnimatedList";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { Badge } from "@/components/ui/StatusBadge";
import { PengumumanForm } from "@/components/santri/PengumumanForm";
import { deletePengumumanAction } from "@/lib/actions/pengumuman";
import { getProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/query";
import type { PengumumanRow } from "@/lib/types";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Pengumuman" };

export default async function PengumumanPage() {
  const profile = await getProfile();
  if (!profile) redirect("/dashboard");

  const supabase = await createClient();
  const canCreate = profile.role === "admin" || profile.role === "guru";

  const [listRes, kelasRes] = await Promise.all([
    supabase
      .from("pengumuman")
      .select("id, judul, isi, dibuat_oleh, created_at, kelas:kelas(nama)")
      .order("created_at", { ascending: false })
      .limit(30),
    canCreate ? supabase.from("kelas").select("id, nama").order("nama") : Promise.resolve({ data: [] }),
  ]);

  const rows = (listRes.data ?? []) as unknown as PengumumanRow[];
  const kelasList = (kelasRes.data ?? []) as { id: string; nama: string }[];

  return (
    <>
      <PageHeader title="Pengumuman" description="Informasi terbaru dari TPQ." />
      {canCreate && <PengumumanForm kelasList={kelasList} />}
      {rows.length === 0 ? (
        <EmptyState title="Belum ada pengumuman" />
      ) : (
        <AnimatedList listKey="pengumuman" className="grid-cols-1">
          {rows.map((p) => {
            const baru = Date.now() - new Date(p.created_at).getTime() < 3 * 24 * 3600 * 1000;
            const canDelete = profile.role === "admin" || p.dibuat_oleh === profile.id;
            return (
              <AnimatedItem key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="min-w-0 wrap-break-word text-lg font-bold text-heading">{p.judul}</h2>
                  <div className="flex items-center gap-2">
                    {baru && <Badge tone="gold">Baru</Badge>}
                    <span className="text-xs text-ink/60">{formatTanggal(p.created_at)}</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-ink/60">{p.kelas ? `Kelas ${p.kelas.nama}` : "Untuk semua kelas"}</p>
                <p className="mt-3 whitespace-pre-line wrap-break-word text-sm text-ink/90">{p.isi}</p>
                {canDelete && canCreate && (
                  <div className="mt-3">
                    <ConfirmDeleteButton
                      action={deletePengumumanAction}
                      id={p.id}
                      title="Hapus pengumuman?"
                      description={`Pengumuman "${p.judul}" akan dihapus permanen.`}
                    />
                  </div>
                )}
              </AnimatedItem>
            );
          })}
        </AnimatedList>
      )}
    </>
  );
}