import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, EmptyState, Metric, PageHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { getProfile, getUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/query";
import type { HafalanRow, SantriRow } from "@/lib/types";

export const metadata: Metadata = { title: "Beranda" };

type Pengumuman = { id: string; judul: string; created_at: string };

async function count(table: "santri" | "kelas" | "hafalan"): Promise<number> {
  const supabase = await createClient();
  const { count: c } = await supabase.from(table).select("id", { count: "exact", head: true });
  return c ?? 0;
}

async function latestPengumuman(): Promise<Pengumuman[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pengumuman")
    .select("id, judul, created_at")
    .order("created_at", { ascending: false })
    .limit(3);
  return (data ?? []) as Pengumuman[];
}

function PengumumanCard({ items }: { items: Pengumuman[] }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-heading">Pengumuman terbaru</h2>
        <Link href="/dashboard/pengumuman" className="text-sm font-semibold text-accent underline">
          Lihat semua
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ink/70">Belum ada pengumuman.</p>
      ) : (
        <ul className="divide-y divide-primary/10">
          {items.map((p) => (
            <li key={p.id} className="flex justify-between gap-3 py-2 text-sm">
              <span className="min-w-0 wrap-break-word">{p.judul}</span>
              <span className="shrink-0 text-xs text-ink/60">{formatTanggal(p.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const profile = await getProfile();
  if (!profile) return null; // layout menampilkan penjelasan profil

  const nama = profile.full_name || user.email?.split("@")[0] || "Pengguna";
  const supabase = await createClient();

  if (profile.role === "admin") {
    const [santri, kelas, hafalan, pengumuman] = await Promise.all([
      count("santri"),
      count("kelas"),
      count("hafalan"),
      latestPengumuman(),
    ]);
    return (
      <>
        <PageHeader title={`Halo, ${nama}!`} description="Ringkasan TPQ hari ini." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Total santri" value={santri} />
          <Metric label="Total kelas" value={kelas} />
          <Metric label="Catatan hafalan" value={hafalan} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/santri/baru" className={buttonClass("primary")}>+ Tambah santri</Link>
          <Link href="/dashboard/hafalan" className={buttonClass("outline")}>Catat hafalan</Link>
          <Link href="/dashboard/pengguna" className={buttonClass("outline")}>Atur pengguna</Link>
        </div>
        <PengumumanCard items={pengumuman} />
      </>
    );
  }

  if (profile.role === "guru") {
    const [santriRes, hafalanRes, pengumuman] = await Promise.all([
      supabase.from("santri").select("id, nama, kelas(nama)").eq("aktif", true).order("nama").limit(8),
      supabase
        .from("hafalan")
        .select("id", { count: "exact", head: true })
        .eq("guru_id", profile.id),
      latestPengumuman(),
    ]);
    const santri = (santriRes.data ?? []) as unknown as Pick<SantriRow, "id" | "nama" | "kelas">[];
    return (
      <>
        <PageHeader title={`Halo, ${nama}!`} description="Selamat mengajar." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Metric label="Catatan yang kamu buat" value={hafalanRes.count ?? 0} />
          <Metric label="Santri aktif (ditampilkan)" value={santri.length} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/hafalan" className={buttonClass("primary")}>Catat hafalan</Link>
        </div>
        <Card>
          <h2 className="mb-3 font-bold text-heading">Santri</h2>
          {santri.length === 0 ? (
            <p className="text-sm text-ink/70">Belum ada santri aktif.</p>
          ) : (
            <ul className="divide-y divide-primary/10">
              {santri.map((s) => (
                <li key={s.id} className="flex justify-between gap-3 py-2 text-sm">
                  <Link href={`/dashboard/santri/${s.id}`} className="font-medium text-accent underline">
                    {s.nama}
                  </Link>
                  <span className="text-ink/60">{s.kelas?.nama ?? "-"}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <PengumumanCard items={pengumuman} />
      </>
    );
  }

  // wali
  const { data: anakData } = await supabase
    .from("santri")
    .select("id, nama, kelas(nama)")
    .eq("wali_id", profile.id);
  const anak = (anakData ?? []) as unknown as Pick<SantriRow, "id" | "nama" | "kelas">[];
  const ids = anak.map((a) => a.id);
  const { data: hData } = ids.length
    ? await supabase
        .from("hafalan")
        .select("id, santri_id, materi, status, tanggal, santri(nama)")
        .in("santri_id", ids)
        .order("tanggal", { ascending: false })
        .limit(5)
    : { data: [] };
  const terbaru = (hData ?? []) as unknown as Pick<HafalanRow, "id" | "materi" | "status" | "tanggal" | "santri">[];
  const pengumuman = await latestPengumuman();

  return (
    <>
      <PageHeader title={`Halo, ${nama}!`} description="Pantau perkembangan putra-putri Bapak/Ibu." />
      {anak.length === 0 ? (
        <EmptyState title="Belum ada santri yang terhubung ke akunmu">
          Minta admin TPQ menghubungkan akun ini ke data santri.
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {anak.map((a) => (
            <Card key={a.id}>
              <h2 className="font-bold text-heading">{a.nama}</h2>
              <p className="text-sm text-ink/70">{a.kelas?.nama ?? "Belum ada kelas"}</p>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-heading">Hafalan terbaru</h2>
          <Link href="/dashboard/perkembangan" className="text-sm font-semibold text-accent underline">
            Lihat perkembangan
          </Link>
        </div>
        {terbaru.length === 0 ? (
          <p className="text-sm text-ink/70">Belum ada catatan.</p>
        ) : (
          <ul className="divide-y divide-primary/10">
            {terbaru.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 wrap-break-word">
                  <span className="font-medium">{h.santri?.nama}</span>
                  <span dir="auto" className="ml-2 font-arab text-lg">{h.materi}</span>
                </span>
                <StatusBadge status={h.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
      <PengumumanCard items={pengumuman} />
    </>
  );
}