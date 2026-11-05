import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { RoleSelect } from "@/components/santri/RoleSelect";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/query";
import type { AdminUserRow } from "@/lib/types";

export const metadata: Metadata = { title: "Pengguna" };

export default async function PenggunaPage() {
  const me = await requireRole(["admin"]);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_list_users");
  const users = (data ?? []) as AdminUserRow[];

  return (
    <>
      <PageHeader
        title="Pengguna"
        description="Atur peran akun: admin, guru, atau wali. Peranmu sendiri tidak bisa diubah di sini."
      />
      {error ? (
        <EmptyState title="Gagal memuat pengguna">
          Pastikan file <code>supabase/schema.sql</code> sudah dijalankan di SQL Editor.
        </EmptyState>
      ) : users.length === 0 ? (
        <EmptyState title="Belum ada pengguna" />
      ) : (
        <ul className="space-y-3">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-primary/10 bg-surface p-4 shadow-sm">
              <div className="min-w-0">
                <p className="wrap-break-word font-semibold text-heading">{u.full_name || "(tanpa nama)"}</p>
                <p className="break-all text-sm text-ink/70">{u.email ?? "-"}</p>
                <p className="text-xs text-ink/50">Bergabung {formatTanggal(u.created_at)}</p>
              </div>
              <RoleSelect id={u.id} role={u.role} disabled={u.id === me.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}