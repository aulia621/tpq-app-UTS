import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AnimatedItem, AnimatedList } from "@/components/ui/AnimatedList";
import { EmptyState, Metric, PageHeader } from "@/components/ui/Card";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/StatusBadge";
import { buttonClass } from "@/components/ui/buttonStyles";
import { deleteSantriAction } from "@/lib/actions/santri";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { escapeLike, first, PAGE_SIZE, parseEnum, parseListParams, qs, type RawParams } from "@/lib/query";
import type { SantriRow } from "@/lib/types";

export const metadata: Metadata = { title: "Data Santri" };
const STATUS = ["semua", "aktif", "nonaktif"] as const;

export default async function SantriPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const profile = await requireRole(["admin", "guru"]);
  const isAdmin = profile.role === "admin";
  const raw = await searchParams;
  const { search, page } = parseListParams(raw);
  const status = parseEnum(first(raw.status), STATUS, "semua");

  const supabase = await createClient();
  const pattern = `%${escapeLike(search)}%`;
  const from = (page - 1) * PAGE_SIZE;

  let listQ = supabase
    .from("santri")
    .select("id, nama, nis, tanggal_lahir, jenis_kelamin, kelas_id, wali_id, aktif, kelas(nama)", { count: "exact" });
  if (search) listQ = listQ.ilike("nama", pattern);
  if (status !== "semua") listQ = listQ.eq("aktif", status === "aktif");
  listQ = listQ.order("nama").order("id").range(from, from + PAGE_SIZE - 1);

  const countQ = (aktif: boolean) => {
    let q = supabase.from("santri").select("id", { count: "exact", head: true }).eq("aktif", aktif);
    if (search) q = q.ilike("nama", pattern);
    return q;
  };

  const [list, aktifRes, nonRes] = await Promise.all([listQ, countQ(true), countQ(false)]);
  const aktif = aktifRes.count ?? 0;
  const non = nonRes.count ?? 0;
  const total = aktif + non;
  const totalPages = Math.max(1, Math.ceil((list.count ?? 0) / PAGE_SIZE));
  if (page > totalPages) {
    redirect(`/dashboard/santri${qs({ search: search || undefined, status: status === "semua" ? undefined : status, page: String(totalPages) })}`);
  }

  const rows = (list.data ?? []) as unknown as SantriRow[];
  const hasFilter = search !== "" || status !== "semua";

  return (
    <>
      <PageHeader
        title={isAdmin ? "Data Santri" : "Daftar Santri"}
        description={isAdmin ? "Kelola data santri TPQ." : "Daftar santri (hanya baca)."}
        actions={
          isAdmin && (
            <Link href="/dashboard/santri/baru" className={buttonClass("primary")}>
              + Tambah Santri
            </Link>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Total santri" value={total} />
        <Metric label="Aktif" value={aktif} hint={total ? `${Math.round((aktif / total) * 100)}% dari total` : undefined} />
        <Metric label="Nonaktif" value={non} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Suspense fallback={null}>
          <SearchInput placeholder="Cari nama santri..." label="Cari nama santri" />
        </Suspense>
        <Suspense fallback={null}>
          <FilterTabs
            param="status"
            active={status}
            ariaLabel="Filter status santri"
            options={[
              { value: "semua", label: "Semua", count: total },
              { value: "aktif", label: "Aktif", count: aktif },
              { value: "nonaktif", label: "Nonaktif", count: non },
            ]}
          />
        </Suspense>
      </div>

      {rows.length === 0 ? (
        <EmptyState title={hasFilter ? "Tidak ada hasil" : "Belum ada data santri"}>
          {hasFilter ? (
            <Link href="/dashboard/santri" className="font-semibold text-primary underline">
              Reset pencarian
            </Link>
          ) : isAdmin ? (
            "Klik “Tambah Santri” untuk memulai."
          ) : (
            "Admin belum menambahkan santri."
          )}
        </EmptyState>
      ) : (
        <AnimatedList listKey={`${search}|${status}|${page}`}>
          {rows.map((s) => (
            <AnimatedItem key={s.id}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="min-w-0 break-words text-lg font-bold text-primary-dark">{s.nama}</h2>
                <Badge tone={s.aktif ? "primary" : "muted"}>{s.aktif ? "Aktif" : "Nonaktif"}</Badge>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <dt className="text-ink/60">NIS</dt>
                <dd>{s.nis ?? "-"}</dd>
                <dt className="text-ink/60">Kelas</dt>
                <dd>{s.kelas?.nama ?? "-"}</dd>
                <dt className="text-ink/60">Wali</dt>
                <dd>{s.wali_id ? "Terhubung" : "Belum terhubung"}</dd>
              </dl>
              <div className="mt-4 flex flex-wrap items-start gap-2">
                <Link href={`/dashboard/santri/${s.id}`} className={buttonClass("outline")}>
                  Detail
                </Link>
                {isAdmin && (
                  <>
                    <Link href={`/dashboard/santri/${s.id}/edit`} className={buttonClass("gold")}>
                      Edit
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteSantriAction}
                      id={s.id}
                      title="Hapus data santri?"
                      description={`Data "${s.nama}" beserta seluruh riwayat hafalannya akan dihapus permanen dan tidak bisa dikembalikan.`}
                    />
                  </>
                )}
              </div>
            </AnimatedItem>
          ))}
        </AnimatedList>
      )}

      <Pagination
        basePath="/dashboard/santri"
        page={page}
        totalPages={totalPages}
        params={{ search: search || undefined, status: status === "semua" ? undefined : status }}
      />
    </>
  );
}
