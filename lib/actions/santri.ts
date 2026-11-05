"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
import { fieldErrors, idSchema, santriSchema } from "@/lib/schemas";
import { pick, str, type FormState, type RowActionState } from "@/lib/form";

const KEYS = ["nama", "nis", "tanggal_lahir", "jenis_kelamin", "kelas_id", "wali_email"];

export async function saveSantriAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { status: "error", message: "Hanya admin yang boleh mengelola santri." };

  const values = { ...pick(formData, KEYS), aktif: formData.get("aktif") === "on" ? "on" : "" };
  const rawId = str(formData, "id");
  const isEdit = rawId !== "";
  if (isEdit && !idSchema.safeParse(rawId).success) return { status: "error", message: "Data tidak valid.", values };

  const parsed = santriSchema.safeParse({ ...values, aktif: isEdit ? formData.get("aktif") === "on" : true });
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values };

  const supabase = await createClient();

  let waliId: string | null = null;
  if (parsed.data.wali_email) {
    const { data, error } = await supabase.rpc("admin_find_user_by_email", { p_email: parsed.data.wali_email });
    if (error) {
      console.error("find wali", error.code);
      return { status: "error", message: "Gagal mencari akun wali.", values };
    }
    if (!data) {
      return { status: "error", fieldErrors: { wali_email: "Email ini belum terdaftar sebagai akun" }, values };
    }
    waliId = data as string;
  }

  const payload = {
    nama: parsed.data.nama,
    nis: parsed.data.nis,
    tanggal_lahir: parsed.data.tanggal_lahir,
    jenis_kelamin: parsed.data.jenis_kelamin,
    kelas_id: parsed.data.kelas_id,
    wali_id: waliId,
    aktif: parsed.data.aktif,
  };

  const { error } = isEdit
    ? await supabase.from("santri").update(payload).eq("id", rawId)
    : await supabase.from("santri").insert(payload);

  if (error) {
    console.error("saveSantri", error.code);
    if (error.code === "23505") return { status: "error", fieldErrors: { nis: "NIS sudah dipakai santri lain" }, values };
    return { status: "error", message: "Gagal menyimpan data santri.", values };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/santri");
}

export async function deleteSantriAction(_prev: RowActionState, formData: FormData): Promise<RowActionState> {
  const id = idSchema.safeParse(str(formData, "id"));
  if (!id.success) return { status: "error", message: "Data tidak valid." };
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { status: "error", message: "Hanya admin yang boleh menghapus santri." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("santri").delete().eq("id", id.data).select("id");
  if (error || !data || data.length === 0) {
    if (error) console.error("deleteSantri", error.code);
    return { status: "error", message: "Data tidak ditemukan atau tidak bisa dihapus." };
  }
  revalidatePath("/dashboard", "layout");
  return { status: "success" };
}
