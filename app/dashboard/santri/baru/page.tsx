import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Card";
import { SantriForm } from "@/components/santri/SantriForm";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tambah Santri" };

export default async function SantriBaruPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data } = await supabase.from("kelas").select("id, nama").order("nama");
  return (
    <>
      <PageHeader title="Tambah Santri" />
      <SantriForm kelasList={(data ?? []) as { id: string; nama: string }[]} />
    </>
  );
}
