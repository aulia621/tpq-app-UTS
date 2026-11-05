"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
import { fieldErrors, hafalanSchema, idSchema } from "@/lib/schemas";
import { pick, str, type FormState, type RowActionState } from "@/lib/form";

const KEYS = ["santri_id", "jenis", "materi", "nilai", "status", "catatan"];

export async function createHafalanAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const profile = await getProfile();
  if (!profile || (profile.role !== "guru" && profile.role !== "admin")) {
    return { status: "error", message: "Kamu tidak berhak mencatat hafalan." };
  }

  const values = pick(formData, KEYS);
  const parsed = hafalanSchema.safeParse(values);
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { data: santri } = await supabase
    .from("santri")
    .select("id")
    .eq("id", parsed.data.santri_id)
    .eq("aktif", true)
    .maybeSingle();
  if (!santri) {
    return { status: "error", fieldErrors: { santri_id: "Santri tidak ditemukan atau nonaktif" }, values };
  }

  // guru_id SELALU dari sesi server, tidak pernah dari form
  const { error } = await supabase.from("hafalan").insert({
    santri_id: parsed.data.santri_id,
    jenis: parsed.data.jenis,
    materi: parsed.data.materi,
    nilai: parsed.data.nilai,
    status: parsed.data.status,
    catatan: parsed.data.catatan ?? null,
    guru_id: profile.id,
  });
  if (error) {
    console.error("createHafalan", error.code);
    return { status: "error", message: "Gagal menyimpan catatan. Coba lagi.", values };
  }

  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Catatan hafalan tersimpan.", ts: Date.now() };
}

export async function toggleHafalanStatusAction(_prev: RowActionState, formData: FormData): Promise<RowActionState> {
  const id = idSchema.safeParse(str(formData, "id"));
  if (!id.success) return { status: "error", message: "Data tidak valid." };

  const profile = await getProfile();
  if (!profile || (profile.role !== "guru" && profile.role !== "admin")) {
    return { status: "error", message: "Kamu tidak berhak mengubah status." };
  }

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("hafalan")
    .select("id, status, guru_id")
    .eq("id", id.data)
    .maybeSingle();
  if (!row || row.guru_id !== profile.id) {
    return { status: "error", message: "Data tidak ditemukan atau bukan milikmu." };
  }

  const next = row.status === "lulus" ? "ulang" : "lulus";
  const { data: updated, error } = await supabase
    .from("hafalan")
    .update({ status: next })
    .eq("id", id.data)
    .eq("guru_id", profile.id)
    .eq("status", row.status)
    .select("id");
  if (error || !updated || updated.length === 0) {
    if (error) console.error("toggleHafalan", error.code);
    return { status: "error", message: "Data sudah berubah, muat ulang halaman." };
  }

  revalidatePath("/dashboard", "layout");
  return { status: "success" };
}

export async function deleteHafalanAction(_prev: RowActionState, formData: FormData): Promise<RowActionState> {
  const id = idSchema.safeParse(str(formData, "id"));
  if (!id.success) return { status: "error", message: "Data tidak valid." };

  const profile = await getProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "guru")) {
    return { status: "error", message: "Kamu tidak berhak menghapus data ini." };
  }

  const supabase = await createClient();
  let q = supabase.from("hafalan").delete().eq("id", id.data);
  if (profile.role === "guru") q = q.eq("guru_id", profile.id);
  const { data, error } = await q.select("id");

  // RLS menolak tanpa error (nol baris), jadi jumlah baris wajib diperiksa
  if (error || !data || data.length === 0) {
    if (error) console.error("deleteHafalan", error.code);
    return { status: "error", message: "Data tidak ditemukan atau kamu tidak berhak menghapusnya." };
  }

  revalidatePath("/dashboard", "layout");
  return { status: "success" };
}
