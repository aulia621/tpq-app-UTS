import type { Metadata } from "next";
import { ProgresChart } from "@/components/charts/ProgresChart";
import { HafalanCard } from "@/components/hafalan/HafalanCard";
import { AnimatedItem, AnimatedList } from "@/components/ui/AnimatedList";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/StatusBadge";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/query";
import type { HafalanRow, SantriRow } from "@/lib/types";

export const metadata: Metadata = { title: "Perkembangan Anak" };

export default async function PerkembanganPage() {
  const profile = await requireRole(["wali"]);
  const supabase = await createClient();

  const { data: anakData } = await supabase
    .from("santri")
    .select("id, nama, nis, tanggal_lahir, jenis_kelamin, kelas_id, wali_id, aktif, kelas(nama)")
    .eq("wali_id", profile.id)
    .order("nama");
  const anak = (anakData ?? []) as unknown as SantriRow[];

  const ids = anak.map((a) => a.id);
  const { data: hData } = ids.length
    ? await supabase
        .from("hafalan")
        .select("id, santri_id, guru_id, tanggal, jenis, materi, nilai, status, catatan, santri(nama)")
        .in("santri_id", ids)
        .order("tanggal", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: [] };
  const semua = (hData ?? []) as unknown as HafalanRow[];

  return (
    <>
      <PageHeader title="Perkembangan Anak" description="Pantau hafalan dan mengaji putra-putri Bapak/Ibu." />
      {anak.length === 0 ? (
        <EmptyState title="Belum ada santri yang terhubung ke akunmu">
          Minta admin TPQ menghubungkan akun ini (email) ke data santri.
        </EmptyState>
      ) : (
        anak.map((a) => {
          const rows = semua.filter((h) => h.santri_id === a.id);
          const chart = [...rows]
            .slice(0, 30)
            .reverse()
            .filter((r) => r.nilai !== null)
            .map((r) => ({ tanggal: formatTanggal(r.tanggal), nilai: r.nilai as number }));
          return (
            <section key={a.id} aria-labelledby={`anak-${a.id}`} className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id={`anak-${a.id}`} className="text-xl font-bold text-heading">
                  {a.nama}
                </h2>
                <Badge tone="primary">{a.kelas?.nama ?? "Belum ada kelas"}</Badge>
                {!a.aktif && <Badge tone="muted">Nonaktif</Badge>}
              </div>
              <Card>
                <h3 className="mb-3 font-bold text-heading">Grafik nilai</h3>
                <ProgresChart data={chart} />
              </Card>
              {rows.length === 0 ? (
                <EmptyState title="Belum ada catatan hafalan" />
              ) : (
                <AnimatedList listKey={a.id}>
                  {rows.slice(0, 10).map((r) => (
                    <AnimatedItem key={r.id}>
                      <HafalanCard item={r} showSantri={false} canToggle={false} canDelete={false} />
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              )}
            </section>
          );
        })
      )}
    </>
  );
}