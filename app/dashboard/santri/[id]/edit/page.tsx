import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/Card";
import { SantriForm } from "@/components/santri/SantriForm";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { idSchema } from "@/lib/schemas";

export const metadata: Metadata = { title: "Edit Santri" };

export default async function EditSantriPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["admin"]);
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data: s } = await supabase
    .from("santri")
    .select("id, nama, nis, tanggal_lahir, jenis_kelamin, kelas_id, wali_id, aktif")
    .eq("id", id)
    .maybeSingle();
  if (!s) notFound();

  const { data: kelas } = await supabase.from("kelas").select("id, nama").order("nama");
  let waliEmail = "";
  if (s.wali_id) {
    const { data } = await supabase.rpc("admin_get_user_email", { p_id: s.wali_id });
    waliEmail = typeof data === "string" ? data : "";
  }

  return (
    <>
      <PageHeader title="Edit Data Santri" />
      <SantriForm
        kelasList={(kelas ?? []) as { id: string; nama: string }[]}
        santri={{
          id: s.id,
          nama: s.nama,
          nis: s.nis ?? "",
          tanggal_lahir: s.tanggal_lahir ?? "",
          jenis_kelamin: s.jenis_kelamin ?? "",
          kelas_id: s.kelas_id ?? "",
          wali_email: waliEmail,
          aktif: s.aktif,
        }}
      />
    </>
  );
}
