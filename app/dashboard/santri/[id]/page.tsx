import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HafalanCard } from "@/components/hafalan/HafalanCard";
import { ProgresChart } from "@/components/charts/ProgresChart";
import { AnimatedItem, AnimatedList } from "@/components/ui/AnimatedList";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/StatusBadge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { requireRole } from "@/lib/auth/session";
import { idSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/query";
import type { HafalanRow, SantriRow } from "@/lib/types";

export const metadata: Metadata = { title: "Detail Santri" };

export default async function DetailSantriPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(["admin", "guru"]);
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data: s } = await supabase
    .from("santri")
    .select("id, nama, nis, tanggal_lahir, jenis_kelamin, kelas_id, wali_id, aktif, kelas(nama)")
    .eq("id", id)
    .maybeSingle();
  if (!s) notFound();
  const santri = s as unknown as SantriRow;

  const { data: h } = await supabase
    .from("hafalan")
    .select("id, santri_id, guru_id, tanggal, jenis, materi, nilai, status, catatan, santri(nama)")
    .eq("santri_id", id)
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(30);
  const rows = (h ?? []) as unknown as HafalanRow[];
  const chart = [...rows]
    .reverse()
    .filter((r) => r.nilai !== null)
    .map((r) => ({ tanggal: formatTanggal(r.tanggal), nilai: r.nilai as number }));

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-ink/70">
        <Link href="/dashboard/santri" className="font-semibold text-accent underline">
          Santri
        </Link>{" "}
        / <span aria-current="page">{santri.nama}</span>
      </nav>
      <PageHeader
        title={santri.nama}
        description={`NIS ${santri.nis ?? "-"} • ${santri.kelas?.nama ?? "Belum ada kelas"}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={santri.aktif ? "primary" : "muted"}>{santri.aktif ? "Aktif" : "Nonaktif"}</Badge>
            {profile.role === "admin" && (
              <Link href={`/dashboard/santri/${santri.id}/edit`} className={buttonClass("gold")}>
                Edit
              </Link>
            )}
          </div>
        }
      />

      <Card>
        <h2 className="mb-3 font-bold text-heading">Grafik nilai</h2>
        <ProgresChart data={chart} />
      </Card>

      <h2 className="text-lg font-bold text-heading">Riwayat hafalan</h2>
      {rows.length === 0 ? (
        <EmptyState title="Belum ada catatan hafalan" />
      ) : (
        <AnimatedList listKey={id}>
          {rows.map((r) => (
            <AnimatedItem key={r.id}>
              <HafalanCard
                item={r}
                showSantri={false}
                canToggle={r.guru_id === profile.id}
                canDelete={profile.role === "admin" || r.guru_id === profile.id}
              />
            </AnimatedItem>
          ))}
        </AnimatedList>
      )}
    </>
  );
}