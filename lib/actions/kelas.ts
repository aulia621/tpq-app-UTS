"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
import { fieldErrors, idSchema, kelasSchema } from "@/lib/schemas";
import { pick, str, type FormState, type RowActionState } from "@/lib/form";

export async function createKelasAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { status: "error", message: "Hanya admin yang boleh menambah kelas." };

  const values = pick(formData, ["nama", "guru_id"]);
  const parsed = kelasSchema.safeParse(values);
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.from("kelas").insert(parsed.data);
  if (error) {
    console.error("createKelas", error.code);
    return { status: "error", message: "Gagal menyimpan kelas.", values };
  }
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Kelas ditambahkan.", ts: Date.now() };
}

export async function deleteKelasAction(_prev: RowActionState, formData: FormData): Promise<RowActionState> {
  const id = idSchema.safeParse(str(formData, "id"));
  if (!id.success) return { status: "error", message: "Data tidak valid." };
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { status: "error", message: "Hanya admin yang boleh menghapus kelas." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("kelas").delete().eq("id", id.data).select("id");
  if (error || !data || data.length === 0) {
    if (error) console.error("deleteKelas", error.code);
    return { status: "error", message: "Kelas tidak ditemukan atau tidak bisa dihapus." };
  }
  revalidatePath("/dashboard", "layout");
  return { status: "success" };
}
