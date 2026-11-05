import type { Metadata } from "next";
import { AnimatedItem, AnimatedList } from "@/components/ui/AnimatedList";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { KelasForm } from "@/components/santri/KelasForm";
import { deleteKelasAction } from "@/lib/actions/kelas";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Kelas" };

type KelasItem = { id: string; nama: string; guru_id: string | null };

export default async function KelasPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const [kelasRes, guruRes, santriRes] = await Promise.all([
    supabase.from("kelas").select("id, nama, guru_id").order("nama"),
    supabase.from("profiles").select("id, full_name").eq("role", "guru").order("full_name"),
    supabase.from("santri").select("kelas_id").not("kelas_id", "is", null),
  ]);

  const kelas = (kelasRes.data ?? []) as KelasItem[];
  const gurus = (guruRes.data ?? []) as { id: string; full_name: string }[];
  const guruNama = new Map(gurus.map((g) => [g.id, g.full_name || "(tanpa nama)"]));
  const jumlah = new Map<string, number>();
  for (const s of (santriRes.data ?? []) as { kelas_id: string }[]) {
    jumlah.set(s.kelas_id, (jumlah.get(s.kelas_id) ?? 0) + 1);
  }

  return (
    <>
      <PageHeader title="Kelas" description="Kelola kelas dan guru pengampu." />
      <KelasForm guruList={gurus} />
      {kelas.length === 0 ? (
        <EmptyState title="Belum ada kelas">Tambahkan kelas pertama lewat form di atas.</EmptyState>
      ) : (
        <AnimatedList listKey="kelas">
          {kelas.map((k) => (
            <AnimatedItem key={k.id}>
              <h2 className="text-lg font-bold text-primary-dark">{k.nama}</h2>
              <p className="mt-1 text-sm text-ink/70">
                {jumlah.get(k.id) ?? 0} santri • Guru: {k.guru_id ? (guruNama.get(k.guru_id) ?? "-") : "belum ditentukan"}
              </p>
              <div className="mt-3">
                <ConfirmDeleteButton
                  action={deleteKelasAction}
                  id={k.id}
                  title="Hapus kelas?"
                  description={`Kelas "${k.nama}" akan dihapus. Santri di kelas ini tidak ikut terhapus, tetapi menjadi tanpa kelas.`}
                />
              </div>
            </AnimatedItem>
          ))}
        </AnimatedList>
      )}
    </>
  );
}
