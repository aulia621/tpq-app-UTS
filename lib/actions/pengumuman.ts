"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
import { fieldErrors, idSchema, pengumumanSchema } from "@/lib/schemas";
import { pick, str, type FormState, type RowActionState } from "@/lib/form";

export async function createPengumumanAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const profile = await getProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "guru")) {
    return { status: "error", message: "Kamu tidak berhak membuat pengumuman." };
  }

  const values = pick(formData, ["judul", "isi", "target_kelas_id"]);
  const parsed = pengumumanSchema.safeParse(values);
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.from("pengumuman").insert({ ...parsed.data, dibuat_oleh: profile.id });
  if (error) {
    console.error("createPengumuman", error.code);
    return { status: "error", message: "Gagal menyimpan pengumuman.", values };
  }
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Pengumuman diterbitkan.", ts: Date.now() };
}

export async function deletePengumumanAction(_prev: RowActionState, formData: FormData): Promise<RowActionState> {
  const id = idSchema.safeParse(str(formData, "id"));
  if (!id.success) return { status: "error", message: "Data tidak valid." };
  const profile = await getProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "guru")) {
    return { status: "error", message: "Kamu tidak berhak menghapus pengumuman." };
  }

  const supabase = await createClient();
  let q = supabase.from("pengumuman").delete().eq("id", id.data);
  if (profile.role === "guru") q = q.eq("dibuat_oleh", profile.id);
  const { data, error } = await q.select("id");
  if (error || !data || data.length === 0) {
    if (error) console.error("deletePengumuman", error.code);
    return { status: "error", message: "Data tidak ditemukan atau bukan milikmu." };
  }
  revalidatePath("/dashboard", "layout");
  return { status: "success" };
}
