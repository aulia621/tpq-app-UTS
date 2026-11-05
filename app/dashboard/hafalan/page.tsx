import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { HafalanCard } from "@/components/hafalan/HafalanCard";
import { HafalanForm } from "@/components/hafalan/HafalanForm";
import { Card, EmptyState, Metric, PageHeader } from "@/components/ui/Card";
import { AnimatedItem, AnimatedList } from "@/components/ui/AnimatedList";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { escapeLike, first, PAGE_SIZE, parseEnum, parseListParams, qs, type RawParams } from "@/lib/query";
import { ROLE_LABEL, type HafalanRow } from "@/lib/types";

export const metadata: Metadata = { title: "Hafalan" };

const STATUS = ["semua", "lulus", "ulang"] as const;

export default async function HafalanPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const profile = await requireRole(["admin", "guru"]);
  const raw = await searchParams;
  const { search, page } = parseListParams(raw);
  const status = parseEnum(first(raw.status), STATUS, "semua");

  const supabase = await createClient();
  const pattern = `%${escapeLike(search)}%`;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let listQ = supabase
    .from("hafalan")
    .select("id, santri_id, guru_id, tanggal, jenis, materi, nilai, status, catatan, santri(nama)", { count: "exact" });
  if (search) listQ = listQ.ilike("materi", pattern);
  if (status !== "semua") listQ = listQ.eq("status", status);
  listQ = listQ
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id")
    .range(from, to);

  const countQ = (s: "lulus" | "ulang") => {
    let q = supabase.from("hafalan").select("id", { count: "exact", head: true }).eq("status", s);
    if (search) q = q.ilike("materi", pattern);
    return q;
  };

  const [list, lulusRes, ulangRes, santriRes] = await Promise.all([
    listQ,
    countQ("lulus"),
    countQ("ulang"),
    supabase.from("santri").select("id, nama").eq("aktif", true).order("nama"),
  ]);

  const lulus = lulusRes.count ?? 0;
  const ulang = ulangRes.count ?? 0;
  const total = lulus + ulang;
  const filteredTotal = list.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  if (page > totalPages) {
    redirect(`/dashboard/hafalan${qs({ search: search || undefined, status: status === "semua" ? undefined : status, page: String(totalPages) })}`);
  }

  const rows = (list.data ?? []) as unknown as HafalanRow[];
  const santriList = (santriRes.data ?? []) as { id: string; nama: string }[];
  const pct = total > 0 ? Math.round((lulus / total) * 100) : 0;
  const hasFilter = search !== "" || status !== "semua";

  return (
    <>
      <PageHeader
        title="Hafalan & Mengaji"
        description={`Masuk sebagai ${ROLE_LABEL[profile.role]}`}
      />

      {santriList.length > 0 ? (
        <HafalanForm santriList={santriList} />
      ) : (
        <Card>
          <p className="text-sm text-ink/80">
            Belum ada santri aktif.{" "}
            {profile.role === "admin" ? (
              <Link href="/dashboard/santri/baru" className="font-semibold text-primary underline">
                Tambahkan santri dulu
              </Link>
            ) : (
              "Minta admin menambahkan santri."
            )}
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Total catatan" value={total} />
        <Metric label="Lulus" value={`${lulus}`} hint={`${pct}% dari total`} />
        <Metric label="Perlu diulang" value={ulang} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Suspense fallback={null}>
          <SearchInput placeholder="Cari materi hafalan..." label="Cari materi hafalan" />
        </Suspense>
        <Suspense fallback={null}>
          <FilterTabs
            param="status"
            active={status}
            ariaLabel="Filter status hafalan"
            options={[
              { value: "semua", label: "Semua", count: total },
              { value: "lulus", label: "Lulus", count: lulus },
              { value: "ulang", label: "Perlu Diulang", count: ulang },
            ]}
          />
        </Suspense>
      </div>

      {rows.length === 0 ? (
        <EmptyState title={hasFilter ? "Tidak ada hasil" : "Belum ada catatan hafalan"}>
          {hasFilter ? (
            <Link href="/dashboard/hafalan" className="font-semibold text-primary underline">
              Reset pencarian
            </Link>
          ) : (
            "Catatan yang kamu simpan akan tampil di sini."
          )}
        </EmptyState>
      ) : (
        <AnimatedList listKey={`${search}|${status}|${page}`}>
          {rows.map((r) => (
            <AnimatedItem key={r.id}>
              <HafalanCard
                item={r}
                canToggle={r.guru_id === profile.id}
                canDelete={profile.role === "admin" || r.guru_id === profile.id}
              />
            </AnimatedItem>
          ))}
        </AnimatedList>
      )}

      <Pagination
        basePath="/dashboard/hafalan"
        page={page}
        totalPages={totalPages}
        params={{ search: search || undefined, status: status === "semua" ? undefined : status }}
      />
    </>
  );
}
